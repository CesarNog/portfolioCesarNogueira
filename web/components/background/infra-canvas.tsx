"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Vec2 = [number, number];

interface ContourBand {
  baseY: number;
  waves: Array<{ amp: number; freq: number; phase: number; speed: number }>;
  opacity: number;
  lineWidth: number;
}

interface RouteTrace {
  pts: Vec2[];
  drawn: number;
  alpha: number;
  phase: "drawing" | "holding" | "fading" | "done";
  drawSpeed: number;
  holdTime: number;
  fadeSpeed: number;
  held: number;
  pulseAge: number;   // seconds since arriving at destination
}

// ─── Route definitions (normalized 0–1 screen coords) ────────────────────────
// Inspired by submarine cable routes and global network backbone paths.

const ROUTES: Array<[Vec2, Vec2, Vec2, Vec2]> = [
  [[0.08, 0.32], [0.22, 0.12], [0.40, 0.10], [0.60, 0.28]],  // EU → US East
  [[0.12, 0.38], [0.18, 0.16], [0.36, 0.08], [0.65, 0.32]],  // EU → US West
  [[0.55, 0.30], [0.66, 0.22], [0.78, 0.24], [0.90, 0.38]],  // EU → Asia
  [[0.62, 0.30], [0.56, 0.45], [0.52, 0.58], [0.48, 0.70]],  // US → LATAM
  [[0.55, 0.34], [0.58, 0.48], [0.60, 0.60], [0.62, 0.68]],  // EU → MEA
  [[0.88, 0.42], [0.90, 0.54], [0.86, 0.64], [0.80, 0.72]],  // Asia → AU
  [[0.06, 0.44], [0.22, 0.38], [0.38, 0.40], [0.56, 0.44]],  // Atlantic backbone
  [[0.18, 0.28], [0.30, 0.20], [0.52, 0.18], [0.72, 0.26]],  // North Atlantic
];

function cubicBezier(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return [
    mt2 * mt * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t2 * t * p3[0],
    mt2 * mt * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t2 * t * p3[1],
  ];
}

function sampleRoute(route: [Vec2, Vec2, Vec2, Vec2], n = 80): Vec2[] {
  return Array.from({ length: n + 1 }, (_, i) => cubicBezier(...route, i / n));
}

// ─── Band generation ──────────────────────────────────────────────────────────

function makeBands(mobile: boolean): ContourBand[] {
  const count = mobile ? 5 : 8;
  return Array.from({ length: count }, (_, i) => ({
    baseY: 0.04 + (i / (count - 1)) * 0.92,
    waves: [
      { amp: 0.022, freq: 0.7,  phase: Math.random() * Math.PI * 2, speed: 0.016 + Math.random() * 0.010 },
      { amp: 0.012, freq: 1.9,  phase: Math.random() * Math.PI * 2, speed: 0.022 + Math.random() * 0.012 },
      { amp: 0.006, freq: 3.8,  phase: Math.random() * Math.PI * 2, speed: 0.038 + Math.random() * 0.018 },
    ],
    opacity: 0.028 + Math.random() * 0.022,
    lineWidth: 0.6 + Math.random() * 0.7,
  }));
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InfraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = () => window.innerWidth < 768;
    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    // Mutable state — never triggers React re-renders
    const state = {
      bands: makeBands(isMobile()),
      routes: [] as RouteTrace[],
      nextRoute: 3 + Math.random() * 4,
      cursor: { x: -1, y: -1, inHero: false },
      scroll: window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
      last: 0,
      raf: 0,
    };

    // ── Resize ────────────────────────────────────────────────────────────────
    const resize = () => {
      const d = dpr();
      canvas.width  = window.innerWidth  * d;
      canvas.height = window.innerHeight * d;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(d, d);
      state.bands = makeBands(isMobile());
    };
    resize();

    // ── Draw loop ─────────────────────────────────────────────────────────────
    const draw = (ts: number) => {
      state.raf = requestAnimationFrame(draw);

      const now = ts / 1000;
      const dt = state.last ? Math.min(now - state.last, 0.05) : 0;
      state.last = now;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const mobile = isMobile();
      const isDark = !document.documentElement.classList.contains("light");

      ctx.clearRect(0, 0, W, H);

      // ── Layer 1.5: Subtle grid — hero zone only ───────────────────────────
      if (!mobile) {
        const GRID = 52;
        const gridAlpha = isDark ? 0.022 : 0.016;
        ctx.strokeStyle = isDark ? `rgba(96,165,250,${gridAlpha})` : `rgba(30,111,224,${gridAlpha})`;
        ctx.lineWidth = 0.4;
        ctx.setLineDash([]);
        const gridH = H * 0.72;
        // Vertical lines
        for (let x = 0; x < W; x += GRID) {
          const a = Math.max(0, 1 - x / (W * 0.6));
          if (a < 0.01) continue;
          ctx.globalAlpha = a;
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, gridH); ctx.stroke();
        }
        // Horizontal lines
        for (let y = 0; y < gridH; y += GRID) {
          const a = Math.max(0, 1 - y / gridH);
          ctx.globalAlpha = a * 0.6;
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W * 0.55, y); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // ── Layer 2: Topographic contour lines ──────────────────────────────────
      const steps = mobile ? 80 : 180;

      for (const band of state.bands) {
        for (const w of band.waves) w.phase += w.speed * dt;

        // Cursor proximity boost — only when in hero viewport region
        let boost = 1;
        if (!mobile && state.cursor.inHero && state.cursor.x >= 0) {
          const bandY = band.baseY * H;
          const dy = Math.abs(state.cursor.y - bandY);
          if (dy < 140) boost = 1 + (1 - dy / 140) * 1.4;
        }

        // Slight scroll parallax — different speeds per band to suggest depth
        const parallax = state.scroll * band.baseY * 0.06;

        const baseAlpha = isDark ? band.opacity : band.opacity * 1.3;
        ctx.beginPath();
        ctx.lineWidth = band.lineWidth;
        ctx.strokeStyle = isDark
          ? `rgba(96,165,250,${baseAlpha * boost})`
          : `rgba(30,111,224,${baseAlpha * boost * 0.65})`;
        ctx.setLineDash([]);

        for (let i = 0; i <= steps; i++) {
          const nx = i / steps;
          let dy = 0;
          for (const w of band.waves) dy += w.amp * Math.sin(nx * Math.PI * 2 * w.freq + w.phase);
          const x = nx * W;
          const y = (band.baseY + dy - parallax) * H;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // ── Layer 3: Route traces ───────────────────────────────────────────────
      state.nextRoute -= dt;
      const activeRoutes = state.routes.filter(r => r.phase !== "done");

      if (state.nextRoute <= 0 && activeRoutes.length < 2) {
        const def = ROUTES[Math.floor(Math.random() * ROUTES.length)];
        state.routes.push({
          pts: sampleRoute(def, mobile ? 50 : 80),
          drawn: 0,
          alpha: 0,
          phase: "drawing",
          drawSpeed: 0.14 + Math.random() * 0.08,
          holdTime: 1.8 + Math.random() * 2.2,
          fadeSpeed: 0.32,
          held: 0,
          pulseAge: 0,
        });
        state.nextRoute = 5 + Math.random() * 6;
      }
      state.routes = state.routes.filter(r => r.phase !== "done");

      for (const route of state.routes) {
        // Advance phase
        if (route.phase === "drawing") {
          route.drawn  = Math.min(1, route.drawn + route.drawSpeed * dt);
          route.alpha  = Math.min(1, route.alpha + 3 * dt);
          if (route.drawn >= 1) route.phase = "holding";
        } else if (route.phase === "holding") {
          route.held += dt;
          if (route.held >= route.holdTime) route.phase = "fading";
        } else if (route.phase === "fading") {
          route.alpha = Math.max(0, route.alpha - route.fadeSpeed * dt);
          if (route.alpha <= 0) { route.phase = "done"; continue; }
        }

        const endIdx = Math.floor(route.drawn * (route.pts.length - 1));
        if (endIdx < 1) continue;

        const routeAlpha = (isDark ? 0.20 : 0.16) * route.alpha;

        // Route line
        ctx.beginPath();
        ctx.lineWidth = 0.65;
        ctx.strokeStyle = `rgba(96,165,250,${routeAlpha})`;
        ctx.setLineDash([]);
        for (let i = 0; i <= endIdx; i++) {
          const [nx, ny] = route.pts[i];
          i === 0 ? ctx.moveTo(nx * W, ny * H) : ctx.lineTo(nx * W, ny * H);
        }
        ctx.stroke();

        // Origin node
        const [ox, oy] = route.pts[0];
        ctx.beginPath();
        ctx.arc(ox * W, oy * H, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${0.55 * route.alpha})`;
        ctx.fill();

        // Travelling head (drawing phase only)
        if (route.phase === "drawing") {
          const [hx, hy] = route.pts[endIdx];
          // Inner dot
          ctx.beginPath();
          ctx.arc(hx * W, hy * H, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147,197,253,${0.9 * route.alpha})`;
          ctx.fill();
          // Soft halo
          const grad = ctx.createRadialGradient(hx * W, hy * H, 0, hx * W, hy * H, 9);
          grad.addColorStop(0, `rgba(96,165,250,${0.10 * route.alpha})`);
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(hx * W, hy * H, 9, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Destination node + arrival pulse ring
        if (route.phase !== "drawing") {
          const [ex, ey] = route.pts[route.pts.length - 1];
          ctx.beginPath();
          ctx.arc(ex * W, ey * H, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96,165,250,${0.5 * route.alpha})`;
          ctx.fill();

          // Expanding pulse ring — plays once on arrival, then stops
          route.pulseAge += dt;
          const PULSE_DUR = 1.4;
          if (route.pulseAge < PULSE_DUR) {
            const p = route.pulseAge / PULSE_DUR;
            const pr = p * 18;
            const pa = (1 - p) * 0.18 * route.alpha;
            ctx.beginPath();
            ctx.arc(ex * W, ey * H, pr, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(96,165,250,${pa})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    // ── Event listeners ───────────────────────────────────────────────────────
    const onResize = () => {
      resize();
      ctx.scale(dpr(), dpr()); // reset scale after canvas resize
    };

    const onScroll = () => {
      state.scroll = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    };

    const onMouseMove = (e: MouseEvent) => {
      state.cursor.x = e.clientX;
      state.cursor.y = e.clientY;
      state.cursor.inHero = e.clientY < window.innerHeight * 1.05;
    };

    const onMouseLeave = () => { state.cursor.x = -1; state.cursor.y = -1; };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(state.raf);
      } else {
        state.last = 0;
        state.raf = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);

    state.raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  if (reduce) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 10% 0%, rgba(59,130,246,0.05) 0%, transparent 70%)" }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
