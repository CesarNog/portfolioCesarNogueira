# Cesar Augusto Nogueira — Portfolio

**[cesarnogueira.tech](https://cesarnogueira.tech)**

Personal portfolio and consulting pitch for Cesar Augusto Nogueira — Principal Cloud Architect, FinOps specialist, DevOps leader.

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Motion (Framer Motion)
- **Output:** Static export (`next build` → `out/`)
- **Hosting:** Netlify (with serverless functions)
- **Domain:** cesarnogueira.tech

## Features

- AI career assistant chatbot (Grok API via Netlify function)
- Contact form (Resend API via Netlify function)
- Command palette (`⌘K`)
- Recruiter mode — tailored CV view
- Language switcher — EN, PT, ES, FR, ZH
- Dark/light theme toggle
- Motion toggle (`prefers-reduced-motion` respected)
- Fully static — no Next.js server runtime required

## Sections

Story · Experience Timeline · Trust / Clients · Projects · Certifications · FinOps · AI Infrastructure · Cloud Galaxy · Global Map · Testimonials · Contact Console · Capability Matrix

## Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

## Build

```bash
npm run build   # outputs to out/
```

## Environment Variables

Set in Netlify dashboard (Site settings → Environment variables):

| Variable | Purpose |
|----------|---------|
| `GROK_API_KEY` | AI career assistant (xai-...) |
| `RESEND_API_KEY` | Contact form emails (re_...) |

## Deploy

Netlify auto-deploys on push to `master`. Build command and publish directory are defined in `netlify.toml`.
