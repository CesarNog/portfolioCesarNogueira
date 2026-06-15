"use client";

import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { capabilities } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

const ACCENT: Record<string, string> = {
  blue: "var(--color-blue)",
  cyan: "var(--color-cyan)",
  orange: "var(--color-orange)",
};

export function CapabilityMatrix() {
  const { t } = useI18n();
  return (
    <Section
      id="capabilities"
      label={t.sections.capabilities.label}
      title={t.sections.capabilities.title}
      intro={t.sections.capabilities.intro}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((c, i) => (
          <Reveal key={c.area} delay={(i % 4) * 0.04}>
            <article className="panel flex h-full flex-col rounded-lg p-5 transition-colors hover:border-[var(--color-hairline-strong)]">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-[var(--color-fg)]">{c.area}</h3>
                <span
                  className="h-2 w-2 shrink-0 translate-y-1.5 rounded-full"
                  style={{ background: ACCENT[c.accent] }}
                  aria-hidden
                />
              </div>
              <span
                className="mt-2 w-fit rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                style={{ color: ACCENT[c.accent], borderColor: "var(--color-hairline-strong)" }}
              >
                {c.level}
              </span>
              <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[var(--color-fg-muted)]">
                {c.note}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--color-hairline)] pt-3">
                {c.tools.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] text-[var(--color-fg-subtle)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
