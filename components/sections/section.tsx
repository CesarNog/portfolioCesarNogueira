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
  noEyebrow,
}: {
  id: string;
  label: string;
  title: string;
  intro?: string;
  children: ReactNode;
  noEyebrow?: boolean;
}) {
  const { t } = useI18n();
  const tr = t.sections[id];
  const heading = tr?.label ?? label;
  const headline = tr?.title ?? title;
  const lead = tr?.intro ?? intro;

  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-[var(--color-hairline)] px-6 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          {!noEyebrow && (
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              {heading}
            </p>
          )}
          <h2 className="font-display max-w-3xl text-[clamp(1.875rem,4vw+0.5rem,3.75rem)] leading-[1.1] text-[var(--color-fg)] [text-wrap:balance]">
            {headline}
          </h2>
          {lead && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] sm:text-[17px] [text-wrap:pretty]">{lead}</p>
          )}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
