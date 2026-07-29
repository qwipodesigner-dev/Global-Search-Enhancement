import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ScopeParam } from '../navigation/types';
import { colors, radii, font, layout } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { SearchField } from '../components/SearchField';
import { DistributorProductCard } from '../components/DistributorProductCard';
import { WholesalerProductCard } from '../components/WholesalerProductCard';
import { NoResults, ScopedNoResults } from '../components/NoResults';
import { BrandTile } from '../components/EntityTiles';
import { useSearch } from '../context/SearchContext';
import { federatedSearch, productsInScope, didYouMean } from '../search/engine';
import { Product, orderedProductIds } from '../data/catalog';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchResults'>;

/** Distributor and wholesaler listings of one SKU share a base id (d_x / w_x). */
const baseKey = (p: Product) => p.id.replace(/^[dw]_/, '');

/**
 * Merge both sources into one list, grouped by SKU: distributor listing first,
 * its wholesaler counterpart directly beneath it. Relevance order is preserved
 * by each SKU's first appearance.
 */
function groupBySku(listings: Product[]): Product[][] {
  const order: string[] = [];
  const map = new Map<string, Product[]>();
  for (const p of listings) {
    const k = baseKey(p);
    if (!map.has(k)) { map.set(k, []); order.push(k); }
    map.get(k)!.push(p);
  }
  const rank = (p: Product) => (p.source === 'distributor' ? 0 : 1);
  return order.map((k) => map.get(k)!.slice().sort((a, b) => rank(a) - rank(b)));
}

export function SearchResultsScreen({ navigation, route }: Props) {
  const { addRecent } = useSearch();
  const [query, setQuery] = useState(route.params.query || '');
  const [scope, setScope] = useState<ScopeParam | undefined>(route.params.scope);
  /** Set when the retailer rejects the spelling correction and wants their words. */
  const [forceRaw, setForceRaw] = useState(false);

  const isScoped = scope && scope.kind !== 'all';
  const hasQuery = query.trim().length > 0;

  const results = useMemo(
    () => federatedSearch(query, scope as any, !forceRaw),
    [query, scope, forceRaw]
  );

  // One merged list across both sources, grouped distributor-then-wholesaler.
  const rawProducts = hasQuery ? results.products : productsInScope(scope as any);
  const groups = useMemo(() => groupBySku(rawProducts), [rawProducts]);
  const isOrdered = (g: Product[]) => g.some((p) => orderedProductIds.has(p.id));
  const orderedGroups = useMemo(() => groups.filter(isOrdered), [groups]);
  const restGroups = useMemo(() => groups.filter((g) => !isOrdered(g)), [groups]);
  const empty = groups.length === 0;

  const submit = (q: string) => {
    const v = q.trim();
    setQuery(v);
    setForceRaw(false); // a new query gets the correction offered again
    if (v) addRecent(v);
  };
  const searchAll = () => setScope({ kind: 'all' });

  /** A brand tap → the Product List page, across both sources. */
  const openBrand = (brand: string) =>
    navigation.navigate('ProductList', {
      title: brand,
      crumbs: ['Brands', brand],
      filter: { brand },
    });

  // The federated Brands rail shows above the merged product list.
  const showFederated = hasQuery && !isScoped;

  // ── Edge cases ──
  // Inside a scope, "nothing here" means widen the scope; outside it, it's a
  // genuine dead end that earns a "did you mean".
  const scopedEmpty = hasQuery && !!isScoped && empty;
  const deadEnd = hasQuery && !isScoped && empty;
  const suggestion = useMemo(() => (deadEnd ? didYouMean(query) : null), [deadEnd, query]);

  // Spelling was corrected before searching (mung -> moong): say so, and let
  // the retailer force the original back.
  const correction = results.correction;
  const showCorrection = hasQuery && correction.changed && !forceRaw && !empty;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <DeviceStatusBar />
        <View style={styles.searchRow}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <SearchField
              bare
              value={query}
              onChangeText={setQuery}
              onSubmit={() => submit(query)}
              placeholder={isScoped ? `Search in ${scope?.label}` : 'Search for Products'}
            />
          </View>
        </View>
      </View>

      {/* Scope context chip */}
      {isScoped && (
        <View style={styles.scopeRow}>
          <View style={styles.scopeChip}>
            <Ionicons name="funnel" size={12} color={colors.primary} />
            <Text style={styles.scopeText}>Searching in {scope?.label}</Text>
            <Pressable onPress={searchAll} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.textDark2} />
            </Pressable>
          </View>
        </View>
      )}

      {/* ── Edge case A: nothing anywhere → No results + did-you-mean ── */}
      {deadEnd ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.emptyScroll}>
          <NoResults query={query} suggestion={suggestion} onSearch={submit} />
        </ScrollView>
      ) : /* ── Edge case B: nothing inside this scope → offer to widen ── */
      scopedEmpty ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.emptyScroll}>
          <ScopedNoResults query={query} scopeLabel={scope?.label} onSearchAll={searchAll} />
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Spelling corrected before searching — never silently */}
          {showCorrection && (
            <View style={styles.correctionBox}>
              <Text style={styles.correctionLine}>
                Showing results for <Text style={styles.correctionTerm}>{correction.corrected}</Text>
              </Text>
              <Pressable onPress={() => setForceRaw(true)} hitSlop={6}>
                <Text style={styles.correctionAlt}>
                  Search instead for “{correction.original}”
                </Text>
              </Pressable>
            </View>
          )}

          {results.broadened && hasQuery && !empty && (
            <Text style={styles.broadened}>Showing closest matches for “{query}”</Text>
          )}

          {/* ── Federated section — Brands only ── */}
          {showFederated && results.brands.length > 0 && (
            <Section title="Brands">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
                {results.brands.map((b) => (
                  <BrandTile key={b.id} brand={b} onPress={() => openBrand(b.name)} />
                ))}
              </ScrollView>
            </Section>
          )}

          {/* ── Merged products: distributor card, then its wholesaler card ── */}
          {orderedGroups.length > 0 ? (
            <>
              <ProductsHeader icon="repeat" text="Previously Ordered" tint={colors.primary} />
              {orderedGroups.map(renderGroup)}
              {restGroups.length > 0 && <ProductsHeader icon="search" text="More Results" />}
              {restGroups.map(renderGroup)}
            </>
          ) : (
            <>
              <ProductsHeader icon="cube-outline" text={isScoped ? scope?.label || 'Products' : 'Products'} />
              {restGroups.map(renderGroup)}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

/** Render a SKU group: distributor card first, its wholesaler counterpart below. */
function renderGroup(group: Product[]) {
  return group.map((p) =>
    p.source === 'distributor'
      ? <DistributorProductCard key={p.id} product={p} />
      : <WholesalerProductCard key={p.id} product={p} />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ProductsHeader({ icon, text, tint }: { icon: string; text: string; tint?: string }) {
  return (
    <View style={styles.prodHead}>
      <Ionicons name={icon as any} size={15} color={tint || colors.textDark} />
      <Text style={[styles.prodHeadText, tint ? { color: tint } : null]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FBFBFB' },

  header: { backgroundColor: colors.white, paddingBottom: 12, gap: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  backBtn: {
    width: 40, height: 40, padding: 8, borderRadius: radii.md,
    backgroundColor: colors.bgGrey, alignItems: 'center', justifyContent: 'center',
  },

  scroll: { paddingHorizontal: 12, paddingVertical: 12 },
  /** Lets the empty state centre itself in the body rather than sit at the top. */
  emptyScroll: { flexGrow: 1 },

  scopeRow: { paddingHorizontal: layout.gutter, marginTop: 10 },
  scopeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: colors.lightBlue, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 7,
  },
  scopeText: { fontFamily: font.semibold, fontSize: 12.5, color: colors.primary },

  broadened: { fontFamily: font.regular, fontSize: 12.5, color: colors.textDark2, fontStyle: 'italic', marginBottom: 10 },

  correctionBox: {
    backgroundColor: colors.lightBlue, borderRadius: radii.md,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, gap: 3,
  },
  correctionLine: { fontFamily: font.regular, fontSize: 13, color: colors.textDark },
  correctionTerm: { fontFamily: font.bold, color: colors.primary },
  correctionAlt: {
    fontFamily: font.medium, fontSize: 12, color: colors.textDark2,
    textDecorationLine: 'underline',
  },

  section: { marginBottom: 14 },
  sectionTitle: {
    fontFamily: font.bold, fontSize: 12, color: colors.textMuted,
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8,
  },
  rail: { gap: 8, paddingRight: 4 },

  prodHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginTop: 4 },
  prodHeadText: { fontFamily: font.bold, fontSize: 14, color: colors.textDark },

});
