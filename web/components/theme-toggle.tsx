"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Gate theme-dependent UI behind a mounted check to avoid hydration mismatch.
  useEffect(() => setMounted(true), []);

  const isDark = theme !== "light";

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center border border-[var(--color-hairline)] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] hover:border-[var(--color-hairline-strong)]"
    >
      {mounted ? (isDark ? "☾" : "☀") : ""}
    </button>
  );
}
