"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HeroCanvas = dynamic(
  () => import("@/components/hero/scene3d/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

/**
 * Cinematic scroll-scrubbed opening: a short pinned track where a 3D "cloud
 * core" assembles from scattered server-module blocks as the visitor
 * scrolls, then hands off into the real hero (IdentityConsole, rendered
 * right after this in app/page.tsx) which keeps its own full content
 * unchanged. Kept short (120vh, a few seconds of scroll) so it doesn't cost
 * the "person before product" 10-second scan recruiters give the page —
 * see PRODUCT.md.
 *
 * No status readout or terminal-style copy here on purpose: this project's
 * own PRODUCT.md names "fake terminal boot sequences" as rejected AI-
 * portfolio-syndrome. The assembly is a pure visual, no text riding on it.
 *
 * Purely atmospheric — carries no unique information — so reduced-motion
 * visitors simply skip it entirely (render nothing) rather than get a static
 * substitute; all real content lives in IdentityConsole below.
 */
export function IntroSequence() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (reduce) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trackRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        pin: stageRef.current,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (process.env.NODE_ENV !== "production") {
            (window as unknown as { __introProgress?: number }).__introProgress = self.progress;
          }
        },
      });
    }, trackRef);

    return () => ctx.revert();
  }, [reduce]);

  if (reduce) return null;

  return (
    <div ref={trackRef} className="relative h-[120vh]" aria-hidden>
      <div ref={stageRef} className="relative h-dvh w-full overflow-hidden bg-[var(--color-surface-0)]">
        <HeroCanvas progressRef={progressRef} />
        {/* Scroll-progress line along the top edge of the pinned stage */}
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--color-hairline)]" />
      </div>
    </div>
  );
}
