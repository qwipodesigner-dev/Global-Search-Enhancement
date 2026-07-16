/**
 * Smart Search engine (client-side mock of PRD Layers 1–3).
 *
 * - Layer 1 Relevance: tokenization, synonym/vernacular expansion, typo-tolerant
 *   fuzzy matching, and field-weighted scoring (brand/name >> keywords >> category).
 * - Layer 3 Federated: one query returns grouped Brands / Categories / Products /
 *   Offers / Distributors.
 *
 * The scoring is deliberately tuned so "red label" surfaces Red Label tea and
 * never "red chilli" (multi-token queries require full-token coverage first).
 */
import {
  products, brands, categories, offers, distributors, synonyms,
  Product, Brand, Category, Offer, Distributor,
} from '../data/catalog';

const STOPWORDS = new Set(['the', 'a', 'an', 'of', 'for', 'and', 'in', 'x', 'nos', 'pack', 'pc']);

export function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Split into searchable words, dropping stopwords — UNLESS the query is nothing
 * but stopwords. "pack" and "nos" are real retailer vocabulary, so searching
 * them must beat returning nothing at all.
 */
export function tokenize(q: string): string[] {
  const all = normalize(q).split(' ').filter(Boolean);
  const kept = all.filter((t) => !STOPWORDS.has(t));
  return kept.length ? kept : all;
}

const isNumeric = (t: string) => /^\d+$/.test(t);

/** Levenshtein edit distance (capped for performance). */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 3;
  const dp = Array.from({ length: m + 1 }, (_, i) => i);
  for (let j = 1; j <= n; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i];
      dp[i] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[i], dp[i - 1]);
      prev = tmp;
    }
  }
  return dp[m];
}

/** True if `token` fuzzily matches any word (typo tolerance scales with length). */
function fuzzyInWords(token: string, words: string[]): boolean {
  if (token.length < 4) return false;
  const tol = token.length >= 7 ? 2 : 1;
  return words.some((w) => Math.abs(w.length - token.length) <= tol && editDistance(w, token) <= tol);
}

function expand(token: string): string[] {
  const syn = synonyms[token];
  return syn ? [token, ...syn] : [token];
}

type Scored<T> = { item: T; score: number; matched: number };

/** Whole-word, or a word that STARTS with the token — never mid-word. */
function wordHit(words: string[], t: string): 'exact' | 'prefix' | null {
  if (words.includes(t)) return 'exact';
  if (t.length >= 2 && words.some((w) => w.startsWith(t))) return 'prefix';
  return null;
}
/** The phrase must sit on word boundaries: "oil" ✓ "sunflower oil", but "ol" ✗ "gold". */
function phraseHit(text: string, phrase: string): boolean {
  return ` ${text} `.includes(` ${phrase} `);
}

function scoreProduct(
  tokens: string[], phrase: string, p: Product
): { score: number; matched: number; matchedReal: number } {
  const name = normalize(p.name);
  const brand = normalize(p.brand);
  const cat = normalize(p.category);
  const sub = normalize(p.subCategory);
  const kws = p.keywords.map(normalize);
  const nameWords = name.split(' ');
  const brandWords = brand.split(' ');
  const kwWords = kws.join(' ').split(' ');
  const subWords = sub.split(' ');
  const catWords = cat.split(' ');
  const allWords = [...nameWords, ...brandWords, ...kwWords];

  let score = 0;
  // phrase-level bonuses — word-boundary anchored
  if (name === phrase) score += 200;
  else if (name.startsWith(phrase + ' ')) score += 90;
  else if (phraseHit(name, phrase)) score += 55;
  if (brand === phrase) score += 130;
  else if (phrase.length > 2 && phraseHit(brand, phrase)) score += 45;
  if (kws.includes(phrase)) score += 60;

  let matched = 0;
  // Tokens that are more than a bare number. A query like "iphone 15" must not
  // qualify just because "15" matched the pack size "15 Ltr".
  let matchedReal = 0;
  for (const raw of tokens) {
    const variants = expand(raw);
    let best = 0;
    let hit = false;
    for (const t of variants) {
      const b = wordHit(brandWords, t);
      if (b) { best = Math.max(best, b === 'exact' ? 45 : 30); hit = true; }
      const n = wordHit(nameWords, t);
      if (n) { best = Math.max(best, n === 'exact' ? 40 : 32); hit = true; }
      if (kws.includes(t)) { best = Math.max(best, 34); hit = true; }
      else if (wordHit(kwWords, t)) { best = Math.max(best, 20); hit = true; }
      if (wordHit(subWords, t)) { best = Math.max(best, 15); hit = true; }
      if (wordHit(catWords, t)) { best = Math.max(best, 8); hit = true; }
    }
    if (!hit && fuzzyInWords(raw, allWords)) { best = 14; hit = true; }
    if (hit) {
      matched++;
      if (!isNumeric(raw)) matchedReal++;
      score += best;
    }
  }
  if (matched === tokens.length && tokens.length > 1) score += 30; // all-token bonus
  return { score, matched, matchedReal };
}

/**
 * Score an entity name (brand / category / offer / distributor).
 * Matching is WORD-level, never a raw substring — otherwise "Mysore San-dal"
 * would match "dal" and "Red Label" would match "red chilli".
 */
function scoreText(tokens: string[], phrase: string, text: string, weightExact = 100): { score: number; matched: number } {
  const t = normalize(text);
  const words = t.split(' ');
  let score = 0;
  if (t === phrase) score += weightExact;
  else if (t.startsWith(phrase + ' ') || t === phrase) score += weightExact * 0.6;
  else if (words.join(' ').includes(` ${phrase} `) || t.startsWith(phrase)) score += weightExact * 0.4;

  let matched = 0;
  for (const raw of tokens) {
    const variants = expand(raw);
    let hit = false;
    for (const v of variants) {
      if (words.includes(v)) { score += 30; hit = true; break; }  // whole word: "dal" ✓ "dal"
      // word-STEM only: "dal" ✓ "dals", but never "dal" ✗ "sandal"
      if (v.length >= 3 && words.some((w) => w.startsWith(v))) { score += 18; hit = true; break; }
    }
    if (!hit && fuzzyInWords(raw, words)) { score += 10; hit = true; }
    if (hit) matched++;
  }
  return { score, matched };
}

export type FederatedResults = {
  query: string;
  broadened: boolean;
  /** Set when the spelling was corrected before searching (e.g. mung -> moong). */
  correction: Correction;
  products: Product[];
  brands: Brand[];
  categories: Category[];
  offers: Offer[];
  distributors: Distributor[];
  total: number;
};

export type SearchScope = { kind: 'all' | 'category' | 'offer'; id?: string; label?: string };

export function productsInScope(scope?: SearchScope): Product[] {
  return productPool(scope);
}

function productPool(scope?: SearchScope): Product[] {
  if (!scope || scope.kind === 'all') return products;
  if (scope.kind === 'category') return products.filter((p) => p.subCategory === scope.label || p.category === scope.label);
  if (scope.kind === 'offer') {
    const o = offers.find((x) => x.id === scope.id);
    return o ? products.filter((p) => o.productIds.includes(p.id)) : products;
  }
  return products;
}

/**
 * Rank products for a query within an optional scope. Spelling is corrected
 * first; pass correct=false to honour exactly what the retailer typed.
 */
export function searchProductsScored(
  query: string, scope?: SearchScope, correct = true
): { list: Product[]; broadened: boolean } {
  const tokens = tokenize(correct ? correctQuery(query).corrected : query);
  const phrase = tokens.join(' ');
  const pool = productPool(scope);
  if (!tokens.length) return { list: [], broadened: false };

  const scored: (Scored<Product> & { matchedReal: number })[] = [];
  for (const p of pool) {
    const { score, matched, matchedReal } = scoreProduct(tokens, phrase, p);
    if (matched > 0) scored.push({ item: p, score, matched, matchedReal });
  }
  // Strict: require full token coverage (kills "red label" -> "red chilli").
  const need = tokens.length;
  let kept = scored.filter((s) => s.matched >= need);
  let broadened = false;
  if (kept.length === 0) {
    // Relax to partial matches — but a bare number is not evidence of intent,
    // so "iphone 15" must not resurface every 15 Ltr tin.
    kept = scored.filter((s) => s.matchedReal >= 1);
    broadened = kept.length > 0;
  }
  kept.sort((a, b) => b.score - a.score);
  return { list: kept.map((s) => s.item), broadened };
}

// ─────────────────────────────────────────────────────────────
// Spell correction (runs BEFORE the search, not after it fails)
// ─────────────────────────────────────────────────────────────

/** Every word the catalogue actually knows, with how many products use it. */
const VOCAB: Map<string, number> = (() => {
  const m = new Map<string, number>();
  const add = (text: string) => {
    for (const w of normalize(text).split(' ')) {
      if (w.length >= 3 && !isNumeric(w)) m.set(w, (m.get(w) ?? 0) + 1);
    }
  };
  products.forEach((p) => { add(p.name); add(p.brand); p.keywords.forEach(add); });
  brands.forEach((b) => add(b.name));
  categories.forEach((c) => add(c.name));
  Object.keys(synonyms).forEach((k) => add(k));
  return m;
})();

/**
 * Correct ONE word against the catalogue vocabulary. Tolerance is deliberately
 * looser than the silent fuzzy match, because the correction is shown to the
 * retailer and is reversible — a visible wrong guess is cheap, a silent one is not.
 */
function correctToken(t: string): string {
  if (t.length < 4 || isNumeric(t)) return t;      // too short to correct safely
  if (VOCAB.has(t) || synonyms[t]) return t;       // already a real word
  // Flat tolerance of 2. Scaling it up for long words sounds generous but lets
  // "redlabel" collapse onto "label", which is a worse answer than not guessing.
  const tol = 2;

  let best: { w: string; d: number; freq: number } | null = null;
  for (const [w, freq] of VOCAB) {
    if (Math.abs(w.length - t.length) > tol) continue;
    const d = editDistance(w, t);
    if (d > tol) continue;
    if (!best) { best = { w, d, freq }; continue; }
    // 1) closest wins. 2) typos rarely change the first letter. 3) prefer the
    //    word that describes more of the catalogue.
    const sameFirst = (x: string) => (x[0] === t[0] ? 1 : 0);
    const better =
      d !== best.d ? d < best.d
      : sameFirst(w) !== sameFirst(best.w) ? sameFirst(w) > sameFirst(best.w)
      : freq > best.freq;
    if (better) best = { w, d, freq };
  }
  return best ? best.w : t;
}

export type Correction = { corrected: string; original: string; changed: boolean };

/**
 * "mung baal" -> "moong daal". Correcting each word up-front means one bad word
 * no longer silently widens the whole query (which is how "mung baal" used to
 * return every Toor Dal in the catalogue).
 */
export function correctQuery(query: string): Correction {
  const raw = tokenize(query);
  const fixed = raw.map(correctToken);
  const changed = fixed.some((t, i) => t !== raw[i]);
  return { corrected: fixed.join(' '), original: raw.join(' '), changed };
}

/**
 * Closest catalogue term for a query that found nothing — powers "Did you mean…".
 * Compares against brand names, category names and product keywords.
 */
export function didYouMean(query: string): string | null {
  const tokens = tokenize(query);
  if (!tokens.length) return null;
  const vocab = new Set<string>();
  brands.forEach((b) => vocab.add(b.name));
  categories.forEach((c) => vocab.add(c.name));
  products.forEach((p) => p.keywords.forEach((k) => vocab.add(k)));

  let best: { term: string; d: number } | null = null;
  for (const term of vocab) {
    const t = normalize(term);
    for (const tok of tokens) {
      if (Math.abs(t.length - tok.length) > 3) continue;
      const d = editDistance(t, tok);
      if (d <= 3 && (!best || d < best.d)) best = { term, d };
    }
  }
  // only suggest when it's a near-miss, not a wild guess
  return best && best.d <= 2 ? best.term : null;
}

/** Does any product match, ignoring the source split? Used to hint the other tab. */
export function hasAnyMatch(query: string): { distributor: boolean; wholesaler: boolean } {
  const { list } = searchProductsScored(query);
  return {
    distributor: list.some((p) => p.source === 'distributor'),
    wholesaler: list.some((p) => p.source === 'wholesaler'),
  };
}

export function federatedSearch(query: string, scope?: SearchScope, correct = true): FederatedResults {
  // Correct once, then use the corrected words for products AND entities so the
  // whole page agrees on what was searched.
  const correction = correctQuery(query);
  const tokens = tokenize(correct ? correction.corrected : query);
  const phrase = tokens.join(' ');
  const { list: prods, broadened } = searchProductsScored(query, scope, correct);

  // One matched token is enough for an entity — "toor dal" should still surface
  // the "Dals and Pulses" category. Precision comes from scoreText's word-boundary
  // rule, which stops "Mysore San-dal" matching "dal".
  const rank = <T>(items: T[], text: (i: T) => string): T[] => {
    const s: Scored<T>[] = [];
    for (const it of items) {
      const { score, matched } = scoreText(tokens, phrase, text(it));
      if (matched > 0) s.push({ item: it, score, matched });
    }
    s.sort((a, b) => b.score - a.score);
    return s.map((x) => x.item);
  };

  const scoped = !scope || scope.kind === 'all';
  const brandHits = scoped ? rank(brands, (b) => `${b.name} ${b.category}`) : [];
  const catHits = scoped ? rank(categories, (c) => `${c.name} ${c.parent ?? ''}`) : [];
  const offerHits = scoped ? rank(offers, (o) => o.name) : [];
  const distHits = scoped ? rank(distributors, (d) => `${d.name} ${d.brands.join(' ')}`) : [];

  return {
    query,
    broadened,
    correction,
    products: prods,
    brands: brandHits,
    categories: catHits,
    offers: offerHits,
    distributors: distHits,
    total: prods.length + brandHits.length + catHits.length + offerHits.length + distHits.length,
  };
}
