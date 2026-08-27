# Session Memory — portfolioCesarNogueira

> Written per `.claude/CLAUDE.md`'s memory workflow. Read this at the start of
> the next session; update/compress as work continues.

## What happened this session

Large, multi-phase session mirroring design/engineering ideas from
**rubenmarcus.dev** and his `rubenmarcus/rubenmarcus` GitHub profile repo into
this portfolio, adapted with only real content already in `lib/site-config.ts`
— never invented facts. Delivered across many PRs, all merged to `master`
except the most recent (open, CI green, awaiting review).

### Shipped and merged
- Rolling ticker bar, "Try asking your agent" section + cursor-spotlight cards
  on `/connect`, MCP badge in header + footer.
- Intro-sequence hero redesign (mission-control narrative) — earlier-session
  work, unrelated to the agent-discoverability pass below.
- **Agent-discoverability pass** (the bulk of this session):
  - `lib/agent-resume.ts` — single source of truth for resume/case-studies/
    availability, shared by the MCP tool handlers (`app/api/mcp/route.ts`)
    and two plain-HTTP endpoints (`GET /api/resume.json`, `GET /api/resume.txt`).
  - `public/AGENTS.md`, expanded `public/llms.txt`, `public/.well-known/
    mcp/server.json` (validated against the official MCP registry schema),
    `public/.well-known/agent-skills/portfolio-mcp/SKILL.md` (a real Claude
    Agent Skill), `public/.well-known/security.txt` + rewritten `SECURITY.md`,
    `public/ai-index.json`.
  - `app/robots.ts` → `app/robots.txt/route.ts` — allow agentic/search
    crawlers, block bulk-training scrapers, `Content-Signal` opt-out
    (confirmed with the user first, since it reverses a "no permission"
    policy on a live site).
  - `middleware.ts` — serves the plain-text terminal résumé at `/` itself for
    recognized non-browser clients. **Went through several iterations —
    see "A lesson from this session" below before touching this file again.**
  - `components/connect-body.tsx` — "Prefer plain HTTP?" section.
  - `components/site-footer.tsx` — tech-stack credit line, MCP badge.

### A lesson from this session: concurrent sessions collided on this repo
A **separate Claude session** (different session ID, model "Opus 5") was
independently working on this exact repo/branch at the same time as this one,
and found + fixed two real bugs on `master` (PR #88) while this session had
an overlapping fix (PR #87) open and unmerged:
1. The middleware's first version broke social link-preview bots (Slack,
   Twitter/X, Facebook, LinkedIn, WhatsApp, Telegram, Discord) — they carry
   no browser-engine UA token, so they got the plain-text resume instead of
   HTML, losing their `og:*` tags entirely. **Both sessions found this
   independently.**
2. Every `og:image`/`twitter:image` reference pointed at `/opengraph-image.png`,
   which never existed (the build script's copy-to-`.png` step silently
   no-opped since this app isn't a static export) — a 404 in production.
   **Only the other session found this one.**

PR #87 (this session) was closed unmerged once #88 landed on master, since
forcing it in would have conflicted with and duplicated already-fixed work.
This session then verified #88's fixes live, and shipped one further
refinement on top of the new master: rebuilt the middleware's bot-detection
from a blocklist (enumerate every known preview-bot name) to an allowlist
(default to HTML always; only a specific short list of bare CLI tools and
named AI-agent crawlers gets plain text) — verified against rubenmarcus.dev's
*actual* behavior with several precisely-crafted UA strings, not assumption.

**Takeaway for future sessions**: before touching `middleware.ts` (or
anything else here), `git fetch origin master` and diff against what you
last saw — this repo may have moved between reads, especially the OG-image/
`Content-Type` behavior at `/`, which is easy to re-break by "fixing" it
again from an already-fixed base.

### Delivered but NOT pushed anywhere (handed to the user directly)
- A GitHub-profile README package (banner.png + 6 badge PNGs + README.md) for
  a `github.com/CesarNog/CesarNog` special repo — this session has no push
  access there. Sent as a zip via SendUserFile earlier in the session. **The
  user still needs to create that repo and add these files themselves** if
  they want it live.

## Current state
- Branch `claude/continue-determined-lamport-jY2St` — reset onto `master`
  before each new PR per this repo's convention (never stack on
  already-merged history; if the PR for this branch was already merged,
  restart from `origin/master`).
- The `middleware.ts` allowlist refinement was pushed and opened as
  **PR #89** (updates this file superseded the "not yet pushed" note above).
  CI green (`type-check`/`lint` passed on both the push and pull_request
  runs), `mergeable_state: "clean"`, zero unresolved review threads. Base
  (`master` @ `0323c82`) hasn't moved since. **Awaiting the user's merge —
  do not merge PRs on this repo without being explicitly told to.**
- Verified live on cesarnogueira.tech after #88 merged: `og:image` correctly
  resolves to `/opengraph-image` (200), Twitterbot/etc. get real HTML,
  sitemap/JSON-LD/manifest all healthy. Not yet re-verified against #89's
  changes specifically since #89 hasn't merged.

## Next immediate step
Nothing to push — PR #89 is fully ready and just needs the user's review/
merge. If picking this up cold and #89 has since merged: re-verify
production once more (og:image resolves, preview bots get HTML, curl/agent
UAs get plain text) — this session's established habit, and it's caught two
real, otherwise-invisible regressions so far. If #89 is still open, there's
nothing actionable until the user responds — don't invent further changes on
top of a green, unreviewed PR.

If picking this up fresh: re-read `AGENTS.md`/`llms.txt`/`.well-known/*` on
the live site before adding more agent-discoverability surfaces — they're
now the canonical source of what's already been built, so as not to
duplicate.
