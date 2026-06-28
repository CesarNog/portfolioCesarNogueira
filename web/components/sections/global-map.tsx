"use client";

import { useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { Section } from "@/components/sections/section";
import { globalPresence } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

const W = 100;
const H = 52;

function project(lat: number, lon: number) {
  return {
    x: ((lon + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  };
}

type Region = "all" | "europe" | "americas";
type DeliveryType = "all" | "Remote" | "On-site" | "Hybrid";

const FILTER_REGION: { label: string; value: Region }[] = [
  { label: "All", value: "all" },
  { label: "Europe", value: "europe" },
  { label: "Americas", value: "americas" },
];

const FILTER_TYPE: { label: string; value: DeliveryType }[] = [
  { label: "Remote", value: "Remote" },
  { label: "On-site", value: "On-site" },
  { label: "Hybrid", value: "Hybrid" },
];

const TYPE_COLOR: Record<string, string> = {
  Remote: "var(--color-blue)",
  "On-site": "var(--color-orange)",
  Hybrid: "var(--color-cyan)",
};

export function GlobalMap() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [regionFilter, setRegionFilter] = useState<Region>("all");
  const [typeFilter, setTypeFilter] = useState<DeliveryType>("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hub = globalPresence.markers.find((m) => m.hub)!;
  const hubPt = project(hub.lat, hub.lon);

  const visibleMarkers = globalPresence.markers.filter((marker) => {
    if (regionFilter !== "all" && marker.region !== regionFilter) return false;
    if (typeFilter !== "all" && marker.deliveryType !== typeFilter) return false;
    return true;
  });

  const activeMarker =
    hoveredId ? globalPresence.markers.find((m) => m.id === hoveredId) ?? hub : hub;

  return (
    <Section
      id="global"
      label={t.sections.global.label}
      title={t.sections.global.title}
      intro={t.sections.global.intro}
    >
      {/* Filter chips */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)] mr-1">Region</span>
        {FILTER_REGION.map((f) => (
          <button
            key={f.value}
            onClick={() => setRegionFilter(f.value)}
            className={`rounded-md border px-3 py-1 font-mono text-[11px] transition-colors ${
              regionFilter === f.value
                ? "border-[var(--color-blue)] bg-[var(--color-blue)]/10 text-[var(--color-blue)]"
                : "border-[var(--color-hairline)] text-[var(--color-fg-subtle)] hover:border-[var(--color-fg-muted)]"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-[var(--color-hairline)]" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)] mr-1">Type</span>
        {FILTER_TYPE.map((f) => (
          <button
            key={f.value}
            onClick={() => setTypeFilter(typeFilter === f.value ? "all" : f.value)}
            className={`rounded-md border px-3 py-1 font-mono text-[11px] transition-colors ${
              typeFilter === f.value
                ? "border-[var(--color-cyan)] bg-[var(--color-cyan)]/10 text-[var(--color-cyan)]"
                : "border-[var(--color-hairline)] text-[var(--color-fg-subtle)] hover:border-[var(--color-fg-muted)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Map panel */}
        <div className="panel relative overflow-hidden rounded-xl p-4">
          {/* Dot grid overlay */}
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-full w-full"
            role="img"
            aria-label="World map showing Cesar Nogueira's delivery regions"
          >
            <defs>
              <filter id="glow-hub" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-node" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="0.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="dot-grid" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
                <circle cx="0.5" cy="0.5" r="0.25" fill="var(--color-hairline)" />
              </pattern>
            </defs>

            {/* Dot grid background */}
            <rect width={W} height={H} fill="url(#dot-grid)" />

            {/* Faint graticule lines */}
            <g stroke="var(--color-hairline)" strokeWidth={0.1} opacity={0.5}>
              {Array.from({ length: 9 }, (_, i) => (
                <line key={`v${i}`} x1={(i + 1) * 10} y1={0} x2={(i + 1) * 10} y2={H} />
              ))}
              {Array.from({ length: 4 }, (_, i) => (
                <line key={`h${i}`} x1={0} y1={(i + 1) * 12} x2={W} y2={(i + 1) * 12} />
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
                style={{ fontSize: 1.8, letterSpacing: 0.3, opacity: 0.45 }}
              >
                {r.label}
              </text>
            ))}

            {/* Arcs from hub to each visible (non-hub) marker */}
            {globalPresence.markers
              .filter((marker) => !marker.hub)
              .map((marker, i) => {
                const p = project(marker.lat, marker.lon);
                const mx = (hubPt.x + p.x) / 2;
                const my = (hubPt.y + p.y) / 2 - Math.hypot(p.x - hubPt.x, p.y - hubPt.y) * 0.3;
                const d = `M ${hubPt.x} ${hubPt.y} Q ${mx} ${my} ${p.x} ${p.y}`;
                const isVisible = visibleMarkers.some((v) => v.id === marker.id);
                const isHovered = hoveredId === marker.id;
                const color = TYPE_COLOR[marker.deliveryType] ?? "var(--color-blue)";
                return (
                  <m.path
                    key={marker.id}
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHovered ? 0.5 : 0.25}
                    strokeOpacity={isVisible ? (isHovered ? 0.9 : 0.45) : 0.08}
                    strokeDasharray={isHovered ? "none" : undefined}
                    initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                    whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
                    animate={{ strokeOpacity: isVisible ? (isHovered ? 0.9 : 0.45) : 0.08 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.1 + i * 0.18, ease: "easeOut" }}
                  />
                );
              })}

            {/* Markers */}
            {globalPresence.markers.map((marker, i) => {
              const p = project(marker.lat, marker.lon);
              const isVisible = visibleMarkers.some((v) => v.id === marker.id);
              const isHovered = hoveredId === marker.id;
              const color = marker.hub ? "var(--color-ok)" : (TYPE_COLOR[marker.deliveryType] ?? "var(--color-blue)");
              const r = marker.hub ? 1.5 : 1.1;

              return (
                <g
                  key={marker.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredId(marker.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Hub pulse ring */}
                  {marker.hub && (
                    <m.circle
                      cx={p.x} cy={p.y} r={2}
                      fill="none"
                      stroke="var(--color-ok)"
                      strokeWidth={0.25}
                      initial={reduce ? false : { scale: 0.6, opacity: 0.7 }}
                      animate={reduce ? undefined : { scale: 2.8, opacity: 0 }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                      style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                    />
                  )}

                  {/* Hover glow ring */}
                  {isHovered && !marker.hub && (
                    <circle
                      cx={p.x} cy={p.y}
                      r={r + 1.2}
                      fill="none"
                      stroke={color}
                      strokeWidth={0.3}
                      opacity={0.35}
                    />
                  )}

                  {/* Node dot */}
                  <m.circle
                    cx={p.x} cy={p.y}
                    r={r}
                    fill={color}
                    opacity={isVisible ? 1 : 0.15}
                    filter={marker.hub ? "url(#glow-hub)" : isHovered ? "url(#glow-node)" : undefined}
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    whileInView={reduce ? undefined : { scale: 1, opacity: isVisible ? 1 : 0.15 }}
                    animate={{ opacity: isVisible ? 1 : 0.15 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  />

                  {/* Label */}
                  <text
                    x={p.x}
                    y={p.y - (r + 1.2)}
                    textAnchor="middle"
                    style={{
                      fontSize: 1.9,
                      fill: isVisible ? "var(--color-fg-muted)" : "var(--color-fg-subtle)",
                      opacity: isVisible ? 1 : 0.3,
                      fontFamily: "monospace",
                    }}
                  >
                    {marker.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="flex flex-col gap-4">
          {/* Active node card */}
          <m.div
            key={activeMarker.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="panel rounded-xl p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: activeMarker.hub ? "var(--color-ok)" : (TYPE_COLOR[activeMarker.deliveryType] ?? "var(--color-blue)") }}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                    {activeMarker.hub ? "Home Base" : activeMarker.deliveryType}
                  </span>
                </div>
                <h3 className="font-display mt-2 text-xl text-[var(--color-fg)]">
                  {activeMarker.label}
                </h3>
                <p className="font-mono text-xs text-[var(--color-fg-subtle)]">
                  {activeMarker.city}
                </p>
              </div>
              <span className="font-mono text-[10px] text-[var(--color-fg-subtle)] whitespace-nowrap">
                {activeMarker.period}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {activeMarker.context}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-blue)]">
              {activeMarker.subtitle}
            </p>
          </m.div>

          {/* Marker list */}
          <ul className="flex flex-col gap-2">
            {globalPresence.markers.map((marker) => {
              const isVisible = visibleMarkers.some((v) => v.id === marker.id);
              const color = marker.hub ? "var(--color-ok)" : (TYPE_COLOR[marker.deliveryType] ?? "var(--color-blue)");
              return (
                <li key={marker.id}>
                  <button
                    onMouseEnter={() => setHoveredId(marker.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setHoveredId(hoveredId === marker.id ? null : marker.id)}
                    className={`w-full flex items-center gap-3 panel rounded-lg px-4 py-2.5 text-left transition-colors ${
                      hoveredId === marker.id ? "border-[var(--color-hairline-strong)]" : ""
                    } ${!isVisible ? "opacity-35" : ""}`}
                  >
                    <span
                      className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[var(--color-fg)]">{marker.label}</p>
                      <p className="font-mono text-[11px] text-[var(--color-fg-subtle)] truncate">{marker.city}</p>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--color-fg-subtle)] shrink-0">
                      {marker.deliveryType ?? "Hub"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Legend */}
          <div className="panel rounded-lg px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)] mb-2">Delivery type</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(TYPE_COLOR).map(([type, color]) => (
                <span key={type} className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-fg-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                  {type}
                </span>
              ))}
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-fg-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ok)]" />
                Home base
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile timeline (shown below lg) */}
      <div className="mt-8 flex flex-col gap-3 lg:hidden">
        {globalPresence.markers.map((marker, i) => {
          const color = marker.hub ? "var(--color-ok)" : (TYPE_COLOR[marker.deliveryType] ?? "var(--color-blue)");
          return (
            <m.div
              key={marker.id}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="panel flex items-start gap-4 rounded-xl px-4 py-4"
            >
              <div className="flex flex-col items-center pt-1">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                {i < globalPresence.markers.length - 1 && (
                  <span className="mt-1 w-px flex-1 min-h-[24px] bg-[var(--color-hairline)]" />
                )}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium text-[var(--color-fg)]">{marker.label}</p>
                  <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">{marker.period}</span>
                </div>
                <p className="font-mono text-[11px] text-[var(--color-fg-subtle)]">{marker.city}</p>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{marker.context}</p>
              </div>
            </m.div>
          );
        })}
      </div>
    </Section>
  );
}
