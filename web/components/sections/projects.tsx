"use client";

import { m, useReducedMotion } from "motion/react";
import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import { cardHover } from "@/lib/motion";

export function Projects() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  return (
    <Section
      id="work"
      label={t.sections.work.label}
      title={t.sections.work.title}
      intro={t.sections.work.intro}
    >
      <div className="space-y-8">
        {projects.map((p, i) => {
          // Translated fields — fall back to site-config values if key missing
          const tr = t.projects[p.id];
          const category   = tr?.category   ?? p.category;
          const title      = tr?.title      ?? p.title;
          const client     = tr?.client     ?? p.client;
          const problem    = tr?.problem    ?? p.problem;
          const architecture = tr?.architecture ?? p.architecture;
          const scale      = tr?.scale      ?? p.scale;
          const impact     = tr?.impact     ?? p.impact;
          const outcome    = tr?.outcome    ?? p.outcome;
          const lessons    = tr?.lessons    ?? ("lessons" in p ? p.lessons : undefined);
          const metricLabel = tr?.metricLabel ?? p.metricLabel;

          return (
            <Reveal key={p.id} delay={i * 0.05}>
              <m.article
                data-recruiter-highlight
                whileHover={reduce ? undefined : cardHover}
                className="panel grid gap-8 rounded-xl p-8 transition-colors hover:border-[var(--color-hairline-strong)] md:grid-cols-[1fr_2fr]"
              >
                {/* Left: metric + title */}
                <div className="flex flex-col justify-between gap-6">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-blue)]">
                      {category}
                    </span>
                    <p className="font-display mt-4 text-5xl text-[var(--color-fg)]">{p.metric}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                      {metricLabel}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-fg)]">{title}</h3>
                    <p className="mt-1 font-mono text-xs text-[var(--color-fg-subtle)]">
                      {client} · {scale}
                    </p>
                  </div>
                </div>

                {/* Right: challenge / approach / outcome */}
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label={t.labels.problem} value={problem} />
                    <Field label={t.labels.architecture} value={architecture} />
                  </div>

                  <div className="border-t border-[var(--color-hairline)] pt-5">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ok)]">
                      {t.labels.businessResult}
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-fg)]">
                      {outcome}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                      {impact.map((it) => (
                        <li key={it} className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
                          <span className="text-[var(--color-ok)]">✓</span>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {lessons && (
                    <div className="border-l-2 border-[var(--color-blue)] pl-4">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-blue)]">
                        {t.labels.lessons}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-fg-muted)] italic">
                        {lessons}
                      </p>
                    </div>
                  )}

                  {/* Tech — plain mono text, technical terms stay in English */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {p.tech.map((tech) => (
                      <span key={tech} className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </m.article>
            </Reveal>
          );
        })}
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
      <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-fg-muted)]">{value}</p>
    </div>
  );
}
