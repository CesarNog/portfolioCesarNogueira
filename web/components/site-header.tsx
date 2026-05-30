"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";

const NAV = [
  { href: "experience", label: "Career" },
  { href: "stack", label: "Expertise" },
  { href: "work", label: "Work" },
  { href: "finops", label: "FinOps" },
  { href: "ai", label: "AI" },
  { href: "contact", label: "Contact" },
];

export function SiteHeader() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const [active, setActive] = useState("");

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

  const openPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-hairline)] bg-[var(--color-surface-0)]/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <a href="#top" className="font-mono text-sm text-[var(--color-fg)]">
          {siteConfig.firstName}
          <span className="text-[var(--color-blue)]">_</span>nog
        </a>

        <nav className="hidden items-center gap-6 md:flex">
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
              {item.label}
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
            Search <kbd className="text-[var(--color-fg-muted)]">⌘K</kbd>
          </button>
          <ThemeToggle />
        </div>
      </div>
      <motion.div
        className="h-px origin-left bg-[var(--color-blue)]"
        style={{ scaleX }}
      />
    </header>
  );
}
