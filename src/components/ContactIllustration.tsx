import React from 'react';
import Svg, { Rect, Circle, Ellipse, Path, Line } from 'react-native-svg';

/**
 * Support-agent illustration for Contact Us — a vector take on the reference
 * artwork (woman with a headset at a monitor, speech bubble, plant, office
 * backdrop) in the app's palette. Swap for the exported design asset when
 * available for pixel parity.
 */
export function ContactIllustration({ width = 340, height = 260 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 340 260" fill="none">
      {/* ── backdrop: calendar + shelf ── */}
      <Rect x={22} y={38} width={92} height={74} rx={4} fill="#EFEFEF" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <Rect key={`${r}-${c}`} x={30 + c * 16} y={48 + r * 15} width={9} height={8} rx={1.5} fill="#DBDBDB" />
        ))
      )}
      <Rect x={238} y={44} width={70} height={5} rx={2} fill="#DBDBDB" />
      <Rect x={246} y={26} width={10} height={18} fill="#CFCFCF" />
      <Rect x={260} y={30} width={8} height={14} fill="#DBDBDB" />
      <Rect x={282} y={22} width={14} height={22} fill="#CFCFCF" />
      <Line x1={252} y1={49} x2={252} y2={62} stroke="#DBDBDB" strokeWidth={4} />
      <Line x1={296} y1={49} x2={296} y2={62} stroke="#DBDBDB" strokeWidth={4} />

      {/* ── speech bubble ── */}
      <Circle cx={175} cy={52} r={30} fill="#FFFFFF" stroke="#EDEDED" strokeWidth={2} />
      <Path d="M158 76 L150 92 L172 80 Z" fill="#FFFFFF" stroke="#EDEDED" strokeWidth={2} />
      <Circle cx={163} cy={52} r={3.5} fill="#3A3A3A" />
      <Circle cx={175} cy={52} r={3.5} fill="#3A3A3A" />
      <Circle cx={187} cy={52} r={3.5} fill="#3A3A3A" />

      {/* ── plant ── */}
      <Path d="M56 176c-10-14-24-16-32-12 6 12 18 16 28 15" fill="#BB77FF" opacity={0.85} />
      <Path d="M60 176c2-16-4-30-14-36-4 14 2 28 10 34" fill="#BB77FF" />
      <Path d="M64 178c8-10 20-12 27-8-5 10-16 12-24 11" fill="#D3AAFF" />
      <Rect x={48} y={178} width={30} height={26} rx={3} fill="#3F3B3B" />
      <Path d="M50 190l6-6 6 6 6-6 6 6" stroke="#FFFFFF" strokeWidth={2} fill="none" />

      {/* ── desk ── */}
      <Rect x={30} y={204} width={280} height={7} rx={3.5} fill="#E2E2E2" />

      {/* ── monitor ── */}
      <Path d="M96 118c0-4 3-7 7-7h68c4 0 7 3 7 7v66c0 4-3 7-7 7h-68c-4 0-7-3-7-7z" fill="#2E2A2A" />
      <Rect x={124} y={191} width={22} height={10} fill="#2E2A2A" />
      <Rect x={108} y={200} width={54} height={5} rx={2.5} fill="#FFFFFF" stroke="#D8D8D8" strokeWidth={1} />

      {/* ── agent ── */}
      {/* hair back */}
      <Path d="M232 96c-16-14-44-12-54 6-8 15-4 34 2 46l8 40 14 4 40-10-2-52c0-14-2-26-8-34z" fill="#2E2A2A" />
      {/* face */}
      <Circle cx={228} cy={118} r={20} fill="#F0C6A0" />
      {/* fringe */}
      <Path d="M208 112c2-14 14-22 26-18 8 3 12 10 12 18-10-6-28-8-38 0z" fill="#2E2A2A" />
      {/* headset band + mic */}
      <Path d="M208 106c4-12 18-18 30-12" stroke="#3A3A3A" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Circle cx={210} cy={120} r={5} fill="#3A3A3A" />
      <Path d="M212 126c2 6 8 10 16 10" stroke="#3A3A3A" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Circle cx={230} cy={137} r={3} fill="#3A3A3A" />
      {/* body: purple blouse with dots */}
      <Path d="M196 152c8-12 44-14 54 0 8 12 10 34 8 52h-72c-2-20 2-40 10-52z" fill="#C9A1F0" />
      <Circle cx={210} cy={168} r={2} fill="#FFFFFF" />
      <Circle cx={228} cy={162} r={2} fill="#FFFFFF" />
      <Circle cx={244} cy={172} r={2} fill="#FFFFFF" />
      <Circle cx={218} cy={186} r={2} fill="#FFFFFF" />
      <Circle cx={238} cy={192} r={2} fill="#FFFFFF" />
      {/* arm reaching keyboard */}
      <Path d="M200 168c-14 8-30 20-42 30l6 8c14-6 30-14 40-22z" fill="#C9A1F0" />
      <Circle cx={160} cy={202} r={6} fill="#F0C6A0" />
      {/* chair */}
      <Path d="M268 160c8 2 12 10 10 20l-6 24h-8l4-30z" fill="#3F3B3B" />
    </Svg>
  );
}
