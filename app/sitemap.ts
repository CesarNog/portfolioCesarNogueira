import type { MetadataRoute } from "next";
import { siteConfig, projects } from "@/lib/site-config";

export const dynamic = "force-static";

// i18n is a client-side toggle, not per-locale routing, so every page only
// ever serves one real URL — only "en" and "x-default" are listed per page,
// each pointing at *that page's own* URL, matching app/layout.tsx's
// metadata.alternates. Repeating the same URL under pt-BR/es/fr/zh hreflang
// entries (or pointing every page's alternate at the homepage) reads to
// crawlers as duplicate/misleading alternates, so don't do either here.
function selfLanguages(url: string) {
  return { en: url, "x-default": url };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date();

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: selfLanguages(base) },
    },
    {
      url: `${base}/case-studies`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: selfLanguages(`${base}/case-studies`) },
    },
    ...projects.map((p) => {
      const url = `${base}/case-studies/${p.id}`;
      return {
        url,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.7,
        alternates: { languages: selfLanguages(url) },
      };
    }),
  ];
}
