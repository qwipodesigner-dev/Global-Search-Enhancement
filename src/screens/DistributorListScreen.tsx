import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { BottomNav } from '../components/BottomNav';
import { sellers, sellerById, Seller } from '../data/distributorList';

type Props = NativeStackScreenProps<RootStackParamList, 'DistributorList'>;

/**
 * Authorised Distributors directory (Figma "All list view" / "Isolated view").
 * Reached from "See All" beside Distributors on the home screen; tapping a
 * seller card opens the same screen isolated to that seller. In the isolated
 * view the MOV reads "MOV:" in primary blue rather than a muted "Seller MOV:".
 */
export function DistributorListScreen({ navigation, route }: Props) {
  const focused = route.params?.sellerId ? sellerById(route.params.sellerId) : undefined;
  const isolated = !!focused;
  const list: Seller[] = focused ? [focused] : sellers;
  const heading = focused ? focused.name : 'Authorised Distributors';

  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar (Frame 7099) ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <Text style={styles.heading} numberOfLines={1}>{heading}</Text>
          <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('SearchInitial')}>
            <Ionicons name="search" size={22} color={colors.textDark} />
          </Pressable>
        </View>
      </View>

      {/* ── Frame 7343 — scrolling seller cards ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {list.map((s) => (
          <SellerCard
            key={s.id}
            seller={s}
            isolated={isolated}
            onPress={isolated ? undefined : () => navigation.push('DistributorList', { sellerId: s.id })}
          />
        ))}
      </ScrollView>

      <BottomNav active="none" />
    </View>
  );
}

function SellerCard({
  seller, isolated, onPress,
}: { seller: Seller; isolated: boolean; onPress?: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <Text style={styles.sellerName} numberOfLines={1}>{seller.name}</Text>
      <View style={styles.divider} />

      {/* Frame 40104 — Delivery by + slots */}
      <View style={styles.deliveryBlock}>
        <Text style={styles.deliveryLabel}>Delivery by</Text>
        <View style={styles.slotRow}>
          {seller.delivery.map((d, i) => (
            <View key={i} style={styles.slot}>
              <Text style={styles.slotDate} numberOfLines={1}>{d.date}</Text>
              <View style={styles.movRow}>
                <Text style={isolated ? styles.movTextOn : styles.movText}>
                  {isolated ? 'MOV:' : 'Seller MOV:'}
                </Text>
                <Text style={isolated ? styles.movTextOn : styles.movText}>{d.mov}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Frame 40067 — brand cards, 4 per row */}
      <View style={styles.brandGrid}>
        {seller.brands.map((b, i) => (
          <View key={i} style={styles.brandCard}>
            <Image source={b.logo} style={styles.brandImg} resizeMode="contain" />
            <Text style={styles.brandLabel} numberOfLines={1}>{b.label}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgGrey },

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

  // Frame 7343: padding 2 4, gap 12
  scroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },

  // Seller Card: 380 wide, padding 16, gap 12, radius 12, 1px #D3D3D3
  card: {
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.grey, borderRadius: radii.lg,
    padding: 16, gap: 12,
  },
  sellerName: { fontFamily: font.medium, fontSize: 16, lineHeight: 24, color: colors.heading },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.grey },

  deliveryBlock: { gap: 8 },
  deliveryLabel: { fontFamily: font.medium, fontSize: 12, lineHeight: 20, color: colors.textDark2 },
  // Each slot is a fixed 167 box; a single slot stays 167 wide (not stretched).
  slotRow: { flexDirection: 'row', gap: 12, alignSelf: 'flex-start' },
  slot: {
    width: 167, height: 45, justifyContent: 'center', gap: 4,
    paddingHorizontal: 8,
    borderWidth: 1, borderColor: colors.primary, borderRadius: 4,
  },
  slotDate: { fontFamily: font.medium, fontSize: 12, lineHeight: 20, color: colors.primary },
  movRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  movText: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: colors.textDark2 },
  movTextOn: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: colors.primary },

  // Frame 40067 — wrap grid, 4 x 77 + 3 x 12 gap = 344
  brandGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  brandCard: {
    width: 77, height: 89,
    alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.grey, borderRadius: radii.md,
  },
  brandImg: { width: 47, height: 48, borderRadius: 5 },
  brandLabel: {
    maxWidth: 56, textAlign: 'center',
    fontFamily: font.medium, fontSize: 12, lineHeight: 16, color: colors.textDark,
  },
});
