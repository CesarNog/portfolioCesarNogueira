"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Section } from "@/components/sections/section";
import { experience } from "@/lib/site-config";

export function ExperienceTimeline() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section
      id="experience"
      label="Career Timeline"
      title="A decade of cloud, platform & FinOps leadership"
      intro="Each engagement is a mission. Expand a card to see the stack, the work, and the business impact."
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
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="panel w-full rounded-lg p-5 text-left transition-colors hover:border-[var(--color-hairline-strong)]"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-lg text-[var(--color-fg)]">{job.company}</h3>
                    <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
                      {job.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-blue)]">{job.role}</p>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                          {job.summary}
                        </p>
                        {job.impact.length > 0 && (
                          <ul className="mt-3 space-y-1.5">
                            {job.impact.map((it) => (
                              <li
                                key={it}
                                className="flex gap-2 text-sm text-[var(--color-fg-muted)]"
                              >
                                <span className="text-[var(--color-cyan)]">▸</span>
                                {it}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {job.tech.map((t) => (
                            <span
                              key={t}
                              className="rounded border border-[var(--color-hairline)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-fg-muted)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
