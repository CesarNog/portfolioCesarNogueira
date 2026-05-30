"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { galaxy, galaxyGroups } from "@/lib/site-config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false }) as any;

const ACCENT: Record<string, string> = {
  blue: "#2e8bff",
  cyan: "#25d6e0",
  orange: "#ff8a3d",
};

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

type GNode = {
  id: string;
  label: string;
  group: string;
  color: string;
  x?: number;
  y?: number;
};

type GLink = {
  source: string | GNode;
  target: string | GNode;
};

export function ForceGalaxy({
  className = "",
  activeGroup,
}: {
  className?: string;
  activeGroup?: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const graphData = {
    nodes: galaxy.map((n) => ({
      id: n.id,
      label: n.label,
      group: n.group,
      color: ACCENT[galaxyGroups[n.group].accent],
    })),
    links: LINK_PAIRS.map(([s, t]) => ({ source: s, target: t })),
  };

  const paintNode = useCallback(
    (node: GNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const highlight = hovered === node.id || activeGroup === node.group;
      const dim = Boolean((activeGroup || hovered) && !highlight);
      const r = highlight ? 5.5 : 3.5;

      ctx.globalAlpha = dim ? 0.2 : 1;

      ctx.beginPath();
      ctx.arc(node.x ?? 0, node.y ?? 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();

      if (highlight) {
        ctx.beginPath();
        ctx.arc(node.x ?? 0, node.y ?? 0, r + 4, 0, 2 * Math.PI);
        ctx.strokeStyle = node.color + "44";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      const fontSize = Math.max(9 / globalScale, 7);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = highlight ? "#e8edf2" : "#8a97a6";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(node.label, node.x ?? 0, (node.y ?? 0) + r + 3);
      ctx.globalAlpha = 1;
    },
    [hovered, activeGroup],
  );

  const paintPointer = useCallback(
    (node: GNode, paintColor: string, ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = paintColor;
      ctx.beginPath();
      ctx.arc(node.x ?? 0, node.y ?? 0, 12, 0, 2 * Math.PI);
      ctx.fill();
    },
    [],
  );

  const getLinkColor = useCallback(
    (link: GLink) => {
      const src = typeof link.source === "object"
        ? (link.source as GNode).group ?? "cloud"
        : "cloud";
      const color = ACCENT[galaxyGroups[src]?.accent ?? "blue"] ?? "#2e8bff";
      return color + "22";
    },
    [],
  );

  return (
    <div ref={containerRef} className={`h-full w-full ${className}`}>
      {dims.w > 0 && (
        <ForceGraph2D
          graphData={graphData}
          width={dims.w}
          height={dims.h}
          backgroundColor="transparent"
          nodeCanvasObject={paintNode}
          nodeCanvasObjectMode={() => "replace"}
          nodePointerAreaPaint={paintPointer}
          linkColor={getLinkColor}
          linkWidth={0.8}
          linkDirectionalParticles={reduce ? 0 : 2}
          linkDirectionalParticleWidth={1.5}
          linkDirectionalParticleSpeed={0.004}
          linkDirectionalParticleColor={(link: GLink) => {
            const src = typeof link.source === "object"
              ? (link.source as GNode).group ?? "cloud"
              : "cloud";
            return ACCENT[galaxyGroups[src]?.accent ?? "blue"] ?? "#2e8bff";
          }}
          cooldownTicks={reduce ? 0 : 100}
          onNodeHover={(node: GNode | null) => setHovered(node ? node.id : null)}
          enableZoomInteraction
          enablePanInteraction
        />
      )}
    </div>
  );
}
