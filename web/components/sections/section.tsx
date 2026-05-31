"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/lib/i18n";

export function Section({
  id,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  label: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const tr = t.sections[id];
  const heading = tr?.label ?? label;
  const headline = tr?.title ?? title;
  const lead = tr?.intro ?? intro;

  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-[var(--color-hairline)] px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-blue)]">
            <span className="text-[var(--color-fg-subtle)]">//</span> {heading}
          </p>
          <h2 className="font-display max-w-2xl text-3xl text-[var(--color-fg)] sm:text-4xl">
            {headline}
          </h2>
          {lead && (
            <p className="mt-4 max-w-2xl text-[var(--color-fg-muted)]">{lead}</p>
          )}
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
