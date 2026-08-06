import React from 'react';
import Svg, { Path, Rect, Circle, Ellipse, Line, Text as SvgText } from 'react-native-svg';

/**
 * Empty-state illustrations for Payments and Credit Partners, drawn in the
 * same visual family as the no-results box and the Coming Soon shop:
 * slate #738BAB linework with a #BB77FF purple accent.
 */

const SLATE = '#738BAB';
const PURPLE = '#BB77FF';

/** Payment card with a purple magstripe + dashed swoosh, EmptyBox-style. */
export function PaymentCardIllo({ size = 180 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180" fill="none">
      {/* dashed swoosh */}
      <Path
        d="M118 26c16-6 28 2 24 12-4 9-18 8-20 0-2-8 6-15 17-14"
        stroke={SLATE} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="4 6" fill="none"
      />
      <Rect x={126} y={24} width={18} height={5} rx={2.5} fill={PURPLE} transform="rotate(-16 135 26)" />

      {/* back card, offset */}
      <Rect x={30} y={62} width={110} height={72} rx={10}
        fill="#FFFFFF" stroke={SLATE} strokeWidth={3} transform="rotate(-6 85 98)" />

      {/* front card */}
      <Rect x={38} y={74} width={110} height={72} rx={10} fill="#FFFFFF" stroke={SLATE} strokeWidth={3} />
      {/* magstripe */}
      <Rect x={38} y={88} width={110} height={14} fill={PURPLE} />
      {/* embossed dots */}
      <Rect x={52} y={118} width={18} height={7} rx={3.5} fill={SLATE} />
      <Rect x={76} y={118} width={26} height={7} rx={3.5} fill={SLATE} />
      {/* chip */}
      <Rect x={52} y={106} width={12} height={9} rx={2} fill="none" stroke={SLATE} strokeWidth={2} />
    </Svg>
  );
}

/** Rupee coins over an open palm — credit extended, EmptyBox-style. */
export function CreditCoinsIllo({ size = 180 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180" fill="none">
      {/* dashed swoosh */}
      <Path
        d="M120 22c15-5 26 2 22 11-3 8-16 7-18 0-2-7 5-13 15-12"
        stroke={SLATE} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="4 6" fill="none"
      />
      <Rect x={128} y={20} width={16} height={5} rx={2.5} fill={PURPLE} transform="rotate(-16 136 22)" />

      {/* coin stack */}
      <Ellipse cx={78} cy={104} rx={30} ry={9} fill="#FFFFFF" stroke={SLATE} strokeWidth={3} />
      <Ellipse cx={78} cy={94} rx={30} ry={9} fill="#FFFFFF" stroke={SLATE} strokeWidth={3} />

      {/* rupee coin on top */}
      <Circle cx={104} cy={66} r={20} fill="#FFFFFF" stroke={PURPLE} strokeWidth={3.5} />
      <SvgText
        x={104} y={74} textAnchor="middle"
        fontSize={22} fontWeight="bold" fill={PURPLE}
      >
        ₹
      </SvgText>

      {/* open palm underneath */}
      <Path
        d="M40 128c8 14 24 22 46 22s40-8 48-22"
        stroke={SLATE} strokeWidth={3} strokeLinecap="round" fill="none"
      />
      <Line x1={58} y1={124} x2={58} y2={138} stroke={SLATE} strokeWidth={3} strokeLinecap="round" />
      <Line x1={78} y1={128} x2={78} y2={144} stroke={SLATE} strokeWidth={3} strokeLinecap="round" />
      <Line x1={98} y1={128} x2={98} y2={144} stroke={SLATE} strokeWidth={3} strokeLinecap="round" />
      <Line x1={118} y1={124} x2={118} y2={138} stroke={SLATE} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}
