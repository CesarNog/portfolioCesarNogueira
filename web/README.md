# Cloud Command Center 2026 — Cesar Augusto Nogueira

A premium, dark-first personal-brand platform for **Cesar Augusto Nogueira** —
Principal Cloud Architect, Platform Engineer, DevOps Leader, FinOps Consultant
and AI Infrastructure specialist. Lives in `web/`, isolated from the existing
static site on `master`.

## Stack

- **Next.js 16** (App Router, static export) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@theme inline` design tokens)
- **Motion** (`motion/react`) — reveals, magnetic buttons, counters
- **cmdk** — ⌘K command palette
- **next-themes** — dark-first, no-flash theming
- `next/font` self-hosted variables (Geist, Geist Mono, Inter, Inter Tight)
- Hosted on **Netlify** as a static export (`output: "export"` → `out/`)

## Highlights

- **Dynamic Identity Console** hero — animated terminal boot + expertise matrix
- **Living infrastructure background** — lightweight animated canvas (reduced-motion safe)
- **Interactive career timeline**, **Certification Command Center**, **engineering galaxy**
- **Mission Portfolio** case studies, **FinOps** dashboard, **AI Infrastructure** section
- **⌘K command palette** and an **AI FAQ chatbot** (curated buttons + live Grok)

## AI assistant (Grok / xAI)

The "Mission Control Assistant" chatbot answers questions about Cesar.

- Clickable **FAQ buttons** work instantly with curated answers — no key needed.
- **Free-text questions** call a Netlify Function (`netlify/functions/ask.mjs`)
  that proxies xAI's Grok API with a bio knowledge base.

**To enable live AI:** in Netlify → **Site settings → Environment variables**, add

```
XAI_API_KEY = <your xAI API key>      # from https://console.x.ai
XAI_MODEL   = grok-2-latest           # optional override
```

Without the key (or on any error), the chatbot **gracefully falls back** to the
curated FAQ answers — it never breaks.

## Develop

```bash
cd web
npm install
npm run dev          # http://localhost:3000
npm run build        # static export → web/out
```

## Design principles

Mission-control restraint: tinted near-black surfaces (#05070A / #0B1118 /
#121A23), accents (electric blue, cloud cyan, infrastructure orange) used only
when meaningful, hairline borders, tight display tracking, monospace for data.
Everything respects `prefers-reduced-motion`.
