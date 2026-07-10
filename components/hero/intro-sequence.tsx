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

const LABELS = ["TERRAFORM", "KUBERNETES", "MULTI-CLOUD", "FINOPS"];

/**
 * Cinematic scroll-scrubbed opening: a pinned track where a 3D "cloud core"
 * assembles from scattered server-module blocks as the visitor scrolls, then
 * hands off into the real hero (IdentityConsole, rendered right after this in
 * app/page.tsx) which keeps its own full content unchanged.
 *
 * Purely atmospheric — carries no unique information — so reduced-motion
 * visitors simply skip it entirely (render nothing) rather than get a static
 * substitute; all real content lives in IdentityConsole below.
 */
export function IntroSequence() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progressRef = useRef(0);

  useEffect(() => {
    if (reduce) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
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
        },
      });
      // Pad the timeline to a total duration of 1 so every subsequent
      // position parameter below (0-1) maps directly to scroll fraction.
      tl.to({}, { duration: 1 });

      const windowSize = 1 / LABELS.length;
      LABELS.forEach((_, i) => {
        const start = i * windowSize;
        const el = labelRefs.current[i];
        if (!el) return;
        tl.to(el, { opacity: 1, duration: 0.03 }, start + 0.02)
          .to(el, { opacity: 0, duration: 0.03 }, start + windowSize - 0.06);
      });
    }, trackRef);

    return () => ctx.revert();
  }, [reduce]);

  if (reduce) return null;

  return (
    <div ref={trackRef} className="relative h-[260vh]" aria-hidden>
      <div ref={stageRef} className="relative h-dvh w-full overflow-hidden bg-[var(--color-surface-0)]">
        <HeroCanvas progressRef={progressRef} />

        {/* Status readout — bottom-center, cycles through real skill labels.
            Bottom corners are reserved by the persistent chat widgets. */}
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          <span aria-hidden className="mr-2 text-[var(--color-cyan)]">▸</span>
          <span className="relative inline-block h-[1em] min-w-[9ch]">
            {LABELS.map((label, i) => (
              <span
                key={label}
                ref={(el) => { labelRefs.current[i] = el; }}
                className="absolute inset-0 opacity-0"
              >
                {label}
              </span>
            ))}
          </span>
        </div>

        {/* Scroll-progress line along the top edge of the pinned stage */}
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--color-hairline)]" />
      </div>
    </div>
  );
}
