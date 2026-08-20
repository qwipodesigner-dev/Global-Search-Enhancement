import React, { createContext, useContext, useMemo, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, font } from '../theme/theme';
import { Product } from '../data/catalog';
import { BottomSheet } from '../components/BottomSheet';
import { VariantPills, SellerSelector, ProductImage } from '../components/ProductCardParts';
import { rupees } from './CartContext';

/**
 * The "Add to Cart" bottom sheet (Figma reference), opened by the Add button
 * on every product card. Distributor products: variant pills + per-piece and
 * per-case quantity rows. Wholesaler products additionally get the seller
 * selector. Rendered once at app level so it overlays the whole screen.
 */

type AddToCartApi = { open: (product: Product) => void };

const AddToCartContext = createContext<AddToCartApi | null>(null);

export function useAddToCart(): AddToCartApi {
  const ctx = useContext(AddToCartContext);
  if (!ctx) throw new Error('useAddToCart must be used inside AddToCartProvider');
  return ctx;
}

/** "Case: 16 pc" → 16; "Case: 1 bag" → 1. */
function caseSize(p: Product): number {
  const m = p.caseText.match(/(\d+)/);
  return m ? Number(m[1]) : 1;
}
const toNumber = (s: string) => Number(s.replace(/,/g, ''));

export function AddToCartProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [variant, setVariant] = useState(0);
  const [seller, setSeller] = useState(0);
  const [pcQty, setPcQty] = useState(1);
  const [caseQty, setCaseQty] = useState(1);

  const api = useMemo<AddToCartApi>(() => ({
    open: (p) => {
      setVariant(0);
      setSeller(Math.max(0, p.sellers?.findIndex((x) => x.selected) ?? 0));
      setPcQty(1);
      setCaseQty(1);
      setProduct(p);
    },
  }), []);

  const close = () => setProduct(null);

  const unit = product ? toNumber(product.price) : 0;
  const perCase = product ? caseSize(product) : 1;
  // Wholesaler case rate comes from the selected seller's offer.
  const casePrice = product?.sellers?.length
    ? toNumber(product.sellers[Math.min(seller, product.sellers.length - 1)].price)
    : unit * perCase;
  const total = pcQty * unit + caseQty * casePrice;

  return (
    <AddToCartContext.Provider value={api}>
      {children}

      <BottomSheet
        visible={!!product}
        title="Add to Cart"
        subtitle="Please select the quantity to add to your cart"
        onClose={close}
      >
        {product && (
          <View style={styles.body}>
            {/* ── Product header ── */}
            <View style={styles.productRow}>
              <Text style={styles.name}>{product.name}</Text>
              <ProductImage product={product} />
            </View>

            <VariantPills options={product.quantities} selected={variant} onSelect={setVariant} />

            {/* Wholesalers: pick the seller first */}
            {!!product.sellers?.length && (
              <SellerSelector sellers={product.sellers} selected={seller} onSelect={setSeller} />
            )}

            {/* ── Per-piece row ── */}
            <QtyRow
              product={product}
              multiplier="1 × 1"
              unitLabel="1 Pc"
              unitPrice={unit}
              qty={pcQty}
              pieces={pcQty}
              onQty={setPcQty}
            />

            {/* ── Per-case row ── */}
            <QtyRow
              product={product}
              multiplier={`1 × ${perCase}`}
              unitLabel="1 Case"
              unitPrice={casePrice}
              qty={caseQty}
              pieces={caseQty * perCase}
              onQty={setCaseQty}
            />

            {/* ── Total + Continue ── */}
            <View style={styles.footer}>
              <View style={{ gap: 6 }}>
                <Text style={styles.totalLabel}>Total Value:</Text>
                <View style={styles.totalRow}>
                  <Text style={styles.totalValue}>₹{rupees(total)}</Text>
                  <View style={styles.feeRow}>
                    <Ionicons name="cube-outline" size={14} color={colors.marginGreen} />
                    <Text style={styles.feeTxt}>+ ₹12 Fees</Text>
                  </View>
                </View>
              </View>
              <Pressable style={styles.continueBtn} onPress={close}>
                <Text style={styles.continueTxt}>Continue</Text>
              </Pressable>
            </View>
          </View>
        )}
      </BottomSheet>
    </AddToCartContext.Provider>
  );
}

/** One quantity line: thumb, unit maths, stepper + resulting piece count. */
function QtyRow({
  product, multiplier, unitLabel, unitPrice, qty, pieces, onQty,
}: {
  product: Product;
  multiplier: string;
  unitLabel: string;
  unitPrice: number;
  qty: number;
  pieces: number;
  onQty: (n: number) => void;
}) {
  return (
    <View style={styles.qtyCard}>
      <View style={styles.thumbFrame}>
        {product.image
          ? <Image source={product.image} style={styles.thumb} resizeMode="contain" />
          : <Ionicons name="cube-outline" size={24} color={colors.textMuted} />}
      </View>

      <View style={{ flex: 1, gap: 8 }}>
        <View style={styles.mathRow}>
          <Text style={styles.mathDim}>{multiplier}</Text>
          <Text style={styles.mathPrice}>₹ {rupees(unitPrice)}</Text>
        </View>
        <View style={styles.mathRow}>
          <Text style={styles.mathDim}>{unitLabel}</Text>
          <Text style={styles.mathPrice}>₹ {rupees(unitPrice)}</Text>
        </View>
      </View>

      <View style={{ alignItems: 'center', gap: 8 }}>
        <View style={styles.stepper}>
          <Pressable onPress={() => onQty(Math.max(0, qty - 1))} hitSlop={6}>
            <Ionicons name="remove" size={20} color={colors.primary} />
          </Pressable>
          <Text style={styles.stepperQty}>{qty}</Text>
          <Pressable onPress={() => onQty(qty + 1)} hitSlop={6}>
            <Ionicons name="add" size={20} color={colors.primary} />
          </Pressable>
        </View>
        <Text style={styles.pcs}>{pieces} Pcs</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { backgroundColor: '#F7F7F7', padding: 16, gap: 12 },

  productRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  name: { flex: 1, fontFamily: font.semibold, fontSize: 18, lineHeight: 24, color: colors.textDark },

  qtyCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, borderRadius: radii.lg, padding: 12,
  },
  thumbFrame: {
    width: 56, height: 56, borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#B5B5B5',
    backgroundColor: '#FBFBFB',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  thumb: { width: 48, height: 48 },
  mathRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mathDim: { minWidth: 42, fontFamily: font.regular, fontSize: 13, color: colors.textDark2 },
  mathPrice: { fontFamily: font.semibold, fontSize: 15, color: colors.textDark },

  stepper: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 36, paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.primary, borderRadius: radii.md,
  },
  stepperQty: {
    minWidth: 18, textAlign: 'center',
    fontFamily: font.semibold, fontSize: 16, color: colors.primary,
  },
  pcs: { fontFamily: font.medium, fontSize: 13, color: colors.textDark },

  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    backgroundColor: colors.white, borderRadius: radii.lg,
    paddingHorizontal: 14, paddingVertical: 12, marginTop: 4,
  },
  totalLabel: { fontFamily: font.regular, fontSize: 12, color: colors.textMuted },
  totalRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  totalValue: { fontFamily: font.semibold, fontSize: 20, color: colors.textDark },
  feeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  feeTxt: { fontFamily: font.medium, fontSize: 10, color: colors.marginGreen },

  continueBtn: {
    height: 48, paddingHorizontal: 24, borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  continueTxt: { fontFamily: font.semibold, fontSize: 18, color: colors.white },
});
