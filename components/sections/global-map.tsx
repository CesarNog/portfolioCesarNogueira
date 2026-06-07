"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { m, useReducedMotion } from "motion/react";
import { Section } from "@/components/sections/section";
import { globalPresence } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

const MapChart = dynamic(() => import("@/components/map/world-map-chart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[380px] items-center justify-center">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
        loading…
      </span>
    </div>
  ),
});

type Region = "all" | "europe" | "americas";
type DeliveryType = "all" | "Remote" | "On-site";

const TYPE_COLOR: Record<string, string> = {
  Remote:   "var(--color-blue)",
  "On-site":"var(--color-orange)",
  Hybrid:   "var(--color-cyan)",
};

function markerColor(marker: (typeof globalPresence.markers)[number]) {
  return marker.hub ? "var(--color-ok)" : (TYPE_COLOR[marker.deliveryType] ?? "var(--color-blue)");
}

export function GlobalMap() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [regionFilter, setRegionFilter] = useState<Region>("all");
  const [typeFilter, setTypeFilter]     = useState<DeliveryType>("all");
  const [activeId, setActiveId]         = useState<string | null>(null);

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
      title={t.sections.global.title}
      intro={t.sections.global.intro}
    >
      <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">

        {/* ── Map panel ── */}
        <div className="panel overflow-hidden rounded-xl">
          {/* Filter bar inside the panel */}
          <div className="flex flex-wrap items-center gap-4 border-b border-[var(--color-hairline)] px-4 py-2.5">
            {/* Region filter */}
            <div className="flex items-center gap-1">
              <span className="mr-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                {t.labels.region}
              </span>
              {(["all", "europe", "americas"] as Region[]).map((v) => {
                const label =
                  v === "all"      ? t.labels.filterAll
                  : v === "europe" ? t.labels.filterEurope
                                   : t.labels.filterAmericas;
                const active = regionFilter === v;
                return (
                  <button
                    key={v}
                    onClick={() => setRegionFilter(v)}
                    className={`flex min-h-[44px] items-center rounded px-2.5 font-mono text-[11px] transition-colors sm:min-h-0 sm:py-1 ${
                      active
                        ? "bg-[var(--color-blue)]/10 text-[var(--color-blue)]"
                        : "text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <span className="h-3.5 w-px shrink-0 bg-[var(--color-hairline)]" />

            {/* Type filter — Remote / On-site only (per spec) */}
            <div className="flex items-center gap-1">
              <span className="mr-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                {t.labels.deliveryType}
              </span>
              {(["Remote", "On-site"] as const).map((v) => {
                const active = typeFilter === v;
                const isOrange = v === "On-site";
                return (
                  <button
                    key={v}
                    onClick={() => setTypeFilter(active ? "all" : v)}
                    className={`flex min-h-[44px] items-center rounded px-2.5 font-mono text-[11px] transition-colors sm:min-h-0 sm:py-1 ${
                      active
                        ? isOrange
                          ? "bg-[var(--color-orange)]/10 text-[var(--color-orange)]"
                          : "bg-[var(--color-blue)]/10 text-[var(--color-blue)]"
                        : "text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]"
                    }`}
                  >
                    {v === "Remote" ? t.labels.filterRemote : t.labels.filterOnsite}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SVG map */}
          <MapChart
            markers={globalPresence.markers}
            visibleIds={visibleMarkers.map((m) => m.id)}
            activeId={activeId}
            hubId={hub.id}
            onSelect={setActiveId}
            reduce={!!reduce}
          />
        </div>

        {/* ── Detail + location navigation ── */}
        <div className="flex flex-col gap-4">

          {/* Active location card */}
          <m.div
            key={activeMarker.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="panel rounded-xl p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: markerColor(activeMarker) }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                {activeMarker.hub ? t.labels.homeBase : activeMarker.deliveryType}
              </span>
              <span className="ml-auto font-mono text-[10px] text-[var(--color-fg-subtle)]">
                {activeMarker.period}
              </span>
            </div>

            <h3 className="font-display text-2xl text-[var(--color-fg)] [text-wrap:balance]">
              {activeMarker.label}
            </h3>
            <p className="mt-0.5 font-mono text-[11px] text-[var(--color-fg-subtle)]">
              {activeMarker.city}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {activeMarker.context}
            </p>
            <p
              className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: markerColor(activeMarker) }}
            >
              {activeMarker.subtitle}
            </p>
          </m.div>

          {/* Location navigation — compact rows */}
          <div className="panel overflow-hidden rounded-xl">
            {globalPresence.markers.map((marker, i) => {
              const isVisible = visibleMarkers.some((v) => v.id === marker.id);
              const isActive  = activeId === marker.id || (!activeId && marker.hub);
              const color     = markerColor(marker);
              return (
                <button
                  key={marker.id}
                  onClick={() => setActiveId(activeId === marker.id ? null : marker.id)}
                  onMouseEnter={() => setActiveId(marker.id)}
                  onMouseLeave={() => setActiveId(null)}
                  className={[
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    i > 0 ? "border-t border-[var(--color-hairline)]" : "",
                    isActive
                      ? "bg-[var(--color-surface-2)]"
                      : "hover:bg-[var(--color-surface-2)]/50",
                    !isVisible ? "opacity-25" : "",
                  ].join(" ")}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className={`flex-1 text-sm transition-colors ${
                      isActive ? "text-[var(--color-fg)]" : "text-[var(--color-fg-muted)]"
                    }`}
                  >
                    {marker.label}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-[var(--color-fg-subtle)]">
                    {marker.period}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 px-1">
            {[
              { label: t.labels.homeBase, color: "var(--color-ok)" },
              { label: "Remote",          color: "var(--color-blue)" },
              { label: "On-site",         color: "var(--color-orange)" },
              { label: "Hybrid",          color: "var(--color-cyan)" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-fg-subtle)]"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
