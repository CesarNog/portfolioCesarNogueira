"use client";

import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Section } from "@/components/sections/section";
import { experience } from "@/lib/site-config";

export function ExperienceTimeline() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section
      id="experience"
      label="Career Impact"
      title="Outcomes delivered across a decade of cloud leadership"
      intro="Each role framed as Challenge → Action → Result. Expand a card for the business outcome, scale and stack."
    >
      <div className="relative">
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--color-hairline)] sm:left-[9px]"
          aria-hidden
        />
        <ul className="space-y-3">
          {experience.map((job, i) => {
            const isOpen = open === i;
            return (
              <li key={job.company} className="relative pl-8 sm:pl-10">
                <span
                  className={`absolute left-0 top-5 h-3.5 w-3.5 rounded-full border-2 sm:left-0.5 ${
                    isOpen
                      ? "border-[var(--color-blue)] bg-[var(--color-blue)]"
                      : "border-[var(--color-hairline-strong)] bg-[var(--color-surface-0)]"
                  }`}
                  aria-hidden
                />
                <div className="panel w-full rounded-lg transition-colors hover:border-[var(--color-hairline-strong)]">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full rounded-lg p-5 text-left"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="text-lg text-[var(--color-fg)]">{job.company}</h3>
                      <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
                        {job.period}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-sm text-[var(--color-blue)]">{job.role}</p>
                      {job.leadership && (
                        <span className="rounded border border-[var(--color-hairline-strong)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                          Leadership
                        </span>
                      )}
                    </div>

                    {/* Outcome is always visible — the part recruiters scan for. */}
                    <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-fg)]">
                      <span className="text-[var(--color-ok)]" aria-hidden>
                        ▸
                      </span>
                      <span className="font-medium">{job.outcome}</span>
                    </p>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 px-5 pb-5">
                          <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                            {job.scale}
                          </p>
                          <CAR label="Challenge" value={job.challenge} accent="orange" />
                          <CAR label="Action" value={job.action} accent="blue" />
                          <CAR label="Result" value={job.result} accent="cyan" />
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {job.tech.map((t) => (
                              <span
                                key={t}
                                className="rounded border border-[var(--color-hairline)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-fg-muted)]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

const ACCENT: Record<string, string> = {
  blue: "var(--color-blue)",
  cyan: "var(--color-cyan)",
  orange: "var(--color-orange)",
};

function CAR({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr] sm:gap-4">
      <p
        className="font-mono text-[11px] uppercase tracking-wider"
        style={{ color: ACCENT[accent] }}
      >
        {label}
      </p>
      <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{value}</p>
    </div>
  );
}
