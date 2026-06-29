"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen digital-rain backdrop for the recruiter scanner overlay.
 *
 * Pseudo-3D depth field: every column is assigned a depth (z). Near columns
 * render larger, brighter and fall faster; far columns are smaller, dimmer and
 * slower. Drawing far-to-near each frame layers the planes, so the rain reads
 * as a 3D volume rather than a flat sheet, without pulling in a WebGL engine
 * (single Canvas 2D RAF loop, ~60fps, no dependencies).
 *
 * Brand-tinted glyphs (availability green, platform cyan, architecture blue),
 * not the cliché lime Matrix screensaver. Fully black backdrop. Honors reduced
 * motion with a faint static frame, and tears the loop down on unmount.
 */

const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789</>{}=$#%&*+".split("");
// rgb triples — keep in sync with --color-ok / --color-cyan / --color-blue
const COLORS = ["52,211,153", "34,184,196", "59,130,246"] as const;
const BASE_FONT = 15; // px at depth 1.0

export function MatrixRain({
  active,
  opacity = 0.6,
  reduce = false,
}: {
  active: boolean;
  opacity?: number;
  reduce?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduce =
      reduce ||
      (typeof window !== "undefined" &&
        (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
          document.documentElement.getAttribute("data-reduce-motion") === "1"));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;

    // Per-column state. order[] holds column indices sorted far->near so nearer
    // (brighter/larger) planes paint over farther ones.
    type Col = { x: number; y: number; depth: number; font: number; speed: number; alpha: number; color: string };
    let cols: Col[] = [];
    let order: number[] = [];

    const rnd = (n: number) => (Math.random() * n) | 0;

    const build = () => {
      const spacing = BASE_FONT; // base column pitch
      const count = Math.max(1, Math.ceil(W / spacing) + 6);
      cols = Array.from({ length: count }, (_, i) => {
        const depth = 0.45 + Math.random() * 0.95; // 0.45 (far) .. 1.40 (near)
        return {
          x: i * spacing + (Math.random() * 6 - 3),
          y: (Math.random() * -H) / BASE_FONT,
          depth,
          font: Math.max(7, Math.round(BASE_FONT * depth)),
          speed: 0.35 + depth * 0.95,
          alpha: 0.22 + ((depth - 0.45) / 0.95) * 0.72,
          color: COLORS[i % 3],
        };
      });
      order = cols.map((_, i) => i).sort((a, b) => cols[a].depth - cols[b].depth);
    };

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const staticFrame = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      for (const i of order) {
        const c = cols[i];
        ctx.font = `${c.font}px "Geist Mono", ui-monospace, monospace`;
        ctx.fillStyle = `rgba(${c.color},${(c.alpha * 0.5).toFixed(3)})`;
        ctx.fillText(GLYPHS[rnd(GLYPHS.length)], c.x, rnd(H));
      }
    };

    const frame = () => {
      // Black trail wash leaves the fading vertical streaks.
      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.fillRect(0, 0, W, H);
      for (const i of order) {
        const c = cols[i];
        const y = c.y * BASE_FONT;
        const g = GLYPHS[rnd(GLYPHS.length)];
        ctx.font = `${c.font}px "Geist Mono", ui-monospace, monospace`;
        ctx.fillStyle = `rgba(${c.color},${c.alpha.toFixed(3)})`;
        ctx.fillText(g, c.x, y);
        // Bright near-white leading glyph; brighter on nearer columns.
        if (Math.random() > 0.965) {
          ctx.fillStyle = `rgba(237,240,243,${(c.alpha).toFixed(3)})`;
          ctx.fillText(g, c.x, y);
        }
        if (y > H && Math.random() > 0.975) c.y = rnd(20) * -1;
        c.y += c.speed;
      }
      raf = requestAnimationFrame(frame);
    };

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    if (prefersReduce) staticFrame();
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [active, reduce]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{ opacity, background: "#000" }}
    />
  );
}
