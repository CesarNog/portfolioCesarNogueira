"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { ScanReticle } from "@/components/hero/scan-reticle";

const HeroCanvas = dynamic(
  () => import("@/components/hero/scene3d/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

// Provider/DevOps icons that orbit in around the assembled cloud in the
// final segment. Local SVGs (devicon, MIT) — no runtime CDN dependency.
// Positions are % of the stage, ringed around the centered 3D cloud.
const ORBIT_ICONS = [
  { src: "/icons/aws.svg", name: "AWS", x: 25, y: 31 },
  { src: "/icons/azure.svg", name: "Azure", x: 75, y: 29 },
  { src: "/icons/gcp.svg", name: "GCP", x: 19, y: 59 },
  { src: "/icons/kubernetes.svg", name: "Kubernetes", x: 81, y: 57 },
  { src: "/icons/terraform.svg", name: "Terraform", x: 34, y: 80 },
  { src: "/icons/docker.svg", name: "Docker", x: 66, y: 81 },
];

/**
 * Cinematic scroll-scrubbed opening (reference: naramcharan.me, adapted to
 * this brand): a pinned track in three segments —
 *   A (rest → ~28%): scan reticle + identity block (welcome eyebrow, glowing
 *     name, localized role line) + scroll prompt; scattered 3D blocks faint
 *     behind. Identity and reticle drift out as scrolling starts.
 *   B (~15–80%): the canvas ramps to full opacity while the 11-block cloud
 *     core assembles (driven by progressRef inside the R3F frame loop).
 *   C (~75–100%): the core ignites and AWS/Azure/GCP/K8s/Terraform/Docker
 *     icons stagger into an orbit ring around the assembled cloud, then the
 *     pin releases into the unmodified IdentityConsole below.
 *
 * All visible copy is localized (t.intro.*, t.hero.*) per this repo's
 * i18n-first rule. The whole sequence duplicates no unique content, so
 * prefers-reduced-motion visitors get null — zero added height, no WebGL
 * fetched — and land directly on the real hero.
 */
export function IntroSequence() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef(0);

  // Documented exception to the "Motion for all animation" rule: this scene
  // needs scroll PINNING + scrubbed timeline orchestration, which GSAP
  // ScrollTrigger provides and Motion's useScroll/useTransform do not
  // (no pin primitive; the reference implementation also found framer's
  // useScroll unreliable on a pinned track). GSAP is scoped to this one
  // component; everything else on the site stays on Motion.
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
      // Pad to duration 1 so position parameters below read as scroll fractions.
      tl.to({}, { duration: 1 }, 0);

      // Segment A → out: identity drifts up, reticle scales past the camera,
      // scroll hint drops away. All eased on the scrub.
      tl.to(identityRef.current, { opacity: 0, y: -48, duration: 0.2, ease: "power2.in" }, 0.06);
      tl.to(reticleRef.current, { opacity: 0, scale: 1.22, duration: 0.24, ease: "power2.in" }, 0.08);
      tl.to(scrollHintRef.current, { opacity: 0, y: 24, duration: 0.12, ease: "power1.in" }, 0.04);

      // Canvas ramps from faint backdrop to full presence for the assembly.
      tl.to(canvasWrapRef.current, { opacity: 1, duration: 0.28, ease: "power1.inOut" }, 0.1);

      // Segment C: provider icons orbit in around the assembled cloud, each
      // preceded by its connection line drawing outward from the core — the
      // finale resolves into a materializing architecture diagram.
      if (linesRef.current) {
        const lines = Array.from(linesRef.current.querySelectorAll("line"));
        lines.forEach((line, i) => {
          tl.to(
            line,
            { opacity: 1, duration: 0.06, ease: "power1.out" },
            0.72 + i * 0.035,
          );
        });
      }
      if (iconsRef.current) {
        const chips = Array.from(iconsRef.current.children);
        chips.forEach((chip, i) => {
          tl.fromTo(
            chip,
            { opacity: 0, y: 18, scale: 0.85 },
            { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: "power2.out" },
            0.74 + i * 0.035,
          );
        });
      }
    }, trackRef);

    return () => ctx.revert();
  }, [reduce]);

  if (reduce) return null;

  return (
    <div ref={trackRef} className="relative h-[220vh]" aria-hidden>
      <div ref={stageRef} className="relative h-dvh w-full overflow-hidden bg-[var(--color-surface-0)]">
        {/* 3D scene — faint at rest so the identity block owns the first read */}
        <div ref={canvasWrapRef} className="absolute inset-0" style={{ opacity: 0.16 }}>
          <HeroCanvas progressRef={progressRef} />
        </div>

        {/* Scan reticle — upper center */}
        <ScanReticle
          ref={reticleRef}
          className="absolute left-1/2 top-[4vh] h-[min(44vh,380px)] w-[min(44vh,380px)] -translate-x-1/2"
        />

        {/* Identity block — the Naram-style welcome moment, localized */}
        <div
          ref={identityRef}
          className="absolute inset-x-0 top-[52vh] flex flex-col items-center px-6 text-center"
        >
          <p className="font-mono text-[13px] tracking-[0.08em] text-[var(--color-blue)]">
            {t.intro.welcome}
          </p>
          <h2
            className="mt-2 font-display text-[clamp(2.75rem,6.5vw,5.25rem)] font-bold leading-[0.95] tracking-[-0.025em] text-[var(--color-fg)]"
            style={{ textShadow: "0 0 32px color-mix(in oklab, var(--color-blue) 45%, transparent)" }}
          >
            {siteConfig.firstName} Nogueira
          </h2>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-fg-muted)]">
            {t.hero.roleLine}
            <span className="text-[var(--color-ok)]"> · {t.hero.available}</span>
          </p>
        </div>

        {/* Scroll prompt — bottom center */}
        <div
          ref={scrollHintRef}
          className="absolute inset-x-0 bottom-24 flex flex-col items-center gap-1.5 text-[var(--color-fg-subtle)] sm:bottom-8"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">{t.intro.scroll}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-float">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Connection lines — revealed from the core outward as each icon
            arrives, resolving the finale into an architecture diagram.
            Visibility is gated by a per-line opacity tween in segment C (see
            the quirk note on the <line> elements for why a dashoffset "draw"
            doesn't work here); non-scaling-stroke keeps the 1px weight
            despite the stretched viewBox. */}
        <svg
          ref={linesRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {ORBIT_ICONS.map((icon) => {
            // Start each line 16% of the way out from center so they don't
            // converge through the core in an asterisk — they emanate from
            // just outside the ignited sphere instead.
            const x1 = (50 + (icon.x - 50) * 0.16).toFixed(2);
            const y1 = (52 + (icon.y - 52) * 0.16).toFixed(2);
            return (
              <line
                key={icon.name}
                x1={x1} y1={y1} x2={icon.x} y2={icon.y}
                // Dashed on purpose: dotted links are the standard visual for
                // network connections in architecture diagrams. Screen-space
                // dashes via non-scaling-stroke; visibility gated by an
                // opacity tween in segment C (a dashoffset "draw" trick does
                // NOT work here — non-scaling-stroke makes dash patterns
                // screen-space, ignoring pathLength normalization, which
                // leaked faint dashed rays over the at-rest identity block).
                strokeDasharray="5 7"
                stroke="var(--color-blue)"
                strokeOpacity="0.45"
                vectorEffect="non-scaling-stroke"
                style={{ opacity: 0 }}
              />
            );
          })}
        </svg>

        {/* Provider/DevOps icon orbit — revealed as the cloud finishes assembling */}
        <div ref={iconsRef} className="absolute inset-0">
          {ORBIT_ICONS.map((icon) => (
            <div
              key={icon.name}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border bg-[var(--color-surface-1)]/80 p-2.5 opacity-0"
              style={{
                left: `${icon.x}%`,
                top: `${icon.y}%`,
                // Blue-tinted border ties the endpoint chips to the diagram's
                // connection lines — they read as part of one system.
                borderColor: "color-mix(in oklab, var(--color-blue) 35%, var(--color-hairline-strong))",
              }}
            >
              <Image src={icon.src} alt={icon.name} width={34} height={34} unoptimized />
            </div>
          ))}
        </div>

        {/* Scroll-progress hairline along the top edge of the pinned stage */}
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--color-hairline)]" />
      </div>
    </div>
  );
}
