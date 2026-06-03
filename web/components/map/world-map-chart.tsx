"use client";

/**
 * WorldMapChart — Cloudflare-style international delivery network.
 * Natural Earth 110m via react-simple-maps. Portugal is the visual hub.
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

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Atlantic corridor — Europe upper-right, Brazil lower-left, USA upper-left.
// scale 280 shows the full transatlantic delivery network without clipping.
const PROJECTION_CONFIG = {
  rotate: [22, -5, 0] as [number, number, number],
  scale: 280,
  center: [-10, 25] as [number, number],
};

const HIGHLIGHT_COUNTRIES = new Set([
  "620", // Portugal
  "724", // Spain
  "528", // Netherlands
  "826", // United Kingdom
  "076", // Brazil
  "840", // United States
]);

// All colors reference CSS custom properties — adapt to dark/light theme
const C = {
  ok:     "var(--color-ok)",
  orange: "var(--color-orange)",
  blue:   "var(--color-blue)",
  cyan:   "var(--color-cyan)",
};

// Offsets in projected SVG units — tuned for scale 280 Atlantic-corridor view
const MARKER_CONFIG: Record<string, {
  color: string;
  r: number;
  label: string;
  offset: [number, number];
  anchor: "start" | "end" | "middle";
}> = {
  pt: { color: C.ok,     r: 8,  label: "Portugal",      offset: [12, -6],   anchor: "start" },
  es: { color: C.orange, r: 5,  label: "Spain",          offset: [9, 10],    anchor: "start" },
  nl: { color: C.blue,   r: 5,  label: "Netherlands",    offset: [9, -4],    anchor: "start" },
  uk: { color: C.blue,   r: 5,  label: "UK",             offset: [-9, -11],  anchor: "end"   },
  br: { color: C.cyan,   r: 5,  label: "Brazil",         offset: [9, 5],     anchor: "start" },
  us: { color: C.blue,   r: 5,  label: "United States",  offset: [0, -11],   anchor: "middle"},
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
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Brazil→Portugal route gets a slightly stronger visual weight — tells the relocation story
  const isBrazilBridge = (destId: string) => destId === "br";

  return (
    <ComposableMap
      projection="geoNaturalEarth1"
      projectionConfig={PROJECTION_CONFIG}
      style={{ width: "100%", height: "100%", minHeight: 340 }}
    >
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="var(--color-surface-1)" stopOpacity="0.55" />
        </radialGradient>
        <filter id="glow-hub" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-node" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* === Geography layer === */}
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const isHighlighted = HIGHLIGHT_COUNTRIES.has(geo.id);
            const isPortugal = geo.id === "620";
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={
                  isPortugal
                    ? "var(--color-surface-3)"
                    : isHighlighted
                    ? "var(--color-surface-2)"
                    : "var(--color-surface-1)"
                }
                stroke={isHighlighted ? "var(--color-hairline-strong)" : "var(--color-hairline)"}
                strokeWidth={isHighlighted ? 0.5 : 0.25}
                style={{
                  default: { outline: "none" },
                  hover:   { outline: "none", fill: isHighlighted ? "var(--color-surface-3)" : "var(--color-surface-1)" },
                  pressed: { outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>

      {/* Atmospheric vignette overlay */}
      <rect x="-9999" y="-9999" width="99999" height="99999" fill="url(#vignette)" style={{ pointerEvents: "none" }} />

      {/* === Routes === */}
      {ready && markers
        .filter((m) => m.id !== hubId)
        .map((dest, i) => {
          const isVisible = visibleIds.includes(dest.id);
          const isActive = activeId === dest.id;
          const cfg = MARKER_CONFIG[dest.id];
          const isBridge = isBrazilBridge(dest.id);
          // Brazil→Portugal route is slightly stronger to tell the relocation story
          const baseOpacity = isBridge ? 0.55 : 0.35;
          const activeOpacity = 0.9;

          return (
            <g key={`route-${dest.id}`}>
              {/* Base route */}
              <Line
                from={[hub.lon, hub.lat]}
                to={[dest.lon, dest.lat]}
                stroke={cfg?.color ?? C.blue}
                strokeWidth={isActive ? 1.8 : (isBridge ? 1.0 : 0.7)}
                strokeOpacity={isVisible ? (isActive ? activeOpacity : baseOpacity) : 0.05}
                strokeLinecap="round"
                strokeDasharray={isActive ? undefined : "3 6"}
              />
              {/* Animated packet */}
              {isVisible && !reduce && (
                <AnimatedPacket
                  from={[hub.lon, hub.lat]}
                  to={[dest.lon, dest.lat]}
                  color={cfg?.color ?? C.blue}
                  delay={i * 0.7}
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
            <g style={{ cursor: "pointer" }} opacity={isVisible ? 1 : 0.12}>
              {/* Selection ring */}
              {isActive && !isHub && (
                <circle r={cfg.r + 5} fill="none" stroke={cfg.color} strokeWidth={1} opacity={0.35} />
              )}

              {/* Hub pulse rings — two layers for depth */}
              {isHub && !reduce && (
                <>
                  <m.circle
                    r={cfg.r + 4}
                    fill="none"
                    stroke={cfg.color}
                    strokeWidth={0.6}
                    initial={{ scale: 0.7, opacity: 0.7 }}
                    animate={{ scale: 2.8, opacity: 0 }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0 }}
                    style={{ transformOrigin: "0px 0px" }}
                  />
                  <m.circle
                    r={cfg.r + 2}
                    fill="none"
                    stroke={cfg.color}
                    strokeWidth={0.8}
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2.0, opacity: 0 }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0.9 }}
                    style={{ transformOrigin: "0px 0px" }}
                  />
                </>
              )}

              {/* Main dot */}
              <circle
                r={cfg.r}
                fill={cfg.color}
                stroke={isHub ? "var(--color-surface-0)" : "transparent"}
                strokeWidth={isHub ? 2.5 : 0}
                filter={isHub ? "url(#glow-hub)" : (isActive ? "url(#glow-node)" : undefined)}
              />

              {/* Label */}
              <text
                x={cfg.offset[0]}
                y={cfg.offset[1]}
                textAnchor={cfg.anchor}
                style={{
                  fontSize: isHub ? 10 : 8.5,
                  fill: isHub ? "var(--color-fg)" : "var(--color-fg-muted)",
                  fontFamily: "monospace",
                  fontWeight: isHub ? 700 : 400,
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: "none",
                  letterSpacing: isHub ? "0.04em" : "0.02em",
                  textTransform: isHub ? "uppercase" : "none",
                }}
              >
                {cfg.label}
              </text>
            </g>
          </Marker>
        );
      })}
    </ComposableMap>
  );
}

function AnimatedPacket({
  from, to, color, delay, active,
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
      strokeWidth={active ? 3 : 2}
      strokeOpacity={active ? 0.95 : 0.65}
      strokeLinecap="round"
      strokeDasharray="5 250"
      style={{
        animation: `packet-travel ${active ? 1.6 : 2.6}s linear ${delay}s infinite`,
      }}
    />
  );
}

export default memo(WorldMapChart);
