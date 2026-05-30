import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Required for `output: export` so this generates a static sitemap.xml.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
