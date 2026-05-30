import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { IdentityConsole } from "@/components/hero/identity-console";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { Certifications } from "@/components/sections/certifications";
import { CloudGalaxy } from "@/components/sections/cloud-galaxy";
import { Projects } from "@/components/sections/projects";
import { FinOps } from "@/components/sections/finops";
import { AiInfra } from "@/components/sections/ai-infra";
import { Testimonials } from "@/components/sections/testimonials";
import { ContactConsole } from "@/components/sections/contact-console";
import { CommandPalette } from "@/components/command-palette";
import { Assistant } from "@/components/chatbot/assistant";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <>
      <JsonLd />
      <SiteHeader />
      <main>
        <IdentityConsole />
        <ExperienceTimeline />
        <Certifications />
        <CloudGalaxy />
        <Projects />
        <FinOps />
        <AiInfra />
        <Testimonials />
        <ContactConsole />
      </main>

      <footer className="border-t border-[var(--color-hairline)] px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-[var(--color-fg-subtle)]">
            © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.company}
          </p>
          <div className="flex gap-5 font-mono text-xs">
            <a href={siteConfig.links.linkedin} target="_blank" rel="noreferrer" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
              LinkedIn
            </a>
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
              GitHub
            </a>
            <a href={siteConfig.links.x} target="_blank" rel="noreferrer" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
              X
            </a>
          </div>
        </div>
      </footer>

      <CommandPalette />
      <Assistant />
    </>
  );
}
