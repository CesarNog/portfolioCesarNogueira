"use client";

import { m, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * A card that tracks the cursor locally and renders a radial-gradient glow
 * centered on it — the same cursor-spotlight technique the hero
 * (identity-console.tsx) uses for the whole section, scoped down to a single
 * card. Pairs well with the site's existing `card-shine`/`card-glow` CSS
 * utilities (a one-shot diagonal sweep + static edge glow on hover); this
 * adds the piece those don't cover — the glow actually follows the pointer.
 */
export function SpotlightCard({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const spotlight = useMotionTemplate`radial-gradient(220px at ${mouseX}px ${mouseY}px, color-mix(in oklab, var(--color-blue) 14%, transparent) 0%, transparent 70%)`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={
        reduce
          ? undefined
          : (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              mouseX.set(e.clientX - rect.left);
              mouseY.set(e.clientY - rect.top);
            }
      }
      onMouseLeave={
        reduce
          ? undefined
          : () => {
              mouseX.set(-1000);
              mouseY.set(-1000);
            }
      }
      {...rest}
    >
      {!reduce && (
        <m.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
