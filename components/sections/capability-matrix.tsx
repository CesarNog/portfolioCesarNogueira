"use client";

import { m, useReducedMotion } from "motion/react";
import { Section } from "@/components/sections/section";
import { capabilities } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import { EASE, DUR } from "@/lib/motion";

const ACCENT: Record<string, string> = {
  blue: "var(--color-blue)",
  cyan: "var(--color-cyan)",
  orange: "var(--color-orange)",
};

export function CapabilityMatrix() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <Section
      id="capabilities"
      label={t.sections.capabilities.label}
      title={t.sections.capabilities.title}
      intro={t.sections.capabilities.intro}
    >
      {/* Editorial skills table — no card borders, horizontal rows */}
      <div className="divide-y divide-[var(--color-hairline)]">
        {capabilities.map((c, i) => (
          <m.div
            key={c.area}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: DUR.reveal, delay: i * 0.05, ease: EASE.out }}
            className="grid gap-3 py-7 sm:grid-cols-[1fr_2fr] sm:gap-8 lg:grid-cols-[220px_1fr_auto]"
          >
            {/* Area + level */}
            <div className="flex items-start gap-3">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: ACCENT[c.accent] }}
                aria-hidden
              />
              <div>
                <p className="font-medium text-[var(--color-fg)]">{t.capabilities[i]?.area ?? c.area}</p>
                <span
                  className="mt-1 inline-block font-mono text-[10px] uppercase tracking-wider"
                  style={{ color: ACCENT[c.accent] }}
                >
                  {t.capabilities[i]?.level ?? c.level}
                </span>
              </div>
            </div>

            {/* Note */}
            <p className="pl-5 text-[15px] leading-relaxed text-[var(--color-fg-muted)] sm:pl-0">
              {t.capabilities[i]?.note ?? c.note}
            </p>

            {/* Tools */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 pl-5 sm:pl-0 lg:justify-end">
              {c.tools.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-[11px] text-[var(--color-fg-subtle)]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </m.div>
        ))}
      </div>
    </Section>
  );
}
