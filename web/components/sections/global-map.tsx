"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { m, useReducedMotion } from "motion/react";
import { Section } from "@/components/sections/section";
import { globalPresence } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

// Lazy-load react-simple-maps (heavy) — no SSR needed
const MapChart = dynamic(() => import("@/components/map/world-map-chart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[340px] items-center justify-center">
      <span className="font-mono text-xs text-[var(--color-fg-subtle)]">loading map…</span>
    </div>
  ),
});

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
  const [activeId, setActiveId] = useState<string | null>(null);

  const filterRegion = [
    { label: t.labels.filterAll, value: "all" as Region },
    { label: t.labels.filterEurope, value: "europe" as Region },
    { label: t.labels.filterAmericas, value: "americas" as Region },
  ];
  const filterType = [
    { label: t.labels.filterRemote, value: "Remote" as DeliveryType },
    { label: t.labels.filterOnsite, value: "On-site" as DeliveryType },
    { label: t.labels.filterHybrid, value: "Hybrid" as DeliveryType },
  ];

  const hub = globalPresence.markers.find((m) => m.hub)!;

  const visibleMarkers = globalPresence.markers.filter((marker) => {
    if (regionFilter !== "all" && marker.region !== regionFilter) return false;
    if (typeFilter !== "all" && marker.deliveryType !== typeFilter) return false;
    return true;
  });

  const activeMarker = activeId
    ? (globalPresence.markers.find((m) => m.id === activeId) ?? hub)
    : hub;

  return (
    <Section
      id="global"
      label={t.sections.global.label}
      title={t.sections.global.title}
      intro={t.sections.global.intro}
    >
      {/* Filter chips */}
      <div className="-mx-6 mb-5 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        <div className="flex min-w-max items-center gap-2 pb-1 sm:min-w-0 sm:flex-wrap sm:pb-0">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{t.labels.region}</span>
          {filterRegion.map((f) => (
            <button key={f.value} onClick={() => setRegionFilter(f.value)}
              className={`rounded-md border px-3 py-1 font-mono text-[11px] transition-colors ${regionFilter === f.value ? "border-[var(--color-blue)] bg-[var(--color-blue)]/10 text-[var(--color-blue)]" : "border-[var(--color-hairline)] text-[var(--color-fg-subtle)] hover:border-[var(--color-fg-muted)]"}`}>
              {f.label}
            </button>
          ))}
          <span className="mx-2 h-4 w-px bg-[var(--color-hairline)]" />
          <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{t.labels.deliveryType}</span>
          {filterType.map((f) => (
            <button key={f.value} onClick={() => setTypeFilter(typeFilter === f.value ? "all" : f.value)}
              className={`rounded-md border px-3 py-1 font-mono text-[11px] transition-colors ${typeFilter === f.value ? "border-[var(--color-cyan)] bg-[var(--color-cyan)]/10 text-[var(--color-cyan)]" : "border-[var(--color-hairline)] text-[var(--color-fg-subtle)] hover:border-[var(--color-fg-muted)]"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Real world map */}
        <div className="panel overflow-hidden rounded-xl" style={{ minHeight: 340 }}>
          <MapChart
            markers={globalPresence.markers}
            visibleIds={visibleMarkers.map((m) => m.id)}
            activeId={activeId}
            hubId={hub.id}
            onSelect={setActiveId}
            reduce={!!reduce}
          />
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
                  <span className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: activeMarker.hub ? "var(--color-ok)" : (TYPE_COLOR[activeMarker.deliveryType] ?? "var(--color-blue)") }} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                    {activeMarker.hub ? t.labels.homeBase : activeMarker.deliveryType}
                  </span>
                </div>
                <h3 className="font-display mt-2 text-xl text-[var(--color-fg)]">{activeMarker.label}</h3>
                <p className="font-mono text-xs text-[var(--color-fg-subtle)]">{activeMarker.city}</p>
              </div>
              <span className="whitespace-nowrap font-mono text-[10px] text-[var(--color-fg-subtle)]">{activeMarker.period}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{activeMarker.context}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-blue)]">{activeMarker.subtitle}</p>
          </m.div>

          {/* Location list */}
          <ul className="flex flex-col gap-2">
            {globalPresence.markers.map((marker) => {
              const isVisible = visibleMarkers.some((v) => v.id === marker.id);
              const color = marker.hub ? "var(--color-ok)" : (TYPE_COLOR[marker.deliveryType] ?? "var(--color-blue)");
              return (
                <li key={marker.id}>
                  <button
                    onMouseEnter={() => setActiveId(marker.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onClick={() => setActiveId(activeId === marker.id ? null : marker.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-4 py-2.5 text-left transition-colors ${activeId === marker.id ? "border-[var(--color-hairline-strong)]" : ""} ${!isVisible ? "opacity-35" : ""}`}
                  >
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden />
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

      {/* Mobile cards */}
      <div className="mt-8 flex flex-col gap-3 lg:hidden">
        {globalPresence.markers.map((marker, i) => {
          const color = marker.hub ? "var(--color-ok)" : (TYPE_COLOR[marker.deliveryType] ?? "var(--color-blue)");
          return (
            <m.div key={marker.id}
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
