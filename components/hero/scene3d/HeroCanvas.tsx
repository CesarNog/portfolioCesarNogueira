"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CloudCore } from "./CloudCore";
import { ACCENT_BLUE } from "./materials";

type HeroCanvasProps = {
  progressRef: React.MutableRefObject<number>;
  /**
   * Fired once if the WebGL context is lost after creation (GPU driver
   * reset/crash, some mobile browsers reclaiming contexts on backgrounding).
   * Left unhandled, a lost context just freezes the canvas as a permanent
   * blank/frozen rectangle. The parent (IntroSequence) uses this to unmount
   * the Canvas entirely so nothing dead is left in the tree.
   */
  onContextLost?: () => void;
};

export function HeroCanvas({ progressRef, onContextLost }: HeroCanvasProps) {
  // Coarse-pointer (touch) devices commonly report devicePixelRatio 2-3;
  // combined with a full-viewport EffectComposer/Bloom pass that's a
  // meaningfully heavier per-frame cost than desktop, on exactly the class
  // of device most likely to visibly stutter. Clamp the upper DPR bound
  // lower there. Reading matchMedia directly in the initializer is safe:
  // HeroCanvas is only ever mounted client-side (IntroSequence dynamic-
  // imports it with `ssr: false`), so there's no SSR/hydration mismatch to
  // guard against here.
  const [dpr] = useState<[number, number]>(() =>
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
      ? [1, 1.5]
      : [1, 2],
  );

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.2, 7.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        // preventDefault() opts into WebGL's context-restore contract, but
        // we don't attempt to restore the scene — we just tell the parent
        // to unmount it so the rest of the page (IdentityConsole etc.) is
        // never affected by a dead/frozen context.
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            onContextLost?.();
          },
          { once: true },
        );
      }}
    >
      {/* NO <Environment> here, deliberately: a PMREM envmap (drei
          Environment + Lightformers) made the entire frame render black
          during the core-ignite window (originally p≈0.82–0.96; the ignite
          ramp has since been retimed to p≈0.68–0.84, but the underlying
          PMREM/Bloom interaction that caused the black frame is unrelated to
          the exact window and still applies) — verified by bisect with
          screenshots. The rim light below provides the edge definition
          instead, with none of the HDR-specular blowup risk. */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 3]} intensity={0.7} />
      {/* Rim light from behind-left — separates dark chassis edges from the void bg */}
      <directionalLight position={[-5, 2, -4]} intensity={0.9} color={ACCENT_BLUE} />
      <CloudCore progressRef={progressRef} />
      {/* multisampling=0: MSAA render targets are a known silent-black
          failure mode on software/weak GPUs; the dpr clamp above + native AA
          + mipmapBlur bloom cover edge quality without that risk. */}
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.5} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
