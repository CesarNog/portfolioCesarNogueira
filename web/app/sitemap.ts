import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date("2025-06-04");

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          "en": base,
          "pt-BR": base,
          "es": base,
          "fr": base,
          "zh": base,
          "x-default": base,
        },
      },
    },
  ];
}
