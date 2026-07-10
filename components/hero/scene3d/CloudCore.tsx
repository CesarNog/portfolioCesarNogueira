"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Icosahedron } from "@react-three/drei";
import * as THREE from "three";
import { BLOCKS, scatterOffset } from "./blocks-data";
import { chassisMaterial, accentMaterial, coreMaterial } from "./materials";

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

function Block({ index, progressRef }: { index: number; progressRef: ProgressRef }) {
  const def = BLOCKS[index];
  const groupRef = useRef<THREE.Group>(null);
  const [sx, sy, sz, srx, sry, srz] = useMemo(() => scatterOffset(index), [index]);
  const chassis = useMemo(() => chassisMaterial(), []);
  const accent = useMemo(() => accentMaterial(def.accent), [def.accent]);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const t = easeOutCubic(clamp01((progressRef.current - def.delay) / SPAN));
    g.position.set(
      THREE.MathUtils.lerp(sx, def.pos[0], t),
      THREE.MathUtils.lerp(sy, def.pos[1], t),
      THREE.MathUtils.lerp(sz, def.pos[2], t),
    );
    g.rotation.set(
      THREE.MathUtils.lerp(srx, 0, t),
      THREE.MathUtils.lerp(sry, 0, t),
      THREE.MathUtils.lerp(srz, 0, t),
    );
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[0.95, 0.6, 0.95]} radius={0.06} smoothness={2} scale={def.scale} material={chassis} />
      {/* accent strip on the front face — reads as a glowing panel light */}
      <mesh position={[0, 0, 0.48 * def.scale]} material={accent}>
        <boxGeometry args={[0.62 * def.scale, 0.1 * def.scale, 0.02]} />
      </mesh>
    </group>
  );
}

export function CloudCore({ progressRef }: { progressRef: ProgressRef }) {
  const coreMat = useMemo(() => coreMaterial(), []);
  const coreRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const p = progressRef.current;
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
    <group>
      <pointLight ref={lightRef} position={[0, 0, 0]} color="#22b8c4" intensity={1.2} distance={8} />
      <Icosahedron ref={coreRef} args={[0.32, 1]} material={coreMat} />
      {BLOCKS.map((_, i) => (
        <Block key={i} index={i} progressRef={progressRef} />
      ))}
    </group>
  );
}
