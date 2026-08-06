import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { HomeIndicator } from '../components/CartBar';
import { useProfile } from '../context/ProfileContext';

type Props = NativeStackScreenProps<RootStackParamList, 'BusinessDetails'>;

/**
 * Business Details (Figma "My Details") — the retailer's shop profile.
 * Seeded from the shared business profile; Save Changes writes back, so the
 * Profile screen's name/number stay in sync (a real build would also PUT).
 */
export function BusinessDetailsScreen({ navigation }: Props) {
  const { profile, updateProfile } = useProfile();
  const [shop, setShop] = useState(profile.shop);
  const [owner, setOwner] = useState(profile.owner);
  const [mobile, setMobile] = useState(profile.mobile);
  const [address, setAddress] = useState(profile.address);
  const [gstin, setGstin] = useState(profile.gstin);

  const save = () => {
    updateProfile({ shop, owner, mobile, address, gstin });
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
          <Text style={styles.heading} numberOfLines={1}>Business Details</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Field label="Shop Name" required>
          <TextInput style={styles.input} value={shop} onChangeText={setShop} />
        </Field>
        <Field label="Owner Name">
          <TextInput style={styles.input} value={owner} onChangeText={setOwner} />
        </Field>
        <Field label="Mobile Number" required>
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="numeric"
            maxLength={10}
          />
        </Field>
        <Field label="Address" required>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} multiline />
        </Field>
        <Field label="GSTIN Number (optional)">
          <TextInput style={styles.input} value={gstin} onChangeText={setGstin} />
        </Field>
      </ScrollView>

      {/* ── checkout frame — Save Changes ── */}
      <View style={styles.footer}>
        <Pressable style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveTxt}>Save Changes</Text>
        </Pressable>
      </View>
      <HomeIndicator />
    </View>
  );
}

/** Field card: 1px #888 border, inner-shadow look, label 12 muted + value 14. */
function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.asterisk}>*</Text>}
      </Text>
      {children}
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

  scroll: { padding: 16, gap: 8 },

  field: {
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: '#888888', borderRadius: radii.md,
    paddingHorizontal: 16, paddingVertical: 12, gap: 8,
    minHeight: 68,
  },
  fieldLabel: { fontFamily: font.medium, fontSize: 12, lineHeight: 16, color: colors.textMuted },
  asterisk: { color: colors.mrpRed },
  input: { fontFamily: font.medium, fontSize: 14, lineHeight: 20, color: colors.textDark, padding: 0 },

  // "checkout frame": #FBFBFB, 0.5 top border, 312-wide blue button
  footer: {
    height: 64, backgroundColor: '#FBFBFB',
    borderTopWidth: 0.5, borderTopColor: '#888888',
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtn: {
    width: 312, height: 48, borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  saveTxt: { fontFamily: font.ralewaySemibold, fontSize: 20, lineHeight: 24, color: '#FBFBFB' },
});
