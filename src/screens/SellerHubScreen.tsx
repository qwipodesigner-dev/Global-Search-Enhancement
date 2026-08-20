import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { BottomNav } from '../components/BottomNav';
import { sellerById } from '../data/distributorList';
import { categories, brands } from '../data/catalog';

type Props = NativeStackScreenProps<RootStackParamList, 'SellerHub'>;

/** Home tiles use display labels ("Freedom Oil"); map them to catalogue brand names. */
function brandNameFor(label: string): string {
  const hit = brands.find((b) => label.toLowerCase().startsWith(b.name.toLowerCase()));
  return hit ? hit.name : label;
}

/**
 * Seller hub (reference screen) — one distributor's storefront: breadcrumbs
 * through to the company, the delivery slots + MOV, then all the company's
 * brands and categories. Tapping either lands on the Product List filtered
 * to this seller.
 */
export function SellerHubScreen({ navigation, route }: Props) {
  const seller = sellerById(route.params.sellerId);
  if (!seller) return null;

  const sellerCategories = seller.categoryNames
    .map((name) => categories.find((c) => c.name === name))
    .filter((c): c is NonNullable<typeof c> => !!c);

  // Filter by brand/category only (not seller): reference stock is spread
  // across sellers, and an empty list teaches the user nothing.
  const openBrand = (label: string) =>
    navigation.navigate('ProductList', {
      title: seller.name,
      crumbs: ['Distributors', seller.name, label],
      filter: { brand: brandNameFor(label), source: 'distributor' },
      subtitleLabel: label,
    });

  const openCategory = (name: string) =>
    navigation.navigate('ProductList', {
      title: seller.name,
      crumbs: ['Distributors', seller.name, name],
      filter: { category: name, source: 'distributor' },
      subtitleLabel: name,
    });

  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <Text style={styles.heading} numberOfLines={1}>{seller.name}</Text>
          <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('SearchInitial')}>
            <Ionicons name="search" size={22} color={colors.textDark} />
          </Pressable>
        </View>

        {/* Breadcrumbs: Distributors > seller > company */}
        <View style={styles.crumbRow}>
          {['Distributors', seller.name, seller.company].map((c, i) => (
            <React.Fragment key={c}>
              {i > 0 && <Ionicons name="chevron-forward" size={12} color={colors.textDark2} />}
              <Text style={styles.crumb} numberOfLines={1}>{c}</Text>
            </React.Fragment>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Delivery by + MOV ── */}
        <View style={styles.deliveryCard}>
          <Text style={styles.deliveryLabel}>Delivery by</Text>
          <View style={styles.slotRow}>
            {seller.delivery.map((d, i) => (
              <View key={i} style={styles.slot}>
                <Text style={styles.slotDate} numberOfLines={1}>{d.date}</Text>
                <View style={styles.movRow}>
                  <Text style={styles.movTxt}>MOV:</Text>
                  <Text style={styles.movTxt}>₹ {d.mov}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Brands ── */}
        <Text style={styles.sectionTitle}>Brands</Text>
        <View style={styles.brandGrid}>
          {seller.brands.map((b) => (
            <Pressable key={b.label} style={styles.brandItem} onPress={() => openBrand(b.label)}>
              <View style={styles.brandCircle}>
                <Image source={b.logo} style={styles.brandImg} resizeMode="contain" />
              </View>
              <Text style={styles.brandLabel} numberOfLines={2}>{b.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── Categories ── */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.catGrid}>
          {sellerCategories.map((c) => (
            <Pressable key={c.id} style={styles.catItem} onPress={() => openCategory(c.name)}>
              <Image source={c.image} style={styles.catImg} resizeMode="cover" />
              <Text style={styles.catLabel} numberOfLines={1}>{c.name}</Text>
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

  topNav: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
    ...shadow.topNav, zIndex: 10,
  },
  navBody: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 56 },
  iconBtn: {
    width: 40, height: 40, borderRadius: radii.md,
    backgroundColor: colors.bgGrey, alignItems: 'center', justifyContent: 'center',
  },
  heading: { flex: 1, fontFamily: font.medium, fontSize: 16, lineHeight: 24, color: colors.textDark },

  crumbRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 },
  crumb: {
    maxWidth: 118,
    fontFamily: font.regular, fontSize: 14, lineHeight: 24,
    color: colors.primary, textDecorationLine: 'underline',
  },

  scroll: { padding: 16, paddingBottom: 24 },

  // Delivery by card: white, blue border, slot boxes with "MOV: ₹ x"
  deliveryCard: {
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.primary, borderRadius: radii.lg,
    padding: 12, gap: 8,
  },
  deliveryLabel: { fontFamily: font.medium, fontSize: 12, lineHeight: 20, color: colors.textDark2 },
  slotRow: { flexDirection: 'row', gap: 12 },
  // maxWidth keeps a lone beat-day slot at half the card, matching two-slot rows
  slot: {
    flex: 1, maxWidth: '48.5%', gap: 4, padding: 8, justifyContent: 'center',
    borderWidth: 1, borderColor: colors.primary, borderRadius: 4,
  },
  slotDate: { fontFamily: font.medium, fontSize: 12, lineHeight: 20, color: colors.primary },
  movRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  movTxt: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: colors.textDark2 },

  sectionTitle: {
    fontFamily: font.medium, fontSize: 18, lineHeight: 24,
    color: colors.textDark, marginTop: 20, marginBottom: 12,
  },

  // 4 per row, like the home screen's All Brands: 4 x 86 + 3 x 12 = 380
  brandGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  brandItem: { width: 86, alignItems: 'center', gap: 8 },
  brandCircle: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12, shadowRadius: 4, elevation: 2,
  },
  brandImg: { width: 50, height: 50, borderRadius: 25 },
  brandLabel: {
    fontFamily: font.medium, fontSize: 12.5, lineHeight: 16,
    color: colors.textDark, textAlign: 'center',
  },

  // 2 per row: 2 x 184 + 12 = 380
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  catItem: { width: 184, gap: 8, alignItems: 'center' },
  catImg: { width: 184, height: 120, borderRadius: radii.lg },
  catLabel: { fontFamily: font.medium, fontSize: 15, lineHeight: 20, color: colors.textDark, textAlign: 'center' },
});
