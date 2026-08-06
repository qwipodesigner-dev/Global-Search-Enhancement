import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { QwipoLogo } from '../components/Logo';
import { BottomNav } from '../components/BottomNav';
import { useProfile } from '../context/ProfileContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const MENU: { label: string; icon: keyof typeof Ionicons.glyphMap; route?: 'Payments' | 'CreditPartners' | 'Notifications' }[] = [
  { label: 'My Orders', icon: 'bag-handle-outline' }, // screen not designed yet
  { label: 'Payments', icon: 'cash-outline', route: 'Payments' },
  { label: 'Credit Partners', icon: 'hand-left-outline', route: 'CreditPartners' },
  { label: 'Notifications', icon: 'notifications-outline', route: 'Notifications' },
];

/**
 * Profile (Figma "Profile") — Qwipo header, the account row (opens Business
 * Details), the four menu cards, and the Contact Us / T&C / Logout footer.
 * The name and number come from the shared business profile, so they always
 * match Business Details. My Orders has no designed screen yet.
 */
export function ProfileScreen({ navigation }: Props) {
  const { profile } = useProfile();
  return (
    <View style={styles.root}>
      {/* ── Home Top Nav Bar — just the logo lockup ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.logoRow}>
          <QwipoLogo />
        </View>
      </View>

      {/* ── Frame 7139 — account row ── */}
      <Pressable style={styles.accountRow} onPress={() => navigation.navigate('BusinessDetails')}>
        <Ionicons name="person-circle-outline" size={40} color={colors.textDark} />
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={styles.accountName}>{profile.owner}</Text>
          <Text style={styles.accountPhone}>{profile.mobile}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#505050" />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Frame 40013 — menu cards ── */}
        <View style={{ gap: 8 }}>
          {MENU.map((m) => (
            <Pressable
              key={m.label}
              style={styles.menuCard}
              onPress={m.route ? () => navigation.navigate(m.route!) : undefined}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={m.icon} size={18} color={colors.textDark} />
              </View>
              <Text style={styles.menuLabel}>{m.label}</Text>
              <Ionicons name="chevron-forward" size={24} color="#505050" />
            </Pressable>
          ))}
        </View>

        {/* ── Footer links ── */}
        <View style={styles.footerLinks}>
          <Pressable onPress={() => navigation.navigate('ContactUs')}>
            <Text style={styles.footerLink}>Contact Us</Text>
          </Pressable>
          <Pressable><Text style={styles.footerLink}>Terms and Conditions</Text></Pressable>
          <Pressable style={styles.logoutRow}>
            <Ionicons name="log-out-outline" size={24} color={colors.mrpRed} />
            <Text style={styles.logoutTxt}>Logout</Text>
          </Pressable>
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
  },
  logoRow: { paddingHorizontal: 16, paddingVertical: 12 },

  // Frame 7139: white, padding 24 16 16, bottom hairline
  accountRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16,
    borderBottomWidth: 0.5, borderBottomColor: colors.grey,
  },
  accountName: { fontFamily: font.medium, fontSize: 20, lineHeight: 20, color: colors.textDark },
  accountPhone: { fontFamily: font.medium, fontSize: 16, lineHeight: 20, color: colors.textDark2 },

  scroll: { padding: 12, gap: 12, flexGrow: 1 },

  // Frame 7144…: white card, radius 12, 0.5 grey border, h56, padding 12 16
  menuCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    height: 56, paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderWidth: 0.5, borderColor: colors.grey, borderRadius: radii.lg,
  },
  menuIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F1F1F1',
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontFamily: font.medium, fontSize: 16, lineHeight: 20, color: colors.textDark },

  footerLinks: { marginTop: 'auto', paddingHorizontal: 19, paddingBottom: 24, gap: 18 },
  footerLink: { fontFamily: font.medium, fontSize: 16, lineHeight: 20, color: colors.textDark },
  logoutRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoutTxt: { fontFamily: font.medium, fontSize: 16, lineHeight: 20, color: colors.mrpRed },
});
