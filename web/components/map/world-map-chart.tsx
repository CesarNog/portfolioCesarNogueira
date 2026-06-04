"use client";

/**
 * WorldMapChart — zero-dependency SVG dot map.
 * Equirectangular projection: x = (lon+180)/360, y = (90-lat)/180.
 * Replaces react-simple-maps + topojson-client (292KB combined).
 */

import { memo } from "react";
import { m } from "motion/react";

const W = 800;
const H = 420;

function lonToX(lon: number) { return ((lon + 180) / 360) * W; }
function latToY(lat: number) { return ((90 - lat) / 180) * H; }

// Simplified land mass outlines — key geographic shapes only (no library needed)
// Each array is a closed polygon [lon, lat][]
const LAND_OUTLINES: [number, number][][] = [
  // Europe rough
  [[-10,36],[10,36],[30,46],[32,48],[28,56],[20,60],[10,58],[5,54],[-5,48],[-8,44],[-10,36]],
  // British Isles rough
  [[-6,50],[-2,50],[0,53],[-2,58],[-5,58],[-6,54],[-6,50]],
  // Iberian Peninsula
  [[-9,36],[-5,36],[3,42],[3,44],[0,46],[-2,44],[-9,44],[-9,36]],
  // North Africa
  [[-18,16],[52,12],[52,38],[36,36],[8,38],[-6,36],[-18,28],[-18,16]],
  // Sub-Saharan Africa
  [[-18,16],[52,12],[52,-26],[36,-34],[20,-36],[10,-28],[-18,-4],[-18,16]],
  // South America
  [[-82,12],[-70,12],[-52,4],[-36,-6],[-36,-56],[-60,-56],[-76,-54],[-82,12]],
  // North America
  [[-168,72],[-52,48],[-52,12],[-82,12],[-100,-4],[-120,14],[-118,34],[-82,30],[-64,18],[-72,42],[-70,48],[-60,44],[-52,48],[-62,72],[-168,72]],
  // Asia rough
  [[32,42],[140,40],[140,72],[70,72],[32,68],[24,68],[32,42]],
  // Southeast Asia
  [[100,20],[128,24],[128,0],[108,-8],[100,2],[96,6],[100,20]],
  // Australia
  [[116,-22],[138,-14],[148,-20],[154,-28],[148,-40],[136,-38],[130,-32],[116,-34],[114,-26],[116,-22]],
  // Japan rough
  [[130,34],[138,38],[144,42],[142,44],[138,42],[134,36],[130,34]],
];

// Color per delivery type
const TYPE_COLOR: Record<string, string> = {
  Remote:   "var(--color-blue)",
  "On-site":"var(--color-orange)",
  Hybrid:   "var(--color-cyan)",
};

interface MarkerData {
  id: string;
  lat: number;
  lon: number;
  hub?: boolean;
  deliveryType?: string;
}

interface Props {
  markers: MarkerData[];
  visibleIds: string[];
  activeId: string | null;
  hubId: string;
  onSelect: (id: string | null) => void;
  reduce: boolean;
}

function WorldMapChart({ markers, visibleIds, activeId, hubId, onSelect, reduce }: Props) {
  const hub = markers.find(m => m.id === hubId)!;
  const hubX = lonToX(hub.lon);
  const hubY = latToY(hub.lat);

  const markerById = Object.fromEntries(markers.map(m => [m.id, m]));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "100%", minHeight: 340 }}
      role="img"
      aria-label="Global delivery map"
    >
      <defs>
        <radialGradient id="mapBg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="var(--color-surface-2)" />
          <stop offset="100%" stopColor="var(--color-surface-1)" />
        </radialGradient>
        <filter id="glow-hub">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Ocean background */}
      <rect width={W} height={H} fill="url(#mapBg)" rx="8" />

      {/* Graticule — subtle grid lines every 30° */}
      <g stroke="var(--color-hairline)" strokeWidth={0.4} opacity={0.6}>
        {[-60,-30,0,30,60].map(lat => (
          <line key={`lat${lat}`} x1={0} y1={latToY(lat)} x2={W} y2={latToY(lat)} />
        ))}
        {[-120,-90,-60,-30,0,30,60,90,120,150].map(lon => (
          <line key={`lon${lon}`} x1={lonToX(lon)} y1={0} x2={lonToX(lon)} y2={H} />
        ))}
        {/* Equator bolder */}
        <line x1={0} y1={latToY(0)} x2={W} y2={latToY(0)} strokeWidth={0.8} opacity={0.8} />
      </g>

      {/* Land masses */}
      {LAND_OUTLINES.map((poly, i) => (
        <polygon
          key={i}
          points={poly.map(([lon, lat]) => `${lonToX(lon)},${latToY(lat)}`).join(" ")}
          fill="var(--color-surface-3)"
          stroke="var(--color-hairline-strong)"
          strokeWidth={0.5}
          strokeLinejoin="round"
        />
      ))}

      {/* Routes from hub to each marker */}
      {markers.filter(m => m.id !== hubId).map(dest => {
        const dx = lonToX(dest.lon);
        const dy = latToY(dest.lat);
        const isVisible = visibleIds.includes(dest.id);
        const isActive = activeId === dest.id;
        const color = TYPE_COLOR[dest.deliveryType ?? ""] ?? "var(--color-blue)";
        const isBrazil = dest.id === "br";

        // Great-circle approximation: curve through midpoint lifted toward top
        const mx = (hubX + dx) / 2;
        const my = (hubY + dy) / 2 - 40;

        return (
          <g key={`route-${dest.id}`}>
            <path
              d={`M ${hubX} ${hubY} Q ${mx} ${my} ${dx} ${dy}`}
              fill="none"
              stroke={color}
              strokeWidth={isActive ? 1.8 : isBrazil ? 1.0 : 0.7}
              strokeOpacity={isVisible ? (isActive ? 0.9 : isBrazil ? 0.55 : 0.35) : 0.05}
              strokeDasharray={isActive ? undefined : "3 6"}
              strokeLinecap="round"
            />
            {/* Animated packet along route */}
            {isVisible && !reduce && (
              <path
                d={`M ${hubX} ${hubY} Q ${mx} ${my} ${dx} ${dy}`}
                fill="none"
                stroke={color}
                strokeWidth={isActive ? 3 : 2}
                strokeOpacity={isActive ? 0.9 : 0.6}
                strokeLinecap="round"
                strokeDasharray="5 250"
                style={{ animation: `packet-travel ${isActive ? 1.6 : 2.6}s linear infinite` }}
              />
            )}
          </g>
        );
      })}

      {/* Markers */}
      {markers.map(marker => {
        const mx = lonToX(marker.lon);
        const my = latToY(marker.lat);
        const isHub = marker.id === hubId;
        const isVisible = visibleIds.includes(marker.id);
        const isActive = activeId === marker.id;
        const color = isHub ? "var(--color-ok)" : (TYPE_COLOR[marker.deliveryType ?? ""] ?? "var(--color-blue)");
        const r = isHub ? 7 : isActive ? 6 : 4.5;

        return (
          <g
            key={marker.id}
            style={{ cursor: "pointer" }}
            opacity={isVisible ? 1 : 0.12}
            onClick={() => onSelect(isActive ? null : marker.id)}
            onMouseEnter={() => onSelect(marker.id)}
            onMouseLeave={() => onSelect(null)}
          >
            {/* Hub pulse rings */}
            {isHub && !reduce && (
              <>
                <m.circle cx={mx} cy={my} r={r + 4} fill="none" stroke={color} strokeWidth={0.6}
                  initial={{ scale: 0.7, opacity: 0.7 }} animate={{ scale: 2.8, opacity: 0 }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
                  style={{ transformOrigin: `${mx}px ${my}px` }}
                />
                <m.circle cx={mx} cy={my} r={r + 2} fill="none" stroke={color} strokeWidth={0.8}
                  initial={{ scale: 0.8, opacity: 0.8 }} animate={{ scale: 2.0, opacity: 0 }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0.9 }}
                  style={{ transformOrigin: `${mx}px ${my}px` }}
                />
              </>
            )}
            {/* Selection ring */}
            {isActive && !isHub && (
              <circle cx={mx} cy={my} r={r + 5} fill="none" stroke={color} strokeWidth={1} opacity={0.35} />
            )}
            {/* Dot */}
            <circle cx={mx} cy={my} r={r} fill={color}
              stroke={isHub ? "var(--color-surface-0)" : "transparent"}
              strokeWidth={isHub ? 2.5 : 0}
              filter={isHub ? "url(#glow-hub)" : undefined}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default memo(WorldMapChart);
