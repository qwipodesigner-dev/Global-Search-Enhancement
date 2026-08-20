/**
 * Reference data for the "Authorised Distributors" list screens
 * (Figma "Autherised Distributors - All list view" / "- Isolated view").
 *
 * Layout/reference only — this is the seller directory shown when the retailer
 * taps "See All" beside Distributors on the home screen. It is deliberately kept
 * separate from the Global Search catalogue in src/data/catalog.ts.
 */
import { brandLogos } from '../assets';

/** One delivery slot on a seller card: a beat day + that seller's minimum order value. */
export type DeliverySlot = { date: string; mov: string };

export type SellerBrand = { label: string; logo: any };

export type Seller = {
  id: string;
  name: string;
  /** The company whose lines this seller distributes (third breadcrumb). */
  company: string;
  delivery: DeliverySlot[];
  brands: SellerBrand[];
  /** Category names from the catalogue, so the hub can filter product lists. */
  categoryNames: string[];
};

export const sellers: Seller[] = [
  {
    id: 's_omkar',
    name: 'Omkar Enterprices',
    company: 'Tata Consumer Products',
    categoryNames: ['Salt, Sugar and Jaggery', 'Atta, Flours and Sooji', 'Dals and Pulses', 'Tea and Coffee'],
    delivery: [
      { date: 'Thu, 27th (Beat day)', mov: '500' },
      { date: 'Tomorrow', mov: '2,500' },
    ],
    brands: [
      { label: 'Tata', logo: brandLogos.tata },
      { label: 'Aashirvaad', logo: brandLogos.aashirvaad },
      { label: 'Himalaya', logo: brandLogos.himalaya },
      { label: 'Double Horse', logo: brandLogos.doubleHorse },
    ],
  },
  {
    id: 's_saikrishna',
    name: 'Shri Sai Krishna Traders',
    company: 'Gemini Edibles & Fats',
    categoryNames: ['Oil & Ghee', 'Beauty & Hygiene', 'Ayurvedic'],
    delivery: [{ date: 'Tomorrow (Beat day)', mov: '500' }],
    brands: [
      { label: 'Freedom Oil', logo: brandLogos.freedom },
      { label: 'Mysore Sandal', logo: brandLogos.mysoreSandal },
      { label: 'Black Rose Hair Color', logo: brandLogos.blackRose },
      { label: 'Dwibhashi Ayurveda', logo: brandLogos.dwibhashi },
    ],
  },
  {
    id: 's_sarda',
    name: 'Sri Sarda Enterprises',
    company: 'Priya Oil Mills',
    categoryNames: ['Oil & Ghee'],
    delivery: [{ date: 'Fri, 28th (Beat day)', mov: '500' }],
    brands: [
      { label: 'Priya Gold Oil', logo: brandLogos.priyaGold },
      { label: 'Gold Drop', logo: brandLogos.goldDrop },
      { label: 'Ruchi Gold Oil', logo: brandLogos.ruchiGold },
    ],
  },
  {
    id: 's_sr',
    name: 'SR Enterprises',
    company: 'Andhra Agro Traders',
    categoryNames: ['Oil & Ghee', 'Salt, Sugar and Jaggery', 'Rice and Rice Products', 'Ayurvedic'],
    delivery: [
      { date: 'Fri, 28th (Beat day)', mov: '500' },
      { date: 'Tomorrow', mov: '2,500' },
    ],
    brands: [
      { label: 'Freedom Oil', logo: brandLogos.freedom },
      { label: 'Ruchi Gold Oil', logo: brandLogos.ruchiGold },
      { label: 'Fortune Oil', logo: brandLogos.fortune },
      { label: 'Gold Drop', logo: brandLogos.goldDrop },
      { label: 'Sri Lalitha', logo: brandLogos.sriLalitha },
      { label: 'Priya Foods', logo: brandLogos.priyaFoods },
      { label: 'Parry Sugar', logo: brandLogos.parrySugar },
      { label: 'Madhur Sugar', logo: brandLogos.madhurSugar },
      { label: 'Vicco', logo: brandLogos.vicco },
    ],
  },
  {
    id: 's_sairam',
    name: 'Sri Sairam Enterprises',
    company: 'Deccan Consumer Products',
    categoryNames: ['Pooja Needs', 'Beauty & Hygiene', 'Oil & Ghee'],
    delivery: [
      { date: 'Mon, 31st (Beat day)', mov: '500' },
      { date: 'Tomorrow', mov: '2,500' },
    ],
    brands: [
      { label: 'Ajay Care', logo: brandLogos.ajay },
      { label: 'Cycle', logo: brandLogos.cycle },
      { label: 'GRB', logo: brandLogos.grb },
      { label: 'Priya Gold Oil', logo: brandLogos.priyaGold },
      { label: 'Nippo', logo: brandLogos.nippo },
    ],
  },
  {
    id: 's_venkat',
    name: 'Venkateswara Agencies',
    company: 'GD Foods Mfg',
    categoryNames: ['Masala & Seasoning', 'Salt, Sugar and Jaggery', 'Oil & Ghee'],
    delivery: [
      { date: 'Tue, 1st (Beat day)', mov: '500' },
      { date: 'Tomorrow', mov: '2,500' },
    ],
    brands: [
      { label: 'GD Hing', logo: brandLogos.gdHing },
      { label: 'AS Brand', logo: brandLogos.asBrand },
      { label: 'Madhur Sugar', logo: brandLogos.madhurSugar },
      { label: 'Sneha & Sukhibhava Oil', logo: brandLogos.sneha },
    ],
  },
  {
    id: 's_mahedeva',
    name: 'Mahedeva Enterprises',
    company: 'Eastern Condiments',
    categoryNames: ['Masala & Seasoning', 'Ayurvedic'],
    delivery: [
      { date: 'Wed, 3rd (Beat day)', mov: '500' },
      { date: 'Tomorrow', mov: '2,500' },
    ],
    brands: [
      { label: 'Eastern', logo: brandLogos.eastern },
      { label: 'MTR', logo: brandLogos.mtr },
      { label: 'Zinda Tilismath', logo: brandLogos.zindaTilismath },
    ],
  },
];

export const sellerById = (id: string) => sellers.find((s) => s.id === id);
export const sellerByName = (name: string) =>
  sellers.find((s) => s.name.toLowerCase() === name.toLowerCase());

/**
 * The seller carrying a given brand label (Home "All Brands" tap). Labels are
 * matched loosely ("Freedom Oil" hits "Freedom Oil"; "Mysore Sandal" hits
 * "Mysore Sandal"); undefined when no listed seller carries the brand.
 */
export const sellerForBrandLabel = (label: string) => {
  const l = label.toLowerCase();
  return sellers.find((s) =>
    s.brands.some((b) => {
      const bl = b.label.toLowerCase();
      return bl === l || bl.startsWith(l) || l.startsWith(bl);
    })
  );
};
