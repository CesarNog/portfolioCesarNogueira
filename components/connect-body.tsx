"use client";

import { useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/site-config";
import { EASE, DUR } from "@/lib/motion";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const MCP_URL = `${siteConfig.url}/api/mcp`;

const CLIENTS = [
  {
    name: "Claude",
    steps: [
      "Open Claude settings → Connectors → Add custom connector.",
      `Name it "${siteConfig.name.split(" ")[0]}" and paste the URL below.`,
      `Connect. Then ask: "what has ${siteConfig.name.split(" ")[0]} shipped?"`,
    ],
  },
  {
    name: "ChatGPT",
    steps: [
      "Settings → Apps & Connectors → developer mode → Create.",
      "Paste the URL below and save.",
      "Ask ChatGPT to call get_resume or book_intro.",
    ],
  },
  {
    name: "Kimi",
    steps: [
      "Add a streamable-HTTP MCP server (or paste the URL in Kimi's MCP settings).",
      "Paste the URL below.",
      "Run tools/list to see the four tools.",
    ],
  },
  {
    name: "Cursor / any MCP client",
    steps: [
      "Add a streamable-HTTP MCP server.",
      "Paste the URL below.",
      "Run tools/list to see the four tools.",
    ],
  },
];

const TOOLS = [
  { name: "get_resume", desc: "Structured resume — role, experience, certifications, capabilities, stats." },
  { name: "list_case_studies", desc: "Real client case studies with problem, architecture and measured outcome." },
  { name: "check_availability", desc: "Current availability, location/timezone and typical response time." },
  { name: "book_intro", desc: "Send a project intro request straight to César's inbox." },
];

const PLAIN_ENDPOINTS = [
  { path: "/api/resume.json", desc: "resume + case studies, JSON" },
  { path: "/api/resume.txt", desc: "resume, plain text" },
  { path: "/llms.txt", desc: "LLM index" },
  { path: "/AGENTS.md", desc: "agent instructions" },
];

const TRY_PROMPTS = [
  `What has ${siteConfig.name.split(" ")[0]} shipped? Give me a quick summary of his experience.`,
  "Show me his case studies — what outcomes has he actually delivered?",
  "Is he available for a new project right now?",
  "I'd like to book an intro call with him — can you send that for me?",
];

function CopyEndpoint() {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — the URL is still selectable/visible.
    }
  };
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-ok)]/25 bg-[var(--color-ok)]/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          MCP Endpoint
        </p>
        <p className="mt-1 truncate font-mono text-sm text-[var(--color-ok)] sm:text-base">{MCP_URL}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline-strong)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[var(--color-fg)] transition-colors hover:border-[var(--color-ok)]/50 hover:text-[var(--color-ok)]"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function PromptChip({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — the prompt text is still visible/selectable.
    }
  };
  return (
    <SpotlightCard className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-hairline)] px-4 py-3">
      <p className="text-[13px] leading-relaxed text-[var(--color-fg)]">&ldquo;{text}&rdquo;</p>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy prompt"
        className="shrink-0 rounded-md border border-[var(--color-hairline-strong)] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)] transition-colors hover:border-[var(--color-blue)]/50 hover:text-[var(--color-blue)]"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </SpotlightCard>
  );
}

export function ConnectBody() {
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: DUR.reveal, delay, ease: EASE.out },
        };

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-blue)]">
        Agent-ready · MCP
      </p>
      <h1 className="gradient-heading mt-3 font-display text-[clamp(2.25rem,4vw+0.5rem,3.75rem)] leading-[1.05] [text-wrap:balance]">
        This site speaks MCP.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] sm:text-[17px]">
        Agent-ready, humans welcome. Add this portfolio as a connector and your agent can
        evaluate {siteConfig.name.split(" ")[0]}&apos;s work, check availability, and book a
        project intro — no account, auth or signup required.
      </p>

      <m.div {...enter(0.05)} className="mt-8">
        <CopyEndpoint />
      </m.div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <SpotlightCard key={tool.name} className="rounded-lg border border-[var(--color-hairline)] px-4 py-3">
            <p className="font-mono text-xs text-[var(--color-cyan)]">{tool.name}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-fg-muted)]">{tool.desc}</p>
          </SpotlightCard>
        ))}
      </div>

      {/* Try asking your agent — copy-paste prompts to sanity-check the
          connector once it's wired up, no need to know the tool names. */}
      <m.div {...enter(0.08)} className="mt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          Try asking your agent
        </p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {TRY_PROMPTS.map((prompt) => (
            <PromptChip key={prompt} text={prompt} />
          ))}
        </div>
      </m.div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {CLIENTS.map((client, i) => (
          <m.div key={client.name} {...enter(0.1 + i * 0.06)}>
            <SpotlightCard className="panel card-shine card-glow rounded-xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 text-lg font-medium text-[var(--color-fg)]">{client.name}</h2>
              <ol className="mt-3 space-y-2">
                {client.steps.map((step, j) => (
                  <li key={j} className="flex gap-2.5 text-[13px] leading-relaxed text-[var(--color-fg-muted)]">
                    <span className="shrink-0 text-[var(--color-blue)]">{j + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </SpotlightCard>
          </m.div>
        ))}
      </div>

      {/* Plain-HTTP fallback for scripts/curl/agents that don't speak MCP —
          same underlying facts as the four tools above (lib/agent-resume.ts
          is the shared source for both). */}
      <m.div {...enter(0.12)} className="mt-12 border-t border-[var(--color-hairline)] pt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          Prefer plain HTTP?
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {PLAIN_ENDPOINTS.map((e) => (
            <a
              key={e.path}
              href={e.path}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-hairline)] px-4 py-2.5 font-mono text-[13px] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-fg)]"
            >
              <span>{e.path}</span>
              <span className="text-[11px] text-[var(--color-fg-subtle)]">{e.desc}</span>
            </a>
          ))}
        </div>
      </m.div>
    </div>
  );
}
