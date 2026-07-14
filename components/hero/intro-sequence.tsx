"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { ScanReticle } from "@/components/hero/scan-reticle";
import { WebGLBoundary } from "@/components/hero/scene3d/webgl-boundary";

const HeroCanvas = dynamic(
  () => import("@/components/hero/scene3d/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

// Provider/DevOps icons that orbit in around the assembled cloud in the
// final segment. Local SVGs (devicon, MIT) — no runtime CDN dependency.
// Positions are % of the stage, ringed around the centered 3D cloud.
//
// `domain` ties each icon into the same Domain-Color Rule the 3D CloudCore
// assembly now encodes in its own geometry (see scene3d/blocks-data.ts):
// cloud providers and IaC are architecture (blue), container orchestration
// is platform/DevOps (cyan). Kept to two domains here deliberately — the
// provider set itself is infra/IaC tooling, so a FinOps-orange entry would
// misrepresent what these six logos actually are; FinOps is left for a
// later stage per this pass's scope (art direction of the 3D geometry only).
const ORBIT_ICONS: { src: string; name: string; x: number; y: number; domain: "blue" | "cyan" }[] = [
  { src: "/icons/aws.svg", name: "AWS", x: 25, y: 31, domain: "blue" },
  { src: "/icons/azure.svg", name: "Azure", x: 75, y: 29, domain: "blue" },
  { src: "/icons/gcp.svg", name: "GCP", x: 19, y: 59, domain: "blue" },
  { src: "/icons/kubernetes.svg", name: "Kubernetes", x: 81, y: 57, domain: "cyan" },
  { src: "/icons/terraform.svg", name: "Terraform", x: 34, y: 80, domain: "blue" },
  { src: "/icons/docker.svg", name: "Docker", x: 66, y: 81, domain: "cyan" },
];

/**
 * Cinematic scroll-scrubbed opening (reference: naramcharan.me, adapted to
 * this brand): a pinned track carrying a five-beat arc —
 *   A. Identity-first opening (0 → ~0.20): scan reticle + identity block
 *     (welcome eyebrow, quiet Title-scale name, localized role line) +
 *     scroll prompt own the first read; scattered 3D blocks sit faint
 *     behind at rest.
 *     Identity/reticle/hint drift out as scrolling starts — fully clear
 *     before the canvas ramps up, so text and 3D never compete for attention.
 *   B. Infrastructure assembly (~0.20 → ~0.62): the canvas ramps to full
 *     opacity and the 11-block cloud core docks into place (driven by
 *     progressRef inside the R3F frame loop — see CloudCore's block delays).
 *   C. Platform activation (~0.68 → ~0.84): the core ignites — brightening
 *     visibly *before* any connector line starts drawing, so the finale's
 *     causality reads correctly (activation invites the diagram, not the
 *     other way around) — then AWS/Azure/GCP/K8s/Terraform/Docker icons
 *     stagger into an orbit ring around it.
 *   D. Stable operating state (~0.84 → 1): the ignite settles to a calm
 *     glow and idle motion (block bob, cloud drift) tapers to a quieter
 *     whisper — see the `settle` factors in CloudCore.tsx — rather than
 *     holding full-amplitude motion indefinitely.
 *   E. Continuous handoff: the pin releases directly into IdentityConsole,
 *     whose own entrance is gated on scroll-arrival (not mount), so the
 *     "real hero" animates to life at the exact moment this scene ends
 *     instead of arriving already settled off-screen.
 *
 * Track height matches CLAUDE.md's documented, scan-time-justified 120vh
 * baseline exactly (most of a single viewport of real scroll once the
 * 100dvh pin is subtracted) so this arc doesn't eat into the ~10-second
 * scan recruiters give the page.
 *
 * All visible copy is localized (t.intro.*, t.hero.*) per this repo's
 * i18n-first rule. The identity block's name is deliberately set at
 * Title scale, not Display — DESIGN.md reserves Display type for "hero
 * name only, one instance per page," and IdentityConsole's typewriter
 * is that instance. This block's job is a quick, quiet "here's who" read
 * at rest; the confirm-beat name reveal belongs to the real hero below,
 * so the sequence hands off cleanly instead of repeating itself.
 *
 * Resilience: `HeroCanvas` is wrapped in `WebGLBoundary` and gated on a
 * `canvasFailed` flag (set by HeroCanvas's `onContextLost`) so a WebGL
 * init failure or a lost context degrades to "no 3D scene" instead of
 * taking the page down — IdentityConsole is a sibling, unaffected either
 * way. Performance: the Canvas is also gated on `canvasVisible`, an
 * IntersectionObserver on the track itself, so it unmounts (stopping its
 * per-frame render loop and freeing GPU resources via CloudCore's existing
 * disposal effect) once the visitor has scrolled well past it, rather than
 * rendering forever at `frameloop="always"` for the rest of the session.
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
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [overlayFit, setOverlayFit] = useState(1);
  const [siteReduced, setSiteReduced] = useState(false);
  // The 3D scene has two deliberate material identities (materials.ts SCENE):
  // a glowing data-center void in dark, a crisp light-grey architecture-diagram
  // look in light. Default "dark" (this repo is dark-first and the Canvas is
  // client-only, so no SSR markup depends on it); a class-attribute observer
  // re-skins the scene live if the visitor toggles the theme mid-view.
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  // SSR (and the very first, hydrating client render) must agree, or React
  // logs a hydration mismatch and the 120vh track visibly collapses/re-
  // expands. `useReducedMotion()` returns false during SSR but can already
  // read the real OS media query on the client's first render (framer-
  // motion evaluates matchMedia synchronously in the hook body, not in an
  // effect) — so gate the reduced-motion early-return on mount, the same
  // pattern IdentityConsole/InfraCanvas use elsewhere in this codebase.
  // Post-mount, an actual reduced-motion visitor still collapses to null
  // (zero added height, no WebGL fetched) exactly as before; only the very
  // first paint is now guaranteed to match the server's.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // WebGL failure/resilience: if Canvas creation throws (caught by
  // WebGLBoundary below) or the context is lost after creation
  // (HeroCanvas's onContextLost), stop trying to render the 3D scene for
  // the rest of this visit. The 2D identity/orbit-icon/connection-line
  // layer and the scroll-scrubbed handoff into IdentityConsole are
  // completely independent of the canvas, so they keep working normally.
  const [canvasFailed, setCanvasFailed] = useState(false);
  // Perf/resilience: once this 120vh track has scrolled well out of view
  // (visitor has moved on to Story/ExperienceTimeline/etc.), there is no
  // reason for the R3F Canvas to keep rendering every frame indefinitely.
  // This PAUSES the render loop (HeroCanvas `frameloop="never"`) rather than
  // unmounting the Canvas: unmounting disposes the WebGL context, which fires
  // `webglcontextlost`, and scroll-away/scroll-back churn either trips the
  // context-lost handler below (permanently blanking the scene) or exhausts
  // the browser's live-context budget. Pausing keeps the context alive (a few
  // MB idle) while doing zero per-frame work off-screen — the actual cost the
  // gating targets. The scene reads live from `progressRef`, so on resume it
  // renders the correct assembly state on its next frame with no bookkeeping.
  const [canvasVisible, setCanvasVisible] = useState(true);

  // Mirrors CloudCore's own aspect-aware `fit` (scene3d/CloudCore.tsx) so the
  // 2D orbit-icon ring and connection lines pull toward center in step with
  // the 3D cloud on narrow/portrait viewports, instead of staying at full
  // desktop radius while the assembled cloud behind them shrinks to as
  // little as 44% scale — which previously left icons/lines floating,
  // visually disconnected from a much smaller cloud. Floored higher than
  // CloudCore's 0.44 (at 0.6) because the DOM icon chips are physically
  // larger than the 3D chassis blocks; matching CloudCore's floor exactly
  // packs adjacent chips (e.g. Terraform/Docker) close enough to touch at
  // the narrowest phone widths.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const compute = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      setOverlayFit(Math.min(1, Math.max(0.6, w / h / 1.15)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Dual reduced-motion gate: `useReducedMotion()` only reflects the OS-level
  // media query. This codebase's own MotionToggle sets `data-reduce-motion`
  // on <html> (components/motion-toggle.tsx), and ui/matrix-rain.tsx already
  // checks both signals for the same reason — this is the single heaviest
  // animated component on the site (GSAP-pinned WebGL), so it's the one most
  // worth respecting the in-app toggle for. A MutationObserver (rather than
  // a one-time read) picks up a toggle flip that happens mid-visit, before
  // this section has scrolled into view.
  useEffect(() => {
    const check = () =>
      setSiteReduced(document.documentElement.getAttribute("data-reduce-motion") === "1");
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-reduce-motion"] });
    return () => mo.disconnect();
  }, []);

  // Track the site theme (next-themes toggles `.light`/`.dark` on <html>) so
  // the 3D scene can flip between its two material identities live. Read post-
  // mount + observe the class attribute for mid-view toggles.
  useEffect(() => {
    const check = () =>
      setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  const shouldReduce = mounted && (reduce || siteReduced);

  // Perf/resilience: gate the Canvas mount on the track's own viewport
  // intersection so it stops rendering (and frees its GPU resources) once
  // the visitor has scrolled well past it, rather than running
  // `frameloop="always"` forever for the rest of the session.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setCanvasVisible(entry.isIntersecting),
      { rootMargin: "200px 0px 200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Radial position of each orbit icon/connection line, pulled toward center
  // by `overlayFit` so the finale diagram hugs the shrunk 3D cloud on narrow
  // viewports rather than floating at full desktop radius around a much
  // smaller assembly.
  const scaledIcons = useMemo(
    () =>
      ORBIT_ICONS.map((icon) => ({
        ...icon,
        cx: 50 + (icon.x - 50) * overlayFit,
        cy: 52 + (icon.y - 52) * overlayFit,
      })),
    [overlayFit],
  );

  // Documented exception to the "Motion for all animation" rule: this scene
  // needs scroll PINNING + scrubbed timeline orchestration, which GSAP
  // ScrollTrigger provides and Motion's useScroll/useTransform do not
  // (no pin primitive; the reference implementation also found framer's
  // useScroll unreliable on a pinned track). GSAP is scoped to this one
  // component; everything else on the site stays on Motion.
  useEffect(() => {
    if (shouldReduce) return;
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
            // Direct ref write (no React state) so the hairline updates
            // every scroll tick without a re-render, consistent with how
            // the rest of this scene already avoids React re-renders per
            // scroll tick (progressRef itself, read inside useFrame).
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
            if (process.env.NODE_ENV !== "production") {
              (window as unknown as { __introProgress?: number }).__introProgress = self.progress;
            }
          },
        },
      });
      // Pad to duration 1 so position parameters below read as scroll fractions.
      tl.to({}, { duration: 1 }, 0);

      // Segment A → out: identity drifts up, reticle scales past the camera,
      // scroll hint drops away — all fully clear by ~0.20, before segment B's
      // canvas ramp begins, so the "identity first" read never has to
      // compete on-screen with the assembling cloud (previously these
      // overlapped ~0.10–0.26).
      tl.to(identityRef.current, { opacity: 0, y: -48, duration: 0.16, ease: "power2.in" }, 0.02);
      tl.to(reticleRef.current, { opacity: 0, scale: 1.22, duration: 0.18, ease: "power2.in" }, 0.04);
      tl.to(scrollHintRef.current, { opacity: 0, y: 24, duration: 0.08, ease: "power1.in" }, 0.0);

      // Segment B: canvas ramps from faint backdrop to full presence only
      // once identity/reticle have cleared, so the handoff from text to 3D
      // reads as sequential rather than simultaneous.
      tl.to(canvasWrapRef.current, { opacity: 1, duration: 0.2, ease: "power1.inOut" }, 0.22);

      // Segment C: the core's own ignite ramp (CloudCore.tsx) starts at
      // p=0.68. Connector lines/icons are staggered to start at/after that,
      // not before it (previously lines started at 0.72 while ignite didn't
      // begin until 0.82 — the diagram appeared to precede activation
      // instead of following from it). Each icon is still preceded by its
      // own connection line drawing outward from the already-igniting core.
      if (linesRef.current) {
        const lines = Array.from(linesRef.current.querySelectorAll("line"));
        lines.forEach((line, i) => {
          tl.to(
            line,
            { opacity: 1, duration: 0.05, ease: "power1.out" },
            0.7 + i * 0.025,
          );
        });
      }
      if (iconsRef.current) {
        const chips = Array.from(iconsRef.current.children);
        chips.forEach((chip, i) => {
          tl.fromTo(
            chip,
            { opacity: 0, y: 18, scale: 0.85 },
            { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power2.out" },
            0.715 + i * 0.025,
          );
        });
      }
    }, trackRef);

    return () => ctx.revert();
  }, [shouldReduce]);

  if (shouldReduce) return null;

  return (
    <div ref={trackRef} className="relative h-[120vh]" aria-hidden>
      <div ref={stageRef} className="relative h-dvh w-full overflow-hidden bg-[var(--color-surface-0)]">
        {/* 3D scene — faint at rest so the identity block owns the first read.
            Wrapped in WebGLBoundary (hard requirement: a Canvas init failure
            must never take the page down). The Canvas stays mounted for the
            whole visit and only its render loop is paused off-screen (via the
            `active` prop → frameloop) — see the canvasVisible note above for
            why this must NOT be an unmount. Only a genuine, unrecoverable
            context loss (canvasFailed) actually removes it, leaving an empty
            wrapper div with the 2D layer and IdentityConsole handoff intact. */}
        <div ref={canvasWrapRef} className="absolute inset-0" style={{ opacity: 0.16 }}>
          {!canvasFailed && (
            <WebGLBoundary>
              <HeroCanvas
                progressRef={progressRef}
                active={canvasVisible}
                theme={theme}
                onContextLost={() => setCanvasFailed(true)}
              />
            </WebGLBoundary>
          )}
        </div>

        {/* Scan reticle — upper center. Shrunk on short/landscape viewports
            (max-height 520px covers ~390-430px-wide phones in landscape)
            so it clears well before the identity block below it — at rest
            these two never had more than ~15px clearance in landscape. */}
        <ScanReticle
          ref={reticleRef}
          className="absolute left-1/2 top-[4vh] h-[min(44vh,380px)] w-[min(44vh,380px)] -translate-x-1/2 [@media(max-height:520px)]:top-[2vh] [@media(max-height:520px)]:h-[min(28vh,200px)] [@media(max-height:520px)]:w-[min(28vh,200px)]"
        />

        {/* Identity block — a quick "here's who" glimpse, not the hero moment.
            Name sits at Title scale (DESIGN.md), not Display: the Display
            treatment — the site's one permitted instance — belongs to
            IdentityConsole's typewriter reveal just below. This block only
            teases; that one confirms.
            `top` pulls up on short/landscape viewports (see reticle above)
            so a longer, wrapped role-line still has headroom before the
            scroll-hint at the bottom. */}
        <div
          ref={identityRef}
          className="absolute inset-x-0 top-[52vh] flex flex-col items-center px-6 text-center [@media(max-height:520px)]:top-[34vh]"
        >
          <p className="font-mono text-[13px] tracking-[0.08em] text-[var(--color-blue)]">
            {t.intro.welcome}
          </p>
          <p className="mt-2 font-display text-[clamp(1.125rem,2.6vw,1.25rem)] font-medium leading-[1.4] tracking-[-0.01em] text-[var(--color-fg)]">
            {siteConfig.firstName} Nogueira
          </p>
          {/* max-w + reduced mobile tracking: the PT/ES/FR translations of
              roleLine + available run ~85-90 characters combined (vs EN's
              ~76), which wraps to 2-3 lines at 360-430px with the full
              0.22em tracking and no width cap. Availability is repeated
              seconds later in IdentityConsole's badge, so it's dropped here
              below `sm` (same `hidden sm:inline` pattern IdentityConsole
              already uses for its own secondary timestamp) rather than left
              to wrap awkwardly on the narrowest phones. */}
          <p className="mt-4 max-w-[min(90vw,30rem)] font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)] sm:tracking-[0.22em]">
            {t.hero.roleLine}
            <span className="hidden text-[var(--color-ok)] sm:inline"> · {t.hero.available}</span>
          </p>
        </div>

        {/* Scroll prompt — bottom center. `env(safe-area-inset-bottom)` keeps
            it clear of notched-phone home indicators/gesture bars even if
            the base offset is ever tightened; short/landscape viewports pull
            it further up so it can't collide with a wrapped identity block
            above it. */}
        <div
          ref={scrollHintRef}
          className="absolute inset-x-0 bottom-[calc(6rem_+_env(safe-area-inset-bottom))] flex flex-col items-center gap-1.5 text-[var(--color-fg-subtle)] sm:bottom-[calc(2rem_+_env(safe-area-inset-bottom))] [@media(max-height:520px)]:bottom-[calc(1rem_+_env(safe-area-inset-bottom))]"
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
            despite the stretched viewBox. Endpoints use `scaledIcons`
            (cx/cy), not the raw ORBIT_ICONS percentages, so the lines shrink
            toward center with the 3D cloud on narrow viewports instead of
            staying full desktop length. */}
        <svg
          ref={linesRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {scaledIcons.map((icon) => {
            // Start each line 16% of the way out from center so they don't
            // converge through the core in an asterisk — they emanate from
            // just outside the ignited sphere instead. Computed from the
            // already-scaled cx/cy so the start offset shrinks in step too.
            const x1 = (50 + (icon.cx - 50) * 0.16).toFixed(2);
            const y1 = (52 + (icon.cy - 52) * 0.16).toFixed(2);
            return (
              <line
                key={icon.name}
                x1={x1} y1={y1} x2={icon.cx} y2={icon.cy}
                // Dashed on purpose: dotted links are the standard visual for
                // network connections in architecture diagrams. Screen-space
                // dashes via non-scaling-stroke; visibility gated by an
                // opacity tween in segment C (a dashoffset "draw" trick does
                // NOT work here — non-scaling-stroke makes dash patterns
                // screen-space, ignoring pathLength normalization, which
                // leaked faint dashed rays over the at-rest identity block).
                // Stroke color matches the icon's domain (see ORBIT_ICONS)
                // so the diagram itself, not just the 3D core, shows
                // architecture vs. platform/DevOps as distinct connections.
                strokeDasharray="5 7"
                stroke={icon.domain === "cyan" ? "var(--color-cyan)" : "var(--color-blue)"}
                strokeOpacity="0.45"
                vectorEffect="non-scaling-stroke"
                style={{ opacity: 0 }}
              />
            );
          })}
        </svg>

        {/* Provider/DevOps icon orbit — revealed as the cloud finishes
            assembling. Positioned from `scaledIcons` (cx/cy) so the ring
            pulls toward center on narrow viewports along with the 3D cloud
            and the connection lines above, instead of staying at a fixed
            desktop radius around a much smaller assembly. */}
        <div ref={iconsRef} className="absolute inset-0">
          {scaledIcons.map((icon) => (
            <div
              key={icon.name}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border bg-[var(--color-surface-1)]/80 p-2.5 opacity-0"
              style={{
                left: `${icon.cx}%`,
                top: `${icon.cy}%`,
                // Border tints to the icon's domain color, matching its
                // connection line above — chips read as part of one system,
                // grouped by discipline rather than uniformly blue.
                borderColor: `color-mix(in oklab, var(--color-${icon.domain}) 35%, var(--color-hairline-strong))`,
              }}
            >
              <Image src={icon.src} alt={icon.name} width={34} height={34} unoptimized />
            </div>
          ))}
        </div>

        {/* Scroll-progress hairline along the top edge of the pinned stage.
            Width now actually reflects scroll progress (bound via a direct
            ref write in the ScrollTrigger's onUpdate above — previously this
            was a static, unbound div despite the comment promising a
            progress cue, giving zero feedback across a pinned track this
            long on how much remains before real content appears). */}
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--color-hairline)]" aria-hidden>
          <div ref={progressBarRef} className="h-full origin-left bg-[var(--color-blue)]" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
