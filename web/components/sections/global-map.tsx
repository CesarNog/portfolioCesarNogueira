"use client";

import { m, useReducedMotion } from "motion/react";
import { Section } from "@/components/sections/section";
import { globalPresence } from "@/lib/site-config";

const W = 100;
const H = 50;

// Equirectangular projection into the viewBox.
function project(lat: number, lon: number) {
  return {
    x: ((lon + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  };
}

export function GlobalMap() {
  const reduce = useReducedMotion();
  const hub = globalPresence.markers.find((marker) => marker.hub)!;
  const hubPt = project(hub.lat, hub.lon);

  return (
    <Section
      id="global"
      label="Global Delivery Map"
      title="Senior cloud delivery, wherever you operate"
      intro="A decade of work across Europe and the Americas — delivered on-site and fully remote."
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="panel relative overflow-hidden rounded-lg p-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="World map of delivery regions">
            {/* Graticule */}
            <g stroke="var(--color-hairline)" strokeWidth={0.15}>
              {Array.from({ length: 9 }, (_, i) => (
                <line key={`v${i}`} x1={(i + 1) * 10} y1={0} x2={(i + 1) * 10} y2={H} />
              ))}
              {Array.from({ length: 4 }, (_, i) => (
                <line key={`h${i}`} x1={0} y1={(i + 1) * 10} x2={W} y2={(i + 1) * 10} />
              ))}
            </g>

            {/* Region labels */}
            {globalPresence.regions.map((r) => (
              <text
                key={r.label}
                x={r.x}
                y={r.y}
                textAnchor="middle"
                className="fill-[var(--color-fg-subtle)] font-mono uppercase"
                style={{ fontSize: 2, letterSpacing: 0.2 }}
              >
                {r.label}
              </text>
            ))}

            {/* Arcs from hub to every region */}
            {globalPresence.markers
              .filter((marker) => !marker.hub)
              .map((marker, i) => {
                const p = project(marker.lat, marker.lon);
                const mx = (hubPt.x + p.x) / 2;
                const my = (hubPt.y + p.y) / 2 - Math.hypot(p.x - hubPt.x, p.y - hubPt.y) * 0.28;
                const d = `M ${hubPt.x} ${hubPt.y} Q ${mx} ${my} ${p.x} ${p.y}`;
                return (
                  <m.path
                    key={marker.id}
                    d={d}
                    fill="none"
                    stroke="var(--color-blue)"
                    strokeWidth={0.3}
                    strokeOpacity={0.55}
                    initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                    whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.2 + i * 0.15, ease: "easeOut" }}
                  />
                );
              })}

            {/* Markers */}
            {globalPresence.markers.map((marker, i) => {
              const p = project(marker.lat, marker.lon);
              return (
                <g key={marker.id}>
                  {marker.hub && (
                    <m.circle
                      cx={p.x}
                      cy={p.y}
                      r={1.6}
                      fill="none"
                      stroke="var(--color-ok)"
                      strokeWidth={0.3}
                      initial={reduce ? false : { scale: 0.5, opacity: 0.8 }}
                      animate={reduce ? undefined : { scale: 2.4, opacity: 0 }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                      style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                    />
                  )}
                  <m.circle
                    cx={p.x}
                    cy={p.y}
                    r={marker.hub ? 1.3 : 1}
                    fill={marker.hub ? "var(--color-ok)" : "var(--color-blue)"}
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  />
                  <text
                    x={p.x}
                    y={p.y - 2}
                    textAnchor="middle"
                    className="fill-[var(--color-fg-muted)] font-mono"
                    style={{ fontSize: 2 }}
                  >
                    {marker.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <ul className="flex flex-col justify-center gap-2.5">
          {globalPresence.markers.map((marker) => (
            <li key={marker.id} className="flex items-start gap-3 panel rounded-md px-4 py-2.5">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  marker.hub ? "bg-[var(--color-ok)]" : "bg-[var(--color-blue)]"
                }`}
                aria-hidden
              />
              <div>
                <p className="text-sm text-[var(--color-fg)]">{marker.label}</p>
                <p className="font-mono text-[11px] text-[var(--color-fg-subtle)]">{marker.city}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
