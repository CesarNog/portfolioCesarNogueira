# Session Memory — portfolioCesarNogueira

> Written per `.claude/CLAUDE.md`'s memory workflow. Read this at the start of
> the next session; update/compress as work continues.

## What happened this session

Large, multi-phase session mirroring design/engineering ideas from
**rubenmarcus.dev** and his `rubenmarcus/rubenmarcus` GitHub profile repo into
this portfolio, adapted with only real content already in `lib/site-config.ts`
— never invented facts. Delivered across PRs #81–87, all merged to `master`
except #87 (open, CI green, awaiting human review/merge).

### Shipped and merged
- Rolling ticker bar, "Try asking your agent" section + cursor-spotlight cards
  on `/connect`, MCP badge in header + footer (`site-header.tsx`,
  `site-footer.tsx`).
- Intro-sequence hero redesign (mission-control narrative) — unrelated
  earlier-session work, also merged.
- **Agent-discoverability pass** (the bulk of this session):
  - `lib/agent-resume.ts` — single source of truth for resume/case-studies/
    availability, shared by the MCP tool handlers (`app/api/mcp/route.ts`)
    and two new plain-HTTP endpoints.
  - `GET /api/resume.json`, `GET /api/resume.txt` — plain-HTTP fallbacks for
    non-MCP clients.
  - `public/AGENTS.md`, expanded `public/llms.txt` — machine-readable site
    indexes.
  - `public/.well-known/mcp/server.json` (validated against the official MCP
    registry schema), `public/.well-known/agent-skills/portfolio-mcp/SKILL.md`
    (a real Claude Agent Skill file).
  - `public/.well-known/security.txt` + rewritten `SECURITY.md` (was an
    unedited GitHub template).
  - `public/ai-index.json` — structured index of the 3 real case studies.
  - `app/robots.ts` → `app/robots.txt/route.ts` — policy change (confirmed
    with the user first): allow agentic/search crawlers
    (ChatGPT-User/ClaudeBot/PerplexityBot/etc.), keep bulk-training scrapers
    (GPTBot/CCBot/etc.) blocked, `Content-Signal: ai-train=no` as
    defense-in-depth.
  - `middleware.ts` — serves the plain-text terminal résumé at `/` itself for
    non-browser clients (mirrors verified live behavior on rubenmarcus.dev).
    **Went through two iterations**: v1 was a blocklist (browser-engine
    tokens only) that broke social link-preview bots (Slack/Twitter/
    Facebook/LinkedIn/WhatsApp/Telegram/Discord/Apple — none carry a
    "Mozilla" token, so they got plain text instead of the HTML their
    `og:*` scraper needs — a real regression, caught by testing prod
    directly). v2 (current, in PR #87) is an **allowlist** instead — default
    HTML for everything, plain text only for a specific list of bare-HTTP
    clients (curl/Wget/python-requests/etc.) and named agent crawlers
    (GPTBot/ClaudeBot/PerplexityBot/etc.). Verified this matches
    rubenmarcus.dev's actual behavior (tested with an AhrefsBot-style UA and
    a made-up UA — both get HTML there too).
  - `components/connect-body.tsx` — "Prefer plain HTTP?" section linking the
    4 machine-readable endpoints.
  - `components/site-footer.tsx` — tech-stack credit line.

### Delivered but NOT pushed anywhere (handed to the user directly)
- A GitHub-profile README package (banner.png + 6 badge PNGs + README.md) for
  a `github.com/CesarNog/CesarNog` special repo — this session has no push
  access there. Sent as a zip via SendUserFile earlier in the session. **The
  user still needs to create that repo and add these files themselves** if
  they want it live.

## Current state
- Branch `claude/continue-determined-lamport-jY2St` — this repo's designated
  branch, reset onto `master` before each new PR per the repo's workflow
  convention (never stacked on already-merged history).
- **PR #87 open**: https://github.com/CesarNog/portfolioCesarNogueira/pull/87
  — the middleware fix above. CI green, no merge conflicts, no unresolved
  review threads. Session is subscribed to its activity.
- Working tree otherwise clean.
- GitHub Actions in this sandbox had a multi-minute queued-run backlog
  earlier in the session (unrelated to any code) — resolved on its own by
  the time PR #87's CI ran.

## Next immediate step
**Merge PR #87** (or ask for changes). After that, nothing else is queued —
this session explicitly verified production (cesarnogueira.tech) end-to-end
after each merge and found no other regressions: sitemap.xml, JSON-LD,
manifest, OG image all healthy; root URL content-negotiates correctly for
browsers/preview-bots/agents/unknown UAs.

If picking this up fresh: re-read `AGENTS.md`/`llms.txt`/`.well-known/*` on
the live site before adding more agent-discoverability surfaces — they're
now the canonical source of what's already been built, so as not to
duplicate.
