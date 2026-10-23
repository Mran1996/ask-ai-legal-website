import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ops", "/api"],
      },
      {
        // Named so AI search and assistant crawlers are clearly welcome.
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: "/",
        disallow: ["/ops", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
