import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { trust } from "@/lib/site-config";

export function Trust() {
  return (
    <Section
      id="trust"
      label="Enterprise Validation"
      title="Trusted with regulated, mission-critical systems"
      intro="Banks, airlines and global enterprises — across four cloud providers and six industries."
    >
      {/* Signal stats */}
      <div
        data-recruiter-highlight
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--color-hairline)] sm:grid-cols-3 lg:grid-cols-6"
      >
        {trust.signals.map((s) => (
          <div key={s.label} className="bg-[var(--color-surface-1)] p-5 text-center">
            <p className="font-display text-2xl text-[var(--color-fg)] sm:text-3xl">{s.value}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Reveal>
          <TrustCard title="Companies worked with" items={trust.companies} />
        </Reveal>
        <Reveal delay={0.05}>
          <TrustCard title="Industries served" items={trust.industries} />
        </Reveal>
        <Reveal delay={0.1}>
          <TrustCard title="Cloud providers" items={trust.clouds} />
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
