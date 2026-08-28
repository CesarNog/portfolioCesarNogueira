import type { MetadataRoute } from "next";
import { siteConfig, projects } from "@/lib/site-config";
import { blogPosts } from "@/lib/blog-posts";

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

// Stable ISO dates — only update when content actually changes to avoid
// wasting Google's crawl budget signalling "new" on every deployment.
const HOME_MODIFIED = new Date("2026-07-21");
export const CASE_STUDIES_MODIFIED = new Date("2026-07-21");
const CONNECT_MODIFIED = new Date("2026-08-12");
const BLOG_MODIFIED = new Date("2026-08-28");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  return [
    {
      url: base,
      lastModified: HOME_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: selfLanguages(base) },
    },
    {
      url: `${base}/case-studies`,
      lastModified: CASE_STUDIES_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: selfLanguages(`${base}/case-studies`) },
    },
    {
      url: `${base}/connect`,
      lastModified: CONNECT_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: selfLanguages(`${base}/connect`) },
    },
    ...projects.map((p) => {
      const url = `${base}/case-studies/${p.id}`;
      return {
        url,
        lastModified: CASE_STUDIES_MODIFIED,
        changeFrequency: "yearly" as const,
        priority: 0.7,
        alternates: { languages: selfLanguages(url) },
      };
    }),
    {
      url: `${base}/blog`,
      lastModified: BLOG_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: selfLanguages(`${base}/blog`) },
    },
    ...blogPosts.map((post) => {
      const url = `${base}/blog/${post.slug}`;
      return {
        url,
        lastModified: new Date(post.publishedDate),
        changeFrequency: "yearly" as const,
        priority: 0.6,
        alternates: { languages: selfLanguages(url) },
      };
    }),
  ];
}
