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
      <div className="grid gap-6 sm:grid-cols-2">
        {certifications.map((cat, i) => (
          <Reveal key={cat.group} delay={i * 0.06}>
            <div data-recruiter-highlight className={`panel accent-${cat.accent} h-full rounded-xl p-7`}>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-[var(--color-fg)]">{cat.group}</h3>
                <span className="text-accent font-mono text-[11px] uppercase tracking-wider">
                  {cat.items.length} {t.labels.verified}
                </span>
              </div>
              {/* Items — spacing only, no internal hairlines */}
              <ul className="mt-6 space-y-4">
                {cat.items.map((it) => (
                  <li key={it.name} className="flex items-start gap-3">
                    <span
                      className="text-accent mt-0.5 text-sm font-medium"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <div className="flex-1">
                      <span className="text-[15px] text-[var(--color-fg)]">{it.name}</span>
                      {"note" in it && it.note && (
                        <span className="ml-2 font-mono text-[11px] text-[var(--color-fg-subtle)]">
                          {it.note}
                        </span>
                      )}
                    </div>
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
