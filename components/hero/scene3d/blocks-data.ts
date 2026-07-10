// Deterministic block layout for the CloudCore assembly scene — no
// Math.random() here (or anywhere in the render path) so SSR and first
// client paint agree; see IntroSequence's reduced-motion note for why.

export type BlockDef = {
  /** Final locked position [x, y, z]. */
  pos: [number, number, number];
  /** Uniform scale of the block. */
  scale: number;
  /** Accent color variant. */
  accent: "blue" | "cyan" | "orange";
  /** Stagger offset (0-1) within the assembly window — larger arrives later. */
  delay: number;
};

// Cloud silhouette built from overlapping rounded-box "server module" lobes:
// a raised center lobe, two shoulder lobes, two outer lobes, a flatter base
// row underneath, and two small accent chips floating on top.
export const BLOCKS: BlockDef[] = [
  // Top row — the cloud's puffs, tallest/largest in the center
  { pos: [-1.8, 0.1, 0.3], scale: 0.85, accent: "blue", delay: 0.0 },
  { pos: [-0.9, 0.35, -0.2], scale: 1.0, accent: "cyan", delay: 0.08 },
  { pos: [0, 0.55, 0.4], scale: 1.18, accent: "blue", delay: 0.16 },
  { pos: [0.9, 0.35, -0.1], scale: 1.0, accent: "cyan", delay: 0.08 },
  { pos: [1.8, 0.05, 0.3], scale: 0.85, accent: "blue", delay: 0.0 },
  // Base row — flatter, sits lower, gives the cloud its underside
  { pos: [-1.3, -0.55, 0.1], scale: 0.75, accent: "cyan", delay: 0.22 },
  { pos: [-0.4, -0.65, 0.35], scale: 0.8, accent: "orange", delay: 0.3 },
  { pos: [0.5, -0.65, 0.15], scale: 0.8, accent: "cyan", delay: 0.3 },
  { pos: [1.3, -0.55, -0.05], scale: 0.75, accent: "blue", delay: 0.22 },
  // Small accent chips floating just above the main mass
  { pos: [-0.5, 0.95, 0.5], scale: 0.4, accent: "orange", delay: 0.42 },
  { pos: [0.6, 1.0, 0.2], scale: 0.4, accent: "cyan", delay: 0.42 },
];

/** Deterministic pseudo-random scatter offset for block i (no Math.random). */
export function scatterOffset(i: number): [number, number, number, number, number, number] {
  const a = i * 12.9898;
  const b = i * 78.233;
  const c = i * 37.719;
  const wrap = (n: number) => (Math.sin(n) * 43758.5453) % 1;
  const rx = wrap(a) * 2 - 1;
  const ry = wrap(b) * 2 - 1;
  const rz = wrap(c) * 2 - 1;
  const rotX = wrap(a + b) * Math.PI * 2;
  const rotY = wrap(b + c) * Math.PI * 2;
  const rotZ = wrap(c + a) * Math.PI * 2;
  const radius = 5.5 + wrap(a * b) * 2.5;
  return [rx * radius, ry * radius + 1, rz * radius, rotX, rotY, rotZ];
}
