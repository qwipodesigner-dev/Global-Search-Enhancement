import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { colors } from '../theme/theme';
import { logoPaths } from './logoPaths';

/**
 * Qwipo lockup — exact vectors from the Figma export ("Frame 7375").
 * Group 11790: 37.787 x 37.683 mark (#BB77FF + white glyph)
 * Group 11789: 58.265 x 20 wordmark (#231F1F), gap 9.044.
 */
export function QwipoLogo() {
  return (
    <View style={styles.row}>
      <Svg width={37.787} height={37.683} viewBox="0 0 37.7872 37.6826">
        <G>
          <Path d={logoPaths.mark} fill={colors.brand} />
          <Path d={logoPaths.markGlyph} fill={colors.white} />
        </G>
      </Svg>

      <Svg width={58.265} height={20} viewBox="0 0 58.2651 19.9997">
        <G>
          <Path d={logoPaths.w1} fill={colors.textDark} />
          <Path d={logoPaths.w2} fill={colors.textDark} />
          <Path d={logoPaths.w3} fill={colors.textDark} />
          <Path d={logoPaths.w4} fill={colors.textDark} />
          <Path d={logoPaths.w5} fill={colors.textDark} />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 9.044 },
});
