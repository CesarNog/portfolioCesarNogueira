"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CloudCore } from "./CloudCore";
import { SCENE, type Theme } from "./materials";

type HeroCanvasProps = {
  progressRef: React.MutableRefObject<number>;
  /**
   * When false, the render loop is paused (`frameloop="never"`) — the Canvas
   * stays mounted (context intact) but does zero per-frame work while the
   * intro is scrolled out of view. The parent flips this from an
   * IntersectionObserver. This is deliberately NOT an unmount: tearing the
   * Canvas down disposes the WebGL context, which fires `webglcontextlost`,
   * and repeated scroll-away/scroll-back churn either trips that handler or
   * exhausts the browser's live-context budget — both leave the 3D
   * permanently blank. Pausing the loop keeps the context alive and cheap.
   */
  active?: boolean;
  /**
   * Fired once if the WebGL context is genuinely lost after creation (GPU
   * driver reset/crash, browser reclaiming a backgrounded context). Because
   * the Canvas is no longer unmounted on scroll (see `active`), this now only
   * fires for real failures, not for our own teardown — so the parent can
   * safely treat it as "hide the 3D for this visit."
   */
  onContextLost?: () => void;
  /**
   * Current site theme. The scene has two deliberate material/lighting
   * identities (see materials.ts SCENE): a glowing data-center void in dark, a
   * crisp light-grey architecture-diagram look in light. Flips live when the
   * visitor toggles the theme.
   */
  theme?: Theme;
};

export function HeroCanvas({ progressRef, active = true, onContextLost, theme = "dark" }: HeroCanvasProps) {
  const scene = SCENE[theme];
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
      frameloop={active ? "always" : "never"}
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
      {/* Lighting + bloom are theme-driven (materials.ts SCENE): dark leans on
          a strong rim + generous bloom to carve glowing edges from the void;
          light leans on high even ambient fill so the grey module tiles read
          as lit hardware, with a restrained rim/bloom so white doesn't haze. */}
      <ambientLight intensity={scene.ambient} />
      <directionalLight position={[4, 5, 3]} intensity={scene.dir} />
      {/* Rim light from behind-left — separates chassis edges from the bg */}
      <directionalLight position={[-5, 2, -4]} intensity={scene.rim} color={scene.rimColor} />
      <CloudCore progressRef={progressRef} theme={theme} />
      {/* multisampling=0: MSAA render targets are a known silent-black
          failure mode on software/weak GPUs; the dpr clamp above + native AA
          + mipmapBlur bloom cover edge quality without that risk. */}
      <EffectComposer multisampling={0}>
        <Bloom intensity={scene.bloom.intensity} luminanceThreshold={scene.bloom.threshold} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
