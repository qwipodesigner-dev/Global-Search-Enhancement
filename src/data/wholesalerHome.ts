/**
 * Reference content for the Wholesalers home screen (Figma "Home Page - Wholesalers").
 * Layout/reference data only — not wired to Global Search. Uses the phase-one brand
 * logos (Nescafe retired — its artwork had cropping/multi-logo issues).
 */
import { categoryImages, brandLogos, homeCards } from '../assets';

export type WholesaleTile = { id: string; label: string; image: any; bg?: string; fit?: 'cover' | 'contain' };

/** Two large top-level buckets (Frame 7055) — dedicated home-screen card artwork. */
export const wholesaleBigCategories: WholesaleTile[] = [
  { id: 'wc_groceries', label: 'Groceries', image: homeCards.groceries },
  { id: 'wc_fmcg', label: 'FMCG', image: homeCards.fmcg },
];

/** Exclusive offers rail (Frame 7050) — promotional cards. */
export const wholesaleOffers: WholesaleTile[] = [
  { id: 'wo1', label: 'Cooking Oil', image: categoryImages.oilGhee },
  { id: 'wo2', label: 'Biscuits', image: categoryImages.chocolatesAndBiscuits },
  { id: 'wo3', label: 'Beverages', image: categoryImages.beverages },
  { id: 'wo4', label: 'Dals & Pulses', image: categoryImages.dalsAndPulses },
  { id: 'wo5', label: 'Tea & Coffee', image: categoryImages.teaAndCoffee },
];

/** Top categories rail (Frame 7060) — small photo tiles. */
export const wholesaleTopCategories: WholesaleTile[] = [
  { id: 'wtc1', label: 'Rice & rice products', image: categoryImages.riceAndRiceProducts },
  { id: 'wtc2', label: 'Beverages', image: categoryImages.beverages },
  { id: 'wtc3', label: 'Dals & Pulses', image: categoryImages.dalsAndPulses },
  { id: 'wtc4', label: 'Atta & Flours', image: categoryImages.attaFloursAndSooji },
  { id: 'wtc5', label: 'Sugar & Spices', image: categoryImages.saltSugarAndJaggery },
  { id: 'wtc6', label: 'Personal care', image: categoryImages.beautyHygiene },
  { id: 'wtc7', label: 'Cleaning & Household', image: categoryImages.detergentsAndDishwash },
];

/**
 * Category grids reached by tapping Groceries / FMCG on the wholesaler home
 * (Figma "Groceries" / "FMCG" screens). 180x120 image + label, 2-column grid.
 */
export const groceriesCategories: WholesaleTile[] = [
  { id: 'g1', label: 'Rice & Rice Products', image: categoryImages.riceAndRiceProducts },
  { id: 'g2', label: 'Dals & Pulses', image: categoryImages.dalsAndPulses },
  { id: 'g3', label: 'Atta, Flours & Sooji', image: categoryImages.attaFloursAndSooji },
  { id: 'g4', label: 'Cooking Oils & Ghee', image: categoryImages.oilGhee },
  { id: 'g5', label: 'Sugar & Spices', image: categoryImages.saltSugarAndJaggery },
  { id: 'g6', label: 'Pickles & Podis', image: categoryImages.picklesAndChutney },
  { id: 'g7', label: 'Dry Fruits', image: categoryImages.snacksDryFruitsNuts },
];

export const fmcgCategories: WholesaleTile[] = [
  { id: 'f1', label: 'Oats & Noodles', image: categoryImages.pastaSoupAndNoodles },
  { id: 'f2', label: 'Personal Care', image: categoryImages.beautyHygiene },
  { id: 'f3', label: 'Pooja Needs', image: categoryImages.poojaNeeds },
  { id: 'f4', label: 'Ready-To-Cook', image: categoryImages.readyToCookAndEat },
  { id: 'f5', label: 'Spreads, Sauces & Ketchups', image: categoryImages.saucesSpreadsAndDips },
  { id: 'f6', label: 'Biscuits, Snacks & Namkeen', image: categoryImages.chocolatesAndBiscuits },
  { id: 'f7', label: 'Cleaning & Household', image: categoryImages.detergentsAndDishwash },
  { id: 'f8', label: 'Stationery', image: categoryImages.giftVoucher }, // placeholder — no stationery asset
  { id: 'f9', label: 'Beverages', image: categoryImages.beverages },
  { id: 'f10', label: 'Others', image: categoryImages.gourmetWorldFoods },
];

/** Top brands rail (Frame 7060) — circular brand tiles, real phase-one logos. */
export const wholesaleTopBrands: WholesaleTile[] = [
  { id: 'wtb1', label: 'Aashirvaad', image: brandLogos.aashirvaad, fit: 'contain' },
  { id: 'wtb2', label: 'Tata', image: brandLogos.tata, fit: 'contain' },
  { id: 'wtb3', label: 'Fortune', image: brandLogos.fortune, fit: 'contain' },
  { id: 'wtb4', label: 'Freedom', image: brandLogos.freedom, fit: 'contain' },
  { id: 'wtb5', label: 'MTR', image: brandLogos.mtr, fit: 'contain' },
  { id: 'wtb6', label: 'Eastern', image: brandLogos.eastern, fit: 'contain' },
  { id: 'wtb7', label: 'GRB', image: brandLogos.grb, fit: 'contain' },
  { id: 'wtb8', label: 'Priya Foods', image: brandLogos.priyaFoods, fit: 'contain' },
];
