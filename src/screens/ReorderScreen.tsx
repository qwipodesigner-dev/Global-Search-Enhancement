import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { CartBar, HomeIndicator } from '../components/CartBar';
import {
  ProductImage, CaseLine, VariantPills, SellerSelector, PriceBand,
  ActionsRow, DeliveryByLine, s,
} from '../components/ProductCardParts';
import { Product, orderHistory, productById } from '../data/catalog';
import { comingSoonSvg } from '../assets/comingSoonSvg';

type Props = NativeStackScreenProps<RootStackParamList, 'Reorder'>;

/**
 * Reorder — the previously-ordered list, split Wholesalers / Distributors
 * (Figma "Reorder - Wholesalers" / "Reorder - Distributors").
 * Reordering is wholesaler-only for now: the Distributors tab shows the
 * "coming soon" state from the design instead of a product list.
 */
export function ReorderScreen({ navigation }: Props) {
  const [tab, setTab] = useState(0); // 0 = Wholesalers (design default), 1 = Distributors
  const comingSoon = tab === 1;

  // Order history holds the concrete listing that was bought (mostly d_,
  // one w_); the Wholesalers tab shows each SKU's wholesaler listing.
  const wholesale = useMemo(() => {
    const list: Product[] = [];
    for (const h of orderHistory) {
      const w = productById(`w_${h.productId.replace(/^[dw]_/, '')}`);
      if (w) list.push(w);
    }
    return list;
  }, []);

  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar (Frame 7099) ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <View style={styles.headingCol}>
            <Text style={styles.heading} numberOfLines={1}>Reorder</Text>
          </View>
          <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('SearchInitial')}>
            <Ionicons name="search" size={22} color={colors.textDark} />
          </Pressable>
        </View>
      </View>

      {/* ── Toggle Tab bar ── */}
      <View style={styles.tabs}>
        <SegmentedTabs tabs={['Wholesalers', 'Distributors']} active={tab} onChange={setTab} />
      </View>

      {comingSoon ? (
        /* ── Reorder from distributors is not offered yet ── */
        <View style={styles.soonWrap}>
          <SvgXml xml={comingSoonSvg} width={ILLO_SIZE} height={ILLO_SIZE} />
          <View style={styles.soonTextBlock}>
            <Text style={styles.soonTitle}>Reorder from distributors{'\n'}is coming soon</Text>
            <Text style={styles.soonSub}>Please come back later.</Text>
          </View>
        </View>
      ) : (
        /* ── Frame 7098 — reorder cards ── */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {wholesale.map((p) => <ReorderCard key={p.id} product={p} />)}
        </ScrollView>
      )}

      {comingSoon ? <HomeIndicator /> : <CartBar />}
    </View>
  );
}

/** One reorder card — the shared card anatomy without the brand/source tags. */
function ReorderCard({ product }: { product: Product }) {
  const [variant, setVariant] = useState(0);
  const initial = Math.max(0, product.sellers?.findIndex((x) => x.selected) ?? 0);
  const [seller, setSeller] = useState(initial);

  return (
    <View style={s.card}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={s.name} numberOfLines={2}>{product.name}</Text>
          <CaseLine product={product} />
        </View>
        <ProductImage product={product} />
      </View>

      <VariantPills options={product.quantities} selected={variant} onSelect={setVariant} />

      {!!product.sellers?.length && (
        <SellerSelector sellers={product.sellers} selected={seller} onSelect={setSeller} />
      )}

      <PriceBand product={product} />

      <ActionsRow />

      <DeliveryByLine text={product.deliveryBy} />
    </View>
  );
}

/** Design places the 302px artboard full-size; cap it on narrow screens. */
const ILLO_SIZE = Math.min(302, Math.round(Dimensions.get('window').width * 0.73));

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
  headingCol: { flex: 1, gap: 2 },
  heading: { fontFamily: font.medium, fontSize: 16, lineHeight: 24, color: colors.textDark },

  tabs: { paddingVertical: 12 },
  scroll: { paddingHorizontal: 16, paddingBottom: 16, gap: 4 },

  // ── Coming soon (Container: gap 10; heading Raleway 600 20/24; sub Inter 400 14/16) ──
  soonWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 10 },
  soonTextBlock: { alignItems: 'center', gap: 10 },
  soonTitle: {
    fontFamily: font.ralewaySemibold, fontSize: 20, lineHeight: 24,
    color: colors.textDark, textAlign: 'center',
  },
  soonSub: { fontFamily: font.regular, fontSize: 14, lineHeight: 16, color: colors.textMuted },
});
