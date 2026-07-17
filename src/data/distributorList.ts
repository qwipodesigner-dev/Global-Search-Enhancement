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
  delivery: DeliverySlot[];
  brands: SellerBrand[];
};

export const sellers: Seller[] = [
  {
    id: 's_saikrishna',
    name: 'Shri Sai Krishna Traders',
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
    ],
  },
  {
    id: 's_sairam',
    name: 'Sri Sairam Enterprises',
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
    delivery: [
      { date: 'Wed, 3rd (Beat day)', mov: '500' },
      { date: 'Tomorrow', mov: '2,500' },
    ],
    brands: [
      { label: 'Eastern', logo: brandLogos.eastern },
      { label: 'MTR', logo: brandLogos.mtr },
      { label: 'Zindha Tilismath', logo: brandLogos.zindaTilismath },
    ],
  },
];

export const sellerById = (id: string) => sellers.find((s) => s.id === id);
