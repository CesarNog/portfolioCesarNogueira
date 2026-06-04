"use client";

import { useEffect, useRef, useState } from "react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { siteConfig } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

type Item = { label: string; hint?: string; run: () => void; group: string };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const go = (id: string) => () => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const ext = (url: string) => () => {
    setOpen(false);
    window.open(url, "_blank", "noopener");
  };

  const s = t.sections;
  const p = t.palette;
  const NAV = p.groups.navigate;
  const ACT = p.groups.actions;
  const CON = p.groups.contact;
  const items: Item[] = [
    { group: NAV, label: p.home, run: go("top") },
    { group: NAV, label: s.summary?.label ?? "Who I Am", run: go("summary") },
    { group: NAV, label: s.experience?.label ?? "Career", run: go("experience") },
    { group: NAV, label: s.work?.label ?? "Impact Stories", run: go("work") },
    { group: NAV, label: s.capabilities?.label ?? "Technical Depth", run: go("capabilities") },
    { group: NAV, label: s.trust?.label ?? "Enterprise Trust", run: go("trust") },
    { group: NAV, label: s.global?.label ?? "Global Delivery", run: go("global") },
    { group: NAV, label: s.certifications?.label ?? "Certifications", run: go("certifications") },
    { group: NAV, label: s.stack?.label ?? "Technology", run: go("stack") },
    { group: NAV, label: s.testimonials?.label ?? "Testimonials", run: go("testimonials") },
    { group: NAV, label: s.contact?.label ?? "Contact", run: go("contact") },
    { group: ACT, label: p.darkTheme, run: () => { setTheme("dark"); setOpen(false); } },
    { group: ACT, label: p.lightTheme, run: () => { setTheme("light"); setOpen(false); } },
    { group: ACT, label: p.openFaq, run: () => { setOpen(false); document.dispatchEvent(new CustomEvent("open-smart-faq")); } },
    { group: CON, label: p.emailCesar, hint: siteConfig.links.email, run: ext(`mailto:${siteConfig.links.email}`) },
    { group: CON, label: "LinkedIn", run: ext(siteConfig.links.linkedin) },
    { group: CON, label: "GitHub", run: ext(siteConfig.links.github) },
    { group: CON, label: p.downloadCv, run: ext(siteConfig.links.cv) },
  ];

  const groups = Array.from(new Set(items.map((i) => i.group)));

  if (!open) return null;

  return (
    // Native dialog avoids Radix context entirely — no DialogTitle requirement
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.commandPalette}
      className="fixed inset-0 z-[100] flex items-start justify-center"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={p.ariaClose}
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <Command
        className="panel relative mt-[12vh] w-[92vw] max-w-lg overflow-hidden rounded-xl shadow-2xl"
        shouldFilter
        loop
      >
        <Command.Input
          ref={inputRef}
          placeholder={p.placeholder}
          className="w-full border-b border-[var(--color-hairline)] bg-transparent px-4 py-3.5 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)]"
        />
        <Command.List className="max-h-[50vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--color-fg-subtle)]">
            {p.noResults}
          </Command.Empty>
          {groups.map((g) => (
            <Command.Group
              key={g}
              heading={g}
              className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)] [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:py-1.5"
            >
              {items
                .filter((i) => i.group === g)
                .map((i) => (
                  <Command.Item
                    key={i.label}
                    onSelect={i.run}
                    className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-[var(--color-fg)] data-[selected=true]:bg-[var(--color-surface-2)]"
                  >
                    <span>{i.label}</span>
                    {i.hint && (
                      <span className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
                        {i.hint}
                      </span>
                    )}
                  </Command.Item>
                ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
