"use client";

import { m, useReducedMotion } from "motion/react";
import { siteConfig, stats } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import { Counter } from "@/components/ui/counter";
import { Magnetic } from "@/components/ui/magnetic";
import { EASE, DUR, buttonPress } from "@/lib/motion";
import { RecruiterScanner } from "@/components/recruiter-scanner";

// Staggered hero entrance — each layer reveals 120ms after the previous
const DELAYS = { badge: 0.1, name: 0.2, desc: 0.38, ctas: 0.52, stats: 0.68, photo: 0.15 };

export function IdentityConsole() {
  const reduce = useReducedMotion();
  const { t } = useI18n();

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: DUR.section, delay, ease: EASE.out },
        };

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Mobile: portrait as background, content on top */}
      <div className="absolute inset-0 -z-10 lg:hidden" aria-hidden>
        <Image
          src="/portrait.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top"
          style={{ opacity: 0.15 }}
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface-0)]/20 via-[var(--color-surface-0)]/80 to-[var(--color-surface-0)]" />
      </div>

      {/* Desktop: side-by-side grid. Mobile: single column. */}
      <div className="mx-auto max-w-[1600px] lg:grid lg:min-h-[100svh] lg:grid-cols-[48%_52%]">
        {/* Content column */}
        <div className="flex min-h-[100svh] flex-col justify-end pb-12 pt-20 sm:justify-end sm:pt-24 lg:justify-center lg:pb-16 lg:pt-28">
          <div className="px-6 lg:pl-8 xl:pl-16">
            <div className="max-w-[520px]">
              {/* Availability badge */}
              <m.div {...enter(DELAYS.badge)} className="mb-7 flex items-center gap-2.5">
                <span className="status-dot" aria-hidden />
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-ok)]">
                  {t.hero.available}
                </span>
              </m.div>

              {/* Name */}
              <m.h1
                {...enter(DELAYS.name)}
                className="font-display text-[2.5rem] leading-[0.9] tracking-[-0.02em] text-[var(--color-fg)] sm:text-[clamp(3rem,5vw,5rem)] lg:text-[clamp(3.5rem,5vw,5.5rem)] [text-wrap:balance]"
              >
                {siteConfig.firstName}
                <br />
                Nogueira.
              </m.h1>

              {/* One-liner */}
              <m.p
                {...enter(DELAYS.desc)}
                className="mt-6 text-base leading-relaxed text-[var(--color-fg-muted)] sm:text-lg"
              >
                {t.hero.desc}
              </m.p>

              {/* CTAs */}
              <m.div {...enter(DELAYS.ctas)} className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <m.a
                    href="#contact"
                    whileTap={buttonPress}
                    className="bg-accent accent-blue inline-flex items-center rounded-md px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    {t.hero.ctaPrimary}
                  </m.a>
                </Magnetic>
                <Magnetic>
                  <m.a
                    href="#work"
                    whileTap={buttonPress}
                    className="inline-flex items-center rounded-md border border-[var(--color-hairline-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)]"
                  >
                    {t.hero.ctaSecondary}
                  </m.a>
                </Magnetic>
              </m.div>

              {/* Recruiter Scanner — plain div, NOT inside m.div with filter.
                  CSS filter creates a new containing block for position:fixed,
                  trapping the overlay inside the hero instead of the viewport. */}
              <div className="mt-4">
                <RecruiterScanner />
              </div>

              {/* Stats — 2×2 on mobile, 4 columns on sm+ */}
              <m.div
                {...enter(DELAYS.stats)}
                className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--color-hairline)] pt-7 sm:grid-cols-4 lg:mt-16"
              >
                {stats.map((s, i) => (
                  <div key={s.label}>
                    <p className="font-display text-2xl text-[var(--color-fg)] sm:text-3xl">
                      <Counter
                        value={s.value}
                        prefix={"prefix" in s ? (s.prefix as string) : ""}
                        suffix={s.suffix}
                        decimals={"decimals" in s ? (s.decimals as number) : 0}
                      />
                    </p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                      {t.statsLabels[i]}
                    </p>
                  </div>
                ))}
              </m.div>
            </div>
          </div>
        </div>

        {/* Photo column — desktop only, fades in with slight scale */}
        <m.div
          className="relative hidden lg:block"
          aria-hidden
          {...(reduce ? {} : {
            initial: { opacity: 0, scale: 1.03 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 1.1, delay: DELAYS.photo, ease: EASE.out },
          })}
        >
          <Image
            src="/portrait.jpg"
            alt=""
            fill
            sizes="52vw"
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-0)] via-[var(--color-surface-0)]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[var(--color-surface-0)] to-transparent" />
        </m.div>
      </div>
      {/* Scroll-to-next chevron — bottom-center of hero, all viewports */}
      <m.a
        href="#summary"
        aria-label="Scroll to next section"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-fg)]"
        {...(reduce ? {} : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.6, delay: 1.4, ease: EASE.out },
        })}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="animate-float">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </m.a>
    </section>
  );
}
