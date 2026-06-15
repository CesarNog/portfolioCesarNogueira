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