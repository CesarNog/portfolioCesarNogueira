import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { executiveSummary } from "@/lib/site-config";

export function ExecutiveSummary() {
  return (
    <Section
      id="summary"
      label="Executive Summary"
      title="A senior cloud consultant, summarized for decision-makers"
      intro="The 30-second brief: who Cesar is, why he's different, what he solves, and how to engage."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {executiveSummary.map((c, i) => (
          <Reveal key={c.k} delay={i * 0.05}>
            <article
              data-recruiter-highlight
              className="panel h-full rounded-lg p-6 transition-colors hover:border-[var(--color-hairline-strong)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-blue)]">
                  {c.title}
                </span>
                <span className="font-mono text-xs text-[var(--color-fg-subtle)]">{c.k}</span>
              </div>
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
    </Section>
  );
}
