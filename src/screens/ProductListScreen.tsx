import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, layout } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { ListProductCard } from '../components/ListProductCard';
import { EmptyBox } from '../components/EmptyBox';
import { CartBar } from '../components/CartBar';
import { products, DELIVERY_OPTIONS } from '../data/catalog';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

export function ProductListScreen({ navigation, route }: Props) {
  const { title, crumbs, filter, subtitleLabel } = route.params;

  // ── The list is derived entirely from `filter`, so every entry point works ──
  const list = useMemo(
    () =>
      products.filter((p) => {
        if (filter.source && p.source !== filter.source) return false;
        if (filter.distributor && p.from !== filter.distributor) return false;
        if (filter.brand && p.brand !== filter.brand) return false;
        if (filter.category && p.subCategory !== filter.category) return false;
        return true;
      }),
    [filter]
  );

  // "Freedom - 13 Products" / "Oil & Ghee - 6 Products" / "13 Products"
  const lead = subtitleLabel ?? filter.brand ?? filter.category;
  const subtitle = `${lead ? `${lead} - ` : ''}${list.length} ${list.length === 1 ? 'Product' : 'Products'}`;

  // Seller-level delivery + MOV belongs to a distributor context.
  const showDelivery = !!filter.distributor || filter.source === 'distributor';

  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar (fixed) ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />

        <View style={styles.navBody}>
          {/* Frame 7101 — back + heading/subheading + actions */}
          <View style={styles.navRow}>
            <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={colors.textDark} />
            </Pressable>

            <View style={styles.titleBlock}>
              <Text style={styles.heading} numberOfLines={1}>{title}</Text>
              <Text style={styles.subHeading} numberOfLines={1}>{subtitle}</Text>
            </View>

            <View style={styles.navActions}>
              <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('SearchInitial')}>
                <Ionicons name="search" size={22} color={colors.textDark} />
              </Pressable>
              <Pressable style={styles.iconBtn}>
                <Ionicons name="options-outline" size={22} color={colors.textDark} />
              </Pressable>
            </View>
          </View>

          {/* Frame 7100 — breadcrumbs (dynamic per navigation combination) */}
          <View style={styles.crumbRow}>
            {crumbs.map((c, i) => (
              <React.Fragment key={`${c}-${i}`}>
                {i > 0 && (
                  <Ionicons name="chevron-forward" size={12} color={colors.textDark2} />
                )}
                <Text style={styles.crumb} numberOfLines={1}>{c}</Text>
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Frame 40008 — Delivery by + seller MOV ── */}
        {showDelivery && (
          <View style={styles.deliveryCard}>
            <Text style={styles.deliveryLabel}>Delivery by</Text>
            <View style={styles.deliveryRow}>
              {DELIVERY_OPTIONS.map((o, i) => (
                <View key={i} style={styles.deliveryBox}>
                  <Text style={styles.deliveryDate}>{o.date}</Text>
                  <View style={styles.movRow}>
                    <Text style={styles.movLabel}>Seller MOV:</Text>
                    <Text style={styles.movValue}>{o.mov}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Frame 7098 — product cards ── */}
        {list.length > 0 ? (
          list.map((p) => <ListProductCard key={p.id} product={p} />)
        ) : (
          <View style={styles.empty}>
            <EmptyBox />
            <Text style={styles.emptyTitle}>No products here yet</Text>
          </View>
        )}
      </ScrollView>

      {/* ── Cart CTA + home indicator ── */}
      <CartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgGrey },

  // ── Top Nav Bar: padding 16, gap 16, radius 0 0 16 16, shadow 0 1px 4 ──
  topNav: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  navBody: { paddingHorizontal: 16, paddingBottom: 16, gap: 16 },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 40 },
  iconBtn: {
    width: 40, height: 40, padding: 8, borderRadius: radii.md,
    backgroundColor: colors.bgGrey, alignItems: 'center', justifyContent: 'center',
  },
  titleBlock: { flex: 1, justifyContent: 'center', gap: 6 },
  heading: { fontFamily: font.medium, fontSize: 16, lineHeight: 24, color: colors.textDark },
  subHeading: { fontFamily: font.regular, fontSize: 14, lineHeight: 20, color: colors.textDark2 },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  // ── Breadcrumbs: underlined primary links, each capped at 106 ──
  crumbRow: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 24 },
  crumb: {
    maxWidth: 106,
    fontFamily: font.regular,
    fontSize: 14,
    lineHeight: 24,
    color: colors.primary,
    textDecorationLine: 'underline',
  },

  scroll: { padding: 12, gap: 12, paddingBottom: 16 },

  // ── Frame 40008 — Delivery by ──
  deliveryCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.lg,
    padding: 12,
    gap: 8,
  },
  deliveryLabel: { fontFamily: font.medium, fontSize: 12, lineHeight: 20, color: colors.textDark2 },
  deliveryRow: { flexDirection: 'row', gap: 12 },
  deliveryBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    padding: 8,
    gap: 4,
    justifyContent: 'center',
  },
  deliveryDate: { fontFamily: font.medium, fontSize: 12, lineHeight: 20, color: colors.primary },
  movRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  movLabel: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: colors.textDark2 },
  movValue: { fontFamily: font.medium, fontSize: 10, lineHeight: 16, color: colors.textDark2 },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.textDark, marginTop: 14 },
});
