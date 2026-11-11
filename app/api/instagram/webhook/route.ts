import { matchKeyword } from "@/lib/instagram/keywords"
import { replyToComment, sendPrivateReply, validSignature } from "@/lib/instagram/graph"

/**
 * Instagram comment-to-DM webhook.
 * GET: Meta checks this address once when the webhook is connected (it must echo hub.challenge).
 * POST: Meta sends each new comment; if it contains a keyword (for example SERVED), the commenter gets one private DM.
 * Setup steps: docs/INSTAGRAM_COMMENT_DM.md
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 15

type CommentChange = {
  field?: string
  value?: { id?: string; text?: string; from?: { id?: string; username?: string } }
}
type WebhookBody = { object?: string; entry?: { id?: string; changes?: CommentChange[] }[] }

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams
  const token = process.env.IG_VERIFY_TOKEN
  if (token && p.get("hub.mode") === "subscribe" && p.get("hub.verify_token") === token) {
    return new Response(p.get("hub.challenge") ?? "", { status: 200 })
  }
  return new Response("Forbidden", { status: 403 })
}

export async function POST(req: Request) {
  const raw = await req.text()
  if (!validSignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new Response("Forbidden", { status: 403 })
  }

  let body: WebhookBody
  try {
    body = JSON.parse(raw) as WebhookBody
  } catch {
    return new Response("Bad request", { status: 400 })
  }

  const ownId = process.env.IG_USER_ID
  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "comments") continue
      const c = change.value
      if (!c?.id || !c.text) continue
      if (c.from?.id && (c.from.id === ownId || c.from.id === entry.id)) continue // never answer our own replies
      const keyword = matchKeyword(c.text)
      if (!keyword) continue
      try {
        await sendPrivateReply(c.id, keyword.dm)
        if (keyword.publicReply) await replyToComment(c.id, keyword.publicReply)
        console.log(`instagram auto-dm: sent ${keyword.word} to @${c.from?.username ?? "unknown"}`)
      } catch (err) {
        // Instagram allows one private reply per comment; repeats and expired comments end up here.
        console.error(`instagram auto-dm: ${keyword.word} not sent:`, (err as Error).message)
      }
    }
  }

  // Always answer 200 once the signature is valid, so Meta does not keep re-sending the same comment.
  return new Response("OK", { status: 200 })
}
