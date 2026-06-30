"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Section } from "@/components/sections/section";
import { experience } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import { EASE, DUR, cardHover } from "@/lib/motion";

export function ExperienceTimeline() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const containerRef = useRef<HTMLDivElement>(null);

  // Deployment beam — vertical line fills as user scrolls through section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const beamHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section
      id="experience"
      title={t.sections.experience.title}
      intro={t.sections.experience.intro}
    >
      <div ref={containerRef} className="relative">
        {/* Track line — static gray */}
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--color-hairline)] sm:left-[9px]"
          aria-hidden
        />
        {/* Deployment beam — blue fill, scroll-driven */}
        {mounted && !reduce && (
          <m.div
            className="absolute left-[7px] top-2 w-px origin-top bg-[var(--color-blue)] sm:left-[9px]"
            style={{ height: beamHeight }}
            aria-hidden
          />
        )}

        <ul className="space-y-3">
          {experience.map((job, i) => {
            const isOpen = open === i;
            return (
              <m.li
                key={job.company}
                className="relative pl-8 sm:pl-10"
                initial={reduce ? false : { opacity: 0, x: -8 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: DUR.reveal, delay: i * 0.06, ease: EASE.spring }}
              >
                {/* Timeline node */}
                <m.span
                  className={`absolute left-0 top-5 h-3.5 w-3.5 rounded-full border-2 sm:left-0.5 transition-colors duration-200 ${
                    isOpen
                      ? "border-[var(--color-blue)] bg-[var(--color-blue)]"
                      : "border-[var(--color-hairline-strong)] bg-[var(--color-surface-0)]"
                  }`}
                  aria-hidden
                />

                {/* Card */}
                <m.div
                  className="panel w-full rounded-lg transition-colors"
                  whileHover={reduce ? undefined : cardHover}
                >
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
                          {t.labels.leadership}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-fg)]">
                      <span className="text-[var(--color-ok)]" aria-hidden>▸</span>
                      <span className="font-medium">{job.outcome}</span>
                    </p>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE.spring }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 px-5 pb-5">
                          <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                            {job.scale}
                          </p>
                          <CAR label={t.labels.challenge} value={job.challenge} accent="orange" />
                          <CAR label={t.labels.action} value={job.action} accent="blue" />
                          <CAR label={t.labels.result} value={job.result} accent="cyan" />
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {job.tech.map((tech) => (
                              <span
                                key={tech}
                                className="rounded border border-[var(--color-hairline)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-fg-muted)]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </m.div>
              </m.li>
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
      <p className="font-mono text-[11px] uppercase tracking-wider" style={{ color: ACCENT[accent] }}>
        {label}
      </p>
      <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{value}</p>
    </div>
  );
}
