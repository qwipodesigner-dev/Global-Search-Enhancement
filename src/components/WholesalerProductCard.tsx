import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Product } from '../data/catalog';
import {
  CardTags, ProductImage, CaseLine, VariantPills, SellerSelector, PriceBand,
  ActionsRow, DeliveryByLine, s,
} from './ProductCardParts';

/**
 * Wholesaler product card — replicated from the Figma export.
 * brand chip + Wholesaler badge → name → case → 120px image → variants →
 * seller selector (multiple sellers) → price band → Discounts/Add → delivery.
 */
export function WholesalerProductCard({ product }: { product: Product }) {
  const [variant, setVariant] = useState(0);
  const initial = Math.max(0, product.sellers?.findIndex((x) => x.selected) ?? 0);
  const [seller, setSeller] = useState(initial);

  return (
    <View style={s.card}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <CardTags product={product} />
          <Text style={s.name} numberOfLines={2}>{product.name}</Text>
          <CaseLine product={product} />
        </View>
        <ProductImage product={product} />
      </View>

      <VariantPills options={product.quantities} selected={variant} onSelect={setVariant} />

      {!!product.sellers?.length && (
        <SellerSelector sellers={product.sellers} selected={seller} onSelect={setSeller} />
      )}

      <PriceBand product={product} />

      <ActionsRow />

      <DeliveryByLine text={product.deliveryBy} />
    </View>
  );
}
