export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { buildResume, buildCaseStudies, buildAvailability } from "@/lib/agent-resume";

const CORS_HEADERS = { "Access-Control-Allow-Origin": "*" };

/**
 * Plain-HTTP fallback for agents/tools that don't speak MCP — same facts as
 * the `get_resume` + `list_case_studies` + `check_availability` MCP tools
 * (app/api/mcp/route.ts), just a GET a script or curl can hit directly.
 */
export async function GET() {
  return NextResponse.json(
    { ...buildResume(), caseStudies: buildCaseStudies(), availability: buildAvailability() },
    { headers: CORS_HEADERS },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
