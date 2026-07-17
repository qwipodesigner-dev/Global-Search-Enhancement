import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors, radii, font, shadow } from '../theme/theme';
import {
  wholesaleBigCategories, wholesaleOffers, wholesaleTopCategories, wholesaleTopBrands,
  WholesaleTile,
} from '../data/wholesalerHome';

/**
 * Wholesalers home body (Figma "Home Page - Wholesalers"): big category cards →
 * exclusive offers → top categories → top brands. Rendered inside HomeScreen's
 * shared chrome (top nav, banner, footer) when the source toggle = wholesalers.
 * Reference layout only — tiles are visual, not wired to Global Search.
 */
export function WholesalerHome({ onOpenGroup }: { onOpenGroup: (g: 'groceries' | 'fmcg') => void }) {
  return (
    <View style={{ gap: 16, marginTop: 16 }}>
      {/* ── Frame 7055 — two large category cards, full-width (space-between) ── */}
      <View style={s.bigRow}>
        {wholesaleBigCategories.map((c) => (
          <Pressable
            key={c.id}
            style={s.bigCol}
            onPress={() => onOpenGroup(c.id === 'wc_groceries' ? 'groceries' : 'fmcg')}
          >
            <View style={s.bigCard}>
              <Image source={c.image} style={s.bigImg} resizeMode="cover" />
            </View>
            <Text style={s.bigLabel} numberOfLines={1}>{c.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* ── Frame 7050 — Exclusive offers (no See All) ── */}
      <View style={{ gap: 8 }}>
        <View style={s.headRow}>
          <Text style={s.headTitle}>Exclusive offers</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.offerRow}>
          {wholesaleOffers.map((o) => (
            <Pressable key={o.id} style={s.offerCard}>
              <Image source={o.image} style={s.offerImg} resizeMode="cover" />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ── Top categories (See All) — 90x60 photo tiles ── */}
      <Section title="Top categories">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tileRow}>
          {wholesaleTopCategories.map((c) => (
            <Pressable key={c.id} style={s.catTile}>
              <View style={s.catCard}>
                <Image source={c.image} style={s.catImg} resizeMode="cover" />
              </View>
              <Text style={s.catLabel} numberOfLines={2}>{c.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Section>

      {/* ── Top Brands (See All) — 64px circle tiles ── */}
      <Section title="Top Brands">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tileRow}>
          {wholesaleTopBrands.map((b) => (
            <BrandTile key={b.id} tile={b} />
          ))}
        </ScrollView>
      </Section>
    </View>
  );
}

function BrandTile({ tile }: { tile: WholesaleTile }) {
  return (
    <Pressable style={s.brandTile}>
      <View style={[s.brandCircle, tile.bg ? { backgroundColor: tile.bg } : null]}>
        <Image
          source={tile.image}
          style={tile.fit === 'contain' ? s.brandLogo : s.brandPhoto}
          resizeMode={tile.fit === 'contain' ? 'contain' : 'cover'}
        />
      </View>
      <Text style={s.brandLabel} numberOfLines={2}>{tile.label}</Text>
    </Pressable>
  );
}

/** Section header with a "See All" link (Frame 39993). */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <View style={s.headRow}>
        <Text style={s.headTitle}>{title}</Text>
        <Pressable><Text style={s.seeAll}>See All</Text></Pressable>
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  // shared header
  headRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, height: 24,
  },
  headTitle: { fontFamily: font.medium, fontSize: 14, lineHeight: 24, color: colors.textDark },
  seeAll: { fontFamily: font.medium, fontSize: 12, lineHeight: 24, color: colors.primary },

  // ── Big category cards — the gap between them matches the outer margins
  //    (16 / 16 / 16), so the two cards read as evenly spaced. ──
  bigRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 16 },
  bigCol: { flex: 1, alignItems: 'center', gap: 10 },
  bigCard: {
    width: '100%', height: 120, borderRadius: radii.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.grey, backgroundColor: colors.white,
  },
  bigImg: { width: '100%', height: '100%' },
  bigLabel: {
    width: '100%', textAlign: 'center',
    fontFamily: font.medium, fontSize: 16, lineHeight: 20, color: colors.textDark2,
  },

  // ── Exclusive offers (120x120) ──
  offerRow: { paddingHorizontal: 16, gap: 8 },
  offerCard: {
    width: 120, height: 120, borderRadius: radii.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.grey, backgroundColor: colors.white,
  },
  offerImg: { width: '100%', height: '100%' },

  // ── Rails (top categories + top brands) ──
  tileRow: { paddingHorizontal: 16, gap: 12 },

  // top-category tile: 90x60 card + label
  catTile: { width: 90, gap: 12 },
  catCard: {
    width: 90, height: 60, borderRadius: radii.md, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.grey, backgroundColor: colors.white,
  },
  catImg: { width: '100%', height: '100%' },
  catLabel: {
    width: 90, textAlign: 'center', height: 32,
    fontFamily: font.medium, fontSize: 12, lineHeight: 16, color: colors.textDark2,
  },

  // top-brand tile: 64 circle + label
  brandTile: { width: 89, alignItems: 'center', gap: 8 },
  brandCircle: {
    width: 64, height: 64, borderRadius: radii.full,
    backgroundColor: colors.tileBg, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', ...shadow.circle,
  },
  brandLogo: { width: 53, height: 53 },
  brandPhoto: { width: '100%', height: '100%' },
  brandLabel: {
    width: 89, height: 36, textAlign: 'center',
    fontFamily: font.medium, fontSize: 14, lineHeight: 18, color: colors.textDark2,
  },
});
