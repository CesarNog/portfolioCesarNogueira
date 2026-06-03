"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useI18n } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

// ─── Role profiles ────────────────────────────────────────────────────────────

const ROLES = [
  {
    id: "cloud-architect",
    label: "Cloud Architect",
    abbr: "CA",
    accent: "blue" as const,
    fitScore: 97,
    level: "Principal",
    strengths: [
      "2× Google Cloud Professional Architect (recertified)",
      "Multi-cloud at enterprise scale: GCP, AWS, Azure, OCI",
      "10+ years designing regulated cloud for banking and aviation",
      "Founded UP2CLOUD — delivers architecture as a service globally",
    ],
    evidence: [
      "AndBank, Santander, LATAM Airlines — regulatory-grade multi-cloud",
      "Accenture Interactive — led GKE enablement, trained 120+ engineers",
      "everis/NTT Data — VPC design, PII security, full observability stack",
    ],
    concerns: [] as string[],
    interviewTopics: [
      "Network topology for regulated multi-cloud (VPC peering, private endpoints)",
      "Architecture decision records — how do you document and govern?",
      "Cost governance from day one — tagging taxonomy and budget guardrails",
      "Disaster recovery at 99.9% availability SLA across clouds",
    ],
  },
  {
    id: "platform-engineer",
    label: "Platform Engineer",
    abbr: "PE",
    accent: "cyan" as const,
    fitScore: 92,
    level: "Expert",
    strengths: [
      "Kubernetes (GKE) in production at Accenture, ZeroLight, everis",
      "Terraform for reproducible multi-cloud IaC",
      "Argo CD, GitHub Actions, GitLab CI — GitOps delivery pipelines",
      "Developer enablement: golden paths, self-service platforms",
    ],
    evidence: [
      "GKE setup and administration — led cloud enablement at Accenture",
      "CloudBees CI/CD pipeline automation at Randstad Digital (global scale)",
      "Multi-cloud Kubernetes at ZeroLight for Volkswagen, Lucid, Vinfast, Cadillac",
    ],
    concerns: [
      "Primary identity is Cloud Architect; platform engineering is integral but not sole focus",
    ],
    interviewTopics: [
      "Platform-as-product: how do you measure internal developer satisfaction?",
      "Golden paths — what constraints drive adoption vs. flexibility?",
      "Kubernetes multi-tenancy and namespace isolation at scale",
      "Platform team model — stream-aligned vs. enablement team?",
    ],
  },
  {
    id: "devops-lead",
    label: "DevOps Lead",
    abbr: "DL",
    accent: "cyan" as const,
    fitScore: 90,
    level: "Lead",
    strengths: [
      "CI/CD at scale: CloudBees, Jenkins, Spinnaker, GitHub Actions",
      "40% faster deployments via pipeline redesign at Randstad Digital",
      "Observability: New Relic, PagerDuty, StackStorm — 24/7 on-call",
      "Automated resource tagging, cost reporting, chargeback via Python",
    ],
    evidence: [
      "Randstad Digital — Python automation + CloudBees for global multi-cloud ops",
      "ZeroLight — RunDeck, Jenkins, Wazuh, ElasticSearch in automotive production",
      "Accenture — Jenkins + Spinnaker CD automation for GKE workloads",
    ],
    concerns: [
      "Most DevOps work embedded in broader cloud/platform roles vs. standalone DevOps Lead title",
    ],
    interviewTopics: [
      "Pipeline security: secrets management, SAST/DAST integration",
      "Deployment strategies — blue/green vs. canary at scale",
      "DORA metrics — how do you improve deployment frequency?",
      "On-call culture: runbooks, incident response, post-mortems",
    ],
  },
  {
    id: "finops-engineer",
    label: "FinOps Engineer",
    abbr: "FO",
    accent: "orange" as const,
    fitScore: 96,
    level: "Specialist",
    strengths: [
      "Dedicated FinOps Automation Engineer at Randstad Digital (3.5 years)",
      "~30% cloud waste reduction across GCP, AWS, Azure — documented",
      "Python automation against multi-cloud billing APIs",
      "CloudHealth, chargeback reporting, automated tagging at enterprise scale",
    ],
    evidence: [
      "Randstad Digital — multi-account, multi-cloud cost governance and automation",
      "FinOps Foundation Applied Practitioner certification",
      "Executive cost dashboards + scheduled chargeback jobs + anomaly detection",
    ],
    concerns: [] as string[],
    interviewTopics: [
      "Chargeback vs. showback — when does each model apply?",
      "Tagging governance — enforcement mechanisms and exception handling",
      "Reserved instances vs. Savings Plans — your selection criteria",
      "Anomaly detection — how do you alert on unexpected spend spikes?",
    ],
  },
  {
    id: "staff-engineer",
    label: "Staff Engineer",
    abbr: "SE",
    accent: "blue" as const,
    fitScore: 88,
    level: "Staff",
    strengths: [
      "Technology Architecture Manager at Accenture (technical + people leadership)",
      "Founder of UP2CLOUD — owns architecture decisions end-to-end",
      "Cross-functional: technical pre-sales, delivery, architecture, mentoring",
      "Trained 120+ Accenture engineers to Google Cloud certification",
    ],
    evidence: [
      "Accenture — 70% technical, 30% leadership; ran team + technical pre-sales",
      "UP2CLOUD — consistent pattern of technical depth + business translation",
      "5 employer contexts across 3 continents — strong cross-org influence",
    ],
    concerns: [
      "Staff Eng in product companies often requires sustained org-wide code ownership",
      "Cesar's path is consulting/advisory-led — evaluate fit with specific charter",
    ],
    interviewTopics: [
      "Technical strategy: how do you influence without direct authority?",
      "When did you push back on a business decision on technical grounds?",
      "How do you make architecture decisions stick across multiple teams?",
      "Mentoring model — how do you develop senior engineers?",
    ],
  },
  {
    id: "ai-infrastructure",
    label: "AI Infrastructure",
    abbr: "AI",
    accent: "cyan" as const,
    fitScore: 82,
    level: "Advanced",
    strengths: [
      "Infrastructure foundation for AI: GPU scheduling, cost-aware inference platforms",
      "LLM integrations and RAG over private knowledge bases (production)",
      "Platform engineering directly applicable to MLOps infrastructure",
      "AI automation: cost anomaly detection, ops automation agents",
    ],
    evidence: [
      "This portfolio runs an AI assistant on xAI Grok (live production integration)",
      "Automation agent delivery at UP2CLOUD for enterprise clients",
      "Cloud + observability background directly maps to AI infrastructure needs",
    ],
    concerns: [
      "Growing focus — not primary historical experience vs. cloud/FinOps",
      "Less hands-on GPU cluster management at hyperscale",
      "Strong infra foundation; may need role-specific ML context ramp-up",
    ],
    interviewTopics: [
      "Model serving: trade-offs between vLLM, TGI, and managed endpoints",
      "Cost optimization for inference — batching, quantization, spot/preemptible",
      "Observability for AI: what metrics matter beyond latency/throughput?",
      "RAG architecture — chunking strategy, embedding models, retrieval tuning",
    ],
  },
  {
    id: "consultant",
    label: "Consultant",
    abbr: "CO",
    accent: "blue" as const,
    fitScore: 99,
    level: "Principal",
    strengths: [
      "Founder and principal of UP2CLOUD — B2B cloud consultancy (2022–present)",
      "International delivery: Portugal, Spain, Netherlands, UK, Brazil, US clients",
      "Enterprise track record: banking, aviation, media, staffing, automotive",
      "B2B model: fractional architecture, platform builds, FinOps engagements",
    ],
    evidence: [
      "Randstad Digital — 3.5-year consulting engagement (global staffing leader)",
      "ZeroLight — remote contractor for UK automotive visualization company",
      "everis/NTT Data — AndBank, Santander, LATAM Airlines concurrently",
    ],
    concerns: [] as string[],
    interviewTopics: [
      "How do you scope and price a cloud architecture engagement?",
      "Managing multiple clients — how do you protect quality across engagements?",
      "What does a successful consulting exit look like vs. creating dependency?",
      "How do you handle a client who wants to cut corners on security?",
    ],
  },
] as const;

type Role = typeof ROLES[number];

// ─── Quick insight modes ───────────────────────────────────────────────────────

const QUICK_MODES = [
  {
    id: "exec",
    shortLabel: "Exec",
    question: "Give me a concise executive summary of César Nogueira as a candidate — who he is, his level, key differentiators, and current availability.",
  },
  {
    id: "impact",
    shortLabel: "Impact",
    question: "What measurable business impact has César delivered? Focus on specific outcomes, numbers, and scale of delivery.",
  },
  {
    id: "creds",
    shortLabel: "Credentials",
    question: "List César's certifications, education and verified professional credentials.",
  },
  {
    id: "career",
    shortLabel: "Career",
    question: "Walk me through César's complete career history — companies, roles, responsibilities, and what he delivered at each.",
  },
] as const;

type QuickId = typeof QUICK_MODES[number]["id"];

// ─── Chat message type ────────────────────────────────────────────────────────

type ChatMsg = { id: string; role: "user" | "bot"; text: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(s: number): string {
  if (s >= 93) return "var(--color-ok)";
  if (s >= 85) return "var(--color-cyan)";
  if (s >= 75) return "var(--color-blue)";
  return "var(--color-orange)";
}

function scoreLabel(s: number): string {
  if (s >= 93) return "Excellent fit";
  if (s >= 85) return "Strong fit";
  if (s >= 75) return "Good fit";
  return "Partial fit";
}

let msgCounter = 0;
const msgId = () => `m-${++msgCounter}`;

// ─── Main component ───────────────────────────────────────────────────────────

export function RecruiterMode() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [tab, setTab] = useState<"roles" | "chat">("roles");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [recruiterOn, setRecruiterOn] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<QuickId | null>(null);
  const [quickResult, setQuickResult] = useState<{ id: QuickId; text: string } | null>(null);

  const reduce = useReducedMotion();
  const { t } = useI18n();

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);

  // Restore recruiter state
  useEffect(() => {
    if (localStorage.getItem("recruiter-mode") === "1") {
      document.documentElement.setAttribute("data-recruiter", "1");
      setRecruiterOn(true);
    }
  }, []);

  // Focus close button when panel opens
  useEffect(() => {
    if (panelOpen) {
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    }
  }, [panelOpen]);

  // Focus input when switching to chat tab
  useEffect(() => {
    if (tab === "chat" && panelOpen) {
      const t_ = setTimeout(() => chatInputRef.current?.focus(), 120);
      return () => clearTimeout(t_);
    }
  }, [tab, panelOpen]);

  // Focus back button when role report loads
  useEffect(() => {
    if (selectedRole) {
      const t_ = setTimeout(() => backBtnRef.current?.focus(), 80);
      return () => clearTimeout(t_);
    }
  }, [selectedRole]);

  // Scroll to start of last bot message via container arithmetic
  useEffect(() => {
    if (chatLoading || !lastMsgRef.current || !chatListRef.current) return;
    const container = chatListRef.current;
    const el = lastMsgRef.current;
    const timer = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      const offset = rect.top - cRect.top + container.scrollTop - 12;
      container.scrollTo({ top: offset, behavior: reduce ? "instant" : "smooth" });
    }, 80);
    return () => clearTimeout(timer);
  }, [chatMsgs, reduce, chatLoading]);

  // Escape to close
  useEffect(() => {
    if (!panelOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setPanelOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [panelOpen]);

  const enableRecruiter = () => {
    document.documentElement.setAttribute("data-recruiter", "1");
    localStorage.setItem("recruiter-mode", "1");
    setRecruiterOn(true);
  };
  const disableRecruiter = () => {
    document.documentElement.removeAttribute("data-recruiter");
    localStorage.removeItem("recruiter-mode");
    setRecruiterOn(false);
  };

  const openPanel = () => { enableRecruiter(); setPanelOpen(true); };
  const closePanel = () => { setPanelOpen(false); };

  // Shared AI call
  const callAI = useCallback(async (question: string): Promise<string> => {
    const fallback = `César is a Principal Cloud Architect with 10+ years across GCP, AWS, Azure and OCI — available now for international consulting via UP2CLOUD. Email ${siteConfig.links.email} for enquiries.`;
    try {
      const res = await fetch("/.netlify/functions/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { answer?: string };
      return data.answer?.trim() || fallback;
    } catch {
      return fallback;
    }
  }, []);

  const sendChat = useCallback(async (q: string) => {
    const question = q.trim();
    if (!question || chatLoading) return;
    setChatInput("");
    setChatMsgs((prev) => [...prev, { id: msgId(), role: "user", text: question }]);
    setChatLoading(true);
    const answer = await callAI(question);
    setChatMsgs((prev) => [...prev, { id: msgId(), role: "bot", text: answer }]);
    setChatLoading(false);
  }, [chatLoading, callAI]);

  const runQuick = useCallback(async (mode: typeof QUICK_MODES[number]) => {
    if (quickLoading) return;
    setQuickResult(null);
    setSelectedRole(null);
    setQuickLoading(mode.id);
    setTab("roles");
    const answer = await callAI(mode.question);
    setQuickResult({ id: mode.id, text: answer });
    setQuickLoading(null);
  }, [quickLoading, callAI]);

  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setQuickResult(null);
    setTimeout(() => {
      if (reportRef.current) {
        const rect = reportRef.current.getBoundingClientRect();
        const container = reportRef.current.parentElement!;
        container.scrollTo({ top: container.scrollTop + rect.top - container.getBoundingClientRect().top - 8, behavior: reduce ? "instant" : "smooth" });
      }
    }, 60);
  };
  const clearReport = () => { setSelectedRole(null); setQuickResult(null); };

  const PANEL_ID = "hiring-assistant-panel";
  const ROLES_PANEL_ID = "roles-tab-panel";
  const CHAT_PANEL_ID = "chat-tab-panel";

  return (
    <>
      {/* ── Recruiter banner ────────────────────────────────────────────── */}
      <AnimatePresence>
        {recruiterOn && (
          <m.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -40 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-14 z-40 border-b border-[var(--color-blue)]/30 bg-[var(--color-surface-1)]/95 backdrop-blur-md"
            role="status"
            aria-label="Hiring Assistant mode is active"
          >
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-2">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg)]">
                <span className="text-[var(--color-blue)]" aria-hidden>●</span>{" "}
                Hiring Assistant — impact, credentials &amp; availability highlighted
              </p>
              <button type="button" onClick={disableRecruiter}
                className="shrink-0 font-mono text-[11px] text-[var(--color-fg-muted)] underline-offset-2 hover:text-[var(--color-fg)] hover:underline">
                exit
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger ─────────────────────────────────────────────── */}
      <m.button
        type="button"
        onClick={openPanel}
        aria-label="Open AI Hiring Assistant"
        aria-haspopup="dialog"
        aria-expanded={panelOpen}
        aria-controls={PANEL_ID}
        initial={reduce ? false : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed bottom-5 left-5 z-[90] flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium shadow-2xl transition-all duration-300 ${
          recruiterOn
            ? "border-[var(--color-blue)] bg-[var(--color-blue)] text-white shadow-[0_0_24px_-6px_var(--color-blue)]"
            : "border-[var(--color-blue)]/40 bg-[var(--color-surface-1)] text-[var(--color-fg)] hover:border-[var(--color-blue)] hover:shadow-[0_0_18px_-8px_var(--color-blue)]"
        }`}
      >
        {!recruiterOn && !reduce && (
          <span className="absolute inset-0 rounded-full animate-ping bg-[var(--color-blue)] opacity-20" style={{ animationDuration: "2.4s" }} aria-hidden />
        )}
        {/* Briefcase icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <path d="M2 12h20" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
        <span>Hiring Assistant</span>
      </m.button>

      {/* ── Side panel ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* Backdrop */}
            <m.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closePanel}
              className="fixed inset-0 z-[95] bg-black/50 backdrop-blur-sm sm:hidden"
            />

            <m.div
              id={PANEL_ID}
              role="dialog"
              aria-label="AI Hiring Assistant — César A. Nogueira"
              aria-modal="true"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: "100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="panel fixed inset-y-0 right-0 z-[96] flex w-full flex-col overflow-hidden shadow-2xl sm:w-[440px] lg:w-[460px]"
            >
              {/* ── Header ─────────────────────────────────────────────── */}
              <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-hairline)] px-5 py-4">
                <div>
                  <p className="font-display text-[15px] font-semibold text-[var(--color-fg)]">
                    AI Hiring Assistant
                  </p>
                  <p className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
                    Evaluating César A. Nogueira · Principal Cloud &amp; FinOps
                  </p>
                </div>
                <button
                  ref={closeBtnRef}
                  aria-label="Close hiring assistant"
                  onClick={closePanel}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-fg-subtle)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
                >
                  ✕
                </button>
              </div>

              {/* ── Tabs ───────────────────────────────────────────────── */}
              <div role="tablist" aria-label="Hiring assistant sections" className="flex shrink-0 border-b border-[var(--color-hairline)] px-5">
                {(["roles", "chat"] as const).map((tid) => (
                  <button
                    key={tid}
                    type="button"
                    role="tab"
                    id={`tab-${tid}`}
                    aria-selected={tab === tid}
                    aria-controls={tid === "roles" ? ROLES_PANEL_ID : CHAT_PANEL_ID}
                    onClick={() => { setTab(tid); if (tid === "roles") clearReport(); }}
                    className={`relative py-3 pr-5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                      tab === tid
                        ? "text-[var(--color-blue)]"
                        : "text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]"
                    }`}
                  >
                    {tid === "roles" ? "Role Fit" : "AI Chat"}
                    {tab === tid && (
                      <m.span layoutId="tab-underline" className="absolute bottom-0 left-0 right-4 h-px bg-[var(--color-blue)]" />
                    )}
                  </button>
                ))}
              </div>

              {/* ── Role Fit panel ─────────────────────────────────────── */}
              <div
                id={ROLES_PANEL_ID}
                role="tabpanel"
                aria-labelledby="tab-roles"
                hidden={tab !== "roles"}
                className="flex-1 overflow-y-auto overscroll-contain"
              >
                {tab === "roles" && (
                  <div className="p-5">
                    {/* Quick result */}
                    {quickResult && (
                      <div className="mb-5">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-blue)]">
                            {QUICK_MODES.find((q) => q.id === quickResult.id)?.shortLabel}
                          </p>
                          <button type="button" onClick={() => setQuickResult(null)}
                            className="font-mono text-[10px] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]">
                            ← back
                          </button>
                        </div>
                        <div className="panel-2 rounded-lg p-4 text-sm leading-relaxed text-[var(--color-fg-muted)] whitespace-pre-wrap break-words">
                          {quickResult.text}
                        </div>
                      </div>
                    )}

                    {/* Report view */}
                    {selectedRole && !quickResult && (
                      <div ref={reportRef}>
                        <button
                          ref={backBtnRef}
                          type="button"
                          onClick={clearReport}
                          className="mb-5 flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
                        >
                          ← All roles
                        </button>

                        {/* Score card */}
                        <div className="mb-6 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-2)] p-5">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-display text-lg font-semibold leading-tight text-[var(--color-fg)]">
                                {selectedRole.label}
                              </p>
                              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                                {selectedRole.level} · Fit Evaluation
                              </p>
                            </div>
                            {/* Score */}
                            <div
                              className="flex shrink-0 flex-col items-center"
                              aria-label={`Fit score: ${selectedRole.fitScore} out of 100`}
                            >
                              <p
                                className="font-display text-4xl font-bold leading-none tabular-nums"
                                style={{ color: scoreColor(selectedRole.fitScore) }}
                              >
                                {selectedRole.fitScore}
                              </p>
                              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                                / 100
                              </p>
                            </div>
                          </div>
                          {/* Score bar */}
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]" role="progressbar" aria-valuenow={selectedRole.fitScore} aria-valuemin={0} aria-valuemax={100}>
                            <m.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: scoreColor(selectedRole.fitScore) }}
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedRole.fitScore}%` }}
                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                            />
                          </div>
                          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: scoreColor(selectedRole.fitScore) }}>
                            {scoreLabel(selectedRole.fitScore)}
                          </p>
                        </div>

                        <ReportSection icon="✓" label="Strengths" accent="var(--color-ok)" items={selectedRole.strengths} />
                        <ReportSection icon="○" label="Evidence" accent="var(--color-blue)" items={selectedRole.evidence} />

                        {selectedRole.concerns.length > 0 ? (
                          <ReportSection icon="△" label="Considerations" accent="var(--color-orange)" items={selectedRole.concerns} />
                        ) : (
                          <div className="mb-4">
                            <SectionHeading icon="△" label="Considerations" accent="var(--color-orange)" />
                            <p className="pl-5 font-mono text-[11px] text-[var(--color-ok)]">No significant concerns identified.</p>
                          </div>
                        )}

                        <div className="mb-4">
                          <SectionHeading icon="?" label="Interview Topics" accent="var(--color-cyan)" />
                          <ol className="space-y-2 pl-5">
                            {selectedRole.interviewTopics.map((topic) => (
                              <li key={topic} className="flex gap-2 text-sm text-[var(--color-fg-muted)]">
                                <span className="mt-0.5 font-mono text-[10px] text-[var(--color-fg-subtle)] tabular-nums" aria-hidden>·</span>
                                <span className="leading-relaxed">{topic}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* CTA */}
                        <div className="mt-6 rounded-lg border border-[var(--color-blue)]/30 bg-[var(--color-blue)]/5 p-4">
                          <p className="mb-3 text-sm text-[var(--color-fg-muted)]">
                            Want to discuss this evaluation or explore a specific scenario?
                          </p>
                          <a
                            href={`mailto:${siteConfig.links.email}?subject=Re:%20${encodeURIComponent(selectedRole.label)}%20Evaluation`}
                            aria-label={`Send evaluation email to César about ${selectedRole.label} role`}
                            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-blue)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue)]"
                          >
                            Email César →
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Role grid */}
                    {!selectedRole && !quickResult && (
                      <>
                        <p className="mb-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                          Select a role to generate a structured fit evaluation — strengths, evidence, considerations and interview topics.
                        </p>
                        <div className="grid grid-cols-1 gap-2.5 xs:grid-cols-2 sm:grid-cols-2">
                          {ROLES.map((role) => (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => selectRole(role)}
                              className="group relative flex min-h-[120px] flex-col gap-2 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-2)] p-4 text-left transition-all hover:border-[var(--color-blue)]/60 hover:shadow-sm"
                            >
                              <span
                                className="absolute right-3 top-3 font-mono text-[11px] font-bold tabular-nums"
                                style={{ color: scoreColor(role.fitScore) }}
                                aria-label={`Fit score ${role.fitScore}`}
                              >
                                {role.fitScore}
                              </span>
                              <span
                                className="font-mono text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: `var(--color-${role.accent})` }}
                              >
                                {role.abbr}
                              </span>
                              <span className="line-clamp-2 pr-8 text-[13px] font-medium leading-snug text-[var(--color-fg)]">
                                {role.label}
                              </span>
                              <span className="mt-auto font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                                {role.level}
                              </span>
                              <span className="absolute bottom-3 right-3 font-mono text-[10px] text-[var(--color-blue)] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
                                →
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* ── Chat panel ─────────────────────────────────────────── */}
              <div
                id={CHAT_PANEL_ID}
                role="tabpanel"
                aria-labelledby="tab-chat"
                hidden={tab !== "chat"}
                ref={chatListRef}
                className="flex-1 overflow-y-auto overscroll-contain"
              >
                {tab === "chat" && (
                  <div className="flex flex-col gap-4 p-5">
                    {chatMsgs.length === 0 && (
                      <div className="panel-2 rounded-xl p-4 text-sm leading-relaxed text-[var(--color-fg)]">
                        {t.assistant.greeting}
                      </div>
                    )}

                    {chatMsgs.map((msg) => {
                      const isLastBot = msg.role === "bot" && msg.id === chatMsgs[chatMsgs.length - 1]?.id;
                      return (
                        <div
                          key={msg.id}
                          ref={isLastBot ? lastMsgRef : undefined}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed break-words ${
                            msg.role === "user"
                              ? "bg-[var(--color-blue)] text-white"
                              : "panel-2 text-[var(--color-fg)]"
                          }`}>
                            {msg.role === "bot" && (
                              <p className="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                                {t.assistant.sourceLabel}
                              </p>
                            )}
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}

                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="panel-2 flex items-center gap-2 rounded-xl px-4 py-3">
                          <ThinkingDots />
                          <span className="font-mono text-xs text-[var(--color-fg-muted)]">{t.assistant.thinking}</span>
                        </div>
                      </div>
                    )}

                    {chatMsgs.length === 0 && (
                      <div>
                        <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{t.assistant.suggested}</p>
                        <div className="flex flex-col gap-2">
                          {t.recruiterPrompts.slice(0, 6).map((q, qi) => (
                            <button
                              key={`rp-${qi}`}
                              type="button"
                              onClick={() => sendChat(q)}
                              disabled={chatLoading}
                              className="w-full rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-3 py-2.5 text-left text-xs text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-blue)] hover:text-[var(--color-fg)] disabled:opacity-40"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Quick Insights bar ──────────────────────────────────── */}
              <div
                role="region"
                aria-label="Quick insights about César"
                className="shrink-0 border-t border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-5 py-3"
              >
                <p className="mb-2.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  Quick Insights
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => runQuick(mode)}
                      disabled={!!quickLoading}
                      aria-label={`Get ${mode.shortLabel} insight about César`}
                      className={`flex items-center gap-1.5 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50 sm:py-1.5 ${
                        quickLoading === mode.id
                          ? "border-[var(--color-blue)] bg-[var(--color-blue)]/10 text-[var(--color-blue)]"
                          : "border-[var(--color-hairline)] text-[var(--color-fg-subtle)] hover:border-[var(--color-blue)]/50 hover:text-[var(--color-fg)]"
                      }`}
                    >
                      {quickLoading === mode.id ? <ThinkingDots /> : null}
                      {mode.shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Chat input ─────────────────────────────────────────── */}
              <AnimatePresence>
                {tab === "chat" && (
                  <m.form
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={(e) => { e.preventDefault(); sendChat(chatInput); }}
                    className="shrink-0 flex items-center gap-2 border-t border-[var(--color-hairline)] p-3"
                  >
                    <input
                      ref={chatInputRef}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={t.assistant.placeholder}
                      aria-label="Ask a question about César Nogueira"
                      disabled={chatLoading}
                      className="flex-1 rounded-md border border-[var(--color-hairline)] bg-transparent px-3 py-2 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-blue)] disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      aria-label="Send question"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-blue)] text-sm font-medium text-white disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-[var(--color-blue)]"
                    >
                      ↑
                    </button>
                  </m.form>
                )}
              </AnimatePresence>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ icon, label, accent }: { icon: string; label: string; accent: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="font-mono text-[11px] font-bold" style={{ color: accent }} aria-hidden>{icon}</span>
      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{label}</p>
    </div>
  );
}

function ReportSection({ icon, label, accent, items }: { icon: string; label: string; accent: string; items: readonly string[] }) {
  return (
    <div className="mb-4">
      <SectionHeading icon={icon} label={label} accent={accent} />
      <ul className="space-y-1.5 pl-5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-fg-subtle)]" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex gap-1" aria-hidden>
      {(["d0", "d1", "d2"] as const).map((key, i) => (
        <m.span
          key={key}
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-fg-subtle)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
