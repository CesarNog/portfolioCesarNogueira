"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

/** Styled console greeting for developers who open DevTools. */
export function ConsoleGreeting() {
  useEffect(() => {
    console.log(
      "%c " + siteConfig.name + " ",
      [
        "background: #3b82f6",
        "color: #ffffff",
        "font-weight: 700",
        "font-size: 13px",
        "padding: 3px 8px",
        "border-radius: 4px",
        "letter-spacing: 0.05em",
      ].join(";"),
    );
    console.log(
      "%cPrincipal Cloud Architect · FinOps Engineer · DevOps Leader\n%cStack: Next.js 16 · Tailwind CSS v4 · Motion · Geist\n%cSource: github.com/CesarNog/portfolioCesarNogueira",
      "color: #97a1ad; font-size: 12px; line-height: 1.6;",
      "color: #788490; font-size: 11px; line-height: 1.6;",
      "color: #788490; font-size: 11px; line-height: 1.6;",
    );
    console.log(
      "%c" + siteConfig.links.email,
      "color: #3b82f6; font-size: 12px;",
    );
  }, []);

  return null;
}
