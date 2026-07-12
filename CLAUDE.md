# Project Memory — César Nogueira Portfolio

> Living context for this repo. Update as the build evolves.

## What this is
A premium, recruiter-first personal portfolio for **César Augusto Nogueira** — a
Principal Cloud Architect / Platform Engineer / FinOps consultant (10+ years,
GCP/AWS/Azure, founder of UP2CLOUD). Themed as a **cloud-engineering command
console / mission-control HUD** — terminal typewriter hero, live infrastructure
telemetry, a scanning "Evaluate César" console, and a force-directed "engineering
galaxy" — while functioning as a real, content-complete portfolio. All content is
REAL, sourced from `lib/site-config.ts` (résumé-grounded facts, real certs, real
client outcomes).

## Stack & conventions
- **Next.js 16 (App Router)** + TypeScript + **Tailwind CSS v4** (CSS-first
  tokens, no `tailwind.config.js`) + **Motion** (Framer Motion's `motion/react`
  package) for all animation. **Three.js / React-Three-Fiber + drei +
  postprocessing (Bloom) + GSAP ScrollTrigger** power one scene only — the
  `IntroSequence` scroll-scrubbed hero opener (`components/hero/scene3d/`) —
  everything else on the site stays Motion/CSS/Canvas2D as before. Adds ~320KB
  gzip as a client-only lazy chunk (never fetched under reduced-motion, since
  `IntroSequence` returns `null` before it would render).
- Deployed to **Vercel** (full Next.js runtime, not a static export — `/api/ask`
  and `/api/contact` are real serverless routes). `npm run dev` →
  http://localhost:3000. `npm run build` must pass; `.github/workflows/ci.yml`
  gates `type-check` + `lint` on every push/PR.
- Data-viz libs: `react-force-graph-2d` (Cloud Galaxy node graph), `react-simple-maps`
  + `topojson-client` (Global Delivery Map).
- `cmdk` powers the command palette (⌘K).

## Design system
- **Theme:** dark-first (next-themes), OKLCH-mixed accent colors (`--color-blue`,
  `--color-cyan`, `--color-orange`) via `color-mix(in oklab, ...)` — no hardcoded
  hex in component logic.
- **Typography:** Geist + Geist Mono + Inter Tight + Hanken Grotesk (all
  `next/font/google`, loaded as CSS vars in `app/layout.tsx`).
- **Motion:** shared `EASE` / `DUR` / `buttonPress` tokens in `lib/motion.ts`.
  Global `MotionProvider` + a user-facing `MotionToggle` respects
  `prefers-reduced-motion` and lets visitors kill animation entirely.
- **A11y:** semantic landmarks, focus-visible rings, reduced-motion branches
  render the same final content (no motion-only information).

## Architecture
- `lib/site-config.ts` — **single source of truth** for portfolio/domain content
  (`siteConfig`, `stats`, `experience`, `certifications`, `galaxy`, `projects`,
  `finops`, `testimonials`, `faq`, `knowledgeBase`, `globalPresence`,
  `capabilities`). Edit domain data here, never inline in components —
  localized UI copy lives separately in `lib/i18n.tsx` (below).
- `lib/i18n.tsx` — full dictionary-based i18n (EN/PT-BR/ES/FR/ZH), `I18nProvider`
  + `useI18n()`. No external i18n framework — plain object dictionaries per
  language, ~2400 lines (this is the single biggest file in the repo; expect
  merge conflicts here on parallel translation work).
- `lib/motion.ts` — shared easing/duration tokens + `buttonPress` variant.
- `hooks/use-typewriter.ts` — the hero name's character-by-character reveal.
- `app/page.tsx` order: `SiteHeader` → `InfraCanvas` (background) → main[
  `IntroSequence`, `IdentityConsole`, `Story`, `ExperienceTimeline`, `Projects`,
  `Trust`, `GlobalMap`, `CapabilityMatrix`, `Certifications`, `CloudGalaxy`,
  `Testimonials`, `ContactConsole` ] → footer → `CommandPalette`,
  `RecruiterMode`, `Assistant` (chat widget, mounted last/lazily).

### Key components
- `hero/intro-sequence.tsx` — cinematic scroll-scrubbed opener that plays
  **before** the hero: a short pinned `h-[120vh]` track (GSAP `ScrollTrigger`,
  `pin` + `scrub`) where a 3D "cloud core" — modular glowing server/container
  blocks (`hero/scene3d/CloudCore.tsx`), single blue accent per the
  Domain-Color Rule below — assembles from scattered positions into a cloud
  silhouette as the visitor scrolls, then hands off cleanly into the
  unmodified `IdentityConsole` below. No status-readout text or terminal-
  style copy: PRODUCT.md names "fake terminal boot sequences" as rejected
  AI-portfolio-syndrome, and an earlier draft had exactly that (cycling
  TERRAFORM/KUBERNETES/... labels) — cut after a design critique. Kept short
  (120vh, not the original 260vh) so it doesn't eat into the ~10-second scan
  recruiters give the page (PRODUCT.md user research) — "person before
  product" (Design Principle #1) still means the name/photo arrive quickly.
  Purely atmospheric (carries no unique content), so `prefers-reduced-motion`
  visitors get `null` — zero added height, no WebGL ever fetched — rather
  than a static substitute. `scene3d/blocks-data.ts` defines block
  positions/scatter deterministically (no `Math.random()` in render, same
  hydration-safety rule as the rest of the site). Progress is read via a ref
  inside `useFrame` (no React re-renders per scroll tick).
- `hero/identity-console.tsx` — **the hero**. Typewriter-types the name
  (`use-typewriter`), cursor-follow radial spotlight gradient
  (`useMotionValue`/`useMotionTemplate`), staggered entrance (badge → name →
  desc → CTAs → stats → photo, see `DELAYS`), animated stat counters
  (`ui/counter.tsx`), and embeds `RecruiterScanner`. SSR renders the full
  final content unconditionally (name, stats) so reduced-motion and SEO both
  get real markup; motion/typewriter only activate post-mount.
- `background/infra-canvas.tsx` — decorative full-page canvas background
  (particle/grid infra visualization), `ssr:false` dynamic import, mount-gated
  so SSR and first client paint agree (no hydration mismatch for
  reduced-motion visitors).
- `recruiter-scanner.tsx` — the **"Evaluate César" scanner**: a full-screen
  pseudo-3D Matrix-rain overlay (`ui/matrix-rain.tsx`) with a scanning
  reticle/readout, used to deliver an AI-generated recruiter-fit verdict.
  Largest single interactive component in the repo (~570 lines).
- `background/force-graph.tsx` + `sections/cloud-galaxy.tsx` — the "engineering
  galaxy": `react-force-graph-2d` rendering `galaxy`/`galaxyGroups` from
  `site-config.ts` as a force-directed node graph (cloud/platform/cicd/data/
  finops/code clusters).
- `map/world-map-chart.tsx` + `sections/global-map.tsx` — the Global Delivery
  Map: `react-simple-maps` + `topojson-client`, plots `globalPresence.markers`
  (real delivery locations with lat/lon, period, context) with animated
  arcs/pulses from the Portugal hub.
- `chatbot/assistant.tsx` — chat widget calling `app/api/ask/route.ts`, which
  proxies to **Groq** (`llama-3.3-70b-versatile` by default) or **Grok**
  (`grok-3-mini`, if `GROK_API_KEY` set) with `KNOWLEDGE_BASE` as system
  context; rate-limited via `lib/rate-limit.ts`. `app/api/contact/route.ts`
  handles the contact form (also rate-limited).
- `command-palette.tsx` — `cmdk`-powered ⌘K palette (nav + actions, e.g. open
  the Smart FAQ / recruiter scanner).
- `recruiter-mode.tsx` — a dedicated "recruiter mode" toggle/experience layered
  over the standard portfolio view.
- `ui/console-greeting.tsx` — a browser-devtools-console Easter egg greeting.
- `analytics.tsx` + `web-vitals-reporter.tsx` — Vercel Analytics + GA4 + Google
  Ads (gtag, shared loader; `NEXT_PUBLIC_GA_ID` falls back to the registered
  measurement ID `G-SQR8VVTFEK` so GA4 is always active) + Hotjar + Core Web
  Vitals reported to GA4 as events (metrics queued if gtag isn't loaded yet,
  flushed once ready — see git history for why: GA4 can load after LCP fires
  on a bounce visit). This is the only place gtag.js is loaded — don't add a
  second raw gtag snippet elsewhere (e.g. `app/layout.tsx`), which would
  double-fire `gtag('config', ...)` and double-count page views.
- JSON-LD: `app/layout.tsx` emits a single `@graph` with cross-linked
  `Person` (+ `hasCredential` from `certifications`), `WebSite`, and
  `ProfessionalService` (+ `hasOfferCatalog` from `capabilities`) nodes.

## Content source
All content in `lib/site-config.ts` is real and résumé-grounded: 10+ years,
Principal Cloud Architect at UP2CLOUD (founded 2022); prior roles at Randstad
Digital Portugal (Cloud FinOps Automation Engineer, ~30% cloud waste removed),
ZeroLight (DevOps, automotive OEM clients), Accenture Interactive Brazil (Tech
Architecture Manager, GKE enablement), everis/NTT Data Brazil (Cloud Architect,
AndBank/Santander/LATAM Airlines), CI&T (Big Data on GCP). Certifications: 2×
Google Cloud Professional Cloud Architect, Google Cloud Associate Cloud
Engineer, AWS Cloud Practitioner, Azure Fundamentals (AZ-900), applied FinOps.
Real testimonials from named colleagues (CI&T, Apollo Group, Eldorado Research
Institute, RealWorksBV).

## Environment variables
`NEXT_PUBLIC_GOOGLE_ADS_ID` and `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` are optional
and gate cleanly (those features are inert unset). Neither `NEXT_PUBLIC_GA_ID` nor
`NEXT_PUBLIC_HOTJAR_ID` is a kill switch — `components/analytics.tsx` falls back to
the registered measurement/site IDs (`G-SQR8VVTFEK` / `173193`) when unset, so GA4
and Hotjar tracking are always active in production regardless of these vars; they
only let you point tracking at a *different* GA4 property or Hotjar site ID.
`GROQ_API_KEY` / `GROK_API_KEY` +
`GROK_MODEL`/`GROQ_MODEL` — chatbot backend, set in Vercel project settings,
never committed.

## Open items / TODO
- (none tracked here currently — see `MEMORY.md` for session-to-session state
  if present, and check the current git branch for a `.memory/branches/<branch>.md`
  overlay per `.claude/CLAUDE.md`'s memory workflow.)

## Status
Live at cesarnogueira.tech, deployed via Vercel (auto-deploy on push to
`master`). SEO: full metadata + hreflang (5 languages) + JSON-LD graph +
sitemap/robots. Analytics: GA4 + Ads + Web Vitals + Vercel Analytics all wired
(see `components/analytics.tsx`).
