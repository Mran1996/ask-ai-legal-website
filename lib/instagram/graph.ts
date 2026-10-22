import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Small helpers for Instagram's official API (Instagram API with Instagram Login).
 * Settings come from environment variables set in Vercel, never from code:
 *   IG_VERIFY_TOKEN   any secret phrase you choose; Meta sends it back when you connect the webhook
 *   IG_APP_SECRET     the Instagram app secret from the Meta developer app (checks each webhook really came from Meta)
 *   IG_ACCESS_TOKEN   the long-lived Instagram access token for @askailegal
 *   IG_USER_ID        the Instagram account id for @askailegal (so the app never answers its own replies)
 *   IG_GRAPH_VERSION  optional, defaults to v23.0
 */
const version = () => process.env.IG_GRAPH_VERSION || "v23.0"
const base = () => `https://graph.instagram.com/${version()}`

/** True when the X-Hub-Signature-256 header matches the raw body signed with the app secret. */
export function validSignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.IG_APP_SECRET
  if (!secret || !header?.startsWith("sha256=")) return false
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")
  const got = header.slice("sha256=".length)
  if (got.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(got, "hex"), Buffer.from(expected, "hex"))
}

async function post(path: string, body: Record<string, unknown>) {
  const token = process.env.IG_ACCESS_TOKEN
  if (!token) throw new Error("IG_ACCESS_TOKEN is not set")
  const res = await fetch(`${base()}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Instagram API ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return res.json()
}

/** One private DM to the person who wrote the comment (Instagram's "private reply"). */
export function sendPrivateReply(commentId: string, text: string) {
  const igUser = process.env.IG_USER_ID
  if (!igUser) throw new Error("IG_USER_ID is not set")
  return post(`/${igUser}/messages`, { recipient: { comment_id: commentId }, message: { text } })
}

/** A public reply under the comment. */
export function replyToComment(commentId: string, text: string) {
  return post(`/${commentId}/replies`, { message: text })
}
