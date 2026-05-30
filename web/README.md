# Portfolio v2 — Next.js rebuild

A ground-up rebuild of [cesarnogueira.tech](https://cesarnogueira.tech) as a
modern, premium "cloud control center" portfolio. This lives in `web/` so it can
be developed and tested **in complete isolation** from the existing static site
(served from `master`) — the two never collide.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@theme inline` design tokens)
- **Motion** (`motion/react`) for reveal-on-scroll animation
- **next-themes** — dark-first, no-flash theming
- `next/font` self-hosted variable fonts (Inter, Inter Tight, Geist Mono)
- File-based `robots.ts` / `sitemap.ts` + JSON-LD `Person` / `ProfessionalService`

## Develop

```bash
cd web
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Roadmap (from the 2026 research plan)

- **Stage 1 — Foundation** ✅ scaffold, tokens, theming, SEO, fonts, hero + sections
- **Stage 2 — Content & trust:** 3–5 impact-first case studies, IO scroll-spy,
  reading-progress bar, `cmdk` command palette
- **Stage 3 — Signature motion:** `react-force-graph-2d` topology (lazy,
  `ssr:false`), optional GSAP scroll narrative, View Transitions
- **Stage 4 — Hardening:** reduced-motion + on-page toggle, a11y/keyboard audit,
  bundle analysis, Lighthouse >95

## Design principles

Restraint over decoration: tight negative letter-spacing on display type,
hairline borders at ~8% opacity, aggressive whitespace, flat layered near-black
surfaces, one restrained accent, monospace for data/labels, minimal motion.
Everything respects `prefers-reduced-motion`.
