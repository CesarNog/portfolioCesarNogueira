"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { ScanReticle } from "@/components/hero/scan-reticle";
import { WebGLBoundary } from "@/components/hero/scene3d/webgl-boundary";
import { SCENE } from "@/components/hero/scene3d/materials";

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

// The four capability modules the providers/tools above actually feed into —
// same labels + Domain-Color Rule accents as the real Capability Matrix
// section further down the page (lib/site-config.ts `capabilities`), so this
// scene previews real claims instead of inventing new ones. FinOps and AI
// Infrastructure intentionally share the orange accent, matching that data.
const MODULE_ACCENTS = ["blue", "cyan", "orange", "orange"] as const;

// Three measurable outcomes, verbatim from the site's own case-study data
// (lib/site-config.ts: ~30% cloud waste removed, 99.9% availability SLA) —
// the "result" beat the brief asks for, kept to a strict three so it reads
// as a conclusion, not another list.

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
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const coreLabelRef = useRef<HTMLDivElement>(null);
  const modulesRef = useRef<HTMLDivElement>(null);
  const outcomesRef = useRef<HTMLDivElement>(null);
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
  // Bumped to force a full HeroCanvas + WebGLBoundary remount after a context
  // loss (see handleContextLost below) — a clean remount reinitializes WebGL
  // from scratch and is enough to recover the vast majority of real-world
  // `webglcontextlost` events, which on mobile are usually transient (the
  // tab was briefly backgrounded, the OS reclaimed GPU memory under pressure)
  // rather than a genuinely broken GPU/driver.
  const [canvasKey, setCanvasKey] = useState(0);
  // Timestamps of recent context losses, so repeated losses in a short window
  // (a real crash loop, not a one-off backgrounding blip) still fall back to
  // `canvasFailed` instead of remounting forever.
  const contextLossesRef = useRef<number[]>([]);
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

  // See canvasKey/contextLossesRef above: remount on loss (bounded), only
  // give up permanently after 3 losses inside a 30s window.
  const handleContextLost = useCallback(() => {
    const now = Date.now();
    contextLossesRef.current = [...contextLossesRef.current, now].filter((t) => now - t < 30_000);
    if (contextLossesRef.current.length >= 3) {
      setCanvasFailed(true);
    } else {
      setCanvasKey((k) => k + 1);
    }
  }, []);

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

  // The modules row was originally sandwiched in the horizontal gap between
  // the GCP/Kubernetes icons at the ring's mid-height — fine at overlayFit=1,
  // but as overlayFit shrinks toward its 0.6 floor on narrower aspect ratios
  // (tablet portrait, tall phones) it pulls those icons inward and collapses
  // that gap, so the labels started overlapping the icons/chassis blocks
  // behind them. Anchoring below the ring's lowest icon by a fixed real-pixel
  // gap (the same scaling `scaledIcons` already applies) keeps a constant
  // visual clearance regardless of aspect ratio, instead of a static
  // Tailwind offset that assumed the ring never changes shape.
  const lowestIconY = Math.max(...ORBIT_ICONS.map((icon) => icon.y));
  const moduleTop = `calc(${52 + (lowestIconY - 52) * overlayFit}% + 48px)`;

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
          // Resync from the trigger's own recalculated progress rather than
          // hardcoding 0 — a refresh happens on any layout change (including
          // the guarded resize handler below), and this used to snap a
          // visitor mid-scroll straight back to the start of the pinned
          // track instead of preserving their actual position.
          onRefresh: (self) => {
            progressRef.current = self.progress;
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
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
      // reads as sequential rather than simultaneous. Animates a `--gsap-fade`
      // custom property (0→1), NOT `opacity` directly — see the JSX below for
      // why: GSAP caches a scrub-tween's start value the first time the
      // playhead reaches it, so a tween driving `opacity` straight from the
      // theme's rest value would go stale if the visitor scrolled past this
      // point, back to rest, toggled the theme, then scrolled forward again
      // (the tween would animate from its originally-cached start, not the
      // new theme's value). `--gsap-fade` sidesteps this: it's always a clean
      // 0→1 regardless of theme, so there's nothing theme-dependent to cache.
      tl.fromTo(canvasWrapRef.current, { "--gsap-fade": 0 }, { "--gsap-fade": 1, duration: 0.2, ease: "power1.inOut" }, 0.22);

      // Tagline fills the space the identity block vacated at ~0.18 instead
      // of leaving it empty for the rest of the sequence — it fades in early
      // and stays, since it never competes with the real hero below (that
      // scene only starts once this one's pin releases at p=1).
      tl.fromTo(taglineRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.14 }, 0.24);

      // Segment C: the core's own ignite ramp (CloudCore.tsx) starts at
      // p=0.68 — the core label lands with it, so the abstract glowing cube
      // gets an explicit "this is the control plane" read the moment it
      // lights up, before anything else arrives. Connector lines/icons are
      // staggered to start right after (not before ignite, so activation
      // reads as the cause, the diagram as the effect), retimed tighter
      // (0.018 apart instead of 0.025) than the original pass so there's
      // room left in the track for the new "translation" and "result" beats
      // below without lengthening the pinned track itself.
      tl.fromTo(coreLabelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.68);
      if (linesRef.current) {
        const lines = Array.from(linesRef.current.querySelectorAll("line"));
        lines.forEach((line, i) => {
          // Flow-in reveal: dashes travel inward as the line arrives (strokeDashoffset
          // 28 → 0 alongside the opacity fade), reading as a directional pulse from
          // provider to core rather than a static line snapping to visible. Settles to
          // a fixed offset once landed — a one-shot flow, not a perpetual loop, per the
          // "stable final states" constraint (nothing left pulsing indefinitely).
          tl.fromTo(
            line,
            { opacity: 0, strokeDashoffset: 28 },
            { opacity: 1, strokeDashoffset: 0, duration: 0.09, ease: "power2.out" },
            0.68 + i * 0.018,
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
            0.695 + i * 0.018,
          );
        });
      }

      // "Translation": the flows the providers just drew feed the four
      // capability modules — arrives after the last provider icon (~0.80),
      // reading as the next causal beat rather than a simultaneous one.
      if (modulesRef.current) {
        const modules = Array.from(modulesRef.current.children);
        modules.forEach((mod, i) => {
          tl.fromTo(
            mod,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
            0.82 + i * 0.02,
          );
        });
      }

      // "Result": the modules converge into the three measurable outcomes —
      // the sequence's conclusion, landing just before the pin releases
      // (~1.0) into IdentityConsole, so the scene ends on a stated result
      // rather than a shrug.
      if (outcomesRef.current) {
        const outcomes = Array.from(outcomesRef.current.children);
        outcomes.forEach((outcome, i) => {
          tl.fromTo(
            outcome,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
            0.9 + i * 0.02,
          );
        });
      }
    }, trackRef);

    // Refresh ScrollTrigger on a genuine resize (orientation change, window
    // resize) to recalculate pin/scroll positions — but NOT on a pure height
    // change from the mobile browser chrome (URL bar) auto-hiding as the
    // visitor scrolls, which fires a `resize` event on every scroll tick on
    // most mobile browsers. Refreshing on those was resetting/recalculating
    // the pinned track mid-scroll, which combined with the old onRefresh
    // above (progress hardcoded to 0) made the intro visibly stutter or
    // restart while scrolling on phones — the most common real-world trigger
    // for "the 3D animation doesn't work" on mobile.
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, [shouldReduce]);

  // Reduced motion gets a complete, static reading of the same narrative —
  // tagline, providers, capability modules, outcomes — instead of nothing.
  // The old behavior (returning null) was fine while this scene carried no
  // unique information ("purely atmospheric" — see the file-level comment
  // history), but the tagline/modules/outcomes above are real claims now,
  // and DESIGN.md's own a11y rule is that no information may depend solely
  // on motion. No WebGL is fetched here: `HeroCanvas` is a client-only
  // dynamic import that only loads once actually rendered, and this branch
  // never renders it.
  if (shouldReduce) {
    return (
      <div className="relative overflow-hidden bg-[var(--color-surface-0)] py-16 sm:py-20" aria-hidden>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 text-center">
          <p className="max-w-[min(90vw,32rem)] font-ui text-[0.9375rem] leading-[1.5] text-[var(--color-fg-muted)] [text-wrap:balance]">
            {t.intro.tagline}
          </p>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blue)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-blue)]" />
            {t.intro.coreLabel}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {ORBIT_ICONS.map((icon) => (
              <div
                key={icon.name}
                className="flex h-12 w-12 items-center justify-center rounded-lg border p-2"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--color-surface-1) 80%, transparent)",
                  borderColor: `color-mix(in oklab, var(--color-${icon.domain}) 35%, var(--color-hairline-strong))`,
                }}
              >
                <Image src={icon.src} alt={icon.name} width={28} height={28} unoptimized />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {t.intro.modules.map((label, i) => (
              <span
                key={label}
                className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(--color-${MODULE_ACCENTS[i]})` }}
                />
                {label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {t.intro.outcomes.map((label) => (
              <span
                key={label}
                className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-fg)]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={trackRef} className="relative h-[120vh]" aria-hidden>
      <div ref={stageRef} className="relative h-dvh w-full overflow-hidden bg-[var(--color-surface-0)]">
        {/* 3D scene — faint at rest so the identity block owns the first read,
            but not so faint it's invisible: the rest-state opacity is
            per-theme (SCENE.restOpacity) because a flat 0.16 made the dark
            void's near-black chassis disappear against the near-black
            background entirely, leaving the assembly with no visible
            "before" to animate from. React owns `--rest-opacity` (always
            fresh — recomputed every render from `theme`) and GSAP owns
            `--gsap-fade` (a clean 0→1 scroll-driven ramp, set on the tween
            above) as two independent CSS custom properties; `calc()` combines
            them into the actual opacity. This split — rather than GSAP
            tweening `opacity` straight from the theme's rest value — is what
            avoids GSAP's start-value caching going stale on a scroll-away/
            theme-toggle/scroll-back sequence (see the tween comment above).
            Wrapped in WebGLBoundary (hard requirement: a Canvas init failure
            must never take the page down). The Canvas stays mounted for the
            whole visit and only its render loop is paused off-screen (via the
            `active` prop → frameloop) — see the canvasVisible note above for
            why this must NOT be an unmount. Only a genuine, unrecoverable
            context loss (canvasFailed) actually removes it, leaving an empty
            wrapper div with the 2D layer and IdentityConsole handoff intact. */}
        <div
          ref={canvasWrapRef}
          className="absolute inset-0"
          style={{
            "--rest-opacity": SCENE[theme].restOpacity,
            opacity: "calc(var(--rest-opacity) + (1 - var(--rest-opacity)) * var(--gsap-fade, 0))",
          } as React.CSSProperties}
        >
          {!canvasFailed && (
            <WebGLBoundary key={canvasKey}>
              <HeroCanvas
                key={canvasKey}
                progressRef={progressRef}
                active={canvasVisible}
                theme={theme}
                onContextLost={handleContextLost}
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

        {/* Tagline — fills the space the identity block above vacates as it
            drifts out (~p=0.18), instead of leaving that upper third empty
            for the rest of the sequence while the assembly plays out below
            it. One line, quiet, never competes with IdentityConsole's own
            copy after the handoff. */}
        <p
          ref={taglineRef}
          className="absolute inset-x-0 top-[15vh] px-6 text-center font-ui text-[0.9375rem] leading-[1.5] text-[var(--color-fg-muted)] opacity-0 [text-wrap:balance] [@media(max-height:520px)]:top-[8vh]"
        >
          <span className="mx-auto block max-w-[min(90vw,32rem)]">{t.intro.tagline}</span>
        </p>

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
                // dashes via non-scaling-stroke; a *phase-shift* dashoffset
                // tween (28 → 0, see segment C above) reads as directional
                // flow without needing pathLength normalization — that only
                // matters for a "draw the whole path" reveal, which non-
                // scaling-stroke genuinely can't do (dash patterns would stay
                // screen-space and leak faint rays over the at-rest identity
                // block), but a phase shift is just moving the same repeating
                // pattern, which works fine regardless. Tighter dash + higher
                // opacity than the original pass (was 5/7 @ 0.45) for
                // contrast against the near-black background. Stroke color
                // matches the icon's domain (see ORBIT_ICONS) so the diagram
                // itself, not just the 3D core, shows architecture vs.
                // platform/DevOps as distinct connections.
                strokeDasharray="4 5"
                stroke={icon.domain === "cyan" ? "var(--color-cyan)" : "var(--color-blue)"}
                strokeOpacity="0.7"
                strokeWidth="1.1"
                vectorEffect="non-scaling-stroke"
                style={{ opacity: 0, strokeDashoffset: 28 }}
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

        {/* Core label — lands with the ignite ramp so the 3D core (an
            abstract glowing cube on its own) reads immediately as "this is
            the control plane" rather than decoration. Anchored to the same
            52%-down point the icon ring/lines use as their center, but
            placed ABOVE it (not below): the gap to the nearest icons is
            ~21% of stage height above center (AWS/Azure) vs. only ~7% below
            (GCP/Kubernetes) — as overlayFit shrinks the ring toward center
            on narrow phones, that below-center gap collapses first and the
            label visibly crossed through the GCP chip. The above-center gap
            starts wide enough that it stays clear even at overlayFit's 0.6
            floor. */}
        <div
          ref={coreLabelRef}
          className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-16 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blue)] opacity-0"
        >
          {t.intro.coreLabel}
        </div>

        {/* "Translation" — the four capability modules the flows above
            actually feed, so a first-time visitor doesn't have to recognize
            all six logos to get the point. Same labels/accents as the real
            Capability Matrix section further down the page. Wraps to two
            rows on narrow viewports rather than shrinking past legibility.
            `top` is computed (moduleTop above), not a static Tailwind class —
            see that comment for why: it has to track the ring's actual
            radius, not assume a fixed one. */}
        <div
          ref={modulesRef}
          className="absolute left-1/2 flex w-[min(92vw,30rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-x-5 gap-y-2"
          style={{ top: moduleTop }}
        >
          {t.intro.modules.map((label, i) => (
            <span
              key={label}
              className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)] opacity-0"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--color-${MODULE_ACCENTS[i]})` }}
              />
              {label}
            </span>
          ))}
        </div>

        {/* "Result" — the sequence's conclusion: three measurable outcomes,
            verbatim from the site's own case-study data (see the const above)
            so this scene previews real claims rather than decorative stats.
            Sits low, clear of the icon ring above it on every viewport since
            it no longer competes for space with the scroll prompt (already
            faded out by the time this arrives at p≈0.9). Bottom offset is
            larger by default than on `sm:` up: the site's fixed floating
            chat/recruiter pills (bottom-5, ~44px tall) span nearly the full
            width on narrow phones, so a centered outcomes row at the same
            40px offset used on desktop (where the pills sit clear at the
            edges) visibly collided with them. Short/landscape viewports
            (phones where vertical room is scarcer than horizontal) keep the
            tighter offset since the pills don't span center there either. */}
        <div
          ref={outcomesRef}
          className="absolute inset-x-0 bottom-[calc(5.5rem_+_env(safe-area-inset-bottom))] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 sm:bottom-[calc(2.5rem_+_env(safe-area-inset-bottom))] [@media(max-height:520px)]:bottom-[calc(1rem_+_env(safe-area-inset-bottom))]"
        >
          {t.intro.outcomes.map((label) => (
            <span
              key={label}
              className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-fg)] opacity-0"
            >
              {label}
            </span>
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
