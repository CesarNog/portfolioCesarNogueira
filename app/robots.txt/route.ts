export const dynamic = "force-static";

import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

/**
 * Replaces the old app/robots.ts metadata file: Next's typed
 * MetadataRoute.Robots only emits User-agent/Allow/Disallow/crawl-delay
 * rules, with no way to add the `Content-Signal` line below — so this is a
 * plain route handler instead, giving full control over the raw text.
 *
 * Policy: allow the crawlers that browse or search on a user's/agent's
 * behalf (this is the entire point of the MCP server, AGENTS.md, llms.txt
 * and the /.well-known files — a well-behaved agent checks robots.txt
 * before fetching, so blocking these would make all of that unreachable),
 * while still opting out of bulk model-training scraping. See
 * https://cesarnogueira.tech/AGENTS.md for what those endpoints are.
 */

// Crawlers with a documented live/user-directed browsing or search-
// indexing role — allowing these is what makes the MCP/AGENTS.md work
// actually reachable by an agent following robots.txt.
const AGENTIC_AND_SEARCH_CRAWLERS = [
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "meta-externalagent",
];

// Bulk crawlers whose only documented purpose is harvesting training data,
// with no live/user-directed browsing role. GPTBot specifically is
// OpenAI's training crawler — distinct from ChatGPT-User (live browsing)
// and OAI-SearchBot (search), both allowed above.
const TRAINING_ONLY_CRAWLERS = [
  "GPTBot",
  "CCBot",
  "Bytespider",
  "cohere-ai",
  "omgili",
  "Diffbot",
  "Amazonbot",
  "anthropic-ai",
  "Claude-Web",
];

export async function GET() {
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    ...AGENTIC_AND_SEARCH_CRAWLERS.map((ua) => `User-agent: ${ua}`),
    "Allow: /",
    "Allow: /api/mcp",
    "Allow: /api/resume.json",
    "Allow: /api/resume.txt",
    "Disallow: /api/ask",
    "Disallow: /api/contact",
    "",
    ...TRAINING_ONLY_CRAWLERS.map((ua) => `User-agent: ${ua}`),
    "Disallow: /",
    "",
    "# Search and answer-engine use is welcome; model training is not licensed.",
    "Content-Signal: ai-train=no, search=yes, ai-input=yes",
    "",
    `Sitemap: ${siteConfig.url}/sitemap.xml`,
    "",
  ];

  return new NextResponse(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
