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
      {/* Signal stats — gap-px creates hairlines; no outer border needed */}
      <div
        data-recruiter-highlight
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg sm:grid-cols-3"
        style={{ background: "var(--color-hairline)" }}
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

      {/* Companies, industries, cloud — flat editorial rows, no cards */}
      <div className="mt-16 divide-y divide-[var(--color-hairline)]">
        <Reveal>
          <TrustRow label={t.labels.trustCompanies} items={trust.companies} />
        </Reveal>
        <Reveal delay={0.05}>
          <TrustRow label={t.labels.trustIndustries} items={trust.industries} />
        </Reveal>
        <Reveal delay={0.1}>
          <TrustRow label={t.labels.trustClouds} items={trust.clouds} />
        </Reveal>
      </div>
    </Section>
  );
}

function TrustRow({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-10">
      <p className="w-36 shrink-0 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
        {label}
      </p>
      <p className="text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
        {items.join(" · ")}
      </p>
    </div>
  );
}
