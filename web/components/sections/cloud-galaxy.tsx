"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/sections/section";
import { galaxy, galaxyGroups } from "@/lib/site-config";

const ACCENT: Record<string, string> = {
  blue: "var(--color-blue)",
  cyan: "var(--color-cyan)",
  orange: "var(--color-orange)",
};

export function CloudGalaxy() {
  const [active, setActive] = useState<string | null>(null);

  // Lay nodes on a ring; the hub sits at the center.
  const nodes = useMemo(() => {
    const cx = 250;
    const cy = 200;
    const rx = 210;
    const ry = 150;
    return galaxy.map((g, i) => {
      const a = (i / galaxy.length) * Math.PI * 2 - Math.PI / 2;
      return { ...g, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
    });
  }, []);

  return (
    <Section
      id="stack"
      label="Multi-Cloud Architecture Map"
      title="An engineering galaxy, not a list of badges"
      intro="Hover a domain to trace how the platform connects — clouds, orchestration, CI/CD, data and FinOps."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel relative overflow-hidden rounded-lg">
          <svg viewBox="0 0 500 400" className="h-full w-full">
            {nodes.map((n) => {
              const dim =
                active && active !== n.group ? 0.18 : 1;
              const color = ACCENT[galaxyGroups[n.group].accent];
              return (
                <line
                  key={`l-${n.id}`}
                  x1={250}
                  y1={200}
                  x2={n.x}
                  y2={n.y}
                  stroke={color}
                  strokeWidth={active === n.group ? 1.4 : 0.7}
                  strokeOpacity={dim * 0.4}
                />
              );
            })}
            {/* hub */}
            <circle cx={250} cy={200} r={5} fill="var(--color-fg)" />
            <circle
              cx={250}
              cy={200}
              r={14}
              fill="none"
              stroke="var(--color-hairline-strong)"
            />
            {nodes.map((n) => {
              const isActive = active === n.group;
              const dim = active && !isActive ? 0.25 : 1;
              const color = ACCENT[galaxyGroups[n.group].accent];
              return (
                <g
                  key={n.id}
                  opacity={dim}
                  onMouseEnter={() => setActive(n.group)}
                  onMouseLeave={() => setActive(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isActive ? 6 : 4}
                    fill={color}
                  />
                  <text
                    x={n.x}
                    y={n.y - 10}
                    textAnchor="middle"
                    className="fill-[var(--color-fg-muted)] font-mono"
                    style={{ fontSize: 9 }}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex flex-col justify-center gap-2">
          {Object.entries(galaxyGroups).map(([key, g]) => (
            <button
              key={key}
              type="button"
              onMouseEnter={() => setActive(key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(key)}
              onBlur={() => setActive(null)}
              className={`panel flex items-center justify-between rounded-md px-4 py-3 text-left transition-colors ${
                active === key ? "border-[var(--color-hairline-strong)]" : ""
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: ACCENT[g.accent] }}
                />
                <span className="text-sm text-[var(--color-fg)]">{g.label}</span>
              </span>
              <span className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
                {galaxy.filter((n) => n.group === key).length}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}
