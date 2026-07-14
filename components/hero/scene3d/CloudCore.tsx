"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { BLOCKS, BOX_ARGS, scatterOffset } from "./blocks-data";
import { chassisMaterial, accentMaterial, bezelMaterial, coreMaterial, SCENE, type Domain, type Theme } from "./materials";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

// Fraction of assembly progress each block's own dock animation takes. Paired
// with the retimed `delay` values in blocks-data.ts, every block finishes
// docking by p≈0.62 — well before the core's ignite ramp starts at p=0.68 —
// so "infrastructure assembly" reads as a beat that completes before
// "platform activation" begins, rather than the two overlapping throughout.
const SPAN = 0.3;

type ProgressRef = React.MutableRefObject<number>;
type SharedMaterials = { chassis: THREE.Material; bezel: THREE.Material; accent: Record<Domain, THREE.Material> };

function Block({ index, progressRef, materials }: { index: number; progressRef: ProgressRef; materials: SharedMaterials }) {
  const def = BLOCKS[index];
  const groupRef = useRef<THREE.Group>(null);
  const [sx, sy, sz, srx, sry, srz] = useMemo(() => scatterOffset(index), [index]);
  const [bw, bh, bd] = BOX_ARGS[def.domain];

  const stripRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const p = progressRef.current;
    const t = easeOutCubic(clamp01((p - def.delay) / SPAN));
    // Idle "breathing": a tiny per-block bob that grows in as the block
    // settles — the assembled cloud reads as a live, running system. Once
    // the whole scene reaches its stable operating state (p→1) the bob
    // tapers to a quieter whisper rather than holding full amplitude
    // forever — a settled system still hums, it doesn't keep visibly
    // breathing at full strength once handoff is long past.
    const settle = 1 - smoothstep(0.9, 1, p) * 0.6;
    const bob = Math.sin(state.clock.elapsedTime * 0.9 + index * 1.7) * 0.04 * t * settle;
    g.position.set(
      THREE.MathUtils.lerp(sx, def.pos[0], t),
      THREE.MathUtils.lerp(sy, def.pos[1], t) + bob,
      THREE.MathUtils.lerp(sz, def.pos[2], t),
    );
    g.rotation.set(
      THREE.MathUtils.lerp(srx, 0, t),
      THREE.MathUtils.lerp(sry, 0, t),
      THREE.MathUtils.lerp(srz, 0, t),
    );
    // Boot-up: the accent strip "powers on" (expands from center) only as
    // its block docks — dark chassis flying in, lights coming online.
    if (stripRef.current) {
      const boot = smoothstep(0.72, 0.98, t);
      stripRef.current.scale.set(Math.max(boot, 0.001), 1, 1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Per-domain proportions (see BOX_ARGS): architecture stays the
          original cloud-lobe cube, platform/DevOps modules are wider and
          flatter (stacked-container read), FinOps modules are narrower and
          taller (ledger-tile read) — same rounded-corner chassis language
          throughout, so the kit-of-parts still reads as one system.
          smoothness bumped 2→4: crisper rounded edges at the sizes these
          render on screen, still trivial triangle counts for 11 blocks. */}
      <RoundedBox args={[bw, bh, bd]} radius={0.06} smoothness={4} scale={def.scale} material={materials.chassis} />
      {/* Recessed bezel behind the strip — sits closer to the chassis surface
          and ~20% larger in width/height than the strip in front of it, so
          its edges read as a shadowed frame around a mounted indicator
          rather than the strip floating on the face as a flat decal. */}
      <mesh position={[0, 0, (bd / 2 + 0.008) * def.scale]} material={materials.bezel}>
        <boxGeometry args={[bw * 0.78 * def.scale, bh * 0.24 * def.scale, 0.015]} />
      </mesh>
      {/* accent strip on the front face — reads as a glowing panel light,
          colored by this block's domain (blue/cyan/orange) */}
      <mesh ref={stripRef} position={[0, 0, (bd / 2 + 0.02) * def.scale]} material={materials.accent[def.domain]}>
        <boxGeometry args={[bw * 0.65 * def.scale, bh * 0.17 * def.scale, 0.02]} />
      </mesh>
    </group>
  );
}

export function CloudCore({ progressRef, theme = "dark" }: { progressRef: ProgressRef; theme?: Theme }) {
  // Materials are rebuilt when the theme flips (deps: [theme]) so a live
  // light/dark toggle re-skins the scene; the old set is disposed by the
  // cleanup effect below, which re-runs on the same dependency change.
  const chassis = useMemo(() => chassisMaterial(theme), [theme]);
  const bezel = useMemo(() => bezelMaterial(theme), [theme]);
  const accentBlue = useMemo(() => accentMaterial("blue", theme), [theme]);
  const accentCyan = useMemo(() => accentMaterial("cyan", theme), [theme]);
  const accentOrange = useMemo(() => accentMaterial("orange", theme), [theme]);
  const coreMat = useMemo(() => coreMaterial(theme), [theme]);
  const rootRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const materials = useMemo(
    () => ({ chassis, bezel, accent: { blue: accentBlue, cyan: accentCyan, orange: accentOrange } }),
    [chassis, bezel, accentBlue, accentCyan, accentOrange],
  );
  const scene = SCENE[theme];

  // Materials created outside R3F's reconciler aren't auto-disposed — free the
  // GPU resources when the scene unmounts OR when the theme flips (the memo'd
  // materials become new objects, so this cleanup disposes the superseded set).
  useEffect(() => {
    return () => {
      chassis.dispose();
      bezel.dispose();
      accentBlue.dispose();
      accentCyan.dispose();
      accentOrange.dispose();
      coreMat.dispose();
    };
  }, [chassis, bezel, accentBlue, accentCyan, accentOrange, coreMat]);

  useFrame((state) => {
    const p = progressRef.current;

    // The whole cloud yaws in as it assembles and settles level at
    // completion — parallax depth on the scrub, plus a whisper of idle
    // drift so the finished scene never freezes. That drift itself tapers
    // (not to zero) once the scene reaches its stable operating state, so
    // the "settled system" doesn't keep drifting at the same amplitude it
    // used while still assembling.
    const idleSettle = 1 - smoothstep(0.9, 1, p) * 0.55;
    if (rootRef.current) {
      const idle = Math.sin(state.clock.elapsedTime * 0.18) * 0.02 * idleSettle;
      rootRef.current.rotation.y = THREE.MathUtils.lerp(-0.38, 0.0, easeOutCubic(clamp01(p * 1.15))) + idle;
      rootRef.current.rotation.x = THREE.MathUtils.lerp(0.07, 0.0, clamp01(p * 1.3));
      // Aspect-aware fit: the framing is tuned for wide viewports; on
      // narrow/portrait screens the outer blocks crop at the edges, so
      // scale the whole scene down proportionally (found via 390px-wide
      // screenshot review).
      const aspect = state.viewport.aspect;
      const fit = THREE.MathUtils.clamp(aspect / 1.15, 0.44, 1);
      rootRef.current.scale.setScalar(fit);
    }

    // Camera dolly: gentle push-in as the assembly completes — cinema on
    // the scrub, not just object motion.
    state.camera.position.z = 8.4 - easeOutCubic(clamp01(p * 1.1)) * 0.9;
    state.camera.position.y = 0.35 - clamp01(p) * 0.15;
    state.camera.lookAt(0, 0.05, 0);

    // Platform activation: ignite starts only after assembly has finished
    // (p≈0.62, see SPAN/blocks-data.ts), and finishes with room to spare
    // before the finale's connector lines/icons stop arriving (~p=0.84–0.90)
    // — so the causal read is "the core lights up, then the diagram grows
    // out of it," not the two happening at once. Stable operating state:
    // the glow calms down over the last stretch rather than staying at
    // peak brightness indefinitely.
    const ignite = smoothstep(0.68, 0.84, p);
    const calm = 1 - smoothstep(0.88, 1, p) * 0.4;
    // Ignite/point-light ranges are per-theme (see SCENE): the dark void wants
    // a strong bloom-fed flare, but on white that same range blows out to a
    // muddy haze, so light uses a gentler ramp.
    const intensity = (scene.coreIgnite.base + ignite * scene.coreIgnite.scale) * calm;
    if (coreRef.current) {
      coreRef.current.scale.setScalar(0.85 + ignite * 0.25);
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
    if (lightRef.current) {
      lightRef.current.intensity = scene.point.base + ignite * scene.point.ignite;
    }
  });

  return (
    <group ref={rootRef}>
      <pointLight ref={lightRef} position={[0, 0, 0]} color={scene.point.color} intensity={scene.point.base} distance={8} />
      {/* The control-plane hub: a small rounded module at the center, same
          chassis language (RoundedBox, matching corner radius) as the
          modules docking around it, rather than a faceted crystal — it
          reads as "the cloud's hub", not an unrelated sci-fi power gem. It
          stays architecture-blue: the dominant, central discipline the
          platform and FinOps modules assemble around. */}
      <RoundedBox ref={coreRef} args={[0.46, 0.46, 0.46]} radius={0.14} smoothness={4} material={coreMat} />
      {BLOCKS.map((_, i) => (
        <Block key={i} index={i} progressRef={progressRef} materials={materials} />
      ))}
    </group>
  );
}
