import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { BottomNav } from '../components/BottomNav';
import { groceriesCategories, fmcgCategories, WholesaleTile } from '../data/wholesalerHome';

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryGrid'>;

const GROUPS: Record<'groceries' | 'fmcg', { title: string; items: WholesaleTile[] }> = {
  groceries: { title: 'Groceries', items: groceriesCategories },
  fmcg: { title: 'FMCG', items: fmcgCategories },
};

/**
 * Category grid reached from the Wholesalers home (Figma "Groceries" / "FMCG").
 * Top nav (back + heading + search) → 2-column grid of 180x120 image cards → menu bar.
 */
export function CategoryGridScreen({ navigation, route }: Props) {
  const { title, items } = GROUPS[route.params.group];

  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar (Frame 7099) ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <Text style={styles.heading} numberOfLines={1}>{title}</Text>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="search" size={22} color={colors.textDark} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          {items.map((c) => (
            <Pressable key={c.id} style={styles.cell}>
              <View style={styles.card}>
                <Image source={c.image} style={styles.img} resizeMode="cover" />
              </View>
              <Text style={styles.label} numberOfLines={2}>{c.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNav active="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgGrey },

  // Top Nav Bar: white, radius 0 0 16 16, shadow 0 1px 4, padding 16
  topNav: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
    ...shadow.topNav, zIndex: 10,
  },
  navBody: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 16, height: 56 },
  iconBtn: {
    width: 40, height: 40, borderRadius: radii.md,
    backgroundColor: colors.bgGrey, alignItems: 'center', justifyContent: 'center',
  },
  heading: { flex: 1, fontFamily: font.medium, fontSize: 16, lineHeight: 24, color: colors.textDark },

  // Frame 40010 — wrap grid, padding 16 12, gap 24
  scroll: { paddingBottom: 16 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingVertical: 16, paddingHorizontal: 12,
    rowGap: 24, columnGap: 12, justifyContent: 'space-between',
  },
  // Frame 39998 — 180 card + label
  cell: { width: 180, alignItems: 'center', gap: 12 },
  card: {
    width: 180, height: 120, borderRadius: radii.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.grey, backgroundColor: colors.white,
  },
  img: { width: '100%', height: '100%' },
  label: {
    width: 173, textAlign: 'center',
    fontFamily: font.medium, fontSize: 16, lineHeight: 20, color: colors.textDark2,
  },
});
