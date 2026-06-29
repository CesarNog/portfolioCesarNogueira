"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen digital-rain backdrop for the recruiter scanner overlay.
 *
 * Not the cliché lime-green Matrix screensaver: glyphs fall in the brand's own
 * domain accents (availability green, platform cyan, architecture blue) so the
 * effect reads as "system scanning" rather than costume. Canvas 2D, single RAF
 * loop, device-pixel-ratio aware. Honors reduced motion with a faint static
 * frame instead of animation, and tears the loop down the moment it unmounts.
 */

const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789</>{}=$#%&*+".split("");
// rgb triples — keep in sync with --color-ok / --color-cyan / --color-blue
const COLORS = ["52,211,153", "34,184,196", "59,130,246"] as const;
const FONT_SIZE = 16;

export function MatrixRain({
  active,
  opacity = 0.5,
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
    let cols = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    let raf = 0;

    const setFont = () => { ctx.font = `${FONT_SIZE}px "Geist Mono", ui-monospace, monospace`; };

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setFont();
      cols = Math.max(1, Math.floor(W / FONT_SIZE));
      drops = Array.from({ length: cols }, () => (Math.random() * -H) / FONT_SIZE);
      speeds = Array.from({ length: cols }, () => 0.45 + Math.random() * 0.75);
    };

    const rnd = (n: number) => (Math.random() * n) | 0;

    const staticFrame = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 0.14;
      for (let i = 0; i < cols; i++) {
        ctx.fillStyle = `rgb(${COLORS[i % 3]})`;
        ctx.fillText(GLYPHS[rnd(GLYPHS.length)], i * FONT_SIZE, rnd(H));
      }
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      // Translucent wash leaves the fading vertical trail characteristic of the effect.
      ctx.fillStyle = "rgba(8,9,12,0.11)";
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < cols; i++) {
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;
        const g = GLYPHS[rnd(GLYPHS.length)];
        ctx.fillStyle = `rgb(${COLORS[i % 3]})`;
        ctx.fillText(g, x, y);
        // Bright near-white leading glyph, sparsely, for the falling "head".
        if (Math.random() > 0.972) {
          ctx.fillStyle = "rgba(237,240,243,0.92)";
          ctx.fillText(g, x, y);
        }
        if (y > H && Math.random() > 0.974) drops[i] = rnd(20) * -1;
        drops[i] += speeds[i];
      }
      raf = requestAnimationFrame(frame);
    };

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    if (prefersReduce) {
      staticFrame();
    } else {
      raf = requestAnimationFrame(frame);
    }

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
      style={{ opacity }}
    />
  );
}
