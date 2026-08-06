import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { HomeIndicator } from '../components/CartBar';
import { useLocations } from '../context/LocationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'YourLocation'>;

/**
 * Your Location (reference screen) — saved addresses with a radio selection,
 * "Use Current Location" opening the Add New Location form, and an Apply
 * Location CTA. Pending-approval addresses are listed but not selectable;
 * the address applied here drives the Home screen's serviceability.
 */
export function YourLocationScreen({ navigation }: Props) {
  const { addresses, active, applyLocation } = useLocations();
  const [selected, setSelected] = useState(active.id);
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const list = q ? addresses.filter((a) => a.full.toLowerCase().includes(q)) : addresses;

  const apply = () => {
    applyLocation(selected);
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <Text style={styles.heading} numberOfLines={1}>Your Location</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Search saved addresses */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search saved addresses..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Use Current Location → Add New Location form */}
        <Pressable style={styles.currentRow} onPress={() => navigation.navigate('AddLocation')}>
          <Ionicons name="location-sharp" size={20} color={colors.textDark} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.currentTitle}>Use Current Location</Text>
            <Text style={styles.currentSub}>Tap to detect your location</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textDark2} />
        </Pressable>

        <Text style={styles.sectionLabel}>SAVED ADDRESSES</Text>

        {list.map((a) => {
          const pending = a.status === 'pending';
          const on = a.id === selected;
          return (
            <Pressable
              key={a.id}
              style={styles.addressCard}
              onPress={pending ? undefined : () => setSelected(a.id)}
              disabled={pending}
            >
              <Ionicons name="location-sharp" size={20} color={colors.textDark} />
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={[styles.addressTxt, pending && { color: colors.textMuted }]}>
                  {a.full}
                </Text>
                <View style={styles.chipRow}>
                  {a.id === active.id && (
                    <View style={styles.chip}><Text style={styles.chipTxt}>Active</Text></View>
                  )}
                  {pending && (
                    <View style={[styles.chip, styles.chipPending]}>
                      <Text style={[styles.chipTxt, styles.chipPendingTxt]}>Pending Approval</Text>
                    </View>
                  )}
                </View>
              </View>
              <Ionicons
                name={on && !pending ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={pending ? colors.grey : colors.textDark}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Apply Location ── */}
      <View style={styles.footer}>
        <Pressable style={styles.applyBtn} onPress={apply}>
          <Text style={styles.applyTxt}>Apply Location</Text>
        </Pressable>
      </View>
      <HomeIndicator />
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
  navBody: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 16, height: 56 },
  iconBtn: {
    width: 40, height: 40, borderRadius: radii.md,
    backgroundColor: colors.bgGrey, alignItems: 'center', justifyContent: 'center',
  },
  heading: { flex: 1, fontFamily: font.medium, fontSize: 16, lineHeight: 24, color: colors.textDark },

  scroll: { padding: 16, gap: 12 },

  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    height: 48, paddingHorizontal: 14,
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.grey, borderRadius: radii.lg,
  },
  searchInput: { flex: 1, fontFamily: font.regular, fontSize: 14, color: colors.textDark, padding: 0 },

  currentRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, borderRadius: radii.lg,
    paddingHorizontal: 14, paddingVertical: 14,
  },
  currentTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.textDark },
  currentSub: { fontFamily: font.regular, fontSize: 12, color: colors.textMuted },

  sectionLabel: { fontFamily: font.medium, fontSize: 11, letterSpacing: 0.5, color: colors.textMuted },

  addressCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, borderRadius: radii.lg,
    paddingHorizontal: 14, paddingVertical: 14,
  },
  addressTxt: { fontFamily: font.medium, fontSize: 13, lineHeight: 19, color: colors.textDark },
  chipRow: { flexDirection: 'row', gap: 6 },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.bgGrey, borderRadius: radii.sm,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  chipTxt: { fontFamily: font.medium, fontSize: 10, color: colors.textDark2 },
  chipPending: { backgroundColor: '#FFF4DE' },
  chipPendingTxt: { color: '#B26A00' },

  footer: { padding: 16, backgroundColor: colors.bgGrey },
  applyBtn: {
    height: 48, borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  applyTxt: { fontFamily: font.semibold, fontSize: 16, color: colors.white },
});
