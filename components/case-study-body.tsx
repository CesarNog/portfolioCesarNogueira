"use client";

import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

type Project = (typeof projects)[number];

export function CaseStudyBody({ project: p }: { project: Project }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const tr = t.projects[p.id];
  const category = tr?.category ?? p.category;
  const title = tr?.title ?? p.title;
  const client = tr?.client ?? p.client;
  const problem = tr?.problem ?? p.problem;
  const architecture = tr?.architecture ?? p.architecture;
  const scale = tr?.scale ?? p.scale;
  const impact = tr?.impact ?? p.impact;
  const outcome = tr?.outcome ?? p.outcome;
  const lessons = tr?.lessons ?? p.lessons;
  const metricLabel = tr?.metricLabel ?? p.metricLabel;

  return (
    <article>
      <Reveal>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-blue)]">
          {category}
        </span>
        <h1 className="font-display mt-4 text-[clamp(2rem,4vw+0.5rem,3.25rem)] leading-[1.1] text-[var(--color-fg)] [text-wrap:balance]">
          {title}
        </h1>
        <p className="mt-3 font-mono text-[13px] text-[var(--color-fg-subtle)]">
          {client} · {scale}
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-10 flex items-baseline gap-4 border-y border-[var(--color-hairline)] py-6">
          <p className="font-display text-6xl text-[var(--color-fg)]">{p.metric}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
            {metricLabel}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              {t.labels.problem}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-fg-muted)]">{problem}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              {t.labels.architecture}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-fg-muted)]">{architecture}</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-10 border-t border-[var(--color-hairline)] pt-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ok)]">
            {t.labels.businessResult}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-fg)]">{outcome}</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {impact.map((it) => (
              <li key={it} className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
                <span className="text-[var(--color-ok)]">✓</span>
                {it}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {lessons && (
        <Reveal delay={0.2}>
          <div className="mt-10 rounded border border-[var(--color-blue)]/20 bg-[var(--color-blue)]/5 px-5 py-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-blue)]">
              {t.labels.lessons}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-fg-muted)] italic [text-wrap:pretty]">
              {lessons}
            </p>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.25}>
        <div className="mt-10 flex flex-wrap gap-x-5 gap-y-1">
          {p.tech.map((tech) => (
            <span key={tech} className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
              {tech}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-16 flex flex-col items-start gap-4 border-t border-[var(--color-hairline)] pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-[var(--color-fg-muted)]">
            Have a similar problem to solve?
          </p>
          <m.div whileTap={reduce ? undefined : { scale: 0.97 }}>
            <Link
              href="/#contact"
              className="inline-flex items-center rounded-md px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0"
              style={{ backgroundColor: "var(--color-button-primary)" }}
            >
              Let&apos;s talk
            </Link>
          </m.div>
        </div>
      </Reveal>
    </article>
  );
}
