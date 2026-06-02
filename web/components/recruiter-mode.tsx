"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useI18n } from "@/lib/i18n";

const KEY = "recruiter-mode";

export function RecruiterMode() {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  const { t } = useI18n();

  useEffect(() => {
    if (localStorage.getItem(KEY) === "1") {
      document.documentElement.setAttribute("data-recruiter", "1");
      setOn(true);
    }
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    if (next) {
      document.documentElement.setAttribute("data-recruiter", "1");
      localStorage.setItem(KEY, "1");
      document.getElementById("summary")?.scrollIntoView({ behavior: "smooth" });
    } else {
      document.documentElement.removeAttribute("data-recruiter");
      localStorage.removeItem(KEY);
    }
  };

  return (
    <>
      {/* Banner */}
      <AnimatePresence>
        {on && (
          <m.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -40 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-14 z-40 border-b border-[var(--color-blue)]/30 bg-[var(--color-surface-1)]/95 backdrop-blur-md"
            role="status"
          >
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-2">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg)]">
                <span className="text-[var(--color-blue)]">●</span> {t.recruiter.banner}
              </p>
              <button
                type="button"
                onClick={toggle}
                className="shrink-0 font-mono text-[11px] text-[var(--color-fg-muted)] underline-offset-2 hover:text-[var(--color-fg)] hover:underline"
              >
                {t.recruiter.exit}
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Floating toggle (bottom-left, opposite the Smart AI FAQ) */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Exit recruiter mode" : "Enter recruiter mode"}
        className={`fixed bottom-5 left-5 z-[90] flex items-center gap-2 rounded-full border px-4 py-3 text-sm shadow-2xl transition-colors ${
          on
            ? "border-[var(--color-blue)] bg-[var(--color-blue)] text-white"
            : "border-[var(--color-hairline-strong)] bg-[var(--color-surface-1)] text-[var(--color-fg)] hover:border-[var(--color-blue)]"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span className="font-medium">{on ? t.recruiter.on : t.recruiter.off}</span>
      </button>
    </>
  );
}
