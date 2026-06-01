"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { siteConfig } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

type Item = { label: string; hint?: string; run: () => void; group: string };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();
  const { t } = useI18n();

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

  const go = (id: string) => () => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const ext = (url: string) => () => {
    setOpen(false);
    window.open(url, "_blank", "noopener");
  };

  const s = t.sections;
  const items: Item[] = [
    { group: "Navigate", label: "Home", run: go("top") },
    { group: "Navigate", label: s.summary?.label ?? "Executive Summary", run: go("summary") },
    { group: "Navigate", label: s.experience?.label ?? "Career Impact", run: go("experience") },
    { group: "Navigate", label: s.work?.label ?? "Selected Impact Stories", run: go("work") },
    { group: "Navigate", label: s.capabilities?.label ?? "Engineering Capability Matrix", run: go("capabilities") },
    { group: "Navigate", label: s.trust?.label ?? "Enterprise Validation", run: go("trust") },
    { group: "Navigate", label: s.global?.label ?? "Global Delivery Map", run: go("global") },
    { group: "Navigate", label: s.certifications?.label ?? "Certifications", run: go("certifications") },
    { group: "Navigate", label: s.stack?.label ?? "Cloud Expertise Galaxy", run: go("stack") },
    { group: "Navigate", label: s.finops?.label ?? "FinOps", run: go("finops") },
    { group: "Navigate", label: s.ai?.label ?? "AI Infrastructure", run: go("ai") },
    { group: "Navigate", label: s.testimonials?.label ?? "Testimonials", run: go("testimonials") },
    { group: "Navigate", label: s.contact?.label ?? "Contact", run: go("contact") },
    { group: "Actions", label: "Toggle dark theme", run: () => { setTheme("dark"); setOpen(false); } },
    { group: "Actions", label: "Toggle light theme", run: () => { setTheme("light"); setOpen(false); } },
    { group: "Actions", label: "Open Smart AI FAQ", run: () => { setOpen(false); document.dispatchEvent(new CustomEvent("open-smart-faq")); } },
    { group: "Contact", label: "Email Cesar", hint: siteConfig.links.email, run: ext(`mailto:${siteConfig.links.email}`) },
    { group: "Contact", label: "LinkedIn", run: ext(siteConfig.links.linkedin) },
    { group: "Contact", label: "GitHub", run: ext(siteConfig.links.github) },
    { group: "Contact", label: "Download CV", run: ext(siteConfig.links.cv) },
  ];

  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      className="fixed inset-0 z-[100] flex items-start justify-center"
    >
      <button
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="panel relative mt-[12vh] w-[92vw] max-w-lg overflow-hidden rounded-xl shadow-2xl">
        <Command.Input
          placeholder="Search projects, skills, sections, contact…"
          className="w-full border-b border-[var(--color-hairline)] bg-transparent px-4 py-3.5 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)]"
        />
        <Command.List className="max-h-[50vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--color-fg-subtle)]">
            No results.
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
      </div>
    </Command.Dialog>
  );
}
