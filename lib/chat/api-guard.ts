import { SITE_URL } from "@/lib/site-config"

/** Max JSON body size for POST /api/chat (bytes). */
export const CHAT_MAX_BODY_BYTES = 64_000

const PRODUCTION_ORIGINS = new Set([
  SITE_URL,
  "https://www.askailegal.com",
])

function normalizeOrigin(value: string | null): string | null {
  if (!value) return null
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

function isLocalDevOrigin(origin: string): boolean {
  try {
    const { hostname, protocol } = new URL(origin)
    if (protocol !== "http:" && protocol !== "https:") return false
    return hostname === "localhost" || hostname === "127.0.0.1"
  } catch {
    return false
  }
}

function isVercelPreviewOrigin(origin: string): boolean {
  try {
    const { hostname, protocol } = new URL(origin)
    return protocol === "https:" && hostname.endsWith(".vercel.app")
  } catch {
    return false
  }
}

/** Allow same-site chat only — blocks drive-by abuse of the LLM endpoint. */
export function isAllowedChatOrigin(request: Request): boolean {
  const origin = normalizeOrigin(request.headers.get("origin"))
  if (origin) {
    if (PRODUCTION_ORIGINS.has(origin)) return true
    if (process.env.NODE_ENV !== "production") {
      if (isLocalDevOrigin(origin) || isVercelPreviewOrigin(origin)) return true
    }
    return false
  }

  // Some same-origin fetches omit Origin; fall back to Referer host match.
  const referer = request.headers.get("referer")
  if (!referer) return process.env.NODE_ENV !== "production"

  try {
    const refOrigin = new URL(referer).origin
    if (PRODUCTION_ORIGINS.has(refOrigin)) return true
    if (process.env.NODE_ENV !== "production") {
      return isLocalDevOrigin(refOrigin) || isVercelPreviewOrigin(refOrigin)
    }
  } catch {
    return false
  }

  return false
}

export function chatBodyTooLarge(request: Request): boolean {
  const raw = request.headers.get("content-length")
  if (!raw) return false
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n > CHAT_MAX_BODY_BYTES
}
