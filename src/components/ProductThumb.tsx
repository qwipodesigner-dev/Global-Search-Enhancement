import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Path, G } from 'react-native-svg';
import { colors, radii } from '../theme/theme';

/**
 * Product image. Uses the real photo exported from Figma when the SKU has one,
 * otherwise falls back to a stylised pack illustration.
 */
export function ProductThumb({
  size = 66,
  tint = '#F4C21E',
  image,
}: {
  size?: number;
  tint?: string;
  image?: any;
}) {
  if (image) {
    return (
      <View style={[styles.wrap, { width: size, height: size }]}>
        <Image source={image} style={{ width: size, height: size }} resizeMode="contain" />
      </View>
    );
  }
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size * 0.7} height={size * 0.85} viewBox="0 0 42 52">
        <Rect x={6} y={6} width={30} height={44} rx={4} fill={tint} />
        <Rect x={6} y={6} width={30} height={12} rx={4} fill="#E23D3D" />
        <Rect x={10} y={22} width={22} height={22} rx={3} fill="#FFF7DA" />
        <G>
          <Circle cx={21} cy={31} r={4} fill="#F2A61C" />
          <Path
            d="M21 24v3M21 35v3M14 31h3M25 31h3M16 26l2 2M26 34l-2-2M16 36l2-2M26 28l-2 2"
            stroke="#F2A61C"
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
