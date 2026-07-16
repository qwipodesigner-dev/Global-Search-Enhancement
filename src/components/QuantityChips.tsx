import React, { useState } from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radii, font } from '../theme/theme';

export function QuantityChips({ options, initial = 0 }: { options: string[]; initial?: number }) {
  const [sel, setSel] = useState(initial);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((o, i) => {
        const on = i === sel;
        return (
          <Pressable key={i} onPress={() => setSel(i)} style={[styles.chip, on && styles.chipOn]}>
            <Text style={[styles.txt, on && styles.txtOn]}>{o}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 6, paddingRight: 8 },
  chip: {
    paddingHorizontal: 12,
    height: 30,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  txt: { fontFamily: font.medium, fontSize: 12.5, color: colors.textDark2 },
  txtOn: { color: colors.white },
});
