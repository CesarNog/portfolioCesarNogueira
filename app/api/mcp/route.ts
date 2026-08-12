export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getIp, isRateLimited } from "@/lib/rate-limit";
import { siteConfig, stats, experience, certifications, projects, capabilities } from "@/lib/site-config";

/**
 * MCP server for the portfolio — lets AI agents (Claude, ChatGPT, Kimi,
 * Cursor, …) evaluate César for a role/engagement without a human clicking
 * around the site. Stateless JSON-RPC 2.0 over a single POST endpoint: every
 * call gets a synchronous `application/json` response, no SSE session to
 * keep alive — the right shape for four read-mostly tools on a serverless
 * edge function.
 */

const SERVER_INFO = { name: "cesarnogueira-portfolio", version: "1.0.0" };
const PROTOCOL_VERSION = "2025-03-26";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, mcp-protocol-version",
};

const TOOLS = [
  {
    name: "get_resume",
    description:
      "Get César Nogueira's structured resume: role, experience history, certifications, capabilities and key stats. Use this to evaluate his fit for a Cloud Architect, Platform Engineering or FinOps role or consulting engagement.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_case_studies",
    description:
      "List César's real client case studies (FinOps automation, big-data platforms, regulated banking/aviation cloud) with the problem, architecture, tech stack and a measurable outcome for each.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "check_availability",
    description:
      "Check César's current availability for new projects, his location/timezone and his typical response time.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "book_intro",
    description:
      "Send César a project introduction request on the caller's behalf. Requires a name, email and a short message describing the opportunity — delivered straight to his inbox.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Requester's full name" },
        email: { type: "string", description: "Requester's email address, for César to reply to" },
        message: { type: "string", description: "Short description of the role, project or opportunity" },
      },
      required: ["name", "email", "message"],
      additionalProperties: false,
    },
  },
] as const;

type JsonRpcRequest = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };

function textResult(text: string) {
  return { content: [{ type: "text", text }] };
}

function rpcResult(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id: id ?? null, result }, { headers: CORS_HEADERS });
}

function rpcError(id: unknown, code: number, message: string, status = 200) {
  return NextResponse.json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } }, { status, headers: CORS_HEADERS });
}

async function bookIntro(args: Record<string, unknown>, ip: string) {
  if (isRateLimited(`${ip}:mcp:book_intro`, { windowMs: 60_000, max: 5 })) {
    throw new Error("Too many requests — please try again in a minute.");
  }

  const name = String(args?.name ?? "").slice(0, 100).trim();
  const email = String(args?.email ?? "").slice(0, 254).trim();
  const message = String(args?.message ?? "").slice(0, 5000).trim();
  if (!name || !email || !message) throw new Error("Missing required fields: name, email and message are all required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email address.");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return textResult(
      `Thanks ${name} — noted, but automated delivery isn't configured right now. Please reach César directly at ${siteConfig.links.email}.`,
    );
  }

  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = `<div style="font-family:monospace;background:#0a0a0a;color:#e0e0e0;padding:24px;">
    <p style="color:#4ade80;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">MCP agent intro request</p>
    <p><strong>From:</strong> ${esc(name)} (${esc(email)})</p>
    <p style="white-space:pre-wrap;">${esc(message)}</p>
  </div>`;

  let r: Response;
  try {
    r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(9000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: "Portfolio MCP <portfolio@cesarnogueira.tech>",
        to: siteConfig.links.email,
        reply_to: email,
        subject: `🤖 MCP intro request — from ${name}`,
        html,
      }),
    });
  } catch {
    throw new Error("Delivery failed — please try again shortly.");
  }
  if (!r.ok) throw new Error("Delivery failed — please try again shortly.");

  return textResult(`Sent. César replies within ${siteConfig.responseTime.toLowerCase().replace(/^usually /, "")} to ${email}.`);
}

async function callTool(name: string, args: Record<string, unknown>, ip: string) {
  switch (name) {
    case "get_resume": {
      const payload = {
        name: siteConfig.name,
        role: siteConfig.role,
        tagline: siteConfig.tagline,
        location: siteConfig.location,
        company: siteConfig.company,
        stats: stats.map((s) => ({ label: s.label, value: `${"prefix" in s ? s.prefix : ""}${s.value}${s.suffix}` })),
        experience: experience.map((e) => ({
          company: e.company,
          role: e.role,
          period: e.period,
          outcome: e.outcome,
        })),
        certifications: certifications.flatMap((c) => c.items.map((it) => it.name)),
        capabilities: capabilities.map((c) => ({ area: c.area, level: c.level })),
        cv: siteConfig.links.cv,
        contact: siteConfig.links.email,
      };
      return textResult(JSON.stringify(payload, null, 2));
    }
    case "list_case_studies": {
      const payload = projects.map((p) => ({
        title: p.title,
        client: p.client,
        problem: p.problem,
        architecture: p.architecture,
        tech: p.tech,
        outcome: p.outcome,
        metric: `${p.metric} ${p.metricLabel}`,
        url: `${siteConfig.url}/case-studies/${p.id}`,
      }));
      return textResult(JSON.stringify(payload, null, 2));
    }
    case "check_availability": {
      const payload = {
        availability: siteConfig.availability,
        location: siteConfig.location,
        responseTime: siteConfig.responseTime,
        contact: siteConfig.links.email,
      };
      return textResult(JSON.stringify(payload, null, 2));
    }
    case "book_intro":
      return bookIntro(args, ip);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (isRateLimited(`${ip}:mcp`, { windowMs: 60_000, max: 40 })) {
    return rpcError(null, -32000, "Rate limited", 429);
  }

  let body: JsonRpcRequest;
  try {
    body = await req.json();
  } catch {
    return rpcError(null, -32700, "Parse error", 400);
  }

  const { id = null, method, params } = body ?? {};

  switch (method) {
    case "initialize":
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });

    case "notifications/initialized":
      return new NextResponse(null, { status: 202, headers: CORS_HEADERS });

    case "tools/list":
      return rpcResult(id, { tools: TOOLS });

    case "tools/call": {
      const toolName = String(params?.name ?? "");
      const toolArgs = (params?.arguments as Record<string, unknown>) ?? {};
      const tool = TOOLS.find((t) => t.name === toolName);
      if (!tool) return rpcError(id, -32602, `Unknown tool: ${toolName}`);

      try {
        const result = await callTool(toolName, toolArgs, ip);
        return rpcResult(id, result);
      } catch (err) {
        return rpcResult(id, {
          content: [{ type: "text", text: err instanceof Error ? err.message : "Tool error" }],
          isError: true,
        });
      }
    }

    default:
      return rpcError(id, -32601, `Method not found: ${method}`, 404);
  }
}

export async function GET() {
  return NextResponse.json(
    {
      name: SERVER_INFO.name,
      protocolVersion: PROTOCOL_VERSION,
      transport: "streamable-http",
      description: `MCP server for ${siteConfig.name} — ${siteConfig.shortRole}.`,
      tools: TOOLS.map((t) => t.name),
    },
    { headers: CORS_HEADERS },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
