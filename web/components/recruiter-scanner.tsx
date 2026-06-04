"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/site-config";
import { EASE } from "@/lib/motion";

// ─── Data ────────────────────────────────────────────────────────────────────

const SCAN_FACTS = [
  "10+ years cloud experience · 6 countries delivered",
  "GCP, AWS, Azure, OCI — all four hyperscalers",
  "FinOps Automation Engineer · Randstad Digital (3.5 yrs)",
  "Founder · UP2CLOUD · Available now for international engagements",
  "2× Google Cloud Professional Cloud Architect · certified",
] as const;

const SKILLS = [
  {
    id: "cloud-architecture",
    label: "Cloud Architecture",
    scoringLabel: "Verifying 10+ years multi-cloud delivery…",
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
    scoringLabel: "Scanning GKE production deployments…",
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
    scoringLabel: "Cross-referencing IaC scope across 4 clouds…",
    score: 99,
    evidence: {
      projects: ["Multi-cloud IaC at Randstad Digital", "Infrastructure automation at everis/NTT Data", "UP2CLOUD client infrastructure"],
      technologies: ["Terraform", "Helm", "GitOps", "GitHub Actions", "GitLab CI"],
      production: "Reproducible, reviewed infrastructure across GCP, AWS, Azure and OCI for enterprise clients.",
      impact: "Eliminated configuration drift across multi-account cloud estates.",
      certifications: ["2× GCP Professional Cloud Architect"],
    },
  },
  {
    id: "kubernetes",
    label: "Kubernetes",
    scoringLabel: "Validating cluster administration experience…",
    score: 96,
    evidence: {
      projects: ["GKE platform at Accenture Interactive", "Kubernetes at ZeroLight (AWS/GCP)", "Multi-cloud K8s at everis"],
      technologies: ["GKE", "EKS", "AKS", "Argo CD", "Helm", "Jenkins/Spinnaker CD"],
      production: "Production GKE cluster admin, multi-tenant namespace isolation, Jenkins + Spinnaker CD automation.",
      impact: "GKE from zero to production at Accenture. Reduced deployment time by 40%.",
      certifications: ["2× GCP Professional Cloud Architect", "GCP Associate Cloud Engineer"],
    },
  },
  {
    id: "finops",
    label: "FinOps",
    scoringLabel: "Measuring cost governance outcomes at Randstad…",
    score: 97,
    evidence: {
      projects: ["Randstad Digital multi-cloud cost governance (3.5 years)", "UP2CLOUD FinOps engagements"],
      technologies: ["CloudHealth", "Python billing APIs", "CloudBees CI/CD", "GCP/AWS/Azure cost APIs"],
      production: "Dedicated Cloud FinOps Automation Engineer at a global Fortune 500 staffing leader.",
      impact: "~30% cloud waste reduction. Automated chargeback and tagging across 12 platform teams.",
      certifications: ["FinOps Foundation Applied Practitioner", "Agile / Kanban"],
    },
  },
  {
    id: "automation",
    label: "Automation",
    scoringLabel: "Counting automated cloud operations…",
    score: 99,
    evidence: {
      projects: ["Python billing automation at Randstad", "CloudBees CI/CD pipelines", "AI automation agents at UP2CLOUD"],
      technologies: ["Python", "CloudBees", "Jenkins", "GitHub Actions", "GitLab CI", "Spinnaker"],
      production: "1,200+ automated cloud operations monthly. Full CI/CD pipeline lifecycle at enterprise scale.",
      impact: "Eliminated manual cost reporting. Automated resource tagging across 3 cloud providers.",
      certifications: ["Agile / Kanban", "FinOps Foundation Applied Practitioner"],
    },
  },
  {
    id: "ai-infrastructure",
    label: "AI Infrastructure",
    scoringLabel: "Evaluating GenAI platform experience…",
    score: 91,
    evidence: {
      projects: ["AI career assistant (this portfolio — live on xAI Grok)", "LLM integrations at UP2CLOUD"],
      technologies: ["xAI Grok", "OpenAI API", "RAG / vector stores", "LLM inference", "Python"],
      production: "Live AI assistant in production. LLM and RAG integrations for enterprise clients.",
      impact: "Scalable, cost-aware inference infrastructure. AI-driven ops and cost anomaly detection.",
      certifications: ["Innovating with Google Cloud Artificial Intelligence"],
    },
  },
  {
    id: "leadership",
    label: "Leadership",
    scoringLabel: "Verifying team and company leadership record…",
    score: 88,
    evidence: {
      projects: ["Technology Architecture Manager at Accenture", "Founder of UP2CLOUD", "Technical pre-sales at Accenture"],
      technologies: ["SCRUM", "SAFe", "OKRs", "technical pre-sales", "cross-functional delivery"],
      production: "Led cloud enablement team at Accenture. 70% technical, 30% management.",
      impact: "Trained 120+ engineers to GCP certification. Founded B2B consultancy delivering globally.",
      certifications: ["Agile / Kanban"],
    },
  },
] as const;

const ROLES = ["Cloud Architect", "Platform Engineer", "FinOps Engineer", "Technical Consultant", "Staff Engineer"] as const;

const IMPACT = [
  { value: "~30%",  label: "Cloud Waste Cut" },
  { value: "40+",   label: "Projects" },
  { value: "10+",   label: "Years" },
  { value: "6+",    label: "Countries" },
] as const;

type Phase = "idle" | "scanning" | "analyzing" | "report";

function scoreColor(s: number) {
  if (s >= 95) return "var(--color-ok)";
  if (s >= 88) return "var(--color-cyan)";
  return "var(--color-blue)";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkillBar({ skill, visible }: { skill: typeof SKILLS[number]; visible: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setExpanded(e => !e)} aria-expanded={expanded} className="w-full group">
        <div className="flex items-center justify-between gap-3 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)] transition-colors">
            {skill.label}
          </span>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="font-mono text-[13px] font-bold tabular-nums" style={{ color: scoreColor(skill.score) }}>
              {skill.score}%
            </span>
            <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]" style={{ display: "inline-block", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s" }}>▾</span>
          </div>
        </div>
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]" role="progressbar" aria-valuenow={skill.score} aria-valuemin={0} aria-valuemax={100}>
          <m.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor(skill.score) }}
            initial={{ width: 0 }}
            animate={{ width: visible ? `${skill.score}%` : 0 }}
            transition={{ duration: 0.85, ease: EASE.out }}
          />
          {/* Flash shimmer on completion */}
          {visible && (
            <span className="pointer-events-none absolute inset-0 translate-x-full animate-[shimmer_0.6s_0.85s_ease-out_forwards] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="my-2 space-y-2.5 rounded-lg bg-[var(--color-surface-2)] p-4 text-left">
          <EvidenceRow label="Projects" items={skill.evidence.projects} />
          <EvidenceRow label="Technologies" items={skill.evidence.technologies} />
          <div>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[var(--color-blue)]">Production</p>
            <p className="text-[12px] leading-relaxed text-[var(--color-fg-muted)]">{skill.evidence.production}</p>
          </div>
          <div>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[var(--color-ok)]">Impact</p>
            <p className="text-[12px] leading-relaxed text-[var(--color-fg-muted)]">{skill.evidence.impact}</p>
          </div>
          <EvidenceRow label="Certifications" items={skill.evidence.certifications} accent="var(--color-orange)" />
        </div>
      )}
    </div>
  );
}

function EvidenceRow({ label, items, accent = "var(--color-fg-subtle)" }: { label: string; items: readonly string[]; accent?: string }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[9px] uppercase tracking-wider" style={{ color: accent }}>{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => (
          <span key={item} className="rounded border border-[var(--color-hairline)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-fg-muted)]">{item}</span>
        ))}
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {(["a","b","c"] as const).map((k, i) => (
        <m.span key={k} className="h-1.5 w-1.5 rounded-full bg-[var(--color-blue)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function RecruiterScanner() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [skillsVisible, setSkillsVisible] = useState<boolean[]>(Array(SKILLS.length).fill(false));
  const [activeScoringIdx, setActiveScoringIdx] = useState(-1);
  const reduce = useReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const open = () => setPhase("scanning");
  const close = () => { setPhase("idle"); setSkillsVisible(Array(SKILLS.length).fill(false)); setActiveScoringIdx(-1); };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (phase === "scanning") {
      timers.push(setTimeout(() => setPhase("analyzing"), reduce ? 50 : 1700));
    }

    if (phase === "analyzing") {
      SKILLS.forEach((_, i) => {
        timers.push(setTimeout(() => {
          setActiveScoringIdx(i);
          setSkillsVisible(prev => { const n = [...prev]; n[i] = true; return n; });
        }, reduce ? 0 : i * 230 + 200));
      });
      timers.push(setTimeout(() => {
        setPhase("report");
        setActiveScoringIdx(-1);
      }, reduce ? 50 : SKILLS.length * 230 + 700));
    }

    if (phase === "report") {
      // Delay scroll until after React has painted the report DOM
      timers.push(setTimeout(() => {
        if (bodyRef.current) {
          bodyRef.current.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
        }
      }, 120));
    }

    return () => timers.forEach(clearTimeout);
  }, [phase, reduce]);

  useEffect(() => {
    if (phase !== "idle") requestAnimationFrame(() => closeBtnRef.current?.focus());
  }, [phase]);

  useEffect(() => {
    if (phase === "idle") return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [phase]);

  // ⌘⇧E (Mac) / Ctrl⇧E (Win/Linux) — keyboard shortcut to open scanner
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "E" && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (phase === "idle") open();
        else close();
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [phase]);

  const currentSkill = activeScoringIdx >= 0 ? SKILLS[activeScoringIdx] : null;

  // ── Trigger ────────────────────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <button
        type="button"
        onClick={open}
        className="group relative inline-flex items-center gap-2.5 rounded-md border border-[var(--color-ok)]/40 bg-[var(--color-ok)]/5 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-ok)] transition-all hover:border-[var(--color-ok)]/70 hover:bg-[var(--color-ok)]/10 hover:shadow-[0_0_16px_-6px_var(--color-ok)]"
        aria-haspopup="dialog"
        title="Evaluate Cesar for a role (⌘⇧E)"
      >
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
          <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-ok)] opacity-50" style={{ animationDuration: "1.8s" }} />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-ok)]" />
        </span>
        Evaluate Cesar
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="opacity-60 transition-transform group-hover:translate-x-0.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    );
  }

  // ── Overlay (always visible when phase !== idle — no AnimatePresence/opacity:0) ──
  return (
    <div
      role="dialog"
      aria-label="Candidate Evaluation — César A. Nogueira"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-[var(--color-surface-0)]"
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-hairline)] px-6 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
            {phase !== "report" && <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-ok)] opacity-60" style={{ animationDuration: "1.4s" }} />}
            <span className="relative h-2 w-2 rounded-full bg-[var(--color-ok)]" />
          </span>
          <span className="truncate font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
            {phase === "scanning" && "Initializing candidate scan…"}
            {phase === "analyzing" && (currentSkill ? currentSkill.scoringLabel : "Analyzing candidate profile…")}
            {phase === "report" && "Evaluation complete · Recommendation ready"}
          </span>
        </div>
        <button ref={closeBtnRef} type="button" onClick={close} aria-label="Close"
          className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--color-fg-subtle)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]">
          ✕
        </button>
      </div>

      {/* Scanner beam — CSS only, no opacity animation */}
      {phase === "scanning" && (
        <m.div
          aria-hidden
          initial={{ top: 0 }}
          animate={{ top: "100vh" }}
          transition={{ duration: 1.5, ease: EASE.out }}
          className="pointer-events-none absolute inset-x-0 z-10 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--color-blue) 20%, var(--color-ok) 50%, var(--color-blue) 80%, transparent 100%)",
            boxShadow: "0 0 16px 2px color-mix(in oklab, var(--color-blue) 40%, transparent)",
          }}
        />
      )}

      {/* Body */}
      <div ref={bodyRef} className="flex-1 overflow-y-auto overscroll-contain">

        {/* ── ACT 1: Scanning ─────────────────────────────────────────── */}
        {phase === "scanning" && (
          <div className="flex h-full flex-col items-center justify-center px-6">
            <div className="w-full max-w-lg">
              {/* Terminal-style header block */}
              <div className="mb-8 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-5 font-mono">
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  ▸ AI Hiring Assessment System — v2.1
                </p>
                <p className="text-[10px] text-[var(--color-fg-subtle)]">$ assess --candidate <span className="text-[var(--color-ok)]">CN-EU-2025</span> --depth full</p>
                <div className="mt-3 border-t border-[var(--color-hairline)] pt-3">
                  <p className="text-sm font-semibold text-[var(--color-fg)]">César Augusto Nogueira</p>
                  <p className="text-[11px] text-[var(--color-blue)]">Principal Cloud Architect · FinOps Specialist · UP2CLOUD</p>
                  <p className="mt-1 text-[10px] text-[var(--color-fg-subtle)]">📍 Vila Real, Portugal · Remote EU/Worldwide</p>
                </div>
              </div>

              {/* Scanning status */}
              <div className="mb-6 flex items-center gap-3">
                <ThinkingDots />
                <span className="font-mono text-[11px] text-[var(--color-fg-muted)]">
                  Reading profile data<span className="cursor-blink" />
                </span>
              </div>

              {/* Facts appearing one by one */}
              <div className="space-y-2">
                {SCAN_FACTS.map((fact, i) => (
                  <m.div key={fact}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: i * 0.26, ease: EASE.out }}
                    className="flex items-center gap-3 rounded-md bg-[var(--color-surface-1)] px-4 py-2.5">
                    <span className="shrink-0 font-mono text-[10px] font-bold text-[var(--color-ok)]">✓</span>
                    <span className="font-mono text-[11px] text-[var(--color-fg-muted)]">{fact}</span>
                  </m.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ACT 2 + 3: Analyzing + Report ────────────────────────────── */}
        {(phase === "analyzing" || phase === "report") && (
          <div className="mx-auto max-w-2xl px-5 py-6 sm:px-8 sm:py-10">
            {/* Candidate header */}
            <div className="mb-6 pb-5 border-b border-[var(--color-hairline)]">
              <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                Candidate Evaluation · {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
              <p className="font-display text-xl text-[var(--color-fg)] sm:text-2xl">César Augusto Nogueira</p>
              <p className="font-mono text-[11px] text-[var(--color-blue)]">Principal Cloud Architect · FinOps Specialist · UP2CLOUD · Vila Real, Portugal</p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                Competency Scores
                {phase === "analyzing" && (
                  <span className="ml-2 text-[var(--color-blue)]">· {skillsVisible.filter(Boolean).length} / {SKILLS.length}</span>
                )}
              </p>
              <div className="divide-y divide-[var(--color-hairline)]">
                {SKILLS.map((skill, i) => <SkillBar key={skill.id} skill={skill} visible={skillsVisible[i]} />)}
              </div>
            </div>

            {/* ── ACT 3 Report — CSS animations (avoids React concurrent mode opacity:0 trap) ── */}
            {phase === "report" && (
              <div>
                {/* Separator — line draws from center out */}
                <div className="mb-8 flex items-center gap-3">
                  <div className="verdict-line h-px flex-1 bg-[var(--color-ok)]/40" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-ok)]" style={{ animationDelay: "0.15s" }}>Assessment Complete</span>
                  <div className="verdict-line h-px flex-1 bg-[var(--color-ok)]/40" />
                </div>

                {/* Verdict card — rises 300ms after separator */}
                <div className="verdict-card mb-5 rounded-xl bg-[var(--color-ok)]/6 p-7 text-center"
                  style={{ boxShadow: "0 0 40px -12px color-mix(in oklab, var(--color-ok) 30%, transparent)" }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-ok)]/70">Hire Recommendation</p>
                  <p className="mt-2 font-display text-4xl font-bold leading-tight text-[var(--color-ok)] sm:text-5xl">
                    Proceed to Interview
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-6 border-t border-[var(--color-ok)]/15 pt-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">Overall Fit</p>
                      <p className="mt-0.5 font-mono text-base font-bold text-[var(--color-ok)]">Strong Match</p>
                    </div>
                    <div className="h-8 w-px bg-[var(--color-ok)]/20" />
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">Risk Level</p>
                      <p className="mt-0.5 font-mono text-base font-bold text-[var(--color-ok)]">Low</p>
                    </div>
                    <div className="h-8 w-px bg-[var(--color-ok)]/20" />
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">Availability</p>
                      <p className="mt-0.5 font-mono text-base font-bold text-[var(--color-cyan)]">Now</p>
                    </div>
                  </div>
                </div>

                {/* Best-fit roles — chips pop in staggered */}
                <div className="block-rise mb-5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-4"
                  style={{ animationDelay: "0.55s" }}>
                  <p className="mb-2.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">Best-Fit Roles</p>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((role, i) => (
                      <span key={role}
                        className="chip-pop inline-flex items-center gap-1.5 rounded-full border border-[var(--color-ok)]/25 bg-[var(--color-ok)]/8 px-3 py-1.5 font-mono text-[11px] text-[var(--color-ok)]"
                        style={{ animationDelay: `${0.65 + i * 0.06}s` }}>
                        <span aria-hidden>✓</span> {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Business impact */}
                <div className="block-rise mb-5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-4"
                  style={{ animationDelay: "0.8s" }}>
                  <p className="mb-3 font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">Business Impact</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {IMPACT.map(s => (
                      <div key={s.label}>
                        <p className="font-display text-xl font-bold text-[var(--color-fg)]">{s.value}</p>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="block-rise flex flex-col gap-2.5" style={{ animationDelay: "0.95s" }}>
                  <a href={siteConfig.links.calendly} target="_blank" rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-ok)] px-5 py-3 text-sm font-semibold text-[#08090c] transition-opacity hover:opacity-90">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Schedule Interview
                  </a>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button"
                      onClick={() => { close(); setTimeout(() => document.dispatchEvent(new CustomEvent("open-contact-form")), 300); }}
                      className="inline-flex items-center justify-center rounded-md border border-[var(--color-hairline-strong)] px-4 py-2.5 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]">
                      Email César →
                    </button>
                    <a href={siteConfig.links.cv} target="_blank" rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-md border border-[var(--color-hairline-strong)] px-4 py-2.5 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]">
                      Download CV ↓
                    </a>
                  </div>
                </div>

                <p className="mt-5 text-center font-mono text-[10px] text-[var(--color-fg-subtle)]">
                  Expand any competency above to view projects, evidence and certifications
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="shrink-0 border-t border-[var(--color-hairline)] px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
            {phase === "scanning" && "Scanning candidate record…"}
            {phase === "analyzing" && `Scoring ${skillsVisible.filter(Boolean).length} / ${SKILLS.length} competencies`}
            {phase === "report" && `${SKILLS.length} / ${SKILLS.length} competencies scored · ${ROLES.length} roles matched`}
          </p>
          <button type="button" onClick={close}
            className="font-mono text-[10px] text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-fg)]">
            Close ✕
          </button>
        </div>
      </div>
    </div>
  );
}
