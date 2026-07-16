import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, font } from '../theme/theme';

type Props = {
  tabs: string[];
  active: number;
  onChange: (i: number) => void;
};

/**
 * Search tab bar — Figma export: white track, 1px #F4F4F4 border, radius 12, padding 4, gap 4.
 * Active: #2781E7 + white. Inactive: #F4F4F4 + #2781E7. Inter medium 16, py 8, radius 8.
 */
export function SegmentedTabs({ tabs, active, onChange }: Props) {
  return (
    <View style={styles.track}>
      {tabs.map((t, i) => {
        const on = i === active;
        return (
          <Pressable key={t} style={[styles.tab, on ? styles.tabOn : styles.tabOff]} onPress={() => onChange(i)}>
            <Text style={[styles.label, on ? styles.labelOn : styles.labelOff]}>{t}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.bgGrey,
    borderRadius: radii.lg,
    padding: 4,
    gap: 4,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  tabOn: { backgroundColor: colors.primary },
  tabOff: { backgroundColor: colors.bgGrey },
  label: { fontFamily: font.medium, fontSize: 16 },
  labelOn: { color: colors.white },
  labelOff: { color: colors.primary },
});
