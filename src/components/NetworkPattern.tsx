import React from 'react';
import Svg, { Circle, Line, G } from 'react-native-svg';

/**
 * Faint node-and-link constellation used behind the DigiDukaan footer lockup
 * ("Group 34702" → Frame @ 0.3 opacity in the Figma export).
 * Node positions are generated once from a fixed seed so the pattern is stable.
 */
const W = 412;
const H = 210;

function makeNodes() {
  // deterministic LCG — no Math.random at runtime
  let seed = 20260715;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const nodes: { x: number; y: number; r: number }[] = [];
  const cols = 8;
  const rows = 5;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      // jitter each cell so the grid reads as an organic network
      const x = (c + 0.5) * (W / cols) + (rand() - 0.5) * 34;
      const y = (r + 0.5) * (H / rows) + (rand() - 0.5) * 30;
      nodes.push({ x, y, r: 1.2 + rand() * 2.2 });
    }
  }
  return nodes;
}

const NODES = makeNodes();

const LINKS: [number, number][] = (() => {
  const out: [number, number][] = [];
  const MAX = 78;
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      const dx = NODES[i].x - NODES[j].x;
      const dy = NODES[i].y - NODES[j].y;
      if (Math.hypot(dx, dy) < MAX) out.push([i, j]);
    }
  }
  return out;
})();

/** Larger translucent “bubbles” scattered behind the mesh. */
const BUBBLES = [
  { x: 54, y: 150, r: 15 },
  { x: 128, y: 62, r: 9 },
  { x: 205, y: 176, r: 11 },
  { x: 300, y: 58, r: 13 },
  { x: 366, y: 140, r: 8 },
  { x: 246, y: 104, r: 6 },
];

export function NetworkPattern({ color = '#8A93A3', opacity = 0.3 }: { color?: string; opacity?: number }) {
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <G opacity={opacity}>
        {LINKS.map(([a, b], i) => (
          <Line
            key={`l${i}`}
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            stroke={color} strokeWidth={0.5} opacity={0.45}
          />
        ))}
        {BUBBLES.map((b, i) => (
          <Circle key={`b${i}`} cx={b.x} cy={b.y} r={b.r} fill={color} opacity={0.07} />
        ))}
        {NODES.map((n, i) => (
          <Circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill={color} opacity={0.5} />
        ))}
      </G>
    </Svg>
  );
}
