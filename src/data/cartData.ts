/**
 * Seed data for the cart (Figma "Cart" / "View Items").
 * Everything downstream is computed: line totals = qty x unit price, seller
 * totals = sum of lines, and the MOV comes from whichever delivery slot is
 * selected — the beat-day run is cheap to serve, so its MOV is lower than a
 * next-day delivery. CartContext owns the live state; this is just day zero.
 */
import { products, categoryImages } from '../assets';

export type CartLine = {
  id: string;
  name: string;
  /** Selling price per case/pack — the unit the stepper counts. */
  unitPrice: number;
  mrp: number;
  qty: number;
  image: any;
  /** Per-unit price drop, shown as the green chip in View Items. */
  drop?: number;
};

export type CartSlot = {
  label: string;
  /** Minimum order value when this slot is chosen. */
  mov: number;
};

export type CartSellerSeed = {
  id: string;
  name: string;
  /** Delivery choices; beat-day MOV < next-day MOV. */
  slots: CartSlot[];
  selectedSlot: number;
  lines: CartLine[];
};

export const cartSeed: CartSellerSeed[] = [
  {
    id: 'c_omkar',
    name: 'Omkar Enterprises',
    slots: [
      { label: 'Fri 28th - Beat', mov: 1000 },
      { label: 'Tomorrow', mov: 2500 },
    ],
    selectedSlot: 1,
    lines: [
      {
        id: 'l_oil500', name: 'Freedom Refined Sunflower Oil - 500 ml Packet',
        unitPrice: 88.5, mrp: 108, qty: 12, image: products.freedomSunflower1L,
      },
      {
        id: 'l_oil10', name: 'Freedom Refined Sunflower Oil - 10 Ltr Jar',
        unitPrice: 1852, mrp: 2200, qty: 1, image: categoryImages.oilGhee, drop: 50,
      },
      {
        id: 'l_oil1x16', name: 'Freedom Refined Sunflower Oil - 1 Ltr Packet X 16 Nos',
        unitPrice: 177, mrp: 215, qty: 12, image: products.freedomSunflower1L,
      },
      {
        id: 'l_oil15', name: 'Freedom Refined Sunflower Oil - 15 Ltr Tin',
        unitPrice: 2814, mrp: 3300, qty: 1, image: categoryImages.cookingAndBakingNeeds,
      },
    ],
  },
  {
    id: 'c_sandeep',
    name: 'Sandeep Traders',
    slots: [
      { label: 'Fri 28th - Beat', mov: 1000 },
      { label: 'Tomorrow', mov: 2500 },
    ],
    selectedSlot: 1,
    lines: [
      {
        id: 'l_rice', name: 'Maateja Sona Masoori Rice - 25 Kg Bag',
        unitPrice: 1245, mrp: 1400, qty: 1, image: categoryImages.riceAndRiceProducts,
      },
      {
        id: 'l_rri', name: 'RRI HMT Premium Rice - 25 Kg Bag',
        unitPrice: 1226.5, mrp: 1350, qty: 2, image: categoryImages.foodgrains,
      },
      {
        id: 'l_atta', name: 'Aashirvaad Atta - 1 Kg Pack',
        unitPrice: 30, mrp: 36, qty: 12, image: categoryImages.attaFloursAndSooji,
      },
      {
        id: 'l_salt', name: 'Aashirvaad Iodised Salt - 1 Kg Pack',
        unitPrice: 30, mrp: 34, qty: 12, image: categoryImages.saltSugarAndJaggery,
      },
    ],
  },
  {
    id: 'c_saikrishna',
    name: 'Shri Sai Krishna Traders',
    slots: [{ label: 'Tomorrow', mov: 3000 }],
    selectedSlot: 0,
    lines: [
      {
        id: 'l_atta2', name: 'Aashirvaad Atta - 1 Kg Pack',
        unitPrice: 30, mrp: 36, qty: 12, image: categoryImages.attaFloursAndSooji,
      },
      {
        id: 'l_salt2', name: 'Aashirvaad Iodised Salt - 1 Kg Pack',
        unitPrice: 30, mrp: 34, qty: 12, image: categoryImages.saltSugarAndJaggery,
      },
      {
        id: 'l_bingo', name: 'Bingo Original Style Chips',
        unitPrice: 20, mrp: 25, qty: 5, image: categoryImages.snacksAndNamkeen,
      },
      {
        id: 'l_engage', name: 'Engage Cologne Spray',
        unitPrice: 360, mrp: 425, qty: 4, image: categoryImages.beautyHygiene,
      },
    ],
  },
];
