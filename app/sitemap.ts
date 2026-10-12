import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site-config"
import { listSituationSlugs } from "@/lib/situations/guides"

/** Canonical public marketing pages only — no /pay, /book, /ops, or /api. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/pricing", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/services", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
    ...listSituationSlugs().map((slug) => ({
      path: `/situations/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    { path: "/disclaimer", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/privacy-policy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms-of-service", changeFrequency: "yearly" as const, priority: 0.3 },
  ]

  return routes.map((route) => ({
    url: route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
