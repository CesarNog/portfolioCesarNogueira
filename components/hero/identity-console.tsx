"use client";

import { useEffect, useRef, useState } from "react";
import { m, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { siteConfig, stats, cvByLang } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import { Counter } from "@/components/ui/counter";
import { Magnetic } from "@/components/ui/magnetic";
import { EASE, DUR, buttonPress } from "@/lib/motion";
import { RecruiterScanner } from "@/components/recruiter-scanner";
import { useTypewriter } from "@/hooks/use-typewriter";

// Staggered hero entrance — each layer reveals 120ms after the previous
const DELAYS = { badge: 0.1, name: 0.2, desc: 0.38, ctas: 0.52, stats: 0.68, photo: 0.15 };

export function IdentityConsole() {
  const reduce = useReducedMotion();
  const { t, lang } = useI18n();
  // SSR and first client paint render the full name + non-reduced structure so
  // the markup matches (and the name is present in SSR HTML for SEO); motion /
  // reduced-motion branches only take effect after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const spotlight = useMotionTemplate`radial-gradient(520px at ${mouseX}px ${mouseY}px, color-mix(in oklab, var(--color-blue) 5%, transparent) 0%, transparent 70%)`;

  // Continuous-handoff fix: this section mounts at the same time as the
  // pinned IntroSequence sitting above it, so a mount-triggered entrance
  // would finish off-screen before the visitor ever scrolls down to it.
  // Gate the whole staggered reveal (and the typewriter) on scroll-arrival
  // instead — the "real hero" now animates to life at the moment the intro's
  // pin releases and this section actually enters view, same pattern
  // ui/counter.tsx already uses for its count-up (first-view IntersectionObserver,
  // disconnect after firing once). Under prefers-reduced-motion IntroSequence
  // renders nothing, so this section sits at the top of the page from the
  // first frame and the observer fires immediately — same net effect as before.
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Typewriter effect for the hero name — starts after badge entrance delay,
  // counted from scroll-arrival (`entered`), not from component mount.
  const LINE1 = siteConfig.firstName; // "César A."
  const LINE2 = "Nogueira.";
  const { displayed: typed1, done: done1 } = useTypewriter(LINE1, {
    charDelay: 62,
    startDelay: DELAYS.name * 1000 + 80,
    skip: !!reduce,
    start: entered,
  });
  const { displayed: typed2 } = useTypewriter(LINE2, {
    charDelay: 62,
    startDelay: DELAYS.name * 1000 + 80 + LINE1.length * 62 + 200,
    skip: !!reduce,
    start: entered,
  });

  // Live "last active" timestamp for AVAILABLE badge
  const [lastActive, setLastActive] = useState("");
  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      setLastActive(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    fmt();
    const id = setInterval(fmt, 60_000);
    return () => clearInterval(id);
  }, []);

  // `animate` targets the hidden `initial` state until `entered` flips true,
  // so Motion holds everything at rest off-screen and only actually plays
  // the stagger once the visitor scrolls this section into view.
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16, filter: "blur(6px)" },
          animate: entered
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 16, filter: "blur(6px)" },
          transition: { duration: DUR.section, delay, ease: EASE.out },
          style: { willChange: "transform" },
        };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden"
      onMouseMove={reduce ? undefined : (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
      onMouseLeave={reduce ? undefined : () => {
        mouseX.set(-1000);
        mouseY.set(-1000);
      }}
    >
      {/* Mobile: portrait as background, content on top */}
      <div className="absolute inset-0 -z-10 lg:hidden" aria-hidden>
        <Image
          src="/portrait-mobile.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          loading="eager"
          fetchPriority="high"
          className="object-cover object-top"
          style={{ opacity: 0.30 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface-0)]/10 via-[var(--color-surface-0)]/60 to-[var(--color-surface-0)]" />
      </div>

      {/* Cursor spotlight — follows mouse, GPU-only via motion values */}
      {mounted && !reduce && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 lg:block hidden"
          style={{ background: spotlight }}
        />
      )}

      {/* Desktop: side-by-side grid. Mobile: single column. */}
      {/* Live variant 1 accepted: compressed hero — tighter vertical rhythm */}
      <div className="mx-auto max-w-[1600px] lg:grid lg:min-h-[100svh] lg:grid-cols-[48%_52%]">
        {/* Content column */}
        <div className="flex min-h-[100svh] flex-col justify-end pb-12 pt-20 sm:justify-end sm:pt-24 lg:justify-center lg:pb-16 lg:pt-28">
          <div className="px-6 lg:pl-8 xl:pl-16">
            <div className="max-w-[520px]">
              {/* Availability badge — live timestamp micro-signal */}
              <m.div {...enter(DELAYS.badge)} className="mb-5 flex items-center gap-2.5 pl-1">
                <span className="status-dot" aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ok)]">
                  {t.hero.available}
                </span>
                {lastActive && (
                  <span className="font-mono text-[9px] text-[var(--color-ok)]/50 tracking-wider hidden sm:inline" aria-hidden>
                    · {lastActive}
                  </span>
                )}
              </m.div>

              {/* Name — typewriter reveal, cursor blinks until done */}
              <m.h1
                {...enter(DELAYS.name)}
                className="font-display text-[clamp(3rem,5vw,5rem)] leading-[0.88] tracking-[-0.025em] text-[var(--color-fg)]"
                aria-label={`${LINE1} Nogueira.`}
              >
                <span aria-hidden>
                  {entered && !reduce ? typed1 : LINE1}
                  {entered && !reduce && !done1 && <span className="cursor-blink" />}
                </span>
                <br />
                <span aria-hidden>
                  {entered && !reduce ? typed2 : LINE2}
                  {entered && !reduce && done1 && typed2.length < LINE2.length && <span className="cursor-blink" />}
                </span>
              </m.h1>

              {/* One-liner — mt-4 (was mt-6), slightly smaller + subtler */}
              <m.p
                {...enter(DELAYS.desc)}
                className="mt-4 text-[0.9375rem] leading-[1.65] text-[var(--color-fg-subtle)]"
              >
                {t.hero.desc}
              </m.p>

              {/* CTAs — mt-6 (was mt-8) */}
              <m.div {...enter(DELAYS.ctas)} className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div className="flex flex-wrap gap-3">
                  <Magnetic>
                    <m.a
                      href="#contact"
                      whileTap={buttonPress}
                      className="inline-flex items-center rounded-md px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0"
                      style={{ backgroundColor: "var(--color-button-primary)" }}
                    >
                      {t.hero.ctaPrimary}
                    </m.a>
                  </Magnetic>
                  <Magnetic>
                    <m.a
                      href="#work"
                      whileTap={buttonPress}
                      className="inline-flex items-center rounded-md border border-[var(--color-hairline-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-all hover:border-[var(--color-fg-muted)] hover:-translate-y-px active:translate-y-0"
                    >
                      {t.hero.ctaSecondary}
                    </m.a>
                  </Magnetic>
                  <Magnetic>
                    <m.a
                      href={cvByLang[lang] ?? siteConfig.links.cv}
                      target="_blank"
                      rel="noreferrer"
                      whileTap={buttonPress}
                      className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium text-[var(--color-fg-muted)] transition-all hover:text-[var(--color-fg)] hover:-translate-y-px active:translate-y-0"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      {t.scanner.downloadCv}
                    </m.a>
                  </Magnetic>
                </div>
                {/* Scanner — plain div to avoid CSS filter fixed-position bug */}
                <div>
                  <RecruiterScanner />
                </div>
              </m.div>

              {/* Stats — mt-7 (was mt-10/12), tighter above-fold strip */}
              <m.div {...enter(DELAYS.stats)} className="mt-7">
                <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-[var(--color-hairline)] pt-4 sm:hidden">
                  {stats.map((s, i) => (
                    <span key={s.label} className="font-mono text-[11px] text-[var(--color-fg-muted)]">
                      <span className="font-semibold text-[var(--color-fg)]">
                        {"prefix" in s ? (s.prefix as string) : ""}{s.value}{s.suffix}
                      </span>
                      {" "}{t.statsLabels[i]}
                    </span>
                  ))}
                </div>
                <div className="hidden grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--color-hairline)] pt-7 sm:grid sm:grid-cols-4">
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
                </div>
              </m.div>
            </div>
          </div>
        </div>

        {/* Photo column — desktop only */}
        <m.div
          className="relative hidden lg:block"
          aria-hidden
          {...(reduce ? {} : {
            initial: { opacity: 0, scale: 1.03 },
            animate: entered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.03 },
            transition: { duration: 1.1, delay: DELAYS.photo, ease: EASE.out },
          })}
        >
          <Image src="/portrait.webp" alt={siteConfig.name} fill sizes="52vw" className="object-cover object-top" priority loading="eager" />
          {/* Live variant 2 accepted: gradient drift — boundary slowly oscillates */}
          <div className="hero-gradient-drift absolute inset-0" />
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
          animate: entered ? { opacity: 1 } : { opacity: 0 },
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
