"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  bootSequence,
  expertiseMatrix,
  siteConfig,
  stats,
} from "@/lib/site-config";
import { Counter } from "@/components/ui/counter";
import { Magnetic } from "@/components/ui/magnetic";

const InfraBackground = dynamic(
  () => import("@/components/background/infra-background"),
  { ssr: false },
);

type Phase = "boot" | "matrix" | "status" | "done";

export function IdentityConsole() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? "done" : "boot");
  const [bootLine, setBootLine] = useState(0);
  const [matrixCount, setMatrixCount] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Boot lines.
    bootSequence.forEach((_, i) => {
      timers.push(setTimeout(() => setBootLine(i + 1), 450 + i * 650));
    });
    timers.push(setTimeout(() => setPhase("matrix"), 450 + bootSequence.length * 650));
    // Expertise matrix checks.
    expertiseMatrix.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setMatrixCount(i + 1),
          450 + bootSequence.length * 650 + 220 + i * 180,
        ),
      );
    });
    const statusAt = 450 + bootSequence.length * 650 + 220 + expertiseMatrix.length * 180 + 250;
    timers.push(setTimeout(() => setPhase("status"), statusAt));
    timers.push(setTimeout(() => setPhase("done"), statusAt + 900));
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  const revealed = phase === "done";

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-24 pb-16"
    >
      <InfraBackground />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--color-blue) 10%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        {/* Terminal console */}
        <div className="panel rounded-lg p-1 accent-cyan shadow-2xl">
          <div className="flex items-center gap-2 border-b border-[var(--color-hairline)] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-orange)]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-cyan)]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-blue)]/70" />
            <span className="ml-3 font-mono text-xs text-[var(--color-fg-subtle)]">
              identity://cesar-nogueira ~ control-center
            </span>
          </div>
          <div className="min-h-[300px] p-5 font-mono text-sm leading-relaxed sm:min-h-[330px]">
            {bootSequence.slice(0, reduce ? bootSequence.length : bootLine).map((l) => (
              <p key={l} className="text-[var(--color-fg-muted)]">
                <span className="text-[var(--color-cyan)]">▸</span> {l}
              </p>
            ))}

            {(reduce || phase !== "boot") && (
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
                {expertiseMatrix
                  .slice(0, reduce ? expertiseMatrix.length : matrixCount)
                  .map((m) => (
                    <motion.p
                      key={m}
                      initial={reduce ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-[var(--color-fg)]"
                    >
                      <span className="text-[var(--color-ok)]">✓</span>
                      <span className="truncate">{m}</span>
                    </motion.p>
                  ))}
              </div>
            )}

            {(reduce || phase === "status" || phase === "done") && (
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5 flex items-center gap-3 border-t border-[var(--color-hairline)] pt-4"
              >
                <span className="status-dot" />
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-ok)]">
                  Status: {siteConfig.availability}
                </span>
              </motion.div>
            )}
            {!reduce && phase !== "done" && (
              <span className="cursor-blink inline-block" aria-hidden />
            )}
          </div>
        </div>

        {/* Identity reveal */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={revealed ? { opacity: 1, y: 0 } : reduce ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-blue)]">
            {siteConfig.company} · {siteConfig.location.split("·")[0].trim()}
          </p>
          <h1 className="font-display mt-4 text-5xl leading-[0.98] text-[var(--color-fg)] sm:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-5 max-w-md text-base text-[var(--color-fg-muted)]">
            Principal Cloud Architect — Platform Engineering, DevOps, FinOps &amp;
            AI Infrastructure. {siteConfig.tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#contact"
                className="bg-accent accent-blue inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Start a mission briefing
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#work"
                className="inline-flex items-center rounded-md border border-[var(--color-hairline-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]"
              >
                View mission portfolio
              </a>
            </Magnetic>
            <kbd className="hidden rounded border border-[var(--color-hairline)] px-2 py-1 font-mono text-[10px] text-[var(--color-fg-subtle)] sm:inline-block">
              ⌘K to search
            </kbd>
          </div>
        </motion.div>
      </div>

      {/* Stats strip */}
      <div className="relative mx-auto mt-16 grid w-full max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--color-hairline)] sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--color-surface-1)] p-5">
            <p className="font-display text-3xl text-[var(--color-fg)] sm:text-4xl">
              <Counter
                value={s.value}
                prefix={"prefix" in s ? (s.prefix as string) : ""}
                suffix={s.suffix}
                decimals={"decimals" in s ? (s.decimals as number) : 0}
              />
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
