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
 * Deliberately conservative: this must NEVER show plain text to an actual
 * human visitor, so it only fires when the User-Agent contains no browser
 * engine token at all. Modern search crawlers (Googlebot, Bingbot) include
 * "Mozilla/5.0" in their UA specifically to receive JS-rendered pages, so
 * this doesn't touch SEO — only genuinely non-browser clients (curl,
 * wget, python-requests, most simple bots/AI-agent HTTP clients) match.
 */
const BROWSER_ENGINE = /Mozilla\/5\.0|AppleWebKit|Gecko\/|Chrome\/|Safari\/|Firefox\/|Edg\//i;

/**
 * Link-preview crawlers must always get the HTML, never the resume.
 *
 * These fetch a URL purely to read its <meta> tags and build the card shown
 * when someone shares a link, and most identify themselves with a bare
 * product token ("Twitterbot/1.0") carrying no browser-engine string — so
 * BROWSER_ENGINE alone does not match them and they would be served
 * text/plain. Plain text has no og:* tags, so every share of this site on
 * LinkedIn, X, Facebook, Slack or WhatsApp would render as a bare URL with
 * no title, description or image.
 *
 * Checked before BROWSER_ENGINE: some of these (WhatsApp, Discordbot) do
 * include "Mozilla/5.0" and would pass anyway, but relying on that would
 * make the guarantee depend on each vendor's UA string rather than on
 * intent.
 */
const LINK_PREVIEW_BOT =
  /facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|WhatsApp|TelegramBot|Discordbot|redditbot|Pinterest|SkypeUriPreview|vkShare|Embedly|iframely|Mastodon|Bluesky/i;

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (LINK_PREVIEW_BOT.test(ua)) return NextResponse.next();
  if (BROWSER_ENGINE.test(ua)) return NextResponse.next();

  return new NextResponse(buildResumeText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const config = { matcher: "/" };
