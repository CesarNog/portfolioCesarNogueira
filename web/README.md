# César A. Nogueira — Portfolio

> Principal Cloud Architect · FinOps Engineer · DevOps Leader  
> Based in Portugal, delivering globally.

A production-grade personal portfolio and consulting pitch built to answer three questions in under 10 seconds: who is this, what has he built, and why should I contact him.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@theme inline` design tokens) |
| Animation | Motion (`motion/react`) |
| Command palette | cmdk |
| Theming | next-themes (dark-first, no-flash) |
| Fonts | Geist · Geist Mono · Inter Tight · Hanken Grotesk (via `next/font`) |
| Hosting | Netlify (static export `out/`) |

## Features

**Recruiter conversion flow**
- Identity hero — available status, role stack, credibility chips. Value proposition readable in under 5 seconds.
- Career Impact — every role framed as Challenge → Action → Result, outcome-first.
- Selected Impact Stories — consulting-grade case studies with quantified business outcomes.
- Engineering Capability Matrix — depth by level and tooling. No progress bars, no vanity percentages.
- Enterprise Validation — signal stats, named clients (AndBank, Santander, LATAM Airlines, ZeroLight), industries, cloud providers.
- Global Delivery Map — animated SVG equirectangular map with interactive region and delivery-type filters.
- Certifications, FinOps dashboard, AI Infrastructure section, live force-graph technology galaxy.

**Interactive layers**
- Recruiter Scanner — AI-powered role fit evaluation with animated skill bars and a structured report.
- AI Career Assistant — recruiter-focused Q&A. Suggested prompts resolve instantly from curated answers; free-text questions proxy to Groq (Llama 3.3). Graceful fallback when no key is set.
- Hiring Assistant panel — slide-in panel with role evaluation grid, chat, and fit scoring.
- Command palette — `⌘K` for keyboard navigation across all sections.

**Five languages** — EN · PT · ES · FR · ZH. `lang` attribute updates on switch.

---

## Development

```bash
cd web
npm install
npm run dev       # http://localhost:3000
npm run build     # static export → web/out/
```

---

## AI Career Assistant (free)

Free-text questions call a Netlify Function (`netlify/functions/ask.mjs`) that proxies **Groq** with a recruiter-oriented system prompt. Suggested prompts bypass the API entirely.

To enable live AI, create a free key at [console.groq.com](https://console.groq.com) (no credit card), then add to Netlify environment variables:

```
GROQ_API_KEY = <your Groq key>
GROQ_MODEL   = llama-3.3-70b-versatile   # optional
```

Without a key, the assistant falls back silently to the curated FAQ — it never breaks.

---

## Design system

Dark-first, two-theme (dark default, light toggle). Four fonts, four roles. Three domain-coded accents: blue (architecture/action), cyan (platform/data), orange (FinOps/cost). Green reserved exclusively for availability signals and positive verdicts.

Design tokens live in `app/globals.css` under `@theme inline`. Component conventions in `DESIGN.md`.

**Principles:** Person before product. Proof not claims. Editorial restraint. Earned credibility. Globally legible. WCAG 2.1 AA throughout. `prefers-reduced-motion` respected on every animation.

---

## Images

Portrait and avatar are served as WebP (converted from source JPG with ImageMagick):

```bash
# Regenerate if source photos change
magick portrait-source.jpg -resize 1600x -quality 85 public/portrait.webp
magick avatar-source.jpg   -resize 256x256 -quality 85 public/avatar.webp
```

`next.config.ts` sets `images: { unoptimized: true }` (required for static export). All optimization is done at build time.
