"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CloudCore } from "./CloudCore";
import { ACCENT_BLUE } from "./materials";

export function HeroCanvas({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 7.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* NO <Environment> here, deliberately: a PMREM envmap (drei
          Environment + Lightformers) made the entire frame render black
          during the core-ignite window (p≈0.82–0.96) — verified by bisect
          with screenshots. The rim light below provides the edge definition
          instead, with none of the HDR-specular blowup risk. */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 3]} intensity={0.7} />
      {/* Rim light from behind-left — separates dark chassis edges from the void bg */}
      <directionalLight position={[-5, 2, -4]} intensity={0.9} color={ACCENT_BLUE} />
      <CloudCore progressRef={progressRef} />
      {/* multisampling=0: MSAA render targets are a known silent-black
          failure mode on software/weak GPUs; dpr [1,2] + native AA +
          mipmapBlur bloom cover edge quality without that risk. */}
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.5} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
