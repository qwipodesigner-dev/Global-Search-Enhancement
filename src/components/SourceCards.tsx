import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { colors, radii, font, layout } from '../theme/theme';
import { ui } from '../assets';

/**
 * "Frame 39998" — two 185.5 x 72 cards, padding 8, gap 8, radius 12,
 * border 1px #2781E7. Active: bg #2781E7 + white label. Inactive: white bg + primary label.
 * Image tile 56x56 radius 8. Label Inter 700 12/16.
 */
export function SourceCards({
  active = 'distributors',
  onChange,
}: {
  active?: 'distributors' | 'wholesalers';
  onChange?: (v: 'distributors' | 'wholesalers') => void;
}) {
  const items = [
    { key: 'distributors' as const, label: 'Authorised\nDistributors', img: ui.tileDistributors },
    { key: 'wholesalers' as const, label: 'Wholesalers', img: ui.tileWholesalers },
  ];
  return (
    <View style={styles.row}>
      {items.map((it) => {
        const on = it.key === active;
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange?.(it.key)}
            style={[styles.card, on ? styles.cardOn : styles.cardOff]}
          >
            <Image source={it.img} style={styles.thumb} resizeMode="cover" />
            <Text style={[styles.label, { color: on ? colors.white : colors.primary }]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: layout.sourceCardHeight,
    padding: 8,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cardOn: { backgroundColor: colors.primary },
  cardOff: { backgroundColor: colors.white },
  thumb: { width: 56, height: 56, borderRadius: radii.md },
  label: { flex: 1, fontFamily: font.bold, fontSize: 12, lineHeight: 16 },
});
