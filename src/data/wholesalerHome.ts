/**
 * Reference content for the Wholesalers home screen (Figma "Home Page - Wholesalers").
 * This is layout/reference data only — not wired to Global Search. Brand artwork for
 * the chocolate SKUs (KitKat / Munch / …) is a placeholder pending real assets.
 */
import { categoryImages } from '../assets';
import { brandLogos } from '../assets';

export type WholesaleTile = { id: string; label: string; image: any; bg?: string; fit?: 'cover' | 'contain' };

/** Two large top-level buckets (Frame 7055). */
export const wholesaleBigCategories: WholesaleTile[] = [
  { id: 'wc_groceries', label: 'Groceries', image: categoryImages.foodgrains },
  { id: 'wc_fmcg', label: 'FMCG', image: categoryImages.snacksBrandedFoods },
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

/** Top brands rail (Frame 7060) — circular brand tiles. */
export const wholesaleTopBrands: WholesaleTile[] = [
  { id: 'wtb1', label: 'Nescafe Classic', image: brandLogos.nescafe, bg: '#000000', fit: 'contain' },
  { id: 'wtb2', label: 'Nescafe Sunrise', image: brandLogos.nescafe, bg: '#000000', fit: 'contain' },
  { id: 'wtb3', label: 'Nescafe Gold', image: brandLogos.nescafe, bg: '#000000', fit: 'contain' },
  { id: 'wtb4', label: 'Nestea', image: brandLogos.nescafe, bg: '#000000', fit: 'contain' },
  { id: 'wtb5', label: 'KitKat', image: categoryImages.chocolatesAndBiscuits, fit: 'cover' },
  { id: 'wtb6', label: 'Munch', image: categoryImages.snacksAndNamkeen, fit: 'cover' },
  { id: 'wtb7', label: 'Milkybar', image: categoryImages.dairyAndCheese, fit: 'cover' },
  { id: 'wtb8', label: 'Bar One', image: categoryImages.indianSweets, fit: 'cover' },
];
