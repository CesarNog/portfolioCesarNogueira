"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CloudCore } from "./CloudCore";

export function HeroCanvas({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 7.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 3]} intensity={0.6} />
      <directionalLight position={[-4, -2, -3]} intensity={0.2} color="#22b8c4" />
      <CloudCore progressRef={progressRef} />
      <EffectComposer>
        <Bloom intensity={0.55} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
