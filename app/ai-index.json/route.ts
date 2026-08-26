export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { siteConfig, projects } from "@/lib/site-config";
import { CASE_STUDIES_MODIFIED } from "@/app/sitemap";

/**
 * Structured content index for LLMs/AEO tooling — the same "entries" shape
 * rubenmarcus.dev's ai-index.json uses for his blog, applied to the one
 * kind of durable, citable content this portfolio actually has: the real
 * case studies (this site has no blog, so there's nothing else honest to
 * list here). `dateModified` reuses sitemap.ts's own CASE_STUDIES_MODIFIED
 * rather than inventing a separate date — one source of truth for when
 * this content last actually changed.
 */
export async function GET() {
  return NextResponse.json(
    {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      site: {
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        languages: ["en", "pt-BR", "es", "fr", "zh"],
      },
      entries: projects.map((p) => ({
        id: p.id,
        url: `${siteConfig.url}/case-studies/${p.id}`,
        title: p.title,
        description: p.metaDescription,
        language: "en",
        dateModified: CASE_STUDIES_MODIFIED.toISOString(),
        type: "CaseStudy",
        keywords: p.tech,
      })),
    },
    { headers: { "Access-Control-Allow-Origin": "*" } },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
}
