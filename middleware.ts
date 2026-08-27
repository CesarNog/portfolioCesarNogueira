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
 * Rebuilt from a blocklist to an allowlist. The first version fired
 * whenever the UA had no browser-engine token — which broke social
 * link-preview bots (Slack, Twitter/X, Facebook, LinkedIn, WhatsApp,
 * Telegram, Discord, Apple): none of them carry a Mozilla token either,
 * so they fell into the same bucket as curl/GPTBot and got plain text
 * instead of the HTML their `<meta property="og:*">` scraper needs —
 * a real regression for a recruiter-first portfolio's link sharing.
 * Patching that hole with a growing exclusion list is exactly the
 * whack-a-mole this design invites (uptime monitors, SEO auditors,
 * accessibility scanners, RSS readers... anything not yet thought of
 * would hit the same bug next). Testing rubenmarcus.dev directly with an
 * unrecognized UA and a stripped-down AhrefsBot UA (no Mozilla token)
 * showed it returns HTML for both — its actual logic is an allowlist of
 * specific known bare-HTTP-client/agent signatures, defaulting to HTML
 * for everything else. Matched that here: default is always HTML (safe
 * for humans, browsers, preview bots, and anything unrecognized), plain
 * text only for the specific clients below.
 */
const KNOWN_AGENT_OR_SCRIPT =
  /\bcurl\/|\bWget\/|python-requests|Go-http-client|HTTPie|PostmanRuntime|okhttp|node-fetch|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-User|anthropic-ai|PerplexityBot|cohere-ai|Google-Extended|CCBot|Bytespider|Diffbot|Amazonbot/i;

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (!KNOWN_AGENT_OR_SCRIPT.test(ua)) return NextResponse.next();

  return new NextResponse(buildResumeText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const config = { matcher: "/" };
