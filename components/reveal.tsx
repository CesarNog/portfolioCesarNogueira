"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE, DUR } from "@/lib/motion";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial={{ y: 16, opacity: 0, filter: "blur(6px)" }}
      whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: DUR.reveal, delay, ease: EASE.out }}
      // Ensure content is visible if JS/motion never fires (SSR, crawlers)
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </m.div>
  );
}
