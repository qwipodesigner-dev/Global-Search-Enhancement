import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { colors, radii, font, layout, shadow } from '../theme/theme';
import { Brand, Category } from '../data/catalog';

/**
 * Brand tile — identical treatment to the Home screen "All Brands" tile:
 * 64px shadowed circle + fixed 36px 2-line label, tile locked to 89x108
 * so every tile lines up whether the name wraps or not.
 */
export function BrandTile({ brand, onPress }: { brand: Brand; onPress?: () => void }) {
  return (
    <Pressable style={s.brandTile} onPress={onPress}>
      <View style={[s.brandCircle, !brand.logo && { backgroundColor: brand.color }]}>
        {brand.logo ? (
          <Image source={brand.logo} style={s.brandImg} resizeMode="contain" />
        ) : (
          <Text style={s.brandInitial}>{brand.name[0]}</Text>
        )}
      </View>
      <Text style={s.brandLabel} numberOfLines={2}>{brand.name}</Text>
    </Pressable>
  );
}

/**
 * Category card — matches the Seller Store reference: a 150x100 rounded photo
 * card on a light surface with a centred 2-line label beneath.
 */
export function CategoryCard({ category, onPress }: { category: Category; onPress?: () => void }) {
  return (
    <Pressable style={s.catTile} onPress={onPress}>
      <View style={s.catImgBox}>
        {category.image ? (
          <Image source={category.image} style={s.catImg} resizeMode="cover" />
        ) : (
          <View style={[s.catImg, { backgroundColor: colors.bgGrey }]} />
        )}
      </View>
      <Text style={s.catLabel} numberOfLines={2}>{category.name}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  // ── Brand (Home-screen parity) ──
  brandTile: {
    width: layout.brandTileWidth, // 89
    height: layout.brandTileHeight, // 108
    alignItems: 'center',
    gap: 8,
  },
  brandCircle: {
    width: layout.brandCircle, // 64
    height: layout.brandCircle,
    borderRadius: radii.full,
    backgroundColor: colors.tileBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadow.circle,
  },
  brandImg: { width: 53, height: 53 },
  brandInitial: { fontFamily: font.bold, fontSize: 22, color: colors.white },
  brandLabel: {
    fontFamily: font.medium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textDark2,
    textAlign: 'center',
    width: layout.brandTileWidth,
    height: 36, // 2 lines — keeps 1- and 2-line names aligned
  },

  // ── Category (reference card) ──
  catTile: { width: 150, gap: 8 },
  catImgBox: {
    width: 150,
    height: 100,
    borderRadius: radii.lg,
    backgroundColor: colors.tileBg,
    overflow: 'hidden',
    ...shadow.soft,
  },
  catImg: { width: '100%', height: '100%' },
  catLabel: {
    fontFamily: font.medium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textDark2,
    textAlign: 'center',
    width: 150,
    height: 36, // 2 lines
  },
});
