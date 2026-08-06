import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { HomeIndicator } from '../components/CartBar';
import { PaymentCardIllo, CreditCoinsIllo } from '../components/EmptyIllustrations';

/**
 * Payments / Credit Partners — neither is live yet (the app is fully cash on
 * delivery), so both are empty states in the same construction as the Reorder
 * "coming soon" screen: centred illustration, Raleway heading, muted line.
 */

export function PaymentsScreen(props: NativeStackScreenProps<RootStackParamList, 'Payments'>) {
  return (
    <EmptyAccountScreen
      {...props}
      heading="Payments"
      illustration={<PaymentCardIllo />}
      title={'No payments found'}
      lines={[
        'You have no payment gateways available at this time.',
        'All orders are Cash on Delivery for now.',
      ]}
    />
  );
}

export function CreditPartnersScreen(props: NativeStackScreenProps<RootStackParamList, 'CreditPartners'>) {
  return (
    <EmptyAccountScreen
      {...props}
      heading="Credit Partners"
      illustration={<CreditCoinsIllo />}
      title={'No credit partners yet'}
      lines={[
        'Credit options are on their way.',
        'All orders are Cash on Delivery for now.',
      ]}
    />
  );
}

function EmptyAccountScreen({
  navigation, heading, illustration, title, lines,
}: {
  navigation: { goBack: () => void };
  heading: string;
  illustration: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <Text style={styles.heading} numberOfLines={1}>{heading}</Text>
        </View>
      </View>

      {/* ── Centred empty state, Reorder coming-soon construction ── */}
      <View style={styles.body}>
        {illustration}
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          {lines.map((l) => (
            <Text key={l} style={styles.sub}>{l}</Text>
          ))}
        </View>
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

  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 },
  textBlock: { alignItems: 'center', gap: 8 },
  title: {
    fontFamily: font.ralewaySemibold, fontSize: 20, lineHeight: 24,
    color: colors.textDark, textAlign: 'center',
  },
  sub: { fontFamily: font.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: 'center' },
});
