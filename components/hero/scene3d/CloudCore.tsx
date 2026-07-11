"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Icosahedron, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { BLOCKS, scatterOffset } from "./blocks-data";
import { chassisMaterial, accentMaterial, coreMaterial, ACCENT_BLUE } from "./materials";

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

const SPAN = 0.5; // fraction of assembly progress each block's own animation takes

type ProgressRef = React.MutableRefObject<number>;
type SharedMaterials = { chassis: THREE.Material; accent: THREE.Material };

function Block({ index, progressRef, materials }: { index: number; progressRef: ProgressRef; materials: SharedMaterials }) {
  const def = BLOCKS[index];
  const groupRef = useRef<THREE.Group>(null);
  const [sx, sy, sz, srx, sry, srz] = useMemo(() => scatterOffset(index), [index]);

  const stripRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = easeOutCubic(clamp01((progressRef.current - def.delay) / SPAN));
    // Idle "breathing": a tiny per-block bob that grows in as the block
    // settles — the assembled cloud reads as a live, running system.
    const bob = Math.sin(state.clock.elapsedTime * 0.9 + index * 1.7) * 0.04 * t;
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
      <RoundedBox args={[0.95, 0.6, 0.95]} radius={0.06} smoothness={2} scale={def.scale} material={materials.chassis} />
      {/* accent strip on the front face — reads as a glowing panel light */}
      <mesh ref={stripRef} position={[0, 0, 0.48 * def.scale]} material={materials.accent}>
        <boxGeometry args={[0.62 * def.scale, 0.1 * def.scale, 0.02]} />
      </mesh>
    </group>
  );
}

export function CloudCore({ progressRef }: { progressRef: ProgressRef }) {
  const chassis = useMemo(() => chassisMaterial(), []);
  const accent = useMemo(() => accentMaterial(), []);
  const coreMat = useMemo(() => coreMaterial(), []);
  const rootRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const materials = useMemo(() => ({ chassis, accent }), [chassis, accent]);

  // Materials created outside R3F's reconciler aren't auto-disposed —
  // free the GPU resources if the scene ever unmounts (e.g. a live
  // prefers-reduced-motion toggle).
  useEffect(() => {
    return () => {
      chassis.dispose();
      accent.dispose();
      coreMat.dispose();
    };
  }, [chassis, accent, coreMat]);

  useFrame((state) => {
    const p = progressRef.current;

    // The whole cloud yaws in as it assembles and settles level at
    // completion — parallax depth on the scrub, plus a whisper of idle
    // drift so the finished scene never freezes.
    if (rootRef.current) {
      const idle = Math.sin(state.clock.elapsedTime * 0.18) * 0.02;
      rootRef.current.rotation.y = THREE.MathUtils.lerp(-0.38, 0.0, easeOutCubic(clamp01(p * 1.15))) + idle;
      rootRef.current.rotation.x = THREE.MathUtils.lerp(0.07, 0.0, clamp01(p * 1.3));
    }

    // Camera dolly: gentle push-in as the assembly completes — cinema on
    // the scrub, not just object motion.
    state.camera.position.z = 8.4 - easeOutCubic(clamp01(p * 1.1)) * 0.9;
    state.camera.position.y = 0.35 - clamp01(p) * 0.15;
    state.camera.lookAt(0, 0.05, 0);

    const ignite = smoothstep(0.82, 0.96, p);
    const calm = 1 - smoothstep(0.96, 1, p) * 0.35;
    const intensity = (0.6 + ignite * 3) * calm;
    if (coreRef.current) {
      coreRef.current.scale.setScalar(0.85 + ignite * 0.25);
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + ignite * 6;
    }
  });

  return (
    <group ref={rootRef}>
      {/* Sparse ambient particle field behind the cloud — atmosphere/depth.
          Client-only canvas (ssr:false), so drei's internal randomness here
          can't cause a hydration mismatch. */}
      <Sparkles count={70} scale={[9, 5.5, 5]} position={[0, 0.1, -1.2]} size={1.6} speed={0.25} opacity={0.35} color={ACCENT_BLUE} />
      <pointLight ref={lightRef} position={[0, 0, 0]} color={ACCENT_BLUE} intensity={1.2} distance={8} />
      <Icosahedron ref={coreRef} args={[0.32, 1]} material={coreMat} />
      {BLOCKS.map((_, i) => (
        <Block key={i} index={i} progressRef={progressRef} materials={materials} />
      ))}
    </group>
  );
}
