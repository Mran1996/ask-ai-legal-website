import { secureCompare } from "./secureCompare"

/** Normalize pasted/env tokens (quotes, BOM, zero-width, env-key prefix). */
export function normalizeOpsToken(raw: string): string {
  let s = raw.replace(/^\uFEFF/, "").trim()
  // Common paste mistakes: OPS_ACCESS_TOKEN=… or wrapping quotes
  if (/^OPS_ACCESS_TOKEN\s*=/i.test(s)) {
    s = s.replace(/^OPS_ACCESS_TOKEN\s*=\s*/i, "").trim()
  }
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim()
  }
  // Strip zero-width / soft hyphens that sneak in from docs/email
  s = s.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")
  return s
}

export function assertOpsToken(provided: string): void {
  const expected = normalizeOpsToken(process.env.OPS_ACCESS_TOKEN ?? "")
  const got = normalizeOpsToken(provided)
  if (!expected || expected.length < 8) {
    throw new Error("Ops access is not configured (set OPS_ACCESS_TOKEN in Convex env)")
  }
  if (!secureCompare(got, expected)) {
    throw new Error("Unauthorized")
  }
}

/** Soft check for the ops login gate (does not throw). */
export function checkOpsToken(
  provided: string
): { ok: true } | { ok: false; reason: string } {
  const expected = normalizeOpsToken(process.env.OPS_ACCESS_TOKEN ?? "")
  const got = normalizeOpsToken(provided)
  if (!expected || expected.length < 8) {
    return {
      ok: false,
      reason:
        "OPS_ACCESS_TOKEN is not set on this Convex deployment. From the marketing repo run: npx convex env set OPS_ACCESS_TOKEN \"…\"",
    }
  }
  if (!secureCompare(got, expected)) {
    return {
      ok: false,
      reason:
        "Token does not match. Paste the exact value from: npx convex env get OPS_ACCESS_TOKEN — no quotes, no OPS_ACCESS_TOKEN= prefix.",
    }
  }
  return { ok: true }
}
