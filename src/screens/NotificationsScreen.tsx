import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, font, shadow } from '../theme/theme';
import { DeviceStatusBar } from '../components/DeviceStatusBar';
import { HomeIndicator } from '../components/CartBar';
import { notifications } from '../data/notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

/**
 * Notifications (reference screen) — promo pushes as white cards: circled
 * bell, title, "6, August 2026 | 12:51 PM" timestamp, blue "New" badge for
 * unread, and the message line below. Reached from the Home bell icon and
 * the Profile menu.
 */
export function NotificationsScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      {/* ── Top Nav Bar ── */}
      <View style={styles.topNav}>
        <DeviceStatusBar />
        <View style={styles.navBody}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </Pressable>
          <Text style={styles.heading} numberOfLines={1}>Notifications</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {notifications.map((n) => (
          <View key={n.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.bellCircle}>
                <Ionicons name="notifications-outline" size={22} color={colors.textDark} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.title}>{n.title}</Text>
                <Text style={styles.timestamp}>{n.timestamp}</Text>
              </View>
              {n.unread && (
                <View style={styles.newBadge}>
                  <Text style={styles.newTxt}>New</Text>
                </View>
              )}
            </View>
            <Text style={styles.message}>{n.message}</Text>
          </View>
        ))}
      </ScrollView>

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

  card: {
    backgroundColor: colors.white, borderRadius: radii.md,
    padding: 14, gap: 12,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  bellCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F1F1F1',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22, color: colors.textDark },
  timestamp: { fontFamily: font.regular, fontSize: 12, lineHeight: 16, color: colors.textDark2 },
  newBadge: {
    backgroundColor: colors.primary, borderRadius: radii.sm,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  newTxt: { fontFamily: font.medium, fontSize: 13, color: colors.white },
  message: { fontFamily: font.medium, fontSize: 14, lineHeight: 20, color: colors.textDark },
});
