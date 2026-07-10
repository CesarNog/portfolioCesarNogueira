"use client";

import { useI18n } from "@/lib/i18n";

/**
 * Optical-scanner reticle for the intro sequence: dashed rotating rings,
 * tick ring, crosshair, corner brackets, and a radar sweep. Pure SVG/CSS —
 * deterministic markup (tick angles are computed, never random) so SSR and
 * client agree. Single blue accent per the Domain-Color Rule.
 *
 * Rendered only inside IntroSequence, which itself renders nothing under
 * prefers-reduced-motion — so the constant spin animations here never reach
 * reduced-motion visitors.
 */
export function ScanReticle({
  className = "",
  ref,
}: {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const { t } = useI18n();
  const ticks = Array.from({ length: 60 }, (_, i) => (i * 360) / 60);

    return (
      <div ref={ref} className={`pointer-events-none relative ${className}`} aria-hidden>
        {/* Radar sweep — conic gradient wedge, slow spin */}
        <div
          className="absolute inset-[10%] animate-spin rounded-full"
          style={{
            animationDuration: "7s",
            background:
              "conic-gradient(from 0deg, color-mix(in oklab, var(--color-blue) 22%, transparent) 0deg, transparent 55deg, transparent 360deg)",
            maskImage: "radial-gradient(circle, black 0%, black 68%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle, black 0%, black 68%, transparent 70%)",
          }}
        />

        <svg viewBox="0 0 400 400" className="relative h-full w-full" fill="none">
          {/* Outer dashed ring — rotates slowly */}
          <g className="origin-center animate-spin" style={{ animationDuration: "26s" }}>
            <circle
              cx="200" cy="200" r="176"
              stroke="var(--color-blue)" strokeOpacity="0.55" strokeWidth="1"
              strokeDasharray="10 14"
            />
          </g>
          {/* Tick ring — counter-rotates */}
          <g
            className="origin-center animate-spin"
            style={{ animationDuration: "40s", animationDirection: "reverse" }}
            stroke="var(--color-blue)" strokeOpacity="0.7" strokeWidth="1.5"
          >
            {ticks.map((deg) => {
              const major = deg % 30 === 0;
              const r1 = major ? 148 : 156;
              const rad = (deg * Math.PI) / 180;
              // toFixed(2): Math.cos/sin can differ by an ULP between the
              // server's and the browser's JS engine, which changes the
              // serialized attribute string and trips hydration. Two decimals
              // is far beyond visual precision and identical everywhere.
              const x1 = (200 + r1 * Math.cos(rad)).toFixed(2);
              const y1 = (200 + r1 * Math.sin(rad)).toFixed(2);
              const x2 = (200 + 164 * Math.cos(rad)).toFixed(2);
              const y2 = (200 + 164 * Math.sin(rad)).toFixed(2);
              return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity={major ? 0.8 : 0.35} />;
            })}
          </g>
          {/* Inner dotted ring */}
          <circle
            cx="200" cy="200" r="104"
            stroke="var(--color-blue)" strokeOpacity="0.4" strokeWidth="1"
            strokeDasharray="2 8"
          />
          {/* Crosshair */}
          <g stroke="var(--color-blue)" strokeOpacity="0.6" strokeWidth="1.5">
            <line x1="24" y1="200" x2="64" y2="200" />
            <line x1="336" y1="200" x2="376" y2="200" />
            <line x1="200" y1="140" x2="200" y2="168" />
            <line x1="200" y1="232" x2="200" y2="260" />
          </g>
          {/* Center dot */}
          <circle cx="200" cy="200" r="4" stroke="var(--color-blue)" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="1.5" fill="var(--color-blue)" />
          {/* Corner brackets */}
          <g stroke="var(--color-blue)" strokeOpacity="0.8" strokeWidth="2">
            <path d="M84 64 H64 V84" />
            <path d="M316 64 H336 V84" />
            <path d="M84 336 H64 V316" />
            <path d="M316 336 H336 V316" />
          </g>
        </svg>

        {/* Labels */}
        <span className="absolute left-1/2 top-[6%] -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blue)]/80">
          ◆ {t.intro.scan} ◆
        </span>
        <span className="absolute bottom-[6%] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          {t.intro.calibrating} · UP2CLOUD
        </span>
      </div>
    );
}
