import React from 'react';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';
import { colors } from '../theme/theme';

/** Open-box "no results" illustration with the purple insert + dashed swoosh. */
export function EmptyBox({ size = 150 }: { size?: number }) {
  const stroke = '#7C8798';
  return (
    <Svg width={size} height={size} viewBox="0 0 160 150">
      {/* dashed swoosh */}
      <Path
        d="M96 20c18-6 30 4 24 16-5 10-20 8-22-1-2-8 6-16 18-15"
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="4 6"
      />
      <Rect x={104} y={20} width={20} height={5} rx={2.5} fill={colors.brandPurpleBright} transform="rotate(-18 114 22)" />

      {/* box back flaps */}
      <G stroke={stroke} strokeWidth={3} strokeLinejoin="round" fill="none">
        <Path d="M80 78 L30 58 L52 42 L102 62 Z" fill="#FFFFFF" />
        <Path d="M80 78 L130 58 L108 42 L58 62 Z" fill="#FFFFFF" />
      </G>

      {/* purple insert */}
      <Path d="M80 92 L48 79 L80 66 L112 79 Z" fill={colors.brandPurpleBright} />

      {/* box body */}
      <G stroke={stroke} strokeWidth={3} strokeLinejoin="round" fill="#FFFFFF">
        <Path d="M35 66 L80 84 L80 130 L35 112 Z" />
        <Path d="M125 66 L80 84 L80 130 L125 112 Z" />
      </G>

      <Circle cx={80} cy={84} r={2} fill={stroke} />
    </Svg>
  );
}
