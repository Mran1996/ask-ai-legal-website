import { redirect } from "next/navigation"

function opsDashboardUrl(path = "/"): string {
  const base = (
    process.env.NEXT_PUBLIC_OPS_DASHBOARD_URL || "http://localhost:3001"
  ).replace(/\/$/, "")
  const suffix = path.startsWith("/") ? path : `/${path}`
  return `${base}${suffix === "/" ? "" : suffix}` || base
}

/** Ops moved to the separate business dashboard app (Option A). */
export default function OpsIndexPage() {
  redirect(opsDashboardUrl("/"))
}
