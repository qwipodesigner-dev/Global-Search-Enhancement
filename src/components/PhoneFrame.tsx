import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { colors } from '../theme/theme';

/** Figma artboard — the app always renders at exactly this size. */
const FRAME_W = 412;
const FRAME_H = 892;
const BORDER = 8;
/** Outer device dimensions including the bezel. */
const DEVICE_W = FRAME_W + BORDER * 2;
const DEVICE_H = FRAME_H + BORDER * 2;
/** Breathing room around the device. */
const MARGIN = 24;

/**
 * On web / large screens, render the app inside a phone frame and scale the
 * WHOLE device down to fit the window — width and height together, so the
 * mobile aspect ratio (412 x 892) is always preserved.
 *
 * Scaling (rather than shrinking the height) means the app still lays out at a
 * true 412 x 892 viewport; we only change how big it looks. On a real device
 * it just fills the screen.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const framed = Platform.OS === 'web' && width > 560;

  if (!framed) return <View style={styles.fill}>{children}</View>;

  // Fit by whichever axis is tighter; never upscale past 1.
  const scale = Math.min(
    1,
    (height - MARGIN * 2) / DEVICE_H,
    (width - MARGIN * 2) / DEVICE_W
  );

  return (
    <View style={styles.backdrop}>
      {/* Occupies the scaled footprint so the device stays centred… */}
      <View style={{ width: DEVICE_W * scale, height: DEVICE_H * scale }}>
        {/* …while the device itself keeps its true pixel size and is scaled. */}
        <View style={[styles.device, { transform: [{ scale }], transformOrigin: 'top left' }]}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.surface },
  backdrop: {
    flex: 1,
    backgroundColor: '#E7E9EE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: MARGIN,
  },
  device: {
    width: DEVICE_W, // 428 → 412 of content inside an 8px bezel
    height: DEVICE_H, // 908 → 892 of content
    backgroundColor: colors.surface,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: BORDER,
    borderColor: '#0C0D10',
    // @ts-ignore web-only shadow
    boxShadow: '0 18px 48px rgba(0,0,0,0.22)',
  },
});
