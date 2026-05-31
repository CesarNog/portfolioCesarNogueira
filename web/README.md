# Interactive Executive CV Platform — Cesar Augusto Nogueira

A premium, dark-first **Interactive Executive CV Platform** for **Cesar Augusto
Nogueira** — Principal Cloud Architect, Platform Engineer, DevOps Leader, FinOps
Consultant and AI Infrastructure specialist. Built for **recruiter conversion**:
every section sells outcomes, authority and trust before it sells technology.
Lives in `web/`, isolated from the existing static site on `master`.

## Stack

- **Next.js 16** (App Router, static export) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@theme inline` design tokens)
- **Motion** (`motion/react`) — reveals, magnetic buttons, counters
- **cmdk** — ⌘K command palette
- **next-themes** — dark-first, no-flash theming
- `next/font` self-hosted variables (Geist, Geist Mono, Inter, Inter Tight)
- Hosted on **Netlify** as a static export (`output: "export"` → `out/`)

## Highlights (recruiter-conversion flow)

- **Identity hero** — "Available for global remote consulting" status, role stack and
  credibility chips (value proposition readable in <5s) over a toned-down background
- **Executive Summary** — premium cards: who, why different, what he solves, how to engage
- **Career Impact** — every role framed Challenge → Action → Result, outcome-first
- **Selected Impact Stories** — consulting-grade case studies with a business-result block
- **Engineering Capability Matrix** — depth by level + tools (no progress bars, no vanity %)
- **Enterprise Validation (Trust)** — signal stats, companies, industries, cloud providers
- **Global Delivery Map** — animated equirectangular map of delivery regions
- **Certifications**, **FinOps dashboard**, **AI Infrastructure**, live **force-graph galaxy**
- **Recruiter Mode** — floating toggle that emphasizes impact/leadership/certs/availability
  and de-emphasizes purely decorative visuals
- **Smart AI FAQ** (AI Career Assistant) + **⌘K command palette**

## Smart AI FAQ (free — Groq / Llama 3.3)

The **AI Career Assistant** answers recruiter questions about Cesar's fit for a role.

- Recruiter-focused **suggested prompts** ("Why should I hire Cesar?", "Show FinOps
  achievements"…) resolve instantly from curated, keyword-matched answers — no key needed.
- **Free-text questions** call a Netlify Function (`netlify/functions/ask.mjs`) that
  proxies **Groq** (a free, fast, OpenAI-compatible API serving open models) with a
  recruiter-oriented system prompt and a bio knowledge base.

**To enable live AI (free):** create a free key at https://console.groq.com
(no credit card), then in Netlify → **Site settings → Environment variables** add

```
GROQ_API_KEY = <your free Groq key>
GROQ_MODEL   = llama-3.3-70b-versatile   # optional override
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

Enterprise restraint (Linear / Vercel / Datadog): neutral near-black surfaces,
one restrained blue accent used only when meaningful, hairline borders, tight
display tracking, monospace for data. Sells outcomes, authority and trust before
technology. Everything respects `prefers-reduced-motion`.
