import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, font } from '../theme/theme';
import { Product } from '../data/catalog';
import { ProductImage, CaseLine, VariantPills, PriceBand, ActionsRow, s } from './ProductCardParts';

/**
 * Wholesaler product card — replicated from the Figma export.
 * name → case → 120px image → variants → seller selector (multiple sellers)
 * → price band → Discounts/Add → "Delivery by Tomorrow".
 * No brand chip and no Free-Delivery line under the margin badge (per the reference).
 */
export function WholesalerProductCard({ product }: { product: Product }) {
  const [variant, setVariant] = useState(0);
  const initial = Math.max(0, product.sellers?.findIndex((x) => x.selected) ?? 0);
  const [seller, setSeller] = useState(initial);

  return (
    <View style={s.card}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={s.name} numberOfLines={2}>{product.name}</Text>
          <CaseLine product={product} />
        </View>
        <ProductImage product={product} />
      </View>

      <VariantPills options={product.quantities} selected={variant} onSelect={setVariant} />

      {/* Seller selector — multiple sellers per product */}
      {!!product.sellers?.length && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={w.sellerRow}>
          {product.sellers.map((sl, i) => {
            const on = i === seller;
            const fg = on ? colors.white : colors.textDark2;
            return (
              <Pressable key={i} onPress={() => setSeller(i)} style={[w.sellerBox, on ? w.sellerOn : w.sellerOff]}>
                <Text style={[w.sellerPrice, { color: fg, fontFamily: on ? font.bold : font.medium }]}>
                  ₹ {sl.price}
                </Text>
                <Text style={[w.sellerName, { color: fg, fontFamily: on ? font.semibold : font.regular }]}>
                  {sl.name}
                </Text>
                {sl.freeDelivery && (
                  <View style={w.sellerFree}>
                    <Ionicons name="cube-outline" size={12} color={fg} />
                    <Text style={[w.sellerFreeTxt, { color: fg }]}>Free Delivery</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <PriceBand product={product} />

      <ActionsRow />

      <View style={w.deliveryRow}>
        <Ionicons name="cube-outline" size={16} color={colors.primary} />
        <Text style={w.deliveryTxt}>{product.deliveryBy || 'Delivery by Tomorrow'}</Text>
      </View>
    </View>
  );
}

const w = StyleSheet.create({
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
});
