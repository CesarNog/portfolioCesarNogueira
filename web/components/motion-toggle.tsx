"use client";

import { useEffect, useState } from "react";

const KEY = "force-reduce-motion";

export function MotionToggle() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored === "1") {
      document.documentElement.setAttribute("data-reduce-motion", "1");
      setReduced(true);
    }
  }, []);

  const toggle = () => {
    const next = !reduced;
    setReduced(next);
    if (next) {
      document.documentElement.setAttribute("data-reduce-motion", "1");
      localStorage.setItem(KEY, "1");
    } else {
      document.documentElement.removeAttribute("data-reduce-motion");
      localStorage.removeItem(KEY);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={reduced}
      title={reduced ? "Enable animations" : "Reduce animations"}
      className="flex items-center gap-2 rounded-md border border-[var(--color-hairline)] px-3 py-1.5 font-mono text-[11px] text-[var(--color-fg-subtle)] transition-colors hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-fg-muted)]"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${reduced ? "bg-[var(--color-orange)]" : "bg-[var(--color-ok)]"}`} />
      {reduced ? "motion off" : "motion on"}
    </button>
  );
}
