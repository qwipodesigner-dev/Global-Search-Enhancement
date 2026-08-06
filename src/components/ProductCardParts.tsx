import React from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, font } from '../theme/theme';
import { Product } from '../data/catalog';

/** Shared pieces of the Distributor / Wholesaler product cards (Figma export). */

/** Deeper Qwipo purple than the #BB77FF brand tint, so white text is legible. */
const WHOLESALE_PURPLE = '#8B46E6';

/**
 * Top-of-card tags: the brand chip plus a colour-coded source badge, in the same
 * position on BOTH cards. Since distributor and wholesaler listings now sit in
 * one merged list, the badge (blue = Distributor, purple = Wholesaler) tells the
 * retailer at a glance which is which.
 */
export function CardTags({ product }: { product: Product }) {
  const isDist = product.source === 'distributor';
  return (
    <View style={s.tagRow}>
      <View style={s.brandChip}>
        <Text style={s.brandChipTxt}>{product.brand}</Text>
      </View>
      <View style={[s.sourceBadge, isDist ? s.sourceDist : s.sourceWhol]}>
        <Ionicons name={isDist ? 'storefront' : 'business'} size={11} color={colors.white} />
        <Text style={s.sourceTxt}>{isDist ? 'Distributor' : 'Wholesaler'}</Text>
      </View>
    </View>
  );
}

/** 120x120 image box: bg #F4F4F4, radius 8, shadow 0 1px 3 rgba(0,0,0,0.1). */
export function ProductImage({ product }: { product: Product }) {
  return (
    <View style={s.imgBox}>
      {product.image ? (
        <Image source={product.image} style={s.img} resizeMode="contain" />
      ) : (
        <View style={[s.imgFallback, { backgroundColor: product.tint ?? colors.bgGrey }]}>
          <Ionicons name="cube-outline" size={36} color={colors.white} />
        </View>
      )}
    </View>
  );
}

/** Case: 16 pc — Inter medium 10 #9A9A9A. */
export function CaseLine({ product }: { product: Product }) {
  return (
    <View style={s.caseRow}>
      <Text style={s.caseTxt}>Case:</Text>
      <Text style={s.caseTxt}>{product.caseText.replace(/^Case:\s*/, '')}</Text>
    </View>
  );
}

/** Variant pills: selected #2781E7/white bold, else white + #D3D3D3 border. */
export function VariantPills({
  options, selected, onSelect,
}: { options: string[]; selected: number; onSelect: (i: number) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pillRow}>
      {options.map((v, i) => {
        const on = i === selected;
        return (
          <Pressable key={i} onPress={() => onSelect(i)} style={[s.pill, on ? s.pillOn : s.pillOff]}>
            <Text style={[s.pillTxt, on ? s.pillTxtOn : s.pillTxtOff]}>{v}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/**
 * Price band: 0.5px #D3D3D3 top+bottom borders, py 12.
 * Left: margin badge (+ optional Free Delivery). Right: MRP + price.
 */
export function PriceBand({ product, showFreeDelivery }: { product: Product; showFreeDelivery?: boolean }) {
  return (
    <View style={s.band}>
      <View style={{ gap: 4 }}>
        <View style={s.marginBadge}>
          <Text style={s.marginTxt}>{product.margin}</Text>
        </View>
        {showFreeDelivery && product.freeDelivery && (
          <View style={s.freeRow}>
            <Ionicons name="receipt-outline" size={12} color={colors.discountGreen} />
            <Text style={s.freeTxt}>Free Delivery</Text>
          </View>
        )}
      </View>

      <View style={{ alignItems: 'flex-end', gap: 8 }}>
        <View style={s.mrpRow}>
          <Text style={s.mrpLabel}>MRP</Text>
          <Text style={s.mrpValue}>₹ {product.mrp}</Text>
        </View>
        <View style={s.priceRow}>
          <Text style={s.price}>₹ {product.price}</Text>
          <Text style={s.perPc}>/pc</Text>
        </View>
      </View>
    </View>
  );
}

/** Seller selector — the competing wholesaler offers (₹ price / Seller n / Free Delivery). */
export function SellerSelector({
  sellers, selected, onSelect,
}: { sellers: NonNullable<Product['sellers']>; selected: number; onSelect: (i: number) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.sellerRow}>
      {sellers.map((sl, i) => {
        const on = i === selected;
        const fg = on ? colors.white : colors.textDark2;
        return (
          <Pressable key={i} onPress={() => onSelect(i)} style={[s.sellerBox, on ? s.sellerOn : s.sellerOff]}>
            <Text style={[s.sellerPrice, { color: fg, fontFamily: on ? font.bold : font.medium }]}>
              ₹ {sl.price}
            </Text>
            <Text style={[s.sellerName, { color: fg, fontFamily: on ? font.semibold : font.regular }]}>
              {sl.name}
            </Text>
            {sl.freeDelivery && (
              <View style={s.sellerFree}>
                <Ionicons name="cube-outline" size={12} color={fg} />
                <Text style={[s.sellerFreeTxt, { color: fg }]}>Free Delivery</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** "Delivery by Tomorrow" footer line. */
export function DeliveryByLine({ text }: { text?: string }) {
  return (
    <View style={s.deliveryRow}>
      <Ionicons name="cube-outline" size={16} color={colors.primary} />
      <Text style={s.deliveryTxt}>{text || 'Delivery by Tomorrow'}</Text>
    </View>
  );
}

/** Discounts (green) + Add (blue) row. */
export function ActionsRow() {
  return (
    <View style={s.actions}>
      <Pressable style={s.discountBtn}>
        <Text style={s.discountTxt}>Discounts</Text>
        <Ionicons name="caret-down" size={14} color={colors.white} />
      </Pressable>
      <Pressable style={s.addBtn}>
        <Ionicons name="add-circle-outline" size={20} color={colors.white} />
        <Text style={s.addTxt}>Add</Text>
      </Pressable>
    </View>
  );
}

export const s = StyleSheet.create({
  /** Card: white, radius 16, shadow 0 0 4 rgba(0,0,0,0.15), padding 12, gap 12. */
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  header: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  headerLeft: { flex: 1, gap: 4, minWidth: 0 },

  // brand chip + source badge row (both cards, above the SKU name)
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  brandChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lightBlue,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: radii.md,
  },
  brandChipTxt: { fontFamily: font.semibold, fontSize: 12, color: colors.primary },
  sourceBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: radii.md,
  },
  sourceDist: { backgroundColor: colors.primary },       // blue = Distributor
  sourceWhol: { backgroundColor: WHOLESALE_PURPLE },     // purple = Wholesaler
  sourceTxt: { fontFamily: font.bold, fontSize: 10.5, color: colors.white },

  name: { fontFamily: font.semibold, fontSize: 16, lineHeight: 20.6, color: colors.textDark },

  caseRow: { flexDirection: 'row', gap: 4, paddingHorizontal: 4, alignItems: 'center' },
  caseTxt: { fontFamily: font.medium, fontSize: 10, color: colors.textMuted },

  imgBox: {
    width: 120, height: 120,
    backgroundColor: colors.bgGrey,
    borderRadius: radii.md,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  img: { width: '83.62%', height: '89.59%' },
  imgFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },

  pillRow: { gap: 8, paddingBottom: 4 },
  pill: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  pillOn: { backgroundColor: colors.primary },
  pillOff: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.grey },
  pillTxt: { fontSize: 12 },
  pillTxtOn: { fontFamily: font.bold, color: colors.white },
  pillTxtOff: { fontFamily: font.medium, color: colors.textDark2 },

  band: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: colors.grey,
  },
  marginBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.marginGreen,
    borderRadius: radii.sm,
    paddingHorizontal: 8, paddingVertical: 8,
  },
  marginTxt: { fontFamily: font.semibold, fontSize: 12, color: colors.marginGreen },
  freeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  freeTxt: { fontFamily: font.medium, fontSize: 10, color: colors.marginGreen },

  mrpRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mrpLabel: { fontFamily: font.medium, fontSize: 10, color: colors.mrpRed },
  mrpValue: { fontFamily: font.medium, fontSize: 12, color: colors.mrpRed, textDecorationLine: 'line-through' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end' },
  price: { fontFamily: font.semibold, fontSize: 18, letterSpacing: -0.48, color: colors.textDark },
  perPc: { fontFamily: font.medium, fontSize: 12, color: colors.textDark },

  sellerRow: { gap: 8, alignItems: 'flex-start' },
  sellerBox: { gap: 8, paddingHorizontal: 10, paddingVertical: 8, borderRadius: radii.sm },
  sellerOn: { backgroundColor: colors.primary },
  sellerOff: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.grey },
  sellerPrice: { fontSize: 12 },
  sellerName: { fontSize: 12 },
  sellerFree: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sellerFreeTxt: { fontFamily: font.regular, fontSize: 10 },

  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deliveryTxt: { fontFamily: font.medium, fontSize: 12, color: colors.textDark2 },

  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  discountBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    padding: 10, borderRadius: radii.md,
    backgroundColor: '#01966A', // #02BC7D under a 20% black overlay
  },
  discountTxt: { fontFamily: font.semibold, fontSize: 14, color: colors.white },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: radii.md,
  },
  addTxt: { fontFamily: font.semibold, fontSize: 16, color: colors.white },
});
