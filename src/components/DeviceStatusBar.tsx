import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, font, layout } from '../theme/theme';

/**
 * Status bar — Figma: height 41, padding 12px 16px, time Inter 17/17 -0.5px #4F4F4F,
 * indicators gap 7 (signal 19.97x12, wifi 17x12.5, battery 27.33x13).
 */
export function DeviceStatusBar() {
  const c = colors.textDark2;
  return (
    <View style={styles.bar}>
      <Text style={styles.time}>9:41</Text>

      <View style={styles.indicators}>
        {/* Signal 19.97 x 12 */}
        <Svg width={19.97} height={12} viewBox="0 0 20 12">
          <Rect x={0} y={7.5} width={3.5} height={4.5} rx={1} fill={c} />
          <Rect x={5.5} y={5.25} width={3.5} height={6.75} rx={1} fill={c} />
          <Rect x={11} y={2.6} width={3.5} height={9.4} rx={1} fill={c} />
          <Rect x={16.5} y={0} width={3.5} height={12} rx={1} fill={c} />
        </Svg>

        {/* Wifi 17 x 12.5 */}
        <Svg width={17} height={12.5} viewBox="0 0 17 12.5">
          <Path d="M8.5 2.3c2.7 0 5.2 1 7.1 2.7l1.4-1.5A12 12 0 0 0 8.5 0 12 12 0 0 0 0 3.5l1.4 1.5A10.3 10.3 0 0 1 8.5 2.3Z" fill={c} />
          <Path d="M8.5 6.2c1.6 0 3.1.6 4.2 1.7l1.4-1.5A8.1 8.1 0 0 0 8.5 4.3 8.1 8.1 0 0 0 2.9 6.4l1.4 1.5A6.2 6.2 0 0 1 8.5 6.2Z" fill={c} />
          <Path d="M8.5 8.6c-1 0-1.9.4-2.5 1.1l2.5 2.8 2.5-2.8c-.6-.7-1.5-1.1-2.5-1.1Z" fill={c} />
        </Svg>

        {/* Battery 27.33 x 13 */}
        <Svg width={27.33} height={13} viewBox="0 0 27.33 13">
          <Rect x={0.5} y={0.5} width={24} height={12} rx={4} fill="none" stroke={c} strokeOpacity={0.4} />
          <Rect x={2} y={2} width={17} height={9} rx={2} fill={c} />
          <Rect x={26} y={4.5} width={1.33} height={4} rx={0.7} fill={c} opacity={0.5} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: layout.statusBarHeight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  time: {
    fontFamily: font.medium,
    fontSize: 17,
    lineHeight: 17,
    letterSpacing: -0.5,
    color: colors.textDark2,
  },
  indicators: { flexDirection: 'row', alignItems: 'center', gap: 7 },
});
