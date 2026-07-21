"use client";

import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import { cardHover } from "@/lib/motion";

export function CaseStudiesIndexBody() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <div className="mt-12 space-y-6">
      {projects.map((p, i) => {
        const tr = t.projects[p.id];
        const category = tr?.category ?? p.category;
        const title = tr?.title ?? p.title;
        const client = tr?.client ?? p.client;
        const outcome = tr?.outcome ?? p.outcome;
        const metricLabel = tr?.metricLabel ?? p.metricLabel;

        return (
          <Reveal key={p.id} delay={i * 0.05}>
            <Link href={`/case-studies/${p.id}`} className="block">
              <m.article
                whileHover={reduce ? undefined : cardHover}
                className="panel grid gap-6 rounded-xl p-6 transition-colors hover:border-[var(--color-hairline-strong)] sm:grid-cols-[auto_1fr] sm:items-center sm:p-8"
              >
                <div className="text-left sm:text-center">
                  <p className="font-display text-4xl text-[var(--color-fg)]">{p.metric}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                    {metricLabel}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-blue)]">
                    {category}
                  </span>
                  <h2 className="mt-2 text-lg font-medium text-[var(--color-fg)]">{title}</h2>
                  <p className="mt-1 font-mono text-xs text-[var(--color-fg-subtle)]">{client}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-fg-muted)]">{outcome}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-[var(--color-blue)]">
                    Read the full case study →
                  </span>
                </div>
              </m.article>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
