"use client";

import { useEffect, useRef } from "react";

/**
 * Living infrastructure background: drifting network nodes, service connections
 * and faint telemetry pulses on a single canvas. Lightweight (capped DPR + node
 * count, pauses when off-screen) and fully static under prefers-reduced-motion.
 */
export function InfraBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 26 : 54;

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      nodes = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.8,
      }));
    };

    const css = (v: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#2e8bff";

    const draw = (t: number) => {
      const blue = css("--color-blue");
      const cyan = css("--color-cyan");
      ctx.clearRect(0, 0, w, h);
      const LINK = isMobile ? 120 : 150;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.16;
            ctx.strokeStyle = `rgba(120,150,190,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // Telemetry pulse travelling along the link.
            if (!reduce && d < LINK * 0.7) {
              const p = (Math.sin(t * 0.0012 + i * 0.6 + j) + 1) / 2;
              const px = a.x + (b.x - a.x) * p;
              const py = a.y + (b.y - a.y) * p;
              ctx.fillStyle = `rgba(37,214,224,${alpha * 2.2})`;
              ctx.beginPath();
              ctx.arc(px, py, 1.1, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = n.r > 1.8 ? cyan : blue;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    init();
    draw(0);
    if (!reduce) raf = requestAnimationFrame(loop);

    const onResize = () => {
      resize();
      init();
      draw(0);
    };
    window.addEventListener("resize", onResize);

    // Pause when the tab/section is hidden to save battery.
    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        if (running && !reduce) raf = requestAnimationFrame(loop);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export default InfraBackground;
