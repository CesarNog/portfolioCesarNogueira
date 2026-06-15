"use client";

import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { testimonials } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

export function Testimonials() {
  const { t } = useI18n();
  return (
    <Section
      id="testimonials"
      label={t.sections.testimonials.label}
      title={t.sections.testimonials.title}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05}>
            <figure className="panel h-full rounded-lg p-6">
              <blockquote className="text-sm leading-relaxed text-[var(--color-fg)]">
                "{t.text}"
              </blockquote>
              <figcaption className="mt-4 border-t border-[var(--color-hairline)] pt-3">
                <p className="text-sm text-[var(--color-fg)]">{t.name}</p>
                <p className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
                  {t.title}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
