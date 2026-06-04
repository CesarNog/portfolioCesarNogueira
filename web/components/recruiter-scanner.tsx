"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/site-config";
import { EASE, DUR } from "@/lib/motion";

// ─── Skill data ───────────────────────────────────────────────────────────────

const SKILLS = [
  {
    id: "cloud-architecture",
    label: "Cloud Architecture",
    score: 98,
    evidence: {
      projects: ["AndBank multi-cloud (GCP/AWS/Azure/OCI)", "LATAM Airlines resilient infra", "Santander regulated platform"],
      technologies: ["Google Cloud Platform", "AWS", "Microsoft Azure", "Oracle Cloud", "VPC design", "private endpoints"],
      production: "Regulatory-grade multi-cloud for banking, aviation and staffing enterprises across Europe and the Americas.",
      impact: "99.9% availability SLA delivered for regulated banking and aviation workloads.",
      certifications: ["2× GCP Professional Cloud Architect", "AWS Cloud Practitioner", "Azure AZ-900"],
    },
  },
  {
    id: "platform-engineering",
    label: "Platform Engineering",
    score: 95,
    evidence: {
      projects: ["GKE cloud enablement at Accenture", "ZeroLight automotive OEM deployments", "UP2CLOUD platform builds"],
      technologies: ["Kubernetes / GKE", "Docker", "Argo CD", "Helm", "GitOps", "self-service platforms"],
      production: "GKE in production serving Volkswagen, Lucid, Vinfast, Cadillac and Mitsubishi via ZeroLight.",
      impact: "120+ Accenture engineers trained to Google Cloud certification. 40% faster deployment cycles.",
      certifications: ["GCP Associate Cloud Engineer", "2× GCP Professional Cloud Architect"],
    },
  },
  {
    id: "terraform",
    label: "Terraform / IaC",
    score: 99,
    evidence: {
      projects: ["Multi-cloud IaC at Randstad Digital", "Infrastructure automation at everis/NTT Data", "UP2CLOUD client infrastructure"],
      technologies: ["Terraform", "Helm", "GitOps", "Terragrunt", "GitHub Actions", "GitLab CI"],
      production: "Reproducible, reviewed infrastructure across GCP, AWS, Azure and OCI for enterprise clients.",
      impact: "Eliminated configuration drift across multi-account cloud estates. Infra fully version-controlled.",
      certifications: ["2× GCP Professional Cloud Architect"],
    },
  },
  {
    id: "kubernetes",
    label: "Kubernetes",
    score: 96,
    evidence: {
      projects: ["GKE platform at Accenture Interactive", "Kubernetes at ZeroLight (AWS/GCP)", "Multi-cloud K8s at everis"],
      technologies: ["GKE", "EKS", "AKS", "Argo CD", "Helm", "Istio", "Jenkins/Spinnaker CD"],
      production: "Production GKE cluster admin, multi-tenant namespace isolation, Jenkins + Spinnaker CD automation.",
      impact: "Led cloud enablement team: GKE from zero to production at Accenture. Reduced deployment time by 40%.",
      certifications: ["2× GCP Professional Cloud Architect", "GCP Associate Cloud Engineer"],
    },
  },
  {
    id: "finops",
    label: "FinOps",
    score: 97,
    evidence: {
      projects: ["Randstad Digital multi-cloud cost governance (3.5 years)", "UP2CLOUD FinOps engagements"],
      technologies: ["CloudHealth", "Python billing APIs", "CloudBees CI/CD", "GCP/AWS/Azure cost APIs", "Looker Studio"],
      production: "Dedicated Cloud FinOps Automation Engineer role at a global Fortune 500 staffing leader.",
      impact: "~30% cloud waste reduction. Automated chargeback and tagging across 12 platform teams. Executive dashboards.",
      certifications: ["FinOps Foundation Applied Practitioner", "Agile / Kanban"],
    },
  },
  {
    id: "automation",
    label: "Automation",
    score: 99,
    evidence: {
      projects: ["Python billing automation at Randstad", "CloudBees CI/CD pipelines", "AI automation agents at UP2CLOUD"],
      technologies: ["Python", "CloudBees", "Jenkins", "GitHub Actions", "GitLab CI", "Spinnaker", "RunDeck"],
      production: "1,200+ automated cloud operations monthly. Full CI/CD pipeline lifecycle at enterprise scale.",
      impact: "Eliminated manual cost reporting. Automated resource tagging and chargeback across 3 cloud providers.",
      certifications: ["Agile / Kanban", "FinOps Foundation Applied Practitioner"],
    },
  },
  {
    id: "ai-infrastructure",
    label: "AI Infrastructure",
    score: 91,
    evidence: {
      projects: ["AI career assistant (this portfolio — live on xAI Grok)", "LLM integrations at UP2CLOUD", "AI automation agents"],
      technologies: ["xAI Grok", "OpenAI API", "RAG / vector stores", "LLM inference", "GPU scheduling", "Python"],
      production: "Live AI assistant in production on this portfolio. LLM and RAG integrations for enterprise clients.",
      impact: "Scalable, cost-aware inference infrastructure. AI-driven ops and cost anomaly detection.",
      certifications: ["Innovating with Google Cloud Artificial Intelligence"],
    },
  },
  {
    id: "leadership",
    label: "Leadership",
    score: 88,
    evidence: {
      projects: ["Technology Architecture Manager at Accenture", "Founder of UP2CLOUD", "Technical pre-sales at Accenture"],
      technologies: ["SCRUM", "SAFe", "OKRs", "technical pre-sales", "cross-functional delivery"],
      production: "Led cloud enablement team at Accenture. 70% technical, 30% management and stakeholder leadership.",
      impact: "Trained 120+ engineers to GCP certification. Founded B2B consultancy delivering globally.",
      certifications: ["Agile / Kanban"],
    },
  },
] as const;

type SkillId = typeof SKILLS[number]["id"];

const ROLES = [
  "Cloud Architect",
  "Platform Engineer",
  "FinOps Engineer",
  "Technical Consultant",
  "Staff Engineer",
] as const;

const IMPACT = [
  { label: "Cloud Savings", value: "$2.5M+", sub: "across enterprise clients" },
  { label: "Projects Delivered", value: "40+", sub: "cloud projects" },
  { label: "Years Experience", value: "10+", sub: "in cloud & DevOps" },
  { label: "Countries Delivered", value: "6+", sub: "Europe & Americas" },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "idle" | "scanning" | "analyzing" | "report";

// ─── Score helpers ────────────────────────────────────────────────────────────

function scoreColor(s: number): string {
  if (s >= 95) return "var(--color-ok)";
  if (s >= 88) return "var(--color-cyan)";
  return "var(--color-blue)";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkillBar({ skill, index, visible }: { skill: typeof SKILLS[number]; index: number; visible: boolean; }) {
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();
  const delay = index * 0.22;

  return (
    <m.div
      initial={reduce ? false : { opacity: 0, x: -12 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ duration: DUR.reveal, delay, ease: EASE.spring }}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="w-full group"
      >
        <div className="flex items-center justify-between gap-4 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)] transition-colors">
            {skill.label}
          </span>
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-sm font-bold tabular-nums"
              style={{ color: scoreColor(skill.score) }}
            >
              {skill.score}%
            </span>
            <span className="font-mono text-[10px] text-[var(--color-fg-subtle)] transition-transform duration-200" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
              ▾
            </span>
          </div>
        </div>
        {/* Bar track */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]" role="progressbar" aria-valuenow={skill.score} aria-valuemin={0} aria-valuemax={100} aria-label={`${skill.label}: ${skill.score}%`}>
          <m.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor(skill.score) }}
            initial={{ width: 0 }}
            animate={visible ? { width: `${skill.score}%` } : { width: 0 }}
            transition={{ duration: 0.9, delay: delay + 0.15, ease: EASE.out }}
          />
        </div>
      </button>

      {/* Evidence drawer */}
      <AnimatePresence initial={false}>
        {expanded && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE.spring }}
            className="overflow-hidden"
          >
            <div className="mt-2 mb-3 space-y-3 rounded-lg bg-[var(--color-surface-2)] p-4 text-left">
              <EvidenceRow label="Projects" items={skill.evidence.projects} />
              <EvidenceRow label="Technologies" items={skill.evidence.technologies} />
              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[var(--color-blue)]">Production Experience</p>
                <p className="text-[13px] leading-relaxed text-[var(--color-fg-muted)]">{skill.evidence.production}</p>
              </div>
              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[var(--color-ok)]">Business Impact</p>
                <p className="text-[13px] leading-relaxed text-[var(--color-fg-muted)]">{skill.evidence.impact}</p>
              </div>
              <EvidenceRow label="Certifications" items={skill.evidence.certifications} accent="var(--color-orange)" />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

function EvidenceRow({ label, items, accent = "var(--color-fg-subtle)" }: { label: string; items: readonly string[]; accent?: string }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[9px] uppercase tracking-wider" style={{ color: accent }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded border border-[var(--color-hairline)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-fg-muted)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {(["a","b","c"] as const).map((k, i) => (
        <m.span
          key={k}
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-blue)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RecruiterScanner() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [skillsVisible, setSkillsVisible] = useState<boolean[]>(Array(SKILLS.length).fill(false));
  const reduce = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const open = () => setPhase("scanning");

  const close = () => {
    setPhase("idle");
    setSkillsVisible(Array(SKILLS.length).fill(false));
  };

  // Phase machine — all timers collected so cleanup removes every one of them
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (phase === "scanning") {
      timers.push(setTimeout(() => setPhase("analyzing"), reduce ? 50 : 1600));
    }

    if (phase === "analyzing") {
      SKILLS.forEach((_, i) => {
        timers.push(setTimeout(
          () => setSkillsVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          }),
          reduce ? 0 : i * 220 + 200,
        ));
      });
      // Transition to report 600ms after last skill reveals
      timers.push(setTimeout(
        () => setPhase("report"),
        reduce ? 50 : SKILLS.length * 220 + 600,
      ));
    }

    return () => timers.forEach(clearTimeout);
  }, [phase, reduce]);

  // Focus management
  useEffect(() => {
    if (phase !== "idle") {
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    }
  }, [phase]);

  // Escape to close
  useEffect(() => {
    if (phase === "idle") return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [phase]);

  const isOpen = phase !== "idle";

  return (
    <>
      {/* ── Trigger button ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={open}
        className="group relative inline-flex items-center gap-2.5 rounded-md border border-[var(--color-ok)]/40 bg-[var(--color-ok)]/5 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-ok)] transition-all hover:border-[var(--color-ok)]/70 hover:bg-[var(--color-ok)]/10 hover:shadow-[0_0_16px_-6px_var(--color-ok)]"
        aria-haspopup="dialog"
      >
        {/* Pulse dot */}
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
          <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-ok)] opacity-50" style={{ animationDuration: "1.8s" }} />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-ok)]" />
        </span>
        Evaluate Cesar
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="opacity-60 transition-transform group-hover:translate-x-0.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Scanner overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            role="dialog"
            aria-label="Recruiter Scanner — Candidate Evaluation"
            aria-modal="true"
            ref={panelRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE.out }}
            className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-[var(--color-surface-0)]"
            style={{ backdropFilter: "none" }}
          >
            {/* ── Top bar ──────────────────────────────────────────────── */}
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-hairline)] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2" aria-hidden>
                  {phase !== "report" && <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-ok)] opacity-60" style={{ animationDuration: "1.4s" }} />}
                  <span className={`relative h-2 w-2 rounded-full ${phase === "report" ? "bg-[var(--color-ok)]" : "bg-[var(--color-ok)]"}`} />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                  {phase === "scanning" && "Initializing scan…"}
                  {phase === "analyzing" && "Analyzing candidate profile…"}
                  {phase === "report" && "Evaluation complete"}
                </span>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={close}
                aria-label="Close recruiter scanner"
                className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-fg-subtle)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
              >
                ✕
              </button>
            </div>

            {/* ── Scanner beam (scanning phase) ─────────────────────────── */}
            <AnimatePresence>
              {phase === "scanning" && (
                <m.div
                  aria-hidden
                  initial={{ top: 0 }}
                  animate={{ top: "100vh" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: EASE.out }}
                  className="pointer-events-none absolute inset-x-0 z-10 h-px"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, var(--color-blue) 20%, var(--color-ok) 50%, var(--color-blue) 80%, transparent 100%)",
                    boxShadow: "0 0 16px 2px color-mix(in oklab, var(--color-blue) 40%, transparent)",
                  }}
                />
              )}
            </AnimatePresence>

            {/* ── Body ─────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Scanning phase */}
              {phase === "scanning" && (
                <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
                  <m.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE.out }}
                  >
                    {/* Candidate identity */}
                    <div className="mb-8 space-y-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
                        Candidate ID · CN-2024-EU
                      </p>
                      <p className="font-display text-2xl text-[var(--color-fg)]">
                        César Augusto Nogueira
                      </p>
                      <p className="font-mono text-xs text-[var(--color-blue)]">
                        Principal Cloud Architect · FinOps Specialist
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <ThinkingDots />
                      <span className="font-mono text-sm text-[var(--color-fg-muted)]">
                        Analyzing candidate profile
                      </span>
                    </div>

                    {/* Scanning metadata rows */}
                    <div className="mx-auto mt-10 max-w-sm space-y-2 text-left">
                      {[
                        "Loading experience matrix…",
                        "Cross-referencing certifications…",
                        "Mapping project evidence…",
                        "Computing fit scores…",
                      ].map((msg, i) => (
                        <m.div
                          key={msg}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 0.5, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.28, ease: EASE.out }}
                          className="flex items-center gap-2"
                        >
                          <span className="font-mono text-[10px] text-[var(--color-ok)]">✓</span>
                          <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">{msg}</span>
                        </m.div>
                      ))}
                    </div>
                  </m.div>
                </div>
              )}

              {/* Analyzing + Report phases */}
              {(phase === "analyzing" || phase === "report") && (
                <div className="mx-auto max-w-3xl px-6 py-8 lg:py-12">
                  {/* Candidate header */}
                  <m.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE.out }}
                    className="mb-8 pb-6 border-b border-[var(--color-hairline)]"
                  >
                    <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
                      Candidate Evaluation Report · {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                    <h2 className="font-display text-2xl text-[var(--color-fg)] sm:text-3xl">
                      César Augusto Nogueira
                    </h2>
                    <p className="mt-1 font-mono text-xs text-[var(--color-blue)]">
                      Principal Cloud Architect · FinOps Specialist · UP2CLOUD
                    </p>
                  </m.div>

                  {/* Two-column on large screens */}
                  <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
                    {/* Left: skills */}
                    <div>
                      <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                        Competency Scores
                      </p>
                      <div className="divide-y divide-[var(--color-hairline)]">
                        {SKILLS.map((skill, i) => (
                          <SkillBar
                            key={skill.id}
                            skill={skill}
                            index={i}
                            visible={skillsVisible[i]}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right: summary + impact */}
                    <div className="space-y-5">
                      {/* Overall assessment */}
                      <AnimatePresence>
                        {phase === "report" && (
                          <m.div
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: DUR.reveal, ease: EASE.spring }}
                            className="rounded-xl border border-[var(--color-ok)]/30 bg-[var(--color-ok)]/5 p-5"
                          >
                            <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                              Overall Assessment
                            </p>
                            <p className="font-display text-2xl font-semibold text-[var(--color-ok)]">
                              Strong Match
                            </p>
                          </m.div>
                        )}
                      </AnimatePresence>

                      {/* Recommended roles */}
                      <AnimatePresence>
                        {phase === "report" && (
                          <m.div
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: DUR.reveal, delay: 0.1, ease: EASE.spring }}
                            className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-5"
                          >
                            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                              Recommended Roles
                            </p>
                            <ul className="space-y-2">
                              {ROLES.map((role, i) => (
                                <m.li
                                  key={role}
                                  initial={reduce ? false : { opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.15 + i * 0.07, ease: EASE.out }}
                                  className="flex items-center gap-2 text-sm text-[var(--color-fg)]"
                                >
                                  <span className="font-mono text-[10px] text-[var(--color-ok)]" aria-hidden>✓</span>
                                  {role}
                                </m.li>
                              ))}
                            </ul>
                          </m.div>
                        )}
                      </AnimatePresence>

                      {/* Risk + interview */}
                      <AnimatePresence>
                        {phase === "report" && (
                          <m.div
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: DUR.reveal, delay: 0.2, ease: EASE.spring }}
                            className="grid grid-cols-2 gap-3"
                          >
                            <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-4 text-center">
                              <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">Risk Level</p>
                              <p className="mt-1.5 font-mono text-base font-bold text-[var(--color-ok)]">Low</p>
                            </div>
                            <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-4 text-center">
                              <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">Interview</p>
                              <p className="mt-1.5 font-mono text-base font-bold text-[var(--color-cyan)]">Proceed</p>
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>

                      {/* Business impact */}
                      <AnimatePresence>
                        {phase === "report" && (
                          <m.div
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: DUR.reveal, delay: 0.3, ease: EASE.spring }}
                            className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-5"
                          >
                            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                              Business Impact
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              {IMPACT.map((item, i) => (
                                <m.div
                                  key={item.label}
                                  initial={reduce ? false : { opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.35, delay: 0.35 + i * 0.08, ease: EASE.out }}
                                >
                                  <p className="font-display text-xl font-bold text-[var(--color-fg)]">
                                    {item.value}
                                  </p>
                                  <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                                    {item.label}
                                  </p>
                                </m.div>
                              ))}
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>

                      {/* CTA buttons */}
                      <AnimatePresence>
                        {phase === "report" && (
                          <m.div
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: DUR.reveal, delay: 0.42, ease: EASE.spring }}
                            className="flex flex-col gap-2"
                          >
                            <a
                              href={siteConfig.links.calendly}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-ok)] px-5 py-3 text-sm font-semibold text-[#08090c] transition-opacity hover:opacity-90"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              Schedule Interview
                            </a>
                            <a
                              href={`mailto:${siteConfig.links.email}?subject=Interview%20Request%20%E2%80%94%20Cloud%20Architecture%20Role`}
                              className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--color-hairline-strong)] px-5 py-2.5 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]"
                            >
                              Email César →
                            </a>
                            <a
                              href={siteConfig.links.cv}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-fg)]"
                            >
                              Download CV ↓
                            </a>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer bar ────────────────────────────────────────────── */}
            <div className="shrink-0 border-t border-[var(--color-hairline)] px-6 py-3">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  {phase === "scanning" && "Scanning…"}
                  {phase === "analyzing" && `Scoring ${skillsVisible.filter(Boolean).length} / ${SKILLS.length} competencies`}
                  {phase === "report" && `${SKILLS.length} / ${SKILLS.length} competencies scored · click any skill to expand evidence`}
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="font-mono text-[10px] text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-fg)]"
                >
                  Close ✕
                </button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
