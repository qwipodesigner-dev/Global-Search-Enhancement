/**
 * Autocomplete suggestions (PRD Layer 4).
 * Returns the five suggestion types: search terms, categories, brands,
 * products, and previous searches — as a single ranked, capped list.
 */
import { brands, categories, products, trendingTerms } from '../data/catalog';
import { normalize } from './engine';

export type SuggestionType = 'term' | 'category' | 'brand' | 'product' | 'recent';
export type Suggestion = {
  id: string;
  type: SuggestionType;
  text: string;
  sub?: string;
  icon: string;
};

const TERM_POOL = Array.from(
  new Set([
    'Oil', 'Cooking Oil', 'Sunflower Oil', 'Shampoo', 'Biscuit', 'Soap', 'Coffee',
    'Tea', 'Red Label Tea', 'Rice', 'Basmati Rice', 'Atta', 'Toor Dal', 'Moong Dal',
    'Sugar', 'Salt', 'Honey', 'Ketchup', 'Jam', 'Detergent',
    ...trendingTerms,
  ])
);

const ICONS: Record<SuggestionType, string> = {
  term: 'search-outline',
  category: 'grid-outline',
  brand: 'pricetag-outline',
  product: 'cube-outline',
  recent: 'time-outline',
};

function matches(text: string, q: string): boolean {
  const t = normalize(text);
  return t.includes(q) || q.split(' ').every((tok) => t.includes(tok));
}
function rankKey(text: string, q: string): number {
  const t = normalize(text);
  if (t === q) return 0;
  if (t.startsWith(q)) return 1;
  return 2;
}

export function getSuggestions(query: string, recent: string[] = []): Suggestion[] {
  const q = normalize(query);
  if (q.length < 2) return [];

  const out: Suggestion[] = [];

  // 1. Recent searches that match
  recent
    .filter((r) => matches(r, q))
    .slice(0, 2)
    .forEach((r, i) => out.push({ id: `recent-${i}`, type: 'recent', text: r, icon: ICONS.recent }));

  // 2. Search terms
  TERM_POOL.filter((t) => matches(t, q))
    .sort((a, b) => rankKey(a, q) - rankKey(b, q) || a.length - b.length)
    .slice(0, 3)
    .forEach((t) => out.push({ id: `term-${t}`, type: 'term', text: t, icon: ICONS.term }));

  // 3. Categories
  categories.filter((c) => matches(c.name, q))
    .slice(0, 2)
    .forEach((c) => out.push({ id: `cat-${c.id}`, type: 'category', text: c.name, sub: c.parent, icon: c.icon }));

  // 4. Brands
  brands.filter((b) => matches(b.name, q))
    .slice(0, 2)
    .forEach((b) => out.push({ id: `brand-${b.id}`, type: 'brand', text: b.name, sub: b.category, icon: ICONS.brand }));

  // 5. Products
  products
    .filter((p) => matches(`${p.name} ${p.brand} ${p.keywords.join(' ')}`, q))
    .sort((a, b) => rankKey(a.name, q) - rankKey(b.name, q))
    .slice(0, 3)
    .forEach((p) => out.push({ id: `prod-${p.id}`, type: 'product', text: p.name, sub: p.brand, icon: ICONS.product }));

  // De-dupe by visible text, cap total
  const seen = new Set<string>();
  return out.filter((s) => {
    const key = s.type + '|' + normalize(s.text);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 9);
}
