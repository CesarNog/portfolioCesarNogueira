import { NextRequest, NextResponse } from "next/server";
import { buildResumeText } from "@/lib/agent-resume";

/**
 * rubenmarcus.dev serves a plain-text terminal resume at `/` itself for
 * non-browser clients (verified live: `curl https://www.rubenmarcus.dev/`
 * returns `content-type: text/plain`, while a real browser UA gets the
 * full HTML site) — so an agent or script that only knows the bare domain,
 * without already knowing about /llms.txt or /api/mcp, still gets useful
 * machine-readable content instead of a wall of SPA markup. Mirrored here
 * against the same shared resume builder used by the MCP tools and the
 * /api/resume.* endpoints (lib/agent-resume.ts) — one more surface, same
 * facts, no duplication.
 *
 * This is an allowlist, not a blocklist — the shape verified against
 * rubenmarcus.dev itself: a made-up UA, an AhrefsBot-style UA, and even a
 * correctly-formatted GPTBot/ClaudeBot UA (both of which include a
 * "Mozilla/5.0 (compatible; ...)" prefix by convention) all get HTML there.
 * Only a short list of bare command-line HTTP tools (curl, Wget, HTTPie —
 * not python-requests, not Go-http-client, not okhttp) actually get plain
 * text on the reference site. A blocklist of "known preview bots" was tried
 * here first and broke exactly the thing it was supposed to protect: Slack,
 * Twitter/X, Facebook, LinkedIn, WhatsApp and friends all identify with no
 * browser-engine token, so they landed in the same bucket as curl and lost
 * their `og:*` tags — and any *future* crawler not yet on the list (an SEO
 * auditor, an uptime monitor, a new preview-bot vendor) would hit the same
 * bug next. An allowlist has no such blind spot: HTML is always the safe
 * default, and only what's explicitly recognized here opts into plain text.
 *
 * Deliberate departure from the reference site: this list also includes
 * named AI-agent crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.), which
 * rubenmarcus.dev's own site does NOT special-case — those get HTML there.
 * Kept here anyway because it directly serves this feature's actual point
 * (per the paragraph above): an agent hitting the bare domain should get
 * something useful without first discovering /api/mcp or /llms.txt.
 */
const KNOWN_AGENT_OR_SCRIPT =
  /\bcurl\/?\b|\bWget\/?\b|\bHTTPie\/|python-requests|Go-http-client|PostmanRuntime|okhttp|node-fetch|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-User|anthropic-ai|PerplexityBot|cohere-ai|Google-Extended|CCBot|Bytespider|Diffbot|Amazonbot/i;

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (!KNOWN_AGENT_OR_SCRIPT.test(ua)) return NextResponse.next();

  return new NextResponse(buildResumeText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const config = { matcher: "/" };
