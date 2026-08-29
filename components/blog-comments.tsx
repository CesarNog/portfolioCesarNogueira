"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useI18n, type Lang } from "@/lib/i18n";

// giscus (giscus.app) stores comments as GitHub Discussions on this site's
// own repo: real, moderatable (via normal GitHub Discussion moderation),
// no ads or tracking, and it needs no backend of ours to run — this site
// is a static Vercel deploy with no database. Requires a one-time setup
// step outside this codebase: enable Discussions on the GitHub repo, then
// generate the repo/category IDs at https://giscus.app and set them as
// NEXT_PUBLIC_GISCUS_* env vars. Renders nothing until that's done, same
// graceful-degradation convention as the rest of this site's optional
// integrations (see README's environment variables table).
const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO;
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "Comments";
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

const GISCUS_LANG: Record<Lang, string> = {
  en: "en",
  pt: "pt",
  es: "es",
  fr: "fr",
  zh: "zh-CN",
};

function postToGiscus(message: Record<string, unknown>) {
  const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
  iframe?.contentWindow?.postMessage({ giscus: message }, "https://giscus.app");
}

export function BlogComments() {
  const { lang } = useI18n();
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedTheme = useRef(resolvedTheme);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !REPO || !REPO_ID || !CATEGORY_ID) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", REPO);
    script.setAttribute("data-repo-id", REPO_ID);
    script.setAttribute("data-category", CATEGORY);
    script.setAttribute("data-category-id", CATEGORY_ID);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", mountedTheme.current === "light" ? "light" : "dark_dimmed");
    script.setAttribute("data-lang", GISCUS_LANG[lang]);
    el.appendChild(script);
    // giscus config changes (theme/lang) are pushed via postMessage below,
    // deliberately not by re-running this effect and re-mounting the script.
  }, []);

  // Sync theme/language into the already-mounted giscus iframe rather than
  // reinjecting the script, which would flash/reload the whole widget.
  useEffect(() => {
    if (!REPO_ID) return;
    postToGiscus({ setConfig: { theme: resolvedTheme === "light" ? "light" : "dark_dimmed" } });
  }, [resolvedTheme]);

  useEffect(() => {
    if (!REPO_ID) return;
    postToGiscus({ setConfig: { lang: GISCUS_LANG[lang] } });
  }, [lang]);

  if (!REPO || !REPO_ID || !CATEGORY_ID) return null;

  return <div ref={containerRef} />;
}
