import React, { createContext, useContext, useMemo, useState } from 'react';
import { cartSeed, CartSellerSeed, CartSlot, CartLine } from '../data/cartData';

/**
 * Live cart state shared by Cart Summary, View Items and the Cart CTA bar.
 * Nothing here is hard-coded: seller totals follow the line quantities, the
 * MOV follows the selected delivery slot (beat day is cheaper to serve, so
 * its MOV is lower), and the shortfall drives the red "Add ₹ x More" CTA.
 */

export type CartSeller = CartSellerSeed & {
  /** Sum of qty x unit price across lines. */
  total: number;
  /** MOV of the currently selected delivery slot. */
  mov: number;
  /** How far the seller is from MOV (0 when met). */
  shortfall: number;
  slot: CartSlot;
};

type CartApi = {
  sellers: CartSeller[];
  sellerById: (id: string) => CartSeller | undefined;
  /** Grand total across sellers — feeds the Cart CTA bar. */
  grandTotal: number;
  selectSlot: (sellerId: string, slotIndex: number) => void;
  setQty: (sellerId: string, lineId: string, qty: number) => void;
  removeLine: (sellerId: string, lineId: string) => void;
};

const CartContext = createContext<CartApi | null>(null);

const lineTotal = (l: CartLine) => l.qty * l.unitPrice;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartSellerSeed[]>(cartSeed);

  const patchSeller = (sellerId: string, patch: (s: CartSellerSeed) => CartSellerSeed) =>
    setState((prev) => prev.map((s) => (s.id === sellerId ? patch(s) : s)));

  const api = useMemo<CartApi>(() => {
    // Sellers with no lines left drop out of the cart entirely.
    const sellers: CartSeller[] = state
      .filter((s) => s.lines.length > 0)
      .map((s) => {
        const total = s.lines.reduce((sum, l) => sum + lineTotal(l), 0);
        const slot = s.slots[s.selectedSlot] ?? s.slots[0];
        const mov = slot.mov;
        return { ...s, total, mov, slot, shortfall: Math.max(0, mov - total) };
      });

    return {
      sellers,
      sellerById: (id) => sellers.find((s) => s.id === id),
      grandTotal: sellers.reduce((sum, s) => sum + s.total, 0),
      selectSlot: (sellerId, slotIndex) =>
        patchSeller(sellerId, (s) => ({ ...s, selectedSlot: slotIndex })),
      setQty: (sellerId, lineId, qty) =>
        patchSeller(sellerId, (s) => ({
          ...s,
          lines: s.lines.map((l) => (l.id === lineId ? { ...l, qty: Math.max(1, qty) } : l)),
        })),
      removeLine: (sellerId, lineId) =>
        patchSeller(sellerId, (s) => ({ ...s, lines: s.lines.filter((l) => l.id !== lineId) })),
    };
  }, [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

/** ₹-friendly formatting: en-IN grouping, decimals only when the paise matter. */
export function rupees(n: number): string {
  return n % 1 === 0
    ? n.toLocaleString('en-IN')
    : n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
