"use client";

import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/lib/i18n";
import { PORTRAIT_SRC } from "@/lib/images";
import { siteConfig } from "@/lib/site-config";

export function ExecutiveSummary() {
  const { t } = useI18n();

  return (
    <Section
      id="summary"
      label={t.sections.summary.label}
      title={t.sections.summary.title}
      intro={t.sections.summary.intro}
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        {/* Portrait */}
        <Reveal>
          <figure
            data-recruiter-highlight
            className="panel overflow-hidden rounded-xl lg:max-w-[340px] mx-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PORTRAIT_SRC}
              alt={`${siteConfig.name} — ${siteConfig.shortRole}`}
              width={340}
              height={453}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover object-top"
            />
            <figcaption className="flex items-center justify-between gap-3 border-t border-[var(--color-hairline)] px-4 py-3">
              <div>
                <p className="text-sm text-[var(--color-fg)]">{siteConfig.name}</p>
                <p className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
                  {siteConfig.company} · {siteConfig.location.split("·")[0].trim()}
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                {t.portraitCaption}
              </span>
            </figcaption>
          </figure>
        </Reveal>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {t.exec.map((c, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <article
                data-recruiter-highlight
                className="panel h-full rounded-lg p-6 transition-all duration-200 hover:border-[var(--color-blue)]/40 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-blue)_12%,transparent)]"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-blue)]">
                  {c.title}
                </span>
                <h3 className="font-display mt-3 text-xl leading-snug text-[var(--color-fg)]">
                  {c.headline}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {c.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
