"use client";

import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { aiCapabilities } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

export function AiInfra() {
  const { t } = useI18n();
  return (
    <Section
      id="ai"
      label={t.sections.ai.label}
      title={t.sections.ai.title}
      intro={t.sections.ai.intro}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {aiCapabilities.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.05}>
            <div className="panel accent-cyan group h-full rounded-lg p-6 transition-colors hover:border-[var(--color-hairline-strong)]">
              <div className="flex items-start gap-3">
                <span className="text-accent mt-0.5 font-mono text-sm">◇</span>
                <div>
                  <h3 className="text-base text-[var(--color-fg)]">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {c.desc}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 font-mono text-xs text-[var(--color-fg-subtle)]">
        // The Smart AI FAQ in the corner of this site is itself an AI integration —
        ask it anything about Cesar&apos;s fit for your role.
      </p>
    </Section>
  );
}
