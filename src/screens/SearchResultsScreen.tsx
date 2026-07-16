import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ScopeParam } from '../navigation/types';
import { colors, radii, font, layout } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { SearchField } from '../components/SearchField';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { DistributorProductCard } from '../components/DistributorProductCard';
import { WholesalerProductCard } from '../components/WholesalerProductCard';
import { NoResults, OtherTabHint, ScopedNoResults } from '../components/NoResults';
import { BrandTile, CategoryCard } from '../components/EntityTiles';
import { useSearch } from '../context/SearchContext';
import { federatedSearch, productsInScope, didYouMean, hasAnyMatch } from '../search/engine';
import { personalize, usualSubtitle } from '../search/personalize';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchResults'>;

const TABS = ['Distributors', 'Wholesalers'];

export function SearchResultsScreen({ navigation, route }: Props) {
  const { persona, addRecent } = useSearch();
  const [query, setQuery] = useState(route.params.query || '');
  const [scope, setScope] = useState<ScopeParam | undefined>(route.params.scope);
  const [tab, setTab] = useState(route.params.tab === 'wholesalers' ? 1 : 0);
  /** Set when the retailer rejects the spelling correction and wants their words. */
  const [forceRaw, setForceRaw] = useState(false);

  const isScoped = scope && scope.kind !== 'all';
  const hasQuery = query.trim().length > 0;
  const isDist = tab === 0;

  const results = useMemo(
    () => federatedSearch(query, scope as any, !forceRaw),
    [query, scope, forceRaw]
  );

  // Products for the active tab, split by source.
  const rawProducts = hasQuery ? results.products : productsInScope(scope as any);
  const tabProducts = useMemo(
    () => rawProducts.filter((p) => (isDist ? p.source === 'distributor' : p.source === 'wholesaler')),
    [rawProducts, isDist]
  );

  const { list, yourUsual, personalizedLabel } = useMemo(
    () => personalize(tabProducts, persona),
    [tabProducts, persona]
  );
  const usualCount = isDist && persona === 'existing' ? list.filter((p) => yourUsual.has(p.id)).length : 0;

  const submit = (q: string) => {
    const v = q.trim();
    setQuery(v);
    setForceRaw(false); // a new query gets the correction offered again
    if (v) addRecent(v);
  };
  const searchAll = () => setScope({ kind: 'all' });

  /** Any entity tap → the Product List page, with context built from where we came from. */
  const openBrand = (brand: string) =>
    navigation.navigate('ProductList', {
      title: brand,
      crumbs: ['Brands', brand],
      filter: { brand, source: isDist ? 'distributor' : 'wholesaler' },
    });
  const openCategory = (category: string) =>
    navigation.navigate('ProductList', {
      title: category,
      crumbs: ['Categories', category],
      filter: { category, source: isDist ? 'distributor' : 'wholesaler' },
    });
  // No brand filter here → no brand in the subheading, so the label always
  // matches what's listed ("N Products").
  const openDistributor = (distributor: string) =>
    navigation.navigate('ProductList', {
      title: distributor,
      crumbs: ['Distributors', distributor],
      filter: { distributor, source: 'distributor' },
    });
  const goCategory = (label?: string, id?: string) => { setScope({ kind: 'category', label, id }); setQuery(''); };
  const goOffer = (label?: string, id?: string) => { setScope({ kind: 'offer', label, id }); setQuery(''); };

  // Federated entity sections belong to the Distributors tab only.
  const showFederated = isDist && hasQuery && !isScoped;

  // ── Edge cases ──
  // Does the *other* tab have this product? Drives the cross-tab hint vs a true dead end.
  const anyMatch = useMemo(() => (hasQuery ? hasAnyMatch(query) : { distributor: true, wholesaler: true }), [query, hasQuery]);
  const suggestion = useMemo(
    () => (hasQuery && !anyMatch.distributor && !anyMatch.wholesaler ? didYouMean(query) : null),
    [query, hasQuery, anyMatch]
  );
  // Inside a scope, "nothing here" is a different problem from "nothing anywhere":
  // the fix is to widen the scope, not to switch tabs.
  const scopedEmpty = hasQuery && !!isScoped && list.length === 0;
  const tabEmpty = hasQuery && !isScoped && list.length === 0;
  const otherTabHas = isDist ? anyMatch.wholesaler : anyMatch.distributor;
  const deadEnd = tabEmpty && !otherTabHas;

  // Spelling was corrected before searching (mung -> moong): say so, and let
  // the retailer force the original back.
  const correction = results.correction;
  const showCorrection = hasQuery && correction.changed && !forceRaw && list.length > 0;

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

        <SegmentedTabs tabs={TABS} active={tab} onChange={setTab} />
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
        <ScrollView keyboardShouldPersistTaps="handled">
          <NoResults query={query} suggestion={suggestion} onSearch={submit} />
        </ScrollView>
      ) : /* ── Edge case B: this tab empty, the other tab stocks it ── */
      tabEmpty ? (
        <ScrollView keyboardShouldPersistTaps="handled">
          <OtherTabHint query={query} toWholesalers={isDist} onSwitch={() => setTab(isDist ? 1 : 0)} />
        </ScrollView>
      ) : /* ── Edge case C: nothing inside this scope → offer to widen ── */
      scopedEmpty ? (
        <ScrollView keyboardShouldPersistTaps="handled">
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

          {results.broadened && hasQuery && list.length > 0 && (
            <Text style={styles.broadened}>Showing closest matches for “{query}”</Text>
          )}

          {/* ── Federated sections (Distributors tab) ── */}
          {showFederated && results.brands.length > 0 && (
            <Section title="Brands">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
                {results.brands.map((b) => (
                  <BrandTile key={b.id} brand={b} onPress={() => openBrand(b.name)} />
                ))}
              </ScrollView>
            </Section>
          )}

          {showFederated && results.categories.length > 0 && (
            <Section title="Categories">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
                {results.categories.map((c) => (
                  <CategoryCard key={c.id} category={c} onPress={() => openCategory(c.name)} />
                ))}
              </ScrollView>
            </Section>
          )}

          {showFederated && results.offers.length > 0 && (
            <Section title="Offers">
              {results.offers.map((o) => (
                <EntityRow key={o.id} icon="pricetags" iconColor={colors.marginGreen} title={o.name}
                  sub={`${o.productIds.length} products in this deal`} onPress={() => goOffer(o.name, o.id)} />
              ))}
            </Section>
          )}

          {showFederated && results.distributors.length > 0 && (
            <Section title="Distributors">
              {results.distributors.map((dd) => (
                <EntityRow key={dd.id} icon="storefront" title={dd.name} sub={`Carries ${dd.brands.join(', ')}`} onPress={() => openDistributor(dd.name)} />
              ))}
            </Section>
          )}

          {/* ── Products ── */}
          {isDist ? (
            usualCount > 0 ? (
              <>
                <ProductsHeader icon="repeat" text={personalizedLabel || 'Your Usual'} tint={colors.primary} />
                {list.slice(0, usualCount).map((p) => (
                  <DistributorProductCard key={p.id} product={p} yourUsual usualSub={usualSubtitle(p.id)} />
                ))}
                {list.length > usualCount && (
                  <ProductsHeader icon="search" text={hasQuery ? `More matches for “${query}”` : 'More products'} />
                )}
                {list.slice(usualCount).map((p) => <DistributorProductCard key={p.id} product={p} />)}
              </>
            ) : (
              <>
                <ProductsHeader
                  icon={persona === 'new' ? 'trending-up' : 'cube-outline'}
                  text={persona === 'new' ? 'Bestsellers in Your Area' : (isScoped ? scope?.label || 'Products' : 'Products')}
                  tint={persona === 'new' ? colors.marginGreen : colors.textDark}
                />
                {list.map((p) => <DistributorProductCard key={p.id} product={p} />)}
              </>
            )
          ) : (
            // ── Wholesalers tab: product list only ──
            <>
              {list.map((p) => <WholesalerProductCard key={p.id} product={p} />)}

            </>
          )}
        </ScrollView>
      )}
    </View>
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

function EntityRow({ icon, iconColor, title, sub, onPress }:
  { icon: string; iconColor?: string; title: string; sub?: string; onPress: () => void }) {
  return (
    <Pressable style={styles.entityRow} onPress={onPress}>
      <View style={styles.entityIcon}><Ionicons name={icon as any} size={17} color={iconColor || colors.primary} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.entityTitle}>{title}</Text>
        {!!sub && <Text style={styles.entitySub}>{sub}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />
    </Pressable>
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


  entityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: radii.md, paddingVertical: 12, paddingHorizontal: 12, marginBottom: 8,
  },
  entityIcon: {
    width: 34, height: 34, borderRadius: radii.sm, backgroundColor: colors.lightBlue,
    alignItems: 'center', justifyContent: 'center',
  },
  entityTitle: { fontFamily: font.semibold, fontSize: 14, color: colors.textDark },
  entitySub: { fontFamily: font.regular, fontSize: 11.5, color: colors.subText, marginTop: 2 },

  prodHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginTop: 4 },
  prodHeadText: { fontFamily: font.bold, fontSize: 14, color: colors.textDark },

});
