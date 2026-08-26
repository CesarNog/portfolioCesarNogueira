export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { buildResumeText } from "@/lib/agent-resume";

/**
 * Plain-HTTP, human-and-agent-readable resume — `curl cesarnogueira.tech/api/resume.txt`
 * with no JSON parsing required. Same facts as /api/resume.json, formatted
 * as text (see buildResumeText in lib/agent-resume.ts).
 */
export async function GET() {
  return new NextResponse(buildResumeText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
}
