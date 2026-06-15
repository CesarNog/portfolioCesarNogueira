"use client";

import { m, useReducedMotion } from "motion/react";
import { Section } from "@/components/sections/section";
import { finops } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

const ACCENT: Record<string, string> = {
  blue: "var(--color-blue)",
  cyan: "var(--color-cyan)",
  orange: "var(--color-orange)",
};

// A small illustrative cost-trend sparkline (downward = savings).
const TREND = [62, 58, 60, 51, 47, 44, 40, 36, 33, 30, 28];

export function FinOps() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const max = Math.max(...TREND);
  const min = Math.min(...TREND);
  const pts = TREND.map((v, i) => {
    const x = (i / (TREND.length - 1)) * 100;
    const y = 100 - ((v - min) / (max - min)) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <Section
      id="finops"
      label={t.sections.finops.label}
      title={t.sections.finops.title}
      intro={t.sections.finops.intro}
    >
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* Cost dashboard */}
        <div className="panel accent-orange rounded-lg p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Monthly cloud spend · optimized
            </p>
            <span className="text-accent font-mono text-xs">▼ 28% YoY</span>
          </div>
          <div className="mt-4 h-40">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <defs>
                <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-orange)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--color-orange)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0,100 ${pts} 100,100`} fill="url(#fill)" />
              <m.polyline
                points={pts}
                fill="none"
                stroke="var(--color-orange)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={reduce ? undefined : { pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            </svg>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {finops.metrics.slice(0, 3).map((metric) => (
              <div key={metric.label} className="panel-2 rounded-md p-3">
                <p
                  className="font-display text-xl"
                  style={{ color: ACCENT[metric.accent] }}
                >
                  {metric.value}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-[var(--color-fg-subtle)]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pillars */}
        <div className="panel rounded-lg p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Operating model
          </p>
          <ul className="mt-4 grid gap-2.5">
            {finops.pillars.map((p, i) => (
              <li
                key={p}
                className="flex items-center gap-3 border-t border-[var(--color-hairline)] pt-2.5 first:border-0 first:pt-0"
              >
                <span className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-[var(--color-fg)]">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
