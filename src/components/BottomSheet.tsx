import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, font } from '../theme/theme';

/**
 * App bottom sheet (Figma "Track Order" pop-up): 20px top corners, the
 * "Pop Up Header" — drag handle, 18px title, grey close button — with a
 * bottom shadow, then the caller's body and the home-indicator strip.
 * Rendered in-screen (not a Modal) so it stays inside the phone frame on web.
 */
export function BottomSheet({
  visible, title, subtitle, onClose, children,
}: {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // 0 -> 1 drives both the slide-up and the backdrop fade.
  const slide = useRef(new Animated.Value(0)).current;
  const [sheetH, setSheetH] = useState(600);

  useEffect(() => {
    if (visible) {
      slide.setValue(0);
      Animated.timing(slide, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slide]);

  if (!visible) return null;

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [sheetH, 0] });

  return (
    // Above everything on the screen — including the top nav (zIndex 10)
    <View style={[StyleSheet.absoluteFill, styles.layer]}>
      {/* Backdrop dims the WHOLE screen, so the sheet's rounded corners
          reveal the dimmed page rather than a white gap. */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: slide }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
        onLayout={(e) => setSheetH(Math.max(1, Math.round(e.nativeEvent.layout.height)))}
      >
        {/* ── Pop Up Header ── */}
        <View style={styles.header}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.title} numberOfLines={1}>{title}</Text>
              {!!subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textDark} />
            </Pressable>
          </View>
        </View>

        {children}

        {/* Home indicator strip at the sheet's foot, per the design */}
        <View style={styles.indicatorBar}>
          <View style={styles.indicator} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { zIndex: 100, elevation: 20, justifyContent: 'flex-end' },
  overlay: { backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    overflow: 'hidden',
  },

  header: {
    alignItems: 'center', gap: 12,
    paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 12,
    backgroundColor: colors.white,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    zIndex: 1,
  },
  handle: { width: 40, height: 4, borderRadius: 12, backgroundColor: colors.grey },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'stretch' },
  title: { fontFamily: font.medium, fontSize: 18, lineHeight: 24, color: colors.textDark },
  subtitle: { fontFamily: font.regular, fontSize: 13, lineHeight: 18, color: colors.textDark2 },
  closeBtn: {
    width: 40, height: 40, borderRadius: radii.md,
    backgroundColor: colors.bgGrey,
    alignItems: 'center', justifyContent: 'center',
  },

  indicatorBar: {
    height: 14, backgroundColor: colors.white,
    borderTopWidth: 0.667, borderTopColor: colors.grey,
    alignItems: 'center', justifyContent: 'center',
  },
  indicator: { width: 64, height: 4, borderRadius: 6, backgroundColor: colors.grey },
});
