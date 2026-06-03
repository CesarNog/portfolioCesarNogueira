"use client";

import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { trust } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

export function Trust() {
  const { t } = useI18n();
  return (
    <Section
      id="trust"
      label={t.sections.trust.label}
      title={t.sections.trust.title}
      intro={t.sections.trust.intro}
    >
      {/* Signal stats */}
      <div
        data-recruiter-highlight
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--color-hairline)] sm:grid-cols-3"
      >
        {trust.signals.map((s) => (
          <div key={s.label} className="bg-[var(--color-surface-1)] px-6 py-7 text-center">
            <p className="font-display text-4xl text-[var(--color-fg)] sm:text-5xl">{s.value}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Reveal>
          <TrustCard title={t.labels.trustCompanies} items={trust.companies} />
        </Reveal>
        <Reveal delay={0.05}>
          <TrustCard title={t.labels.trustIndustries} items={trust.industries} />
        </Reveal>
        <Reveal delay={0.1}>
          <TrustCard title={t.labels.trustClouds} items={trust.clouds} />
        </Reveal>
      </div>
    </Section>
  );
}

function TrustCard({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="panel h-full rounded-lg p-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
        {title}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((it) => (
          <span
            key={it}
            className="rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-2)] px-2.5 py-1 text-sm text-[var(--color-fg)]"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
