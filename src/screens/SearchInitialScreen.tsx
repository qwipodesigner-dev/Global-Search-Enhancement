import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ScopeParam } from '../navigation/types';
import { colors, radii, spacing } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { SearchField } from '../components/SearchField';
import { useSearch } from '../context/SearchContext';
import { getSuggestions, Suggestion } from '../search/suggest';
import { trendingTerms, products, categories } from '../data/catalog';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchInitial'>;

export function SearchInitialScreen({ navigation, route }: Props) {
  const scope = route.params?.scope;
  const { recent, addRecent, clearRecent, persona, setPersona } = useSearch();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  // 300 ms debounce (PRD FR-SUG-05)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const suggestions = useMemo(
    () => (debounced.trim().length >= 2 ? getSuggestions(debounced, recent) : []),
    [debounced, recent]
  );

  const runSearch = (q: string, sc?: ScopeParam) => {
    const query = q.trim();
    if (!query && !sc) return;
    if (query) addRecent(query);
    navigation.navigate('SearchResults', { query, scope: sc ?? scope });
  };

  const onSuggestion = (s: Suggestion) => {
    if (s.type === 'category') {
      const cat = categories.find((c) => c.name === s.text);
      navigation.navigate('SearchResults', { query: '', scope: { kind: 'category', label: cat?.name, id: cat?.id } });
    } else {
      runSearch(s.text);
    }
  };

  const typing = debounced.trim().length >= 2;
  const bestsellers = useMemo(
    () => [...products].sort((a, b) => (a.bestsellerRank ?? 99) - (b.bestsellerRank ?? 99)).slice(0, 6),
    []
  );
  const showRecent = persona === 'existing' && recent.length > 0;

  return (
    <View style={styles.root}>
      <DeviceStatusBar />
      <View style={{ marginTop: 4, marginBottom: 8 }}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          onBack={() => navigation.goBack()}
          onSubmit={() => runSearch(query)}
          placeholder={scope?.label ? `Search in ${scope.label}` : 'Search for Products'}
          autoFocus
        />
      </View>

      {typing ? (
        <ScrollView keyboardShouldPersistTaps="handled">
          {suggestions.map((s) => (
            <Pressable key={s.id} style={styles.sugRow} onPress={() => onSuggestion(s)}>
              <Ionicons name={s.icon as any} size={18} color={s.type === 'recent' ? colors.inkFaint : colors.inkMuted} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Highlighted text={s.text} q={debounced} />
                {!!s.sub && <Text style={styles.sugSub}>{typeLabel(s.type)} · {s.sub}</Text>}
                {!s.sub && s.type !== 'term' && s.type !== 'recent' && (
                  <Text style={styles.sugSub}>{typeLabel(s.type)}</Text>
                )}
              </View>
              <Ionicons name="arrow-up-outline" size={15} color={colors.inkFaint} style={{ transform: [{ rotate: '45deg' }] }} />
            </Pressable>
          ))}
          {suggestions.length === 0 && (
            <Text style={styles.noSug}>No suggestions — press search to see all matches.</Text>
          )}
        </ScrollView>
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Persona toggle (demo) */}
          <View style={styles.personaWrap}>
            <Text style={styles.personaLabel}>Demo as</Text>
            <View style={styles.personaToggle}>
              {(['existing', 'new'] as const).map((p) => (
                <Pressable key={p} onPress={() => setPersona(p)} style={[styles.personaBtn, persona === p && styles.personaBtnOn]}>
                  <Text style={[styles.personaText, persona === p && styles.personaTextOn]}>
                    {p === 'existing' ? 'Existing retailer' : 'New retailer'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {showRecent && (
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Recent searches</Text>
                <Pressable onPress={clearRecent}><Text style={styles.clear}>Clear</Text></Pressable>
              </View>
              <View style={styles.chipWrap}>
                {recent.map((r) => (
                  <Pressable key={r} style={styles.chip} onPress={() => runSearch(r)}>
                    <Ionicons name="time-outline" size={13} color={colors.inkMuted} />
                    <Text style={styles.chipText}>{r}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {persona === 'new' ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bestsellers in Your Area</Text>
              <Text style={styles.coldStart}>New here — showing what retailers near you order most.</Text>
              {bestsellers.map((p) => (
                <Pressable key={p.id} style={styles.bestRow} onPress={() => runSearch(p.name)}>
                  <View style={[styles.bestDot, { backgroundColor: p.tint }]} />
                  <Text style={styles.bestName} numberOfLines={1}>{p.name}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending searches</Text>
              <View style={styles.chipWrap}>
                {trendingTerms.map((t) => (
                  <Pressable key={t} style={[styles.chip, styles.chipTrend]} onPress={() => runSearch(t)}>
                    <Ionicons name="trending-up" size={13} color={colors.primary} />
                    <Text style={[styles.chipText, { color: colors.primary }]}>{t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function typeLabel(t: Suggestion['type']) {
  return { term: 'Search', category: 'Category', brand: 'Brand', product: 'Product', recent: 'Recent' }[t];
}

function Highlighted({ text, q }: { text: string; q: string }) {
  const idx = text.toLowerCase().indexOf(q.trim().toLowerCase());
  if (idx < 0 || !q.trim()) return <Text style={styles.sugText}>{text}</Text>;
  return (
    <Text style={styles.sugText}>
      {text.slice(0, idx)}
      <Text style={styles.sugMatch}>{text.slice(idx, idx + q.trim().length)}</Text>
      {text.slice(idx + q.trim().length)}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },

  sugRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.gutter,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sugText: { fontSize: 15, color: colors.ink, fontWeight: '500' },
  sugMatch: { fontWeight: '800', color: colors.ink },
  sugSub: { fontSize: 11.5, color: colors.inkFaint, marginTop: 2 },
  noSug: { padding: spacing.gutter, color: colors.inkFaint, fontSize: 13 },

  personaWrap: { paddingHorizontal: spacing.gutter, paddingTop: 6, paddingBottom: 4 },
  personaLabel: { fontSize: 11, color: colors.inkFaint, fontWeight: '700', marginBottom: 6, letterSpacing: 0.4, textTransform: 'uppercase' },
  personaToggle: { flexDirection: 'row', backgroundColor: colors.surfaceChip, borderRadius: radii.md, padding: 3, gap: 3 },
  personaBtn: { flex: 1, height: 34, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  personaBtnOn: { backgroundColor: colors.surface, ...{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 } },
  personaText: { fontSize: 12.5, fontWeight: '700', color: colors.inkMuted },
  personaTextOn: { color: colors.primary },

  section: { paddingHorizontal: spacing.gutter, marginTop: 18 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: colors.ink, marginBottom: 10 },
  clear: { fontSize: 12.5, fontWeight: '700', color: colors.primary },
  coldStart: { fontSize: 12, color: colors.inkFaint, marginTop: -4, marginBottom: 10 },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.surfaceChip, borderRadius: radii.pill,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  chipTrend: { backgroundColor: colors.primarySoft },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.ink },

  bestRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  bestDot: { width: 10, height: 10, borderRadius: 5 },
  bestName: { flex: 1, fontSize: 13.5, color: colors.ink, fontWeight: '500' },
});
