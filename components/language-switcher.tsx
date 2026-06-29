"use client";

import { useEffect, useRef, useState } from "react";
import { LANGS, useI18n } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={`${current.label}, Language: ${current.name}. Click to change.`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border border-[var(--color-hairline)] px-2 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)] transition-colors hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-fg)]"
      >
        <span aria-hidden className="text-[13px] leading-none">{current.flag}</span>
        {current.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden
          style={{ transition: "transform 0.18s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full mt-1.5 min-w-[148px] overflow-hidden rounded-lg border border-[var(--color-hairline-strong)] bg-[var(--color-surface-1)] py-1 shadow-xl"
          style={{ zIndex: 200 }}
        >
          {LANGS.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left font-mono text-[11px] transition-colors ${
                  active
                    ? "bg-[var(--color-surface-2)] text-[var(--color-fg)]"
                    : "text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
                }`}
              >
                <span aria-hidden className="text-[14px] leading-none shrink-0">{l.flag}</span>
                <span className="uppercase tracking-wider">{l.label}</span>
                <span className="ml-auto text-[10px] text-[var(--color-fg-subtle)] normal-case tracking-normal">{l.name}</span>
                {active && <span className="text-[var(--color-blue)] shrink-0" aria-hidden>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
