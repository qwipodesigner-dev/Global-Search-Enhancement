import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { colors, radii, font, layout } from '../theme/theme';
import { ui } from '../assets';

/**
 * "Frame 39998" — two 185.5 x 72 cards, padding 8, gap 8, radius 12,
 * border 1px #2781E7. Active: bg #2781E7 + white label. Inactive: white bg + primary label.
 * A source not serving the delivery location renders greyed with a
 * "Coming Soon" chip and can't be selected.
 */
export function SourceCards({
  active = 'distributors',
  onChange,
  disabled = {},
}: {
  active?: 'distributors' | 'wholesalers';
  onChange?: (v: 'distributors' | 'wholesalers') => void;
  /** Seller types with no coverage at the active location. */
  disabled?: Partial<Record<'distributors' | 'wholesalers', boolean>>;
}) {
  const items = [
    { key: 'distributors' as const, label: 'Authorised\nDistributors', img: ui.tileDistributors },
    { key: 'wholesalers' as const, label: 'Wholesalers', img: ui.tileWholesalers },
  ];
  return (
    <View style={styles.row}>
      {items.map((it) => {
        const off = !!disabled[it.key];
        const on = it.key === active && !off;
        return (
          <Pressable
            key={it.key}
            onPress={off ? undefined : () => onChange?.(it.key)}
            disabled={off}
            style={[styles.card, off ? styles.cardDisabled : on ? styles.cardOn : styles.cardOff]}
          >
            <Image
              source={it.img}
              style={[styles.thumb, off && { opacity: 0.75 }]}
              resizeMode="cover"
            />
            <View style={{ flex: 1, gap: 4 }}>
              <Text
                style={[
                  styles.label,
                  { color: off ? colors.textMuted : on ? colors.white : colors.primary },
                ]}
              >
                {it.label}
              </Text>
              {off && (
                <View style={styles.soonChip}>
                  <Text style={styles.soonTxt}>Coming Soon</Text>
                </View>
              )}
            </View>
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
  cardDisabled: { backgroundColor: colors.white, borderColor: colors.grey },
  thumb: { width: 56, height: 56, borderRadius: radii.md },
  label: { fontFamily: font.bold, fontSize: 12, lineHeight: 16 },
  soonChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#D9F7E8',
    borderRadius: radii.sm,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  soonTxt: { fontFamily: font.medium, fontSize: 10, color: colors.marginGreen },
});
