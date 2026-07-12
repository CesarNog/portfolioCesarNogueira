# César Augusto Nogueira — Portfolio
[![CI](https://github.com/CesarNog/portfolioCesarNogueira/actions/workflows/ci.yml/badge.svg)](https://github.com/CesarNog/portfolioCesarNogueira/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000?logo=vercel&logoColor=white)](https://cesarnogueira.tech)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](tsconfig.json)
[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](next.config.ts)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Last commit](https://img.shields.io/github/last-commit/CesarNog/portfolioCesarNogueira)](https://github.com/CesarNog/portfolioCesarNogueira/commits/master)

**[cesarnogueira.tech](https://cesarnogueira.tech)**

Personal portfolio and consulting pitch for Cesar Augusto Nogueira — Principal Cloud Architect, FinOps specialist, DevOps leader.

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Motion (Framer Motion)
- **Hosting:** Vercel (primary) · Netlify (PR deploy previews)
- **Domain:** cesarnogueira.tech
- **Analytics:** Vercel Analytics · Google Analytics 4 · Hotjar

## Features

- AI career assistant chatbot (xAI Grok / Groq Llama 3.3 via `/api/ask`)
- Contact form (Resend API via `/api/contact`)
- Per-IP rate limiting on all API endpoints
- Command palette (`⌘K`)
- Recruiter mode — tailored CV view
- Language switcher — EN, PT, ES, FR, ZH
- Dark/light theme toggle
- Motion toggle (`prefers-reduced-motion` respected)

## Sections

Story · Experience Timeline · Trust / Clients · Projects · Certifications · FinOps · AI Infrastructure · Cloud Galaxy · Global Map · Testimonials · Contact Console · Capability Matrix

## Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

## Scripts

```bash
npm run dev          # development server on :3000
npm run build        # production build
npm run type-check   # TypeScript check (no emit)
npm run lint         # ESLint via next lint
```

## Environment Variables

Set in Vercel dashboard (Project Settings → Environment variables):

| Variable | Purpose |
|----------|---------|
| `GROK_API_KEY` | AI chatbot — primary (xAI Grok, `xai-...`) |
| `GROQ_API_KEY` | AI chatbot — fallback (Groq / Llama 3.3) |
| `RESEND_API_KEY` | Contact form emails (`re_...`) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID (optional — falls back to `G-SQR8VVTFEK`) |
| `NEXT_PUBLIC_HOTJAR_ID` | Hotjar site ID (default: `173193`) |
| `GROK_MODEL` | Override xAI model (default: `grok-3-mini`) |
| `GROQ_MODEL` | Override Groq model (default: `llama-3.3-70b-versatile`) |

## Deploy

Vercel auto-deploys on push to `master` via GitHub integration. Netlify provides deploy previews on every pull request.
