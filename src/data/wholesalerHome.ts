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
