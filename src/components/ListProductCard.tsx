import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Product } from '../data/catalog';
import { ProductImage, CaseLine, VariantPills, PriceBand, ActionsRow, s } from './ProductCardParts';

/**
 * "Beat selection Product card" — the card used on the Product List page.
 * Per the Figma CSS this variant has NO brand chip and NO per-card delivery
 * block (Frame 39965 is display:none); delivery/MOV is hoisted to the sticky
 * card at the top of the page.
 *
 * Frame 39964 (gap 12): header (name + case + 120px image) → weight variants
 * → price band (0.5px rules) → Discounts / Add.
 */
export function ListProductCard({ product }: { product: Product }) {
  const [variant, setVariant] = useState(0);

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

      <PriceBand product={product} showFreeDelivery />

      <ActionsRow />
    </View>
  );
}
