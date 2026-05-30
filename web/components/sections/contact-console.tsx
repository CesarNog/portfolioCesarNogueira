import { Section } from "@/components/sections/section";
import { Magnetic } from "@/components/ui/magnetic";
import { siteConfig } from "@/lib/site-config";

export function ContactConsole() {
  const rows = [
    { k: "Email", v: siteConfig.links.email, href: `mailto:${siteConfig.links.email}` },
    { k: "LinkedIn", v: "in/cesarnog", href: siteConfig.links.linkedin },
    { k: "GitHub", v: "@cesarnog", href: siteConfig.links.github },
    { k: "Location", v: siteConfig.location },
    { k: "Response time", v: siteConfig.responseTime },
  ];

  return (
    <Section
      id="contact"
      label="Mission Briefing Console"
      title="Let's architect your next platform"
      intro={siteConfig.tagline}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="panel rounded-lg p-6">
          <div className="flex items-center gap-3">
            <span className="status-dot" />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-ok)]">
              {siteConfig.availability}
            </span>
          </div>
          <dl className="mt-6 divide-y divide-[var(--color-hairline)]">
            {rows.map((r) => (
              <div key={r.k} className="flex items-center justify-between gap-4 py-3">
                <dt className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  {r.k}
                </dt>
                <dd className="text-sm text-[var(--color-fg)]">
                  {r.href ? (
                    <a
                      href={r.href}
                      target={r.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="hover:text-[var(--color-blue)]"
                    >
                      {r.v}
                    </a>
                  ) : (
                    r.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="panel accent-blue glow flex flex-col justify-between rounded-lg p-6">
          <div>
            <h3 className="font-display text-2xl text-[var(--color-fg)]">
              Open a briefing
            </h3>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              Cloud architecture, platform engineering, DevOps, FinOps or AI
              infrastructure — tell me what you're building.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Magnetic>
              <a
                href={`mailto:${siteConfig.links.email}?subject=Project%20Briefing`}
                className="bg-accent inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Email Cesar
              </a>
            </Magnetic>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-[var(--color-hairline-strong)] px-4 py-2.5 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]"
              >
                LinkedIn ↗
              </a>
              <a
                href={siteConfig.links.cv}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-[var(--color-hairline-strong)] px-4 py-2.5 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]"
              >
                Download CV ↧
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
