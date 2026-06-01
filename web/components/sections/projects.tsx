"use client";

import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

export function Projects() {
  const { t } = useI18n();
  return (
    <Section
      id="work"
      label="Selected Impact Stories"
      title="Consulting-grade case studies, outcome-first"
      intro="Real engagements as Problem → Architecture → Result. The business outcome leads; the how follows."
    >
      <div className="space-y-4">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.05}>
            <article
              data-recruiter-highlight
              className="panel grid gap-6 rounded-lg p-6 transition-colors hover:border-[var(--color-hairline-strong)] md:grid-cols-[1fr_2fr]"
            >
              <div className="flex flex-col justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-blue)]">
                    {p.category}
                  </span>
                  <p className="font-display mt-3 text-4xl text-[var(--color-fg)]">{p.metric}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                    {p.metricLabel}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg text-[var(--color-fg)]">{p.title}</h3>
                  <p className="mt-1 font-mono text-xs text-[var(--color-fg-subtle)]">
                    {p.client} · {p.scale}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t.labels.problem} value={p.problem} />
                <Field label={t.labels.architecture} value={p.architecture} />
                <div className="sm:col-span-2 rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-2)] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ok)]">
                    {t.labels.businessResult}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-fg)]">
                    {p.outcome}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                    {p.impact.map((it) => (
                      <li
                        key={it}
                        className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)]"
                      >
                        <span className="text-[var(--color-ok)]">✓</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="sm:col-span-2 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-[var(--color-hairline)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-fg-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-fg-muted)]">{value}</p>
    </div>
  );
}
