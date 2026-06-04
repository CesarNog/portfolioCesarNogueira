"use client";

/**
 * ForceGalaxy — pure SVG radial node-link diagram.
 * Zero dependencies beyond React. Replaces react-force-graph-2d (183KB).
 * Nodes arranged by group in concentric sectors, edges drawn as curved paths.
 */

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { galaxy, galaxyGroups } from "@/lib/site-config";

const LINK_PAIRS: [string, string][] = [
  ["gcp", "k8s"], ["aws", "k8s"], ["azure", "k8s"],
  ["k8s", "argo"], ["k8s", "docker"],
  ["gha", "argo"], ["gitlab", "k8s"], ["jenkins", "k8s"],
  ["gcp", "bigquery"], ["gcp", "dataform"], ["gcp", "beam"],
  ["bigquery", "dbt"], ["beam", "dataform"],
  ["finops", "gcp"], ["finops", "aws"], ["finops", "azure"],
  ["obs", "finops"],
  ["python", "beam"], ["python", "finops"], ["python", "obs"],
  ["terraform", "gcp"], ["terraform", "aws"], ["terraform", "azure"],
  ["oci", "terraform"],
  ["gha", "terraform"], ["gitlab", "terraform"],
];

const ACCENT: Record<string, string> = {
  blue:   "var(--color-blue)",
  cyan:   "var(--color-cyan)",
  orange: "var(--color-orange)",
};

// Groups and their radial sector angles
const GROUP_ORDER = ["cloud", "platform", "cicd", "data", "finops", "code"];

function computeLayout(W: number, H: number) {
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) * 0.38;

  const groups = GROUP_ORDER;
  const sectorAngle = (2 * Math.PI) / groups.length;

  const positions: Record<string, { x: number; y: number; group: string }> = {};

  groups.forEach((group, gi) => {
    const groupNodes = galaxy.filter(n => n.group === group);
    const basAngle = gi * sectorAngle - Math.PI / 2;
    groupNodes.forEach((node, ni) => {
      const spread = (ni - (groupNodes.length - 1) / 2) * 0.22;
      const angle = basAngle + spread;
      const r = R + (ni % 2 === 0 ? 0 : 18);
      positions[node.id] = {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        group: node.group,
      };
    });
  });

  return { positions, cx, cy };
}

function quadraticPath(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number): string {
  // Control point pulled slightly toward center for a gentle curve
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const qx = mx + (cx - mx) * 0.15;
  const qy = my + (cy - my) * 0.15;
  return `M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}`;
}

export function ForceGalaxy({
  className = "",
  activeGroup,
}: {
  className?: string;
  activeGroup?: string | null;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 520;
  const H = 400;

  // On mobile (≤768px) cap nodes to reduce DOM count below 1000
  const visibleGalaxy = useMemo(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      // Keep one representative node per group — prioritise high-value nodes
      const seen = new Set<string>();
      return galaxy.filter(n => {
        if (seen.has(n.group)) return false;
        seen.add(n.group);
        return true;
      });
    }
    return galaxy;
  }, []);

  const { positions, cx, cy } = useMemo(() => computeLayout(W, H), []);
  const links = LINK_PAIRS.filter(([s, t]) => positions[s] && positions[t]);

  // Trigger stagger reveal once on first viewport entry
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * delta)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = (e.clientX - lastPos.current.x) / zoom;
    const dy = (e.clientY - lastPos.current.y) / zoom;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  };
  const handlePointerUp = () => { dragging.current = false; };

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className}`} style={{ overflow: "hidden" }}>
      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1" aria-label="Zoom controls">
        <button
          type="button"
          onClick={() => setZoom(z => Math.min(MAX_ZOOM, z * 1.25))}
          aria-label="Zoom in"
          className="flex h-7 w-7 items-center justify-center rounded border border-[var(--color-hairline)] bg-[var(--color-surface-1)] font-mono text-[13px] text-[var(--color-fg-subtle)] transition-colors hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-fg)]"
        >+</button>
        <button
          type="button"
          onClick={() => setZoom(z => Math.max(MIN_ZOOM, z * 0.8))}
          aria-label="Zoom out"
          className="flex h-7 w-7 items-center justify-center rounded border border-[var(--color-hairline)] bg-[var(--color-surface-1)] font-mono text-[13px] text-[var(--color-fg-subtle)] transition-colors hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-fg)]"
        >−</button>
        {(zoom !== 1 || pan.x !== 0 || pan.y !== 0) && (
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset view"
            className="flex h-7 w-7 items-center justify-center rounded border border-[var(--color-hairline)] bg-[var(--color-surface-1)] font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)] transition-colors hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-fg)]"
          >↺</button>
        )}
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        role="img"
        aria-label="Technology stack graph — scroll to zoom, drag to pan"
        style={{ overflow: "visible", cursor: dragging.current ? "grabbing" : "grab", touchAction: "none" }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
      <g transform={`scale(${zoom}) translate(${pan.x} ${pan.y})`}>
      {/* ── Edges ──────────────────────────────────────────────────── */}
      {links.map(([s, t], idx) => {
        const ps = positions[s];
        const pt = positions[t];
        const sGroup = ps.group;
        const accent = ACCENT[galaxyGroups[sGroup]?.accent ?? "blue"];
        const dim = Boolean((activeGroup || hovered) &&
          activeGroup !== sGroup && hovered !== s && hovered !== t);
        const delay = `${300 + idx * 12}ms`;
        return (
          <path
            key={`${s}-${t}`}
            d={quadraticPath(ps.x, ps.y, pt.x, pt.y, cx, cy)}
            stroke={accent}
            strokeWidth={0.8}
            strokeOpacity={revealed ? (dim ? 0.04 : 0.18) : 0}
            fill="none"
            style={{
              transition: revealed ? `stroke-opacity 0.5s ease-out ${delay}` : "none",
            }}
          />
        );
      })}

      {/* ── Nodes ──────────────────────────────────────────────────── */}
      {visibleGalaxy.map((node, idx) => {
        const pos = positions[node.id];
        if (!pos) return null;
        const accent = ACCENT[galaxyGroups[node.group]?.accent ?? "blue"];
        const isActive = hovered === node.id || activeGroup === node.group;
        const dim = Boolean((activeGroup || hovered) && !isActive);
        const r = isActive ? 5.5 : 3.5;
        const delay = `${(idx * 22)}ms`;

        return (
          <g
            key={node.id}
            style={{
              cursor: "default",
              opacity: revealed ? (dim ? 0.18 : 1) : 0,
              transform: revealed ? "scale(1)" : "scale(0.4)",
              transformOrigin: `${pos.x}px ${pos.y}px`,
              transition: revealed
                ? `opacity 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}`
                : "none",
            }}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Halo */}
            {isActive && (
              <circle cx={pos.x} cy={pos.y} r={r + 5} fill={accent} opacity={0.15} />
            )}
            {/* Main dot */}
            <circle cx={pos.x} cy={pos.y} r={r} fill={accent} />
            {/* Label */}
            <text
              x={pos.x}
              y={pos.y + r + 11}
              textAnchor="middle"
              style={{
                fontSize: isActive ? 9 : 8,
                fill: isActive ? "var(--color-fg)" : "var(--color-fg-subtle)",
                fontFamily: "monospace",
                pointerEvents: "none",
              }}
            >
              {node.label}
            </text>
          </g>
        );
      })}
      </g>
    </svg>
    </div>
  );
}
