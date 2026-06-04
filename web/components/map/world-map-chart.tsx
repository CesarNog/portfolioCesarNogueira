"use client";

import { memo } from "react";
import { m } from "motion/react";

const W = 800;
const H = 420;

function lonToX(lon: number) { return ((lon + 180) / 360) * W; }
function latToY(lat: number) { return ((90 - lat) / 180) * H; }

// Significantly improved land outlines — geographically recognizable at this scale.
// Each polygon is a [lon, lat][] sequence; equirectangular projection applied in render.
const LAND_OUTLINES: [number, number][][] = [
  // Europe mainland — includes Scandinavia in one merged polygon.
  // Baltic Sea appears as land (acceptable at this scale; current code has far worse errors).
  [
    [-9,37],[-6,36],[-2,36],[3,40],[5,43],[8,44],[10,44],
    [12,44],[14,46],[18,42],[20,38],[24,38],[26,40],[28,46],[28,50],[24,54],
    [28,54],[30,58],[30,64],[28,68],[26,70],[20,70],
    [16,68],[14,65],[16,62],[20,60],[18,57],
    [12,56],[8,55],[5,54],[10,54],[8,48],
    [3,52],[0,51],[-2,50],[-5,48],[-8,44],[-9,44],[-9,37],
  ],
  // Italy (boot peninsula)
  [[8,46],[12,46],[14,44],[16,40],[18,38],[15,38],[14,42],[10,44],[8,46]],
  // Greece
  [[20,42],[24,40],[26,38],[22,36],[20,38],[20,42]],
  // UK — Great Britain
  [[-6,50],[-1,50],[1,52],[1,54],[-1,58],[-3,58],[-5,58],[-6,54],[-6,50]],
  // Ireland
  [[-10,52],[-6,52],[-6,54],[-8,55],[-10,54],[-10,52]],
  // Iceland
  [[-24,63],[-14,63],[-14,66],[-22,66],[-24,63]],
  // Greenland
  [[-44,60],[-22,62],[-18,72],[-30,76],[-44,78],[-54,76],[-58,70],[-52,62],[-44,60]],
  // North Africa (Atlas/Sahara coast)
  [[-18,16],[50,12],[52,22],[52,36],[36,36],[12,36],[0,36],[-6,36],[-18,28],[-18,16]],
  // Sub-Saharan Africa (Gulf of Guinea to Cape)
  [[-18,16],[50,12],[52,-26],[36,-34],[18,-36],[14,-28],[10,-28],[-18,-4],[-18,16]],
  // Arabian Peninsula + Levant
  [[36,36],[56,22],[60,22],[60,12],[50,12],[44,12],[36,22],[36,36]],
  // South Asia — India
  [[60,22],[80,22],[80,12],[74,8],[68,8],[60,22]],
  // Central + East Asia (China, Siberia)
  [[80,22],[122,22],[124,32],[122,40],[120,52],[110,52],[90,50],[80,30],[80,22]],
  // Russian Far East
  [[120,52],[140,50],[144,44],[140,40],[122,40],[120,52]],
  // Southeast Asia (Indochina + Malay Peninsula)
  [[96,8],[108,4],[120,10],[120,22],[110,22],[100,20],[96,8]],
  // Sumatra + Java approximation
  [[96,4],[108,4],[116,-8],[104,-8],[96,4]],
  // Borneo
  [[108,4],[118,6],[118,-4],[108,-4],[108,4]],
  // Australia
  [[114,-22],[138,-14],[148,-18],[154,-28],[150,-38],[140,-40],[136,-38],[130,-32],[116,-34],[114,-22]],
  // Japan (Honshu + Kyushu simplified)
  [[130,34],[138,38],[142,40],[140,44],[136,38],[132,34],[130,34]],
  // South America
  [[-80,2],[-68,12],[-52,6],[-36,-6],[-34,-22],[-50,-34],[-68,-56],[-74,-52],[-80,-2],[-80,2]],
  // North America (Atlantic + Pacific coasts; Gulf of Mexico shown as land — acceptable simplification)
  [
    [-168,72],[-154,60],[-130,54],[-124,48],[-116,34],[-110,23],
    [-90,16],[-84,10],[-82,10],
    [-80,26],[-82,30],[-76,38],[-72,42],[-66,44],
    [-52,47],[-60,48],[-78,62],[-100,72],[-140,76],[-168,72],
  ],
];

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

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "100%", minHeight: 380 }}
      role="img"
      aria-label="Global delivery map — based in Portugal, delivering across Europe and the Americas"
    >
      <defs>
        {/* Ocean: subtle blue-tinted dark gradient */}
        <radialGradient id="mapBg" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--color-blue) 5%, var(--color-surface-1))" />
          <stop offset="100%" stopColor="var(--color-surface-0)" />
        </radialGradient>
        <filter id="glow-hub" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-active" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Ocean background */}
      <rect width={W} height={H} fill="url(#mapBg)" />

      {/* Graticule — subtle grid every 30° */}
      <g stroke="var(--color-hairline)" strokeWidth={0.3} opacity={0.45}>
        {[-60,-30,0,30,60].map(lat => (
          <line key={`lat${lat}`}
            x1={0} y1={latToY(lat)} x2={W} y2={latToY(lat)}
            strokeWidth={lat === 0 ? 0.7 : 0.3}
            opacity={lat === 0 ? 0.7 : 0.45}
          />
        ))}
        {[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(lon => (
          <line key={`lon${lon}`} x1={lonToX(lon)} y1={0} x2={lonToX(lon)} y2={H} />
        ))}
      </g>

      {/* Land masses */}
      {LAND_OUTLINES.map((poly, i) => (
        <polygon
          key={i}
          points={poly.map(([lon, lat]) => `${lonToX(lon)},${latToY(lat)}`).join(" ")}
          fill="var(--color-surface-2)"
          stroke="var(--color-hairline-strong)"
          strokeWidth={0.5}
          strokeLinejoin="round"
        />
      ))}

      {/* Routes — quadratic bezier arcs from hub, lifted northward */}
      {markers.filter(m => m.id !== hubId).map(dest => {
        const dx = lonToX(dest.lon);
        const dy = latToY(dest.lat);
        const isVisible = visibleIds.includes(dest.id);
        const isActive = activeId === dest.id;
        const color = TYPE_COLOR[dest.deliveryType ?? ""] ?? "var(--color-blue)";

        const dist = Math.sqrt((dx - hubX) ** 2 + (dy - hubY) ** 2);
        const lift = Math.min(dist * 0.38, 110);
        const mx = (hubX + dx) / 2;
        const my = Math.min(hubY, dy) - lift;
        const d = `M ${hubX} ${hubY} Q ${mx} ${my} ${dx} ${dy}`;

        return (
          <g key={`route-${dest.id}`}>
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={isActive ? 1.6 : 0.8}
              strokeOpacity={isVisible ? (isActive ? 0.9 : 0.28) : 0.04}
              strokeDasharray={isActive ? undefined : "4 8"}
              strokeLinecap="round"
            />
            {/* Animated packet — uses globals.css @keyframes packet-travel (dashoffset 204→0, array "5 250") */}
            {isVisible && !reduce && (
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={isActive ? 3 : 2}
                strokeOpacity={isActive ? 0.95 : 0.55}
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
        const r = isHub ? 6 : isActive ? 5.5 : 4;

        return (
          <g
            key={marker.id}
            style={{ cursor: "pointer" }}
            opacity={isVisible ? 1 : 0.07}
            onClick={() => onSelect(isActive ? null : marker.id)}
            onMouseEnter={() => onSelect(marker.id)}
            onMouseLeave={() => onSelect(null)}
          >
            {/* Hub: two staggered pulse rings */}
            {isHub && !reduce && (
              <>
                <m.circle cx={mx} cy={my} r={r + 6}
                  fill="none" stroke={color} strokeWidth={0.5}
                  initial={{ scale: 0.6, opacity: 0.8 }}
                  animate={{ scale: 3.2, opacity: 0 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                  style={{ transformOrigin: `${mx}px ${my}px` }}
                />
                <m.circle cx={mx} cy={my} r={r + 3}
                  fill="none" stroke={color} strokeWidth={0.7}
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
                  style={{ transformOrigin: `${mx}px ${my}px` }}
                />
              </>
            )}
            {/* Active marker selection ring */}
            {isActive && !isHub && (
              <circle cx={mx} cy={my} r={r + 7}
                fill="none" stroke={color} strokeWidth={1} opacity={0.35}
              />
            )}
            {/* Core dot */}
            <circle cx={mx} cy={my} r={r}
              fill={color}
              stroke={isHub ? "var(--color-surface-0)" : "none"}
              strokeWidth={isHub ? 2 : 0}
              filter={isHub || isActive ? "url(#glow-hub)" : undefined}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default memo(WorldMapChart);
