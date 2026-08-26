"use client";

import { useReducedMotion } from "motion/react";
import { useI18n } from "@/lib/i18n";

/**
 * Rolling status bar above the header — availability, role, stack and the
 * MCP callout on a slow, continuous horizontal scroll. Content is duplicated
 * once so the `animate-ticker` loop (globals.css) wraps seamlessly from
 * -50% back to 0%. Under reduced motion, renders a single static pass
 * instead (no duplication, no animation) rather than a frozen half-loop.
 */
export function TickerBar({ position = "fixed" }: { position?: "fixed" | "static" }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const items = t.ticker;
  const loop = reduce ? items : [...items, ...items];
  // SiteHeader (homepage) is itself `fixed`, so the ticker needs to be fixed
  // above it. CaseStudyHeader (sub-pages) is `sticky`, which already reserves
  // its own space in normal flow — a `static` ticker placed right before it
  // does the same (occupies real height, scrolls away once past it, header
  // then sticks at the true viewport top) without needing top-padding
  // changes on every page that uses that header.
  const posClass = position === "fixed" ? "fixed inset-x-0 top-0 z-50" : "relative";

  return (
    <div
      className={`${posClass} h-7 overflow-hidden border-b border-[var(--color-hairline)] bg-[var(--color-surface-1)]`}
      aria-hidden
    >
      <div
        className={`flex h-full w-max items-center ${reduce ? "flex-wrap" : "animate-ticker"}`}
      >
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-6 whitespace-nowrap px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"
          >
            {item}
            <span className="text-[var(--color-blue)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
