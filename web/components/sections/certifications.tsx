"use client";

import { Section } from "@/components/sections/section";
import { Reveal } from "@/components/reveal";
import { certifications } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

// ─── Provider logos (accurate SVG reproductions of official brand marks) ───────

function GCPLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Google Cloud" role="img">
      {/* Google Cloud official 4-color icon */}
      <path d="M32 18.4h-.8l-10.4 6-10.4 6v12l10.4 6 10.4 6 .8-.4V18.4z" fill="#4285F4"/>
      <path d="M32 18.4l10.4 6 10.4 6v12l-10.4 6L32 54.4v-36z" fill="#1A73E8"/>
      <path d="M21.6 30.4L11.2 24.4v12l10.4 6V30.4z" fill="#669DF6"/>
      <path d="M42.4 30.4L52.8 24.4v12l-10.4 6V30.4z" fill="#1A73E8"/>
      {/* Cloud arc */}
      <path d="M40 22c0-4.4-3.6-8-8-8s-8 3.6-8 8c-2.2.4-4 2.4-4 4.8 0 2.7 2.2 4.9 4.9 4.9h14.4c2.7 0 4.7-2.2 4.7-4.9 0-2.4-1.8-4.4-4-4.8z" fill="#4285F4"/>
    </svg>
  );
}

function AWSLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60" fill="none" aria-label="Amazon Web Services" role="img">
      {/* AWS wordmark + smile */}
      <text x="50" y="28" fontFamily="'Amazon Ember', 'Arial Black', sans-serif" fontSize="28" fontWeight="900" fill="#232F3E" textAnchor="middle" dominantBaseline="middle">AWS</text>
      {/* Orange smile/swoosh */}
      <path d="M18 42 Q50 55 82 42" stroke="#FF9900" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <polygon points="80,38 84,44 76,46" fill="#FF9900"/>
    </svg>
  );
}

function AzureLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Microsoft Azure" role="img">
      {/* Azure official gradient triangular "A" */}
      <defs>
        <linearGradient id="az-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0078D4"/>
          <stop offset="100%" stopColor="#50B4F0"/>
        </linearGradient>
      </defs>
      {/* Left blue triangle */}
      <polygon points="8,52 28,10 40,10 24,30" fill="url(#az-grad)"/>
      {/* Right gradient shape */}
      <polygon points="24,30 40,10 56,52 38,52" fill="#0078D4"/>
      {/* Bottom connecting bar */}
      <polygon points="8,52 22,52 36,52 56,52 44,44 20,44" fill="url(#az-grad)" opacity="0.85"/>
    </svg>
  );
}

function FinOpsLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="FinOps Foundation" role="img">
      <defs>
        <linearGradient id="fo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00C7A3"/>
          <stop offset="100%" stopColor="#0095D5"/>
        </linearGradient>
      </defs>
      {/* Stylized "F" for FinOps Foundation */}
      <rect x="12" y="10" width="10" height="44" rx="2" fill="url(#fo-grad)"/>
      <rect x="12" y="10" width="34" height="10" rx="2" fill="url(#fo-grad)"/>
      <rect x="12" y="30" width="26" height="9" rx="2" fill="url(#fo-grad)" opacity="0.8"/>
      {/* Dollar sign accent */}
      <circle cx="50" cy="50" r="10" fill="#00C7A3" opacity="0.18"/>
      <text x="50" y="54" fontSize="13" fontWeight="700" fill="#00C7A3" textAnchor="middle">$</text>
    </svg>
  );
}

// ─── Logo map ─────────────────────────────────────────────────────────────────

function ProviderLogo({ group }: { group: string }) {
  const g = group.toLowerCase();
  if (g.includes("google")) return <GCPLogo size={44} />;
  if (g.includes("aws") || g.includes("amazon")) return <AWSLogo size={56} />;
  if (g.includes("azure") || g.includes("microsoft")) return <AzureLogo size={44} />;
  return <FinOpsLogo size={44} />;
}

// ─── Provider accent colors (matched to brand) ────────────────────────────────

function providerAccent(group: string): { bg: string; border: string; check: string } {
  const g = group.toLowerCase();
  if (g.includes("google")) return { bg: "#4285F4", border: "rgba(66,133,244,0.25)", check: "#4285F4" };
  if (g.includes("aws")) return { bg: "#FF9900", border: "rgba(255,153,0,0.25)", check: "#FF9900" };
  if (g.includes("azure")) return { bg: "#0078D4", border: "rgba(0,120,212,0.25)", check: "#0078D4" };
  return { bg: "#00C7A3", border: "rgba(0,199,163,0.25)", check: "#00C7A3" };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Certifications() {
  const { t } = useI18n();

  return (
    <Section
      id="certifications"
      label={t.sections.certifications.label}
      title={t.sections.certifications.title}
      intro={t.sections.certifications.intro}
      noEyebrow
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {certifications.map((cat, i) => {
          const accent = providerAccent(cat.group);
          return (
            <Reveal key={cat.group} delay={i * 0.08}>
              <div
                data-recruiter-highlight
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-[var(--color-surface-1)] transition-shadow hover:shadow-lg"
                style={{ borderColor: accent.border }}
              >
                {/* Top accent strip */}
                <div className="h-0.5 w-full" style={{ backgroundColor: accent.bg }} />

                <div className="flex flex-1 flex-col p-6">
                  {/* Provider logo + count */}
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <ProviderLogo group={cat.group} />
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: `${accent.bg}18`, color: accent.bg }}
                    >
                      {cat.items.length} {t.labels.verified}
                    </span>
                  </div>

                  {/* Provider name */}
                  <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                    {cat.group}
                  </p>

                  {/* Certification list */}
                  <ul className="mt-auto space-y-3">
                    {cat.items.map((it) => (
                      <li key={it.name} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: accent.bg }}
                          aria-hidden
                        >
                          ✓
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[14px] leading-snug text-[var(--color-fg)]">{it.name}</span>
                          {"note" in it && it.note && (
                            <span
                              className="ml-2 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                              style={{ backgroundColor: `${accent.bg}15`, color: accent.bg }}
                            >
                              {it.note}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
