"use client";

import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { certifications } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

export function Certifications() {
  const { t } = useI18n();
  return (
    <Section
      id="certifications"
      label={t.sections.certifications.label}
      title={t.sections.certifications.title}
      intro={t.sections.certifications.intro}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {certifications.map((cat, i) => (
          <Reveal key={cat.group} delay={i * 0.05}>
            <div data-recruiter-highlight className={`panel accent-${cat.accent} h-full rounded-lg p-5`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[var(--color-fg)]">
                  {cat.group}
                </h3>
                <span className="text-accent font-mono text-[11px] uppercase tracking-wider">
                  {cat.items.length} {t.labels.verified}
                </span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {cat.items.map((it) => (
                  <li
                    key={it.name}
                    className="flex items-center gap-3 border-t border-[var(--color-hairline)] pt-2.5 first:border-0 first:pt-0"
                  >
                    <span
                      className="text-accent grid h-5 w-5 place-items-center rounded-full border border-[var(--color-hairline-strong)] text-[11px]"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span className="flex-1 text-sm text-[var(--color-fg)]">
                      {it.name}
                    </span>
                    {"note" in it && it.note && (
                      <span className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
                        {it.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
