"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

const NAV = [
  { href: "summary", label: "Summary" },
  { href: "experience", label: "Impact" },
  { href: "work", label: "Stories" },
  { href: "capabilities", label: "Expertise" },
  { href: "trust", label: "Trust" },
  { href: "global", label: "Global" },
  { href: "contact", label: "Contact" },
];

export function SiteHeader() {
  const { t } = useI18n();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
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

  const openPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
    );
  };

  const navTo = (href: string) => {
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById(href)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      {/* Skip to main content — accessibility */}
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-[var(--color-blue)] focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-hairline)] bg-[var(--color-surface-0)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <a href="#top" className="font-mono text-sm text-[var(--color-fg)]">
            {siteConfig.firstName}<span className="text-[var(--color-blue)]">N</span>og
          </a>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                className={`font-mono text-xs uppercase tracking-wider transition-colors ${
                  active === item.href
                    ? "text-[var(--color-fg)]"
                    : "text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]"
                }`}
              >
                {t.nav[item.href] ?? item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette"
              className="hidden items-center gap-2 rounded-md border border-[var(--color-hairline)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--color-fg-subtle)] transition-colors hover:border-[var(--color-hairline-strong)] sm:flex"
            >
              {t.palette.search} <kbd className="text-[var(--color-fg-muted)]">⌘K</kbd>
            </button>
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
              <m.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block h-px w-4 bg-[var(--color-fg)]"
              />
              <m.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.15 }}
                className="block h-px w-4 bg-[var(--color-fg)]"
              />
              <m.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block h-px w-4 bg-[var(--color-fg)]"
              />
            </button>
          </div>
        </div>

        <m.div
          className="h-px origin-left bg-[var(--color-blue)]"
          style={{ scaleX }}
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
              aria-label="Navigation menu"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-[var(--color-surface-1)] shadow-2xl md:hidden"
            >
              <div className="flex h-14 items-center justify-between border-b border-[var(--color-hairline)] px-6">
                <span className="font-mono text-sm text-[var(--color-fg-muted)]">{t.palette.navigate}</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                  className="flex h-11 w-11 items-center justify-center text-lg leading-none text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
                >
                  ✕
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
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
