import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { IntroSequence } from "@/components/hero/intro-sequence";
import { IdentityConsole } from "@/components/hero/identity-console";
import { Story } from "@/components/sections/story";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { Projects } from "@/components/sections/projects";
import { Trust } from "@/components/sections/trust";
import { CapabilityMatrix } from "@/components/sections/capability-matrix";
import { Certifications } from "@/components/sections/certifications";
import { Testimonials } from "@/components/sections/testimonials";

// Decorative -z-10 canvas background. The component gates its canvas-vs-static
// render on a mount flag so SSR and first client paint agree (no hydration
// mismatch for reduced-motion visitors).
const InfraCanvas = dynamic(
  () => import("@/components/background/infra-canvas").then(m => m.InfraCanvas)
);

// Below-fold sections — split into separate JS chunks, load after first paint
const GlobalMap = dynamic(
  () => import("@/components/sections/global-map").then(m => m.GlobalMap)
);
const CloudGalaxy = dynamic(
  () => import("@/components/sections/cloud-galaxy").then(m => m.CloudGalaxy)
);
const ContactConsole = dynamic(
  () => import("@/components/sections/contact-console").then(m => m.ContactConsole)
);

// Interactive overlays — only needed after user interaction; load last
const CommandPalette = dynamic(
  () => import("@/components/command-palette").then(m => m.CommandPalette)
);
const RecruiterMode = dynamic(
  () => import("@/components/recruiter-mode").then(m => m.RecruiterMode)
);
const Assistant = dynamic(
  () => import("@/components/chatbot/assistant").then(m => m.Assistant)
);

export default function Home() {
  return (
    <>
      <InfraCanvas />
      <SiteHeader />
      <main>
        <IntroSequence />
        <IdentityConsole />
        <Story />
        <ExperienceTimeline />
        <Projects />
        <Trust />
        <GlobalMap />
        <CapabilityMatrix />
        <Certifications />
        <CloudGalaxy />
        <Testimonials />
        <ContactConsole />
      </main>

      <SiteFooter />

      <CommandPalette />
      <RecruiterMode />
      <Assistant />
    </>
  );
}
