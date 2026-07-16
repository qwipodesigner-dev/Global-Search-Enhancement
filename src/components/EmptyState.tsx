import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, font } from '../theme/theme';
import { EmptyBox } from './EmptyBox';

export function EmptyState({ query, onSearchWholesaler }: { query: string; onSearchWholesaler: () => void }) {
  return (
    <View style={styles.wrap}>
      <EmptyBox size={150} />
      <Text style={styles.title}>No products available with{'\n'}distributors</Text>
      <Text style={styles.sub}>Please search in “{query}” from Wholesalers?</Text>
      <Pressable style={styles.btn} onPress={onSearchWholesaler}>
        <Ionicons name="search" size={16} color={colors.white} />
        <Text style={styles.btnText}>Search in wholesaler</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 60 },
  title: { fontFamily: font.semibold, fontSize: 15, color: colors.textDark, textAlign: 'center', marginTop: 18 },
  sub: { fontFamily: font.regular, fontSize: 12.5, color: colors.textMuted, textAlign: 'center', marginTop: 8 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingHorizontal: 18,
    height: 42,
    marginTop: 18,
  },
  btnText: { color: colors.white, fontFamily: font.bold, fontSize: 13.5 },
});
