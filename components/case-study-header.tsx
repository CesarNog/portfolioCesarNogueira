"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { useI18n } from "@/lib/i18n";

/** Simplified header for standalone sub-pages (case studies) — no in-page
 * scroll-spy nav since those anchors only exist on the homepage. */
export function CaseStudyHeader() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 text-[var(--color-fg)]" aria-label={t.palette.home}>
          <Logo size={26} className="text-[var(--color-blue)]" />
          <span className="font-display text-sm">César A. Nogueira</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-ui text-[13px] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            ← Back to home
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
