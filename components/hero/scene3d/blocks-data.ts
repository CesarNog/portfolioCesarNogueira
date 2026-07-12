// Deterministic block layout for the CloudCore assembly scene — no
// Math.random() here (or anywhere in the render path) so SSR and first
// client paint agree; see IntroSequence's reduced-motion note for why.

import type { Domain } from "./materials";

export type BlockDef = {
  /** Final locked position [x, y, z]. */
  pos: [number, number, number];
  /** Uniform scale of the block. */
  scale: number;
  /** Stagger offset (0-1) within the assembly window — larger arrives later. */
  delay: number;
  /**
   * Which technical domain this module belongs to, per DESIGN.md's
   * Domain-Color Rule (blue=architecture, cyan=platform/DevOps, orange=
   * FinOps/cost). Drives both the accent-strip color and the chassis
   * silhouette (see BOX_ARGS) so the assembly reads as three disciplines,
   * not eleven identical boxes with a single recolored stripe.
   */
  domain: Domain;
};

// Cloud silhouette built from overlapping rounded-box "server module" lobes:
// a raised center lobe, two shoulder lobes, two outer lobes, a flatter base
// row underneath, and two small accent chips floating on top.
//
// Domain assignment is deliberate, not decorative: architecture (blue) is
// the majority and forms the cloud's upper mass — the discipline everything
// else sits on top of. Platform/DevOps (cyan) modules sit low, in the
// foundation row — the operational layer infrastructure runs on. FinOps
// (orange) appears sparingly, as a floating chip and one foundation module —
// cost visibility sits alongside the platform it measures, never dominates
// it. This mirrors the real proportions of the work (architecture-led,
// platform-supported, FinOps-informed), not an even three-way split.
// Delays are scaled to finish assembly (delay + CloudCore's SPAN, currently
// 0.3) by p≈0.62 — well before the core's ignite ramp starts at p=0.68 — so
// "assembly" and "platform activation" read as two sequential beats within
// the shortened (130vh) pinned track, not one long overlapping blur.
export const BLOCKS: BlockDef[] = [
  // Top row — the cloud's puffs, tallest/largest in the center. Architecture.
  { pos: [-1.8, 0.1, 0.3], scale: 0.85, delay: 0.08, domain: "blue" },
  { pos: [-0.9, 0.35, -0.2], scale: 1.0, delay: 0.13, domain: "blue" },
  { pos: [0, 0.55, 0.4], scale: 1.18, delay: 0.17, domain: "blue" },
  { pos: [0.9, 0.35, -0.1], scale: 1.0, delay: 0.13, domain: "cyan" },
  { pos: [1.8, 0.05, 0.3], scale: 0.85, delay: 0.08, domain: "blue" },
  // Base row — flatter, sits lower, gives the cloud its underside. This is
  // the operational foundation: platform/DevOps modules with one FinOps
  // module reading the cost of what runs on them.
  { pos: [-1.3, -0.55, 0.1], scale: 0.75, delay: 0.21, domain: "cyan" },
  { pos: [-0.4, -0.65, 0.35], scale: 0.8, delay: 0.25, domain: "orange" },
  { pos: [0.5, -0.65, 0.15], scale: 0.8, delay: 0.25, domain: "blue" },
  { pos: [1.3, -0.55, -0.05], scale: 0.75, delay: 0.21, domain: "cyan" },
  // Small accent chips floating just above the main mass — a FinOps cost
  // signal and a platform/observability signal, visibly smaller than the
  // structural modules since they're signals riding on the architecture,
  // not load-bearing parts of it.
  { pos: [-0.5, 0.95, 0.5], scale: 0.4, delay: 0.32, domain: "orange" },
  { pos: [0.6, 1.0, 0.2], scale: 0.4, delay: 0.32, domain: "cyan" },
];

// Per-domain chassis proportions: same rounded-corner language throughout
// (nothing reads as a different kit of parts), but the aspect ratio hints at
// what each domain physically resembles — without adding new geometry or
// textures. Architecture keeps the original soft cloud-lobe cube. Platform/
// DevOps modules are wider and flatter, closer to a stacked container/rack
// unit. FinOps modules are narrower and taller, closer to a ledger tile or
// a meter. Base dimensions before the block's own uniform `scale` multiplies
// them further.
export const BOX_ARGS: Record<Domain, [number, number, number]> = {
  blue: [0.95, 0.6, 0.95],
  cyan: [1.12, 0.42, 0.9],
  orange: [0.72, 0.85, 0.68],
};

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
