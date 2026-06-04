"use client";

/**
 * ForceGalaxy — pure SVG radial node-link diagram.
 * Zero dependencies beyond React. Replaces react-force-graph-2d (183KB).
 * Nodes arranged by group in concentric sectors, edges drawn as curved paths.
 */

import { useMemo, useState } from "react";
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
  const W = 520;
  const H = 400;

  const { positions, cx, cy } = useMemo(() => computeLayout(W, H), []);

  const links = LINK_PAIRS.filter(([s, t]) => positions[s] && positions[t]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`h-full w-full ${className}`}
      role="img"
      aria-label="Technology stack graph"
      style={{ overflow: "visible" }}
    >
      {/* ── Edges ──────────────────────────────────────────────────── */}
      {links.map(([s, t]) => {
        const ps = positions[s];
        const pt = positions[t];
        const sGroup = ps.group;
        const accent = ACCENT[galaxyGroups[sGroup]?.accent ?? "blue"];
        const dim = Boolean((activeGroup || hovered) &&
          activeGroup !== sGroup && hovered !== s && hovered !== t);
        return (
          <path
            key={`${s}-${t}`}
            d={quadraticPath(ps.x, ps.y, pt.x, pt.y, cx, cy)}
            stroke={accent}
            strokeWidth={0.8}
            strokeOpacity={dim ? 0.04 : 0.18}
            fill="none"
          />
        );
      })}

      {/* ── Nodes ──────────────────────────────────────────────────── */}
      {galaxy.map((node) => {
        const pos = positions[node.id];
        if (!pos) return null;
        const accent = ACCENT[galaxyGroups[node.group]?.accent ?? "blue"];
        const isActive = hovered === node.id || activeGroup === node.group;
        const dim = Boolean((activeGroup || hovered) && !isActive);
        const r = isActive ? 5.5 : 3.5;

        return (
          <g
            key={node.id}
            style={{ cursor: "default" }}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
            opacity={dim ? 0.18 : 1}
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
    </svg>
  );
}
