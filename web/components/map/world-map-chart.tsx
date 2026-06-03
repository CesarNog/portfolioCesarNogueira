"use client";

/**
 * WorldMapChart — real Natural Earth geography via react-simple-maps.
 * Atlantic-corridor projection: Europe takes ~60% of visible space.
 * Animated routes from Portugal hub to each delivery country.
 */

import { useState, useEffect, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";
import { m } from "motion/react";

// Natural Earth 110m topology — fetched by browser, not at build time
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Atlantic-corridor projection config — Europe dominant, Americas visible
const PROJECTION_CONFIG = {
  rotate: [20, -10, 0] as [number, number, number],   // rotate globe so Atlantic is center
  scale: 420,              // zoom in significantly
  center: [0, 45] as [number, number],
};

// Countries to highlight (ISO numeric codes from Natural Earth)
const HIGHLIGHT_COUNTRIES = new Set([
  "620", // Portugal
  "724", // Spain
  "528", // Netherlands
  "826", // United Kingdom
  "076", // Brazil
  "840", // United States
]);

const MARKER_CONFIG: Record<string, { color: string; r: number; label: string; offset: [number, number] }> = {
  pt: { color: "#34d399", r: 7,  label: "Portugal",       offset: [8, -4] },
  es: { color: "#f59e5b", r: 5,  label: "Spain",          offset: [8, 2] },
  nl: { color: "#3b82f6", r: 5,  label: "Netherlands",    offset: [8, -2] },
  uk: { color: "#3b82f6", r: 5,  label: "UK",             offset: [-8, -12] },
  br: { color: "#22b8c4", r: 5,  label: "Brazil",         offset: [8, 2] },
  us: { color: "#3b82f6", r: 5,  label: "United States",  offset: [0, -10] },
};

interface Marker {
  id: string;
  lat: number;
  lon: number;
  hub?: boolean;
  deliveryType?: string;
}

interface Props {
  markers: Marker[];
  visibleIds: string[];
  activeId: string | null;
  hubId: string;
  onSelect: (id: string | null) => void;
  reduce: boolean;
}

function WorldMapChart({ markers, visibleIds, activeId, hubId, onSelect, reduce }: Props) {
  const [ready, setReady] = useState(false);
  const hub = markers.find((m) => m.id === hubId)!;

  useEffect(() => {
    // Small delay so map renders after hydration
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <ComposableMap
      projection="geoNaturalEarth1"
      projectionConfig={PROJECTION_CONFIG}
      style={{ width: "100%", height: "100%", minHeight: 340 }}
    >
      {/* === Geography layer === */}
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const isHighlighted = HIGHLIGHT_COUNTRIES.has(geo.id);
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={
                  isHighlighted
                    ? "var(--color-surface-3)"
                    : "var(--color-surface-2)"
                }
                stroke="var(--color-hairline-strong)"
                strokeWidth={0.4}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: isHighlighted ? "var(--color-surface-3)" : "var(--color-surface-2)" },
                  pressed: { outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>

      {/* === Routes from hub to each visible marker === */}
      {ready && markers
        .filter((m) => m.id !== hubId)
        .map((dest, i) => {
          const isVisible = visibleIds.includes(dest.id);
          const isActive = activeId === dest.id;
          const cfg = MARKER_CONFIG[dest.id];
          return (
            <g key={`route-${dest.id}`}>
              {/* Base route — always present, dim when filtered */}
              <Line
                from={[hub.lon, hub.lat]}
                to={[dest.lon, dest.lat]}
                stroke={cfg?.color ?? "#3b82f6"}
                strokeWidth={isActive ? 1.5 : 0.8}
                strokeOpacity={isVisible ? (isActive ? 0.85 : 0.4) : 0.08}
                strokeLinecap="round"
                strokeDasharray={isActive ? undefined : "3 5"}
              />
              {/* Animated packet — moving dot along route when active or reduce=false */}
              {isVisible && !reduce && (
                <AnimatedPacket
                  from={[hub.lon, hub.lat]}
                  to={[dest.lon, dest.lat]}
                  color={cfg?.color ?? "#3b82f6"}
                  delay={i * 0.6}
                  active={isActive}
                />
              )}
            </g>
          );
        })}

      {/* === Markers === */}
      {markers.map((marker, i) => {
        const cfg = MARKER_CONFIG[marker.id];
        if (!cfg) return null;
        const isVisible = visibleIds.includes(marker.id);
        const isActive = activeId === marker.id;
        const isHub = marker.id === hubId;

        return (
          <Marker
            key={marker.id}
            coordinates={[marker.lon, marker.lat]}
            onClick={() => onSelect(isActive ? null : marker.id)}
            onMouseEnter={() => onSelect(marker.id)}
            onMouseLeave={() => onSelect(null)}
          >
            <g style={{ cursor: "pointer" }} opacity={isVisible ? 1 : 0.15}>
              {/* Hover ring */}
              {isActive && (
                <circle
                  r={cfg.r + 5}
                  fill="none"
                  stroke={cfg.color}
                  strokeWidth={1}
                  opacity={0.3}
                />
              )}

              {/* Hub pulse ring */}
              {isHub && !reduce && (
                <m.circle
                  r={cfg.r + 2}
                  fill="none"
                  stroke={cfg.color}
                  strokeWidth={0.8}
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                  style={{ transformOrigin: "0px 0px" }}
                />
              )}

              {/* Main dot */}
              <circle
                r={cfg.r}
                fill={cfg.color}
                stroke={isHub ? "#08090c" : "transparent"}
                strokeWidth={isHub ? 2 : 0}
                filter={isHub ? "url(#glow-hub)" : undefined}
              />

              {/* Label — desktop only via SVG visibility */}
              <text
                x={cfg.offset[0]}
                y={cfg.offset[1]}
                textAnchor={cfg.offset[0] < 0 ? "end" : "start"}
                style={{
                  fontSize: 9,
                  fill: isHub ? "#edf0f3" : "var(--color-fg-muted)",
                  fontFamily: "monospace",
                  fontWeight: isHub ? 600 : 400,
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: "none",
                }}
              >
                {cfg.label}
              </text>
            </g>
          </Marker>
        );
      })}

      {/* Glow filter for hub */}
      <defs>
        <filter id="glow-hub" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </ComposableMap>
  );
}

// Animated packet — SVG dash traveling along the route
function AnimatedPacket({
  from,
  to,
  color,
  delay,
  active,
}: {
  from: [number, number];
  to: [number, number];
  color: string;
  delay: number;
  active: boolean;
}) {
  return (
    <Line
      from={from}
      to={to}
      stroke={color}
      strokeWidth={active ? 2.5 : 1.5}
      strokeOpacity={active ? 0.9 : 0.55}
      strokeLinecap="round"
      strokeDasharray="4 200"
      style={{
        animation: `packet-travel ${active ? 1.8 : 2.8}s linear ${delay}s infinite`,
      }}
    />
  );
}

export default memo(WorldMapChart);
