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
import { useI18n } from "@/lib/i18n";
import { AVATAR_SRC } from "@/lib/images";
import { Counter } from "@/components/ui/counter";
import { Magnetic } from "@/components/ui/magnetic";

const InfraBackground = dynamic(
  () => import("@/components/background/infra-background"),
  { ssr: false },
);

type Phase = "boot" | "matrix" | "status" | "done";

export function IdentityConsole() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
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

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-24 pb-16"
    >
      <div data-recruiter-dim className="pointer-events-none absolute inset-0">
        <InfraBackground />
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(55% 45% at 50% 0%, color-mix(in oklab, var(--color-blue) 7%, transparent), transparent 70%)",
          }}
        />
      </div>

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

        {/* Identity reveal — starts visible so LCP isn't gated by the boot sequence */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Avatar + availability */}
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AVATAR_SRC}
              alt={`Portrait of ${siteConfig.name}`}
              width={56}
              height={56}
              loading="eager"
              className="h-14 w-14 shrink-0 rounded-full border border-[var(--color-hairline-strong)] object-cover shadow-lg"
            />
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface-1)] px-3 py-1">
              <span className="status-dot" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ok)]">
                {t.hero.available}
              </span>
            </span>
          </div>
          <h1 className="font-display mt-5 text-5xl leading-[0.98] text-[var(--color-fg)] sm:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-[0.14em] text-[var(--color-blue)]">
            {t.hero.roleLine}
          </p>
          <p className="mt-5 max-w-md text-base text-[var(--color-fg-muted)]">
            {t.hero.desc}
          </p>

          {/* Credibility chips — value proposition in <5s */}
          <ul className="mt-6 flex flex-wrap gap-2">
            {t.hero.chips.map((h) => (
              <li
                key={h}
                className="rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-fg-muted)]"
              >
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#contact"
                className="bg-accent accent-blue inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                {t.hero.ctaPrimary}
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#work"
                className="inline-flex items-center rounded-md border border-[var(--color-hairline-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]"
              >
                {t.hero.ctaSecondary}
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
