import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { TopologyPlaceholder } from "@/components/topology/topology-placeholder";
import { siteConfig } from "@/lib/site-config";

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6">
        {/* Hero */}
        <section className="relative flex min-h-[88vh] flex-col justify-center py-24">
          <TopologyPlaceholder />
          <Reveal>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
              {siteConfig.role}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display max-w-3xl text-5xl leading-[1.05] text-[var(--color-fg)] sm:text-7xl">
              Building reliable, cost-efficient cloud platforms at scale.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-fg-muted)]">
              I help engineering organizations design resilient infrastructure,
              ship faster with platform engineering, and cut cloud spend through
              disciplined FinOps.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex items-center gap-4">
              <a
                href="#contact"
                className="border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-surface-0)] transition-opacity hover:opacity-90"
              >
                Get in touch
              </a>
              <a
                href="#work"
                className="border border-[var(--color-hairline-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]"
              >
                View work
              </a>
            </div>
          </Reveal>
        </section>

        {/* About */}
        <section id="about" className="border-t border-[var(--color-hairline)] py-24">
          <Reveal>
            <SectionLabel>About</SectionLabel>
            <p className="max-w-2xl text-xl leading-relaxed text-[var(--color-fg)]">
              Principal-level consultant with deep experience across AWS, Azure,
              Kubernetes, and Terraform. I partner with teams to turn fragile,
              expensive systems into platforms engineers actually want to build
              on.
            </p>
          </Reveal>
        </section>

        {/* Work / case studies */}
        <section id="work" className="border-t border-[var(--color-hairline)] py-24">
          <Reveal>
            <SectionLabel>Selected Work</SectionLabel>
          </Reveal>
          <div className="mt-8 grid gap-px overflow-hidden border border-[var(--color-hairline)] sm:grid-cols-2">
            {[
              {
                metric: "−42%",
                title: "Cloud cost reduction",
                desc: "FinOps program across multi-account AWS estate.",
              },
              {
                metric: "10×",
                title: "Deploy frequency",
                desc: "Internal developer platform on Kubernetes + GitOps.",
              },
              {
                metric: "−65%",
                title: "MTTR improvement",
                desc: "Observability and SLO-driven incident response.",
              },
              {
                metric: "99.98%",
                title: "Platform availability",
                desc: "Multi-region resilience and progressive delivery.",
              },
            ].map((c) => (
              <article
                key={c.title}
                className="bg-[var(--color-surface-1)] p-8 transition-colors hover:bg-[var(--color-surface-2)]"
              >
                <p className="font-display text-4xl text-[var(--color-accent)]">
                  {c.metric}
                </p>
                <h3 className="mt-4 text-lg text-[var(--color-fg)]">{c.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
                  {c.desc}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 font-mono text-xs text-[var(--color-fg-subtle)]">
            // Deep case studies (Problem → Architecture → Approach → Outcome)
            coming in stage 2.
          </p>
        </section>

        {/* Stack */}
        <section id="stack" className="border-t border-[var(--color-hairline)] py-24">
          <Reveal>
            <SectionLabel>Stack</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {siteConfig.knowsAbout.map((t) => (
                <span
                  key={t}
                  className="border border-[var(--color-hairline)] px-3 py-1.5 font-mono text-xs text-[var(--color-fg-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-[var(--color-hairline)] py-24">
          <Reveal>
            <SectionLabel>Contact</SectionLabel>
            <h2 className="font-display max-w-xl text-3xl text-[var(--color-fg)] sm:text-4xl">
              Let&apos;s talk about your platform.
            </h2>
            <div className="mt-8 flex flex-wrap gap-6 font-mono text-sm">
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="text-[var(--color-fg)] underline-offset-4 hover:underline"
              >
                {siteConfig.links.email}
              </a>
              <a
                href={siteConfig.links.linkedin}
                className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
              <a
                href={siteConfig.links.github}
                className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-[var(--color-hairline)] py-8">
        <div className="mx-auto max-w-5xl px-6">
          <p className="font-mono text-xs text-[var(--color-fg-subtle)]">
            © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js
            &amp; Tailwind.
          </p>
        </div>
      </footer>
    </>
  );
}
