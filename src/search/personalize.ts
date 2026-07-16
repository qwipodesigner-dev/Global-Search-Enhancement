/**
 * Personalized ranking (PRD Layer 5).
 * - Existing retailer: boost previously-ordered products to the top,
 *   flagged as "Your Usual".
 * - New retailer (cold start): rank by local bestseller signal.
 */
import { Product, orderedProductIds, historyById } from '../data/catalog';

export type Persona = 'existing' | 'new';

export type RankedProducts = {
  list: Product[];
  yourUsual: Set<string>;
  personalizedLabel: string | null;
};

export function personalize(list: Product[], persona: Persona): RankedProducts {
  if (persona === 'new') {
    const sorted = [...list].sort(
      (a, b) => (a.bestsellerRank ?? 999) - (b.bestsellerRank ?? 999)
    );
    return { list: sorted, yourUsual: new Set(), personalizedLabel: 'Bestsellers in Your Area' };
  }

  // existing: previously-ordered first (keep relevance order within each group)
  const usual: Product[] = [];
  const rest: Product[] = [];
  for (const p of list) (orderedProductIds.has(p.id) ? usual : rest).push(p);
  return {
    list: [...usual, ...rest],
    yourUsual: new Set(usual.map((p) => p.id)),
    personalizedLabel: usual.length ? 'Your Usual — reorder in one tap' : null,
  };
}

export function usualSubtitle(productId: string): string | undefined {
  const h = historyById(productId);
  if (!h) return undefined;
  return `Ordered ${h.timesOrdered}× · last ${h.lastOrdered} · ${h.lastQty}`;
}
