"use client";

import { useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { Section } from "@/components/sections/section";
import { globalPresence } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

// Equirectangular projection — W=100, H=52 coordinate space.
// viewBox zooms into the Atlantic corridor (lon -126°→+40°, lat 72°→-52°).
const W = 100;
const H = 52;
const VIEWBOX = "15 5 46 38"; // zoomed Atlantic corridor

function project(lat: number, lon: number) {
  return {
    x: ((lon + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  };
}

// Simplified but geographically correct land shapes.
// Points: x=((lon+180)/360)*100, y=((90-lat)/180)*52
const LAND_SHAPES = [
  // Western & Central Europe (Iberia → Germany, incl. Italy outline)
  "M 47.5 15.6 L 51.7 15.6 L 54.4 14.1 L 54.2 13.3 L 54.7 12.4 L 53.9 11.3 L 52.8 10.4 L 51.4 11.0 L 50.8 11.3 L 50.6 11.6 L 49.4 11.8 L 49.4 12.4 L 49.4 13.3 L 51.1 13.3 L 50.8 13.9 L 50.3 14.4 L 48.6 15.6 Z",
  // Scandinavia + Baltic coast
  "M 52.8 10.4 L 52.8 9.8 L 51.4 9.5 L 51.4 8.1 L 54.7 6.1 L 57.2 5.5 L 58.1 6.1 L 57.5 7.2 L 56.9 8.7 L 56.1 9.5 L 55.6 9.8 L 54.2 10.4 Z",
  // Great Britain
  "M 48.5 11.6 L 50.4 11.3 L 50.0 10.7 L 49.2 9.1 L 48.2 9.5 L 48.3 10.1 L 48.6 11.0 Z",
  // Ireland
  "M 47.2 11.2 L 47.8 10.1 L 48.3 10.4 L 48.3 11.0 Z",
  // Eastern North America (Atlantic seaboard + Great Lakes + Gulf)
  "M 27.5 18.8 L 27.8 18.0 L 29.2 16.0 L 30.6 13.9 L 32.2 12.4 L 34.4 11.6 L 31.9 8.7 L 26.4 7.2 L 24.2 11.6 L 24.2 13.0 L 23.6 17.3 L 23.1 18.9 Z",
  // South America
  "M 29.2 23.1 L 33.1 23.6 L 35.6 24.4 L 36.1 25.8 L 40.3 27.4 L 40.3 28.3 L 39.4 30.2 L 37.5 32.8 L 35.8 35.1 L 32.5 37.1 L 31.1 41.1 L 29.7 37.1 L 30.6 32.2 L 27.5 27.4 L 28.1 25.8 L 28.6 23.6 Z",
];

// Geographic reference lines in the 100×52 coordinate space
const EQUATOR_Y = ((90 - 0) / 180) * 52;       // 26.0
const TROPIC_C_Y = ((90 - 23.5) / 180) * 52;   // 19.2
const TROPIC_CP_Y = ((90 + 23.5) / 180) * 52;  // 32.8

type Region = "all" | "europe" | "americas";
type DeliveryType = "all" | "Remote" | "On-site" | "Hybrid";

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

  const filterRegion: { label: string; value: Region }[] = [
    { label: t.labels.filterAll, value: "all" as Region },
    { label: t.labels.filterEurope, value: "europe" as Region },
    { label: t.labels.filterAmericas, value: "americas" as Region },
  ];
  const filterType: { label: string; value: DeliveryType }[] = [
    { label: t.labels.filterRemote, value: "Remote" as DeliveryType },
    { label: t.labels.filterOnsite, value: "On-site" as DeliveryType },
    { label: t.labels.filterHybrid, value: "Hybrid" as DeliveryType },
  ];

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
      {/* Filter chips — horizontal scroll on mobile */}
      <div className="-mx-6 mb-5 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        <div className="flex min-w-max items-center gap-2 pb-1 sm:min-w-0 sm:flex-wrap sm:pb-0">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{t.labels.region}</span>
          {filterRegion.map((f) => (
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
          <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{t.labels.deliveryType}</span>
          {filterType.map((f) => (
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
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Map panel */}
        <div className="panel relative min-h-[240px] overflow-hidden rounded-xl p-3 sm:min-h-[300px]">
          <svg
            viewBox={VIEWBOX}
            className="h-full w-full"
            role="img"
            aria-label="World map showing Cesar Nogueira's delivery regions"
          >
            <defs>
              <filter id="glow-hub" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="0.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-node" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="0.3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="dots" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
                <circle cx="0.3" cy="0.3" r="0.1" fill="var(--color-hairline)" />
              </pattern>
            </defs>

            {/* Ocean background / dot grid */}
            <rect x="15" y="5" width="46" height="38" fill="url(#dots)" />

            {/* Geographic reference lines */}
            <line x1="15" y1={TROPIC_C_Y} x2="61" y2={TROPIC_C_Y}
              stroke="var(--color-hairline)" strokeWidth={0.08} strokeDasharray="0.4 0.8" strokeOpacity={0.6} />
            <line x1="15" y1={EQUATOR_Y} x2="61" y2={EQUATOR_Y}
              stroke="var(--color-hairline)" strokeWidth={0.12} strokeOpacity={0.8} />
            <line x1="15" y1={TROPIC_CP_Y} x2="61" y2={TROPIC_CP_Y}
              stroke="var(--color-hairline)" strokeWidth={0.08} strokeDasharray="0.4 0.8" strokeOpacity={0.6} />

            {/* Land masses */}
            <g fill="var(--color-surface-3)" stroke="var(--color-hairline-strong)" strokeWidth={0.12} strokeLinejoin="round">
              {LAND_SHAPES.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>

            {/* Delivery arcs — quadratic bezier, bow northward like great-circle routes */}
            {globalPresence.markers
              .filter((marker) => !marker.hub)
              .map((marker, i) => {
                const p = project(marker.lat, marker.lon);
                const dx = p.x - hubPt.x;
                const dy = p.y - hubPt.y;
                const dist = Math.hypot(dx, dy);
                const mx = (hubPt.x + p.x) / 2;
                const my = (hubPt.y + p.y) / 2 - dist * 0.32;
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
                    strokeWidth={isHovered ? 0.35 : 0.18}
                    strokeLinecap="round"
                    strokeOpacity={isVisible ? (isHovered ? 0.9 : 0.5) : 0.06}
                    initial={reduce ? false : { pathLength: 0 }}
                    whileInView={reduce ? undefined : { pathLength: 1 }}
                    animate={{ strokeOpacity: isVisible ? (isHovered ? 0.9 : 0.5) : 0.06 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.2 + i * 0.2, ease: "easeOut" }}
                  />
                );
              })}

            {/* Markers */}
            {globalPresence.markers.map((marker, i) => {
              const p = project(marker.lat, marker.lon);
              const isVisible = visibleMarkers.some((v) => v.id === marker.id);
              const isHovered = hoveredId === marker.id;
              const color = marker.hub
                ? "var(--color-ok)"
                : (TYPE_COLOR[marker.deliveryType] ?? "var(--color-blue)");
              const r = marker.hub ? 0.9 : 0.65;

              return (
                <g
                  key={marker.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredId(marker.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setHoveredId(hoveredId === marker.id ? null : marker.id)}
                >
                  {/* Hub pulse ring */}
                  {marker.hub && (
                    <m.circle
                      cx={p.x} cy={p.y} r={1.8}
                      fill="none"
                      stroke="var(--color-ok)"
                      strokeWidth={0.15}
                      initial={reduce ? false : { scale: 0.5, opacity: 0.8 }}
                      animate={reduce ? undefined : { scale: 2.5, opacity: 0 }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                      style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                    />
                  )}

                  {/* Hover ring */}
                  {isHovered && !marker.hub && (
                    <circle cx={p.x} cy={p.y} r={r + 0.6}
                      fill="none" stroke={color} strokeWidth={0.2} opacity={0.4} />
                  )}

                  {/* Marker dot */}
                  <m.circle
                    cx={p.x} cy={p.y}
                    r={r}
                    fill={color}
                    opacity={isVisible ? 1 : 0.12}
                    filter={marker.hub ? "url(#glow-hub)" : isHovered ? "url(#glow-node)" : undefined}
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    whileInView={reduce ? undefined : { scale: 1, opacity: isVisible ? 1 : 0.12 }}
                    animate={{ opacity: isVisible ? 1 : 0.12 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  />

                  {/* Label — hidden on mobile via SVG class */}
                  <text
                    x={p.x}
                    y={p.y - (r + 0.7)}
                    textAnchor="middle"
                    className="hidden sm:block"
                    style={{
                      fontSize: 1.1,
                      fill: isVisible ? "var(--color-fg-muted)" : "var(--color-fg-subtle)",
                      opacity: isVisible ? 1 : 0.25,
                      fontFamily: "monospace",
                      display: "block",
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
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: activeMarker.hub ? "var(--color-ok)" : (TYPE_COLOR[activeMarker.deliveryType] ?? "var(--color-blue)") }}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                    {activeMarker.hub ? t.labels.homeBase : activeMarker.deliveryType}
                  </span>
                </div>
                <h3 className="font-display mt-2 text-xl text-[var(--color-fg)]">
                  {activeMarker.label}
                </h3>
                <p className="font-mono text-xs text-[var(--color-fg-subtle)]">
                  {activeMarker.city}
                </p>
              </div>
              <span className="whitespace-nowrap font-mono text-[10px] text-[var(--color-fg-subtle)]">
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
              const color = marker.hub
                ? "var(--color-ok)"
                : (TYPE_COLOR[marker.deliveryType] ?? "var(--color-blue)");
              return (
                <li key={marker.id}>
                  <button
                    onMouseEnter={() => setHoveredId(marker.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setHoveredId(hoveredId === marker.id ? null : marker.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-4 py-2.5 text-left transition-colors ${
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
                      <p className="truncate font-mono text-[11px] text-[var(--color-fg-subtle)]">{marker.city}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-[var(--color-fg-subtle)]">
                      {marker.deliveryType ?? t.labels.homeBase}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Legend */}
          <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-4 py-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{t.labels.deliveryType}</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(TYPE_COLOR).map(([type, color]) => (
                <span key={type} className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-fg-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                  {type}
                </span>
              ))}
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-fg-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ok)]" />
                {t.labels.homeBase}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked location cards (map above, cards below) */}
      <div className="mt-8 flex flex-col gap-3 lg:hidden">
        {globalPresence.markers.map((marker, i) => {
          const color = marker.hub ? "var(--color-ok)" : (TYPE_COLOR[marker.deliveryType] ?? "var(--color-blue)");
          return (
            <m.div
              key={marker.id}
              initial={reduce ? false : { opacity: 0, x: -10 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex items-start gap-4 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-4 py-4"
            >
              <div className="flex flex-col items-center pt-1">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                {i < globalPresence.markers.length - 1 && (
                  <span className="mt-1 min-h-[24px] w-px flex-1 bg-[var(--color-hairline)]" />
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
