import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Image,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, layout, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { QwipoLogo } from '../components/Logo';
import { SearchField } from '../components/SearchField';
import { SourceCards } from '../components/SourceCards';
import { BottomNav } from '../components/BottomNav';
import { NetworkPattern } from '../components/NetworkPattern';
import { homeDistributors, homeBrands, brands } from '../data/catalog';
import { banners, ui } from '../assets';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const BANNER_W = layout.bannerWidth; // 300
const BANNER_STEP = BANNER_W + 8; // gap: 8

/** All Brands is a 2-row grid that scrolls horizontally: fill top-to-bottom, then next column. */
const BRAND_ROWS = 2;
const brandColumns = Array.from(
  { length: Math.ceil(homeBrands.length / BRAND_ROWS) },
  (_, c) => homeBrands.slice(c * BRAND_ROWS, c * BRAND_ROWS + BRAND_ROWS)
);

/** Home tiles use display labels ("Freedom Oil"); map them to catalogue brand names. */
function brandNameFor(label: string): string {
  const hit = brands.find((b) => label.toLowerCase().startsWith(b.name.toLowerCase()));
  return hit ? hit.name : label;
}

export function HomeScreen({ navigation }: Props) {
  const [source, setSource] = useState<'distributors' | 'wholesalers'>('distributors');
  const [page, setPage] = useState(0);

  const onBannerScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / BANNER_STEP);
    if (i !== page) setPage(Math.max(0, Math.min(banners.length - 1, i)));
  };

  return (
    <View style={styles.root}>
      {/* ── Home Top Nav Bar (white card, radius 0 0 16 16, shadow) ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />

        <View style={styles.topNavBody}>
          {/* Frame 149 — logo lockup + centred DigiDukaan + icons */}
          <View style={styles.headerRow}>
            <QwipoLogo />

            {/* Centred in the header, independent of the side elements */}
            <View style={styles.digidukaanWrap} pointerEvents="none">
              <Image source={ui.digidukaanBlue} style={styles.digidukaanBlue} resizeMode="contain" />
            </View>

            <View style={styles.iconRow}>
              <Pressable style={styles.iconBtn}>
                <Ionicons name="notifications-outline" size={24} color={colors.textDark} />
              </Pressable>
              <Pressable style={styles.iconBtn}>
                <Ionicons name="person-outline" size={24} color={colors.textDark} />
              </Pressable>
            </View>
          </View>

          {/* Frame 117 — location pill */}
          <View style={styles.locationPill}>
            <Ionicons name="location-sharp" size={12} color={colors.primary} />
            <Text style={styles.deliverTo}>Deliver to</Text>
            <Text style={styles.address} numberOfLines={1}>Lit box, Rai Durg, Hitech City</Text>
            <Ionicons name="chevron-down" size={16} color={colors.primary} />
          </View>

          {/* Search bar */}
          <SearchField bare onPressField={() => navigation.navigate('SearchInitial')} />

          {/* Frame 39998 — source cards */}
          <SourceCards active={source} onChange={setSource} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        {/* ── Banner carousel (Frame 7051): 300x150, gap 8, padding 0 16 ── */}
        <View style={{ gap: 6, paddingTop: 16 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={BANNER_STEP}
            decelerationRate="fast"
            onScroll={onBannerScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.bannerRow}
          >
            {banners.map((b, i) => (
              <Image key={i} source={b} style={styles.banner} resizeMode="cover" />
            ))}
          </ScrollView>

          {/* slider dots: active 8x8 #9A9A9A, rest 4x4 #D3D3D3, gap 2 */}
          <View style={styles.dots}>
            {banners.map((_, i) => (
              <View key={i} style={i === page ? styles.dotOn : styles.dotOff} />
            ))}
          </View>
        </View>

        {/* ── Distributors ── */}
        <SectionHeader title="Distributors" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.railRow}
        >
          {homeDistributors.map((d) => (
            <Pressable
              key={d.id}
              style={styles.distCard}
              onPress={() =>
                // This rail is a distributor × brand pairing, so filter on both —
                // the subheading ("Freedom Oil - N Products") must match the list.
                navigation.navigate('ProductList', {
                  title: d.distributor,
                  crumbs: ['Distributors', d.distributor, d.brand],
                  filter: {
                    distributor: d.distributor,
                    brand: brandNameFor(d.brand),
                    source: 'distributor',
                  },
                  subtitleLabel: d.brand,
                })
              }
            >
              <View style={[styles.logoBox, d.bg ? { backgroundColor: d.bg } : null]}>
                <Image source={d.logo} style={styles.logoImg} resizeMode="contain" />
              </View>
              <Text style={styles.distBrand} numberOfLines={1}>{d.brand}</Text>
              <Text style={styles.distName} numberOfLines={1}>{d.distributor}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── All Brands — 2 rows, scrolls horizontally (Frame 7060) ── */}
        <SectionHeader title="All Brands" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandScroll}
        >
          {brandColumns.map((col, ci) => (
            <View key={ci} style={styles.brandCol}>
              {col.map((b) => (
                <Pressable
                  key={b.id}
                  style={styles.brandTile}
                  onPress={() =>
                    navigation.navigate('ProductList', {
                      title: b.label,
                      crumbs: ['Brands', b.label],
                      filter: { brand: brandNameFor(b.label), source: 'distributor' },
                      subtitleLabel: b.label,
                    })
                  }
                >
                  <View style={[styles.brandCircle, b.bg ? { backgroundColor: b.bg } : null]}>
                    <Image source={b.logo} style={styles.brandImg} resizeMode="contain" />
                  </View>
                  <Text style={styles.brandLabel} numberOfLines={2}>{b.label}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* ── Group 34702 — DigiDukaan watermark footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerPattern} pointerEvents="none">
            <NetworkPattern />
          </View>
          <Image source={ui.digidukaanGrey} style={styles.digidukaanGrey} resizeMode="contain" />
        </View>
      </ScrollView>

      <BottomNav active="home" />
    </View>
  );
}

/** Frame 39994 — space-between, padding 0 16, height 24. */
function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable><Text style={styles.seeAll}>See All</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },

  // ── Top nav ──
  topNav: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...shadow.topNav,
    zIndex: 10,
  },
  topNavBody: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', height: 40, gap: 8, position: 'relative' },
  /** "DigiDukaan Logo Blue 1" — Figma 101x26; centred across the header. */
  digidukaanWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digidukaanBlue: { width: 112, height: 26 },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 'auto' },
  iconBtn: {
    width: 40, height: 40, padding: 8,
    backgroundColor: colors.bgGrey, borderRadius: radii.md,
    alignItems: 'center', justifyContent: 'center',
  },

  locationPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start',
    height: 24, paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: colors.lightBlue, borderRadius: radii.pill,
  },
  deliverTo: { fontFamily: font.regular, fontSize: 10, color: colors.primary },
  address: { fontFamily: font.medium, fontSize: 12, color: colors.primary },

  // ── Banners ──
  bannerRow: { paddingHorizontal: 16, gap: 8 },
  banner: { width: BANNER_W, height: layout.bannerHeight, borderRadius: radii.lg },
  dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, height: 8 },
  dotOn: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.textMuted },
  dotOff: { width: 4, height: 4, borderRadius: 4, backgroundColor: colors.grey },

  // ── Section header ──
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, height: 24, marginTop: 16, marginBottom: 8,
  },
  sectionTitle: { fontFamily: font.medium, fontSize: 14, lineHeight: 24, color: colors.textDark },
  seeAll: { fontFamily: font.medium, fontSize: 12, lineHeight: 24, color: colors.primary },

  // ── Distributors rail ──
  railRow: { paddingHorizontal: 16, gap: 8 },
  distCard: {
    width: layout.distCardWidth, height: layout.distCardHeight,
    padding: 12, alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radii.lg,
  },
  logoBox: {
    width: layout.logoBox, height: layout.logoBox,
    borderWidth: 1, borderColor: colors.logoBorder, borderRadius: radii.lg,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, overflow: 'hidden',
  },
  logoImg: { width: 58, height: 58 },
  distBrand: {
    fontFamily: font.medium, fontSize: 14, lineHeight: 20,
    color: colors.heading, textAlign: 'center', width: 100,
  },
  distName: {
    fontFamily: font.regular, fontSize: 12, lineHeight: 16,
    color: colors.subText, textAlign: 'center', width: 100,
  },

  // ── All Brands: 2-row horizontal scroller ──
  // Every tile is a fixed 89x108 (Figma "category tiles"): 64 circle + 8 gap + 36 label.
  // The fixed label height keeps 1-line and 2-line names on the same baseline.
  brandScroll: { paddingHorizontal: 16, paddingVertical: 4, gap: 8 },
  brandCol: { gap: 16 },
  brandTile: {
    width: layout.brandTileWidth,
    height: layout.brandTileHeight,
    alignItems: 'center',
    gap: 8,
  },
  brandCircle: {
    width: layout.brandCircle, height: layout.brandCircle, borderRadius: radii.full,
    backgroundColor: colors.tileBg, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', ...shadow.circle,
  },
  brandImg: { width: 53, height: 53 },
  brandLabel: {
    fontFamily: font.medium, fontSize: 14, lineHeight: 18,
    color: colors.textDark2, textAlign: 'center',
    width: layout.brandTileWidth,
    height: 36, // 2 lines @ 18 — labels start at the same y whether 1 or 2 lines
  },

  // ── Footer watermark (Group 34702) ──
  footer: { height: 210, marginTop: 12, alignItems: 'center', justifyContent: 'center' },
  footerPattern: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  /** Compact lockup, greyscaled — Figma width 269.74, natural aspect 4.29. */
  digidukaanGrey: { width: 290, height: 68 },
});
