import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Required for `output: export` so this generates a static robots.txt.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Block AI training crawlers from scraping content without permission
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ChatGPT-User", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "Claude-Web", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "cohere-ai", disallow: "/" },
      { userAgent: "omgili", disallow: "/" },
      { userAgent: "Diffbot", disallow: "/" },
      { userAgent: "Meta-ExternalAgent", disallow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
