import {
  DRAFTED_CATEGORY,
  SKIPPED_CATEGORY,
  getGraphToken,
  graphConfigured,
  listNewEmails,
  markHandled,
  saveReplyDraft,
} from "@/lib/support-drafts/graph"
import { writeReply } from "@/lib/support-drafts/write-reply"

export const dynamic = "force-dynamic"
export const maxDuration = 60

/** Small batches keep each run inside the time limit. The next run picks up the rest. */
const EMAILS_PER_RUN = 3

/** Runs on a schedule. Saves reply drafts for new support emails. Nothing is ever sent. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 })
  }
  if (!graphConfigured()) {
    return Response.json({ ok: false, reason: "Microsoft mailbox access is not set up" }, { status: 503 })
  }

  const token = await getGraphToken()
  const emails = await listNewEmails(token, EMAILS_PER_RUN)
  const result = { drafted: 0, skipped: 0, failed: 0 }

  for (const email of emails) {
    try {
      const reply = email.automated ? null : await writeReply(email)
      if (reply) {
        await saveReplyDraft(token, email.id, reply)
        await markHandled(token, email, DRAFTED_CATEGORY)
        result.drafted++
      } else {
        await markHandled(token, email, SKIPPED_CATEGORY)
        result.skipped++
      }
    } catch (error) {
      // Left unmarked, so the next run tries this email again.
      console.error("Support draft failed:", error)
      result.failed++
    }
  }

  return Response.json({ ok: true, ...result })
}
