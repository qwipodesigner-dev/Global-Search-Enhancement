import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { HomeIndicator } from '../components/CartBar';
import { QwipoLogo } from '../components/Logo';
import { ContactIllustration } from '../components/ContactIllustration';

type Props = NativeStackScreenProps<RootStackParamList, 'ContactUs'>;

const INFO: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[] = [
  { icon: 'time-outline', label: 'Office Timing', value: '09:00 AM to 6:00 PM - IST' },
  { icon: 'mail-outline', label: 'Email Address', value: 'info@qwipo.com' },
  { icon: 'phone-portrait-outline', label: 'Customer Care Number', value: '9121222836' },
];

/**
 * Contact Us (reference screen) — support illustration, the Qwipo lockup,
 * office/email/phone info rows, and the pinned Business Advisor card with
 * the call button. Static reference data, like the rest of the account area.
 */
export function ContactUsScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <Text style={styles.heading} numberOfLines={1}>Contact Us</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.lead}>If you have any query or need any further help</Text>

        <View style={styles.illoWrap}>
          <ContactIllustration />
        </View>

        <View style={styles.logoRow}>
          <QwipoLogo />
        </View>

        {INFO.map((row) => (
          <View key={row.label} style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name={row.icon} size={20} color={colors.textDark} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ── Your Business Advisor (pinned) ── */}
      <View style={styles.advisorCard}>
        <Text style={styles.advisorTitle}>Your Business Advisor</Text>
        <View style={styles.advisorRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="id-card-outline" size={20} color={colors.textDark} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.infoLabel}>Vinodkumar Musku</Text>
            <Text style={styles.infoValue}>9100466765</Text>
          </View>
          <Pressable style={styles.callBtn}>
            <Ionicons name="call" size={20} color={colors.white} />
          </Pressable>
        </View>
      </View>
      <HomeIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },

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

  scroll: { paddingBottom: 12 },

  lead: {
    paddingHorizontal: 16, paddingTop: 16,
    fontFamily: font.semibold, fontSize: 14, lineHeight: 20, color: colors.textDark,
  },
  illoWrap: { alignItems: 'center', paddingVertical: 12 },

  logoRow: { paddingHorizontal: 16, paddingVertical: 12 },

  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingHorizontal: 16, paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.grey,
  },
  infoIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.grey,
    alignItems: 'center', justifyContent: 'center',
    ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  },
  infoLabel: { fontFamily: font.regular, fontSize: 13, lineHeight: 16, color: colors.textDark2 },
  infoValue: { fontFamily: font.semibold, fontSize: 15, lineHeight: 20, color: colors.textDark },

  advisorCard: {
    marginHorizontal: 12, marginBottom: 12,
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.grey, borderRadius: radii.lg,
    paddingHorizontal: 14, paddingVertical: 12, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  advisorTitle: { fontFamily: font.semibold, fontSize: 15, lineHeight: 20, color: colors.textDark },
  advisorRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  callBtn: {
    width: 44, height: 44, borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
});
