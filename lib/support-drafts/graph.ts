import { SUPPORT_EMAIL } from "@/lib/site-config"

const GRAPH = "https://graph.microsoft.com/v1.0"
const MAILBOX = `${GRAPH}/users/${encodeURIComponent(SUPPORT_EMAIL)}`

/** Added to each handled email so it is never drafted twice. */
export const DRAFTED_CATEGORY = "Reply drafted"
export const SKIPPED_CATEGORY = "No reply needed"

export type SupportEmail = {
  id: string
  subject: string
  fromAddress: string
  fromName: string
  body: string
  categories: string[]
  automated: boolean
}

type GraphMessage = {
  id: string
  subject?: string
  from?: { emailAddress?: { address?: string; name?: string } }
  replyTo?: { emailAddress?: { address?: string; name?: string } }[]
  body?: { content?: string }
  categories?: string[]
  internetMessageHeaders?: { name: string; value: string }[]
}

export function graphConfigured(): boolean {
  return Boolean(process.env.MS_TENANT_ID && process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET)
}

export async function getGraphToken(): Promise<string> {
  const res = await fetch(`https://login.microsoftonline.com/${process.env.MS_TENANT_ID?.trim()}/oauth2/v2.0/token`, {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.MS_CLIENT_ID?.trim() ?? "",
      client_secret: process.env.MS_CLIENT_SECRET?.trim() ?? "",
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  })
  if (!res.ok) throw new Error(`Microsoft sign-in failed: ${res.status}`)
  return ((await res.json()) as { access_token: string }).access_token
}

async function graph(token: string, path: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${MAILBOX}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: 'outlook.body-content-type="text"',
      ...init.headers,
    },
  })
  if (!res.ok) throw new Error(`Microsoft mail request failed: ${res.status}`)
  return res
}

function looksAutomated(address: string, headers: GraphMessage["internetMessageHeaders"]): boolean {
  if (/^(no-?reply|do-?not-?reply|mailer-daemon|postmaster|notifications?|bounces?)[@+.-]/i.test(address)) return true
  if (address.toLowerCase().endsWith("@askailegal.com")) return true
  return (headers ?? []).some(({ name, value }) => {
    const header = name.toLowerCase()
    return (
      header === "list-unsubscribe" ||
      (header === "auto-submitted" && value.toLowerCase() !== "no") ||
      (header === "precedence" && /bulk|list|junk/i.test(value))
    )
  })
}

/** Inbox emails from the last two days that have not been handled yet, oldest first. */
export async function listNewEmails(token: string, limit: number): Promise<SupportEmail[]> {
  const since = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  const query = new URLSearchParams({
    $filter: `receivedDateTime ge ${since}`,
    $orderby: "receivedDateTime desc",
    $select: "id,subject,from,replyTo,body,categories,internetMessageHeaders",
    $top: "50",
  })
  const res = await graph(token, `/mailFolders/inbox/messages?${query}`)
  const { value } = (await res.json()) as { value: GraphMessage[] }

  return value
    .map((m) => {
      // Website contact form emails come from our own address, with the visitor in reply-to.
      const sender = m.replyTo?.[0]?.emailAddress ?? m.from?.emailAddress
      const fromAddress = sender?.address ?? ""
      return {
        id: m.id,
        subject: m.subject ?? "",
        fromAddress,
        fromName: sender?.name ?? "",
        body: m.body?.content ?? "",
        categories: m.categories ?? [],
        automated:
          !fromAddress || /new purchase:/i.test(m.subject ?? "") || looksAutomated(fromAddress, m.internetMessageHeaders),
      }
    })
    .filter((m) => !m.categories.includes(DRAFTED_CATEGORY) && !m.categories.includes(SKIPPED_CATEGORY))
    .reverse()
    .slice(0, limit)
}

/** Saves a reply in the email's thread, in Drafts. This app has no permission to send mail. */
export async function saveReplyDraft(token: string, messageId: string, text: string): Promise<void> {
  await graph(token, `/messages/${encodeURIComponent(messageId)}/createReply`, {
    method: "POST",
    body: JSON.stringify({ comment: text }),
  })
}

export async function markHandled(token: string, email: SupportEmail, category: string): Promise<void> {
  await graph(token, `/messages/${encodeURIComponent(email.id)}`, {
    method: "PATCH",
    body: JSON.stringify({ categories: [...email.categories, category] }),
  })
}
