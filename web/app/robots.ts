import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Required for `output: export` so this generates a static robots.txt.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
