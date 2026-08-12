"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Renders a photo as a night-vision "digital decode" portrait — the subject
 * rebuilt out of glowing green glyphs, à la a thermal/Matrix hybrid. Same
 * glyph set as ui/matrix-rain.tsx (the recruiter-scanner backdrop) so the
 * hero photo reads as part of the same hacker-console visual language rather
 * than an unrelated effect.
 *
 * Technique: draw the source photo into a tiny offscreen canvas sized to the
 * character grid (one drawImage call does the cover-fit crop + downsample —
 * cheap, no per-pixel loops over the full-res image), read back per-cell
 * luminance, then paint one glyph per cell on the visible canvas colored by
 * a black → green → white ramp. A low-frequency loop rerolls a small
 * percentage of cells each tick (patching only those cells, not a full
 * redraw) for a subtle "decoding" flicker.
 */

const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>{}=+*#$%&/\\".split("");
const CELL = 9; // px per character cell, CSS pixels

// zoom > 1 crops in tighter than a plain object-fit: cover; focusX/focusY (0-1,
// fractions of the source image) pick the point that stays centered in frame —
// e.g. for a full-body photo, focus on the face instead of the default
// horizontal-center/top-aligned cover crop.
function coverCrop(
  nw: number,
  nh: number,
  cw: number,
  ch: number,
  zoom: number,
  focusX: number,
  focusY: number,
) {
  const s = Math.max(cw / nw, ch / nh) * zoom;
  const sw = Math.min(cw / s, nw);
  const sh = Math.min(ch / s, nh);
  const maxSx = nw - sw;
  const maxSy = nh - sh;
  const sx = Math.max(0, Math.min(maxSx, focusX * nw - sw / 2));
  const sy = Math.max(0, Math.min(maxSy, focusY * nh - sh / 2));
  return { sx, sy, sw, sh };
}

// Luminance (0-1) → rgba string: dark green → brand green → near-white hotspot.
function glyphColor(l: number): string {
  if (l < 0.34) {
    const t = l / 0.34;
    return `rgba(${Math.round(6 + t * 14)},${Math.round(60 + t * 90)},${Math.round(30 + t * 50)},${(0.35 + t * 0.35).toFixed(2)})`;
  }
  if (l < 0.7) {
    const t = (l - 0.34) / 0.36;
    return `rgba(${Math.round(20 + t * 50)},${Math.round(150 + t * 72)},${Math.round(80 + t * 40)},${(0.7 + t * 0.25).toFixed(2)})`;
  }
  const t = Math.min(1, (l - 0.7) / 0.3);
  return `rgba(${Math.round(70 + t * 175)},${Math.round(222 + t * 33)},${Math.round(120 + t * 130)},${(0.95 + t * 0.05).toFixed(2)})`;
}

export function PortraitMatrix({
  src,
  alt,
  className = "",
  zoom = 1,
  focusX = 0.5,
  focusY = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  /** > 1 crops in tighter than object-fit: cover — use to frame a face inside a wider source photo. */
  zoom?: number;
  /** Fraction (0-1) of the source image width/height to keep centered in frame. */
  focusX?: number;
  focusY?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!container || !canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const offscreen = document.createElement("canvas");
    const octx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!octx) return;

    let cols = 0;
    let rows = 0;
    let lum = new Float32Array(0);
    let glyphIdx = new Uint8Array(0);
    let raf = 0;
    let last = 0;
    let ready = false;

    const rnd = (n: number) => (Math.random() * n) | 0;

    const patch = (i: number) => {
      const col = i % cols;
      const row = (i / cols) | 0;
      const x = col * CELL;
      const y = row * CELL;
      ctx.fillStyle = "#000";
      ctx.fillRect(x, y, CELL, CELL);
      const l = lum[i];
      if (l < 0.045) return;
      ctx.fillStyle = glyphColor(l);
      ctx.fillText(GLYPHS[glyphIdx[i]], x, y);
    };

    const drawAll = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
      for (let i = 0; i < cols * rows; i++) patch(i);
    };

    const sample = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!cw || !ch || !img.naturalWidth) return;
      cols = Math.max(1, Math.ceil(cw / CELL));
      rows = Math.max(1, Math.ceil(ch / CELL));

      const { sx, sy, sw, sh } = coverCrop(img.naturalWidth, img.naturalHeight, cw, ch, zoom, focusX, focusY);
      offscreen.width = cols;
      offscreen.height = rows;
      octx.imageSmoothingEnabled = true;
      octx.clearRect(0, 0, cols, rows);
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      const data = octx.getImageData(0, 0, cols, rows).data;

      lum = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      }
      glyphIdx = new Uint8Array(cols * rows);
      for (let i = 0; i < glyphIdx.length; i++) glyphIdx[i] = rnd(GLYPHS.length);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CELL + 2}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";

      ready = true;
      drawAll();
    };

    const frame = (t: number) => {
      if (ready && t - last > 110) {
        last = t;
        const flickerCount = Math.max(8, Math.floor(cols * rows * 0.02));
        for (let n = 0; n < flickerCount; n++) {
          const i = rnd(glyphIdx.length);
          if (lum[i] >= 0.045) {
            glyphIdx[i] = rnd(GLYPHS.length);
            patch(i);
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const onLoad = () => {
      sample();
      if (!reduce) raf = requestAnimationFrame(frame);
    };

    if (img.complete && img.naturalWidth) onLoad();
    else img.addEventListener("load", onLoad);

    const ro = new ResizeObserver(() => sample());
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      img.removeEventListener("load", onLoad);
      ro.disconnect();
    };
  }, [reduce, src, zoom, focusX, focusY]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-black ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt=""
        aria-hidden
        className="sr-only"
        decoding="async"
        loading="eager"
        fetchPriority="high"
      />
      <canvas ref={canvasRef} role="img" aria-label={alt} className="absolute inset-0 h-full w-full" />
      {/* Vignette — fades the grid to black at the edges so the effect reads as a
          lit subject emerging from darkness instead of a hard-edged noise rectangle. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 50% 42%, transparent 45%, rgba(0,0,0,0.55) 78%, #000 100%)",
        }}
      />
    </div>
  );
}
