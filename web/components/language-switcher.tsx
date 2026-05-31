"use client";

import { LANGS, useI18n } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      role="group"
      aria-label="Language"
      className={`flex flex-wrap items-center rounded-md border border-[var(--color-hairline)] p-0.5 ${className}`}
    >
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            title={l.name}
            className={`rounded px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
              active
                ? "bg-[var(--color-surface-2)] text-[var(--color-fg)]"
                : "text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
