"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "summary", label: "Summary" },
  { href: "experience", label: "Impact" },
  { href: "work", label: "Work" },
  { href: "capabilities", label: "Expertise" },
  { href: "trust", label: "Trust" },
  { href: "global", label: "Global" },
  { href: "contact", label: "Contact" },
];

export function SiteHeader() {
  const { t } = useI18n();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 350, damping: 55, mass: 0.4 });
  const [active, setActive] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ids = ["top", ...NAV.map((n) => n.href)];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of [...entries].reverse()) {
          if (e.isIntersecting) {
            setActive(e.target.id);
            break;
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Close mobile menu on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Lock body scroll when mobile menu open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Tab focus trap for mobile nav dialog.
  useEffect(() => {
    if (!mobileOpen || !menuRef.current) return;
    const dialog = menuRef.current;
    const focusable = () => dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    // Move focus into the dialog on open.
    (focusable()[0] as HTMLElement | undefined)?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const els = focusable();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [mobileOpen]);

  const openPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const HEADER_H = 56;
    const OFFSET   = 16;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_H - OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const navTo = (href: string) => {
    setMobileOpen(false);
    document.dispatchEvent(new Event("close-assistant"));
    scrollToSection(href);
  };

  return (
    <>
      {/* Skip to main content — accessibility */}
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-scanner focus:rounded focus:bg-[var(--color-button-primary)] focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-hairline)] bg-[var(--color-surface-0)]/80 backdrop-blur-md">
        {/* Live variant 3 accepted: nav dim-siblings on hover */}
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <a href="#top" onClick={(e) => { e.preventDefault(); document.dispatchEvent(new Event("close-assistant")); scrollToSection("top"); }} className="flex shrink-0 items-center self-stretch gap-2.5 text-[var(--color-fg)] transition-opacity hover:opacity-80" aria-label="César A. Nogueira, home">
            <Logo size={24} className="text-[var(--color-fg)] shrink-0" />
            <span className="whitespace-nowrap font-ui text-[13px] font-semibold tracking-tight hidden lg:block">
              César<span className="text-[var(--color-blue)]"> A.</span> Nogueira
            </span>
          </a>
          <span className="hidden md:block h-4 w-px bg-[var(--color-hairline-strong)] mx-1.5" aria-hidden />
          <nav aria-label="Main navigation" className="nav-hover-dim hidden items-center gap-4 lg:gap-5 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                onClick={(e) => { e.preventDefault(); document.dispatchEvent(new Event("close-assistant")); scrollToSection(item.href); }}
                aria-current={active === item.href ? "true" : undefined}
                className={`nav-hover-link font-ui text-[13px] font-medium tracking-wide ${
                  active === item.href
                    ? "active text-[var(--color-fg)]"
                    : "text-[var(--color-fg-subtle)]"
                }`}
              >
                {t.nav[item.href] ?? item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <span className="group hidden lg:flex items-center gap-1.5 rounded-full border border-[var(--color-ok)]/30 bg-[var(--color-ok)]/8 px-2.5 py-1 mr-1 transition-[border-color] duration-200 hover:border-[var(--color-ok)]/60">
              <span className="status-dot shrink-0" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ok)]">{t.hero.available.split(" ")[0]}</span>
              <span className="overflow-hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-[var(--color-ok)] max-w-0 group-hover:max-w-[9rem] transition-[max-width] duration-300 ease-out opacity-0 group-hover:opacity-100">
                {t.hero.available.includes(" ") ? ` ${t.hero.available.slice(t.hero.available.indexOf(" ") + 1)}` : ""}
              </span>
            </span>
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette (⌘K)"
              className="hidden items-center gap-1.5 rounded-md border border-[var(--color-hairline)] px-2 py-1.5 font-mono text-[11px] text-[var(--color-fg-subtle)] transition-colors hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-fg)] sm:flex"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <kbd className="text-[var(--color-fg-muted)]">⌘K</kbd>
            </button>
            <Link
              href="/connect"
              aria-label="Connect via MCP — for AI agents"
              className="hidden items-center gap-1.5 rounded-md border border-[var(--color-cyan)]/30 px-2 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-cyan)] transition-colors hover:border-[var(--color-cyan)]/60 hover:bg-[var(--color-cyan)]/10 lg:flex"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 2v6M15 2v6M6 8h12l-1 5a5 5 0 0 1-10 0z" />
                <path d="M12 19v3" />
              </svg>
              MCP
            </Link>
            <LanguageSwitcher className="hidden sm:flex" />
            <ThemeToggle />
            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-md border border-[var(--color-hairline)] transition-colors hover:border-[var(--color-hairline-strong)] md:hidden"
            >
              <m.span animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} className="block h-px w-4 bg-[var(--color-fg)]" />
              <m.span animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.15 }} className="block h-px w-4 bg-[var(--color-fg)]" />
              <m.span animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} className="block h-px w-4 bg-[var(--color-fg)]" />
            </button>
          </div>
        </div>

        <m.div
          role="progressbar"
          aria-label="Page reading progress"
          className="h-px origin-left bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-cyan)] to-[var(--color-blue)]"
          style={{ scaleX, boxShadow: "0 0 6px 0 color-mix(in oklab, var(--color-blue) 55%, transparent)" }}
        />
      </header>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <m.div
              ref={menuRef}
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-[var(--color-surface-1)] shadow-2xl md:hidden"
            >
              <div className="flex h-14 items-center justify-between border-b border-[var(--color-hairline)] px-6">
                <span className="font-ui text-sm font-medium text-[var(--color-fg-muted)]">{t.palette.navigate}</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                  className="flex h-11 w-11 items-center justify-center text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                  {[{ href: "top", label: t.palette.home }, ...NAV].map((item) => (
                    <li key={item.href}>
                      <button
                        type="button"
                        onClick={() => navTo(item.href)}
                        className={`w-full rounded-md px-4 py-3 text-left text-sm transition-colors ${
                          active === item.href
                            ? "bg-[var(--color-surface-2)] text-[var(--color-fg)]"
                            : "text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
                        }`}
                      >
                        {t.nav[item.href] ?? item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="space-y-3 border-t border-[var(--color-hairline)] p-4">
                <LanguageSwitcher className="w-fit" />
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); openPalette(); }}
                  className="flex w-full items-center justify-between rounded-md border border-[var(--color-hairline)] px-4 py-2.5 text-sm text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-hairline-strong)]"
                >
                  {t.palette.commandPalette}
                  <kbd className="font-mono text-[11px] text-[var(--color-fg-subtle)]">⌘K</kbd>
                </button>
                <Link
                  href="/connect"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center gap-1.5 rounded-md border border-[var(--color-cyan)]/30 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[var(--color-cyan)] transition-colors hover:border-[var(--color-cyan)]/60 hover:bg-[var(--color-cyan)]/10"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M9 2v6M15 2v6M6 8h12l-1 5a5 5 0 0 1-10 0z" />
                    <path d="M12 19v3" />
                  </svg>
                  Connect via MCP
                </Link>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
