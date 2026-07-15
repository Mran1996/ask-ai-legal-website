"use node"

import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"
import {
  OUTLOOK_CLIENT_SUBFOLDERS,
  buildPaidClientFolderName,
} from "./lib/outlookFolderName"

type GraphToken = { access_token: string; expires_in: number }

function graphConfigured(): boolean {
  return Boolean(
    process.env.MICROSOFT_GRAPH_TENANT_ID?.trim() &&
      process.env.MICROSOFT_GRAPH_CLIENT_ID?.trim() &&
      process.env.MICROSOFT_GRAPH_CLIENT_SECRET?.trim() &&
      process.env.MICROSOFT_GRAPH_MAILBOX?.trim()
  )
}

async function getGraphToken(): Promise<string> {
  const tenant = process.env.MICROSOFT_GRAPH_TENANT_ID!.trim()
  const clientId = process.env.MICROSOFT_GRAPH_CLIENT_ID!.trim()
  const clientSecret = process.env.MICROSOFT_GRAPH_CLIENT_SECRET!.trim()
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  })
  const res = await fetch(
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Graph token failed: ${res.status} ${text}`)
  }
  const json = (await res.json()) as GraphToken
  return json.access_token
}

function mailboxUserPath(): string {
  const mailbox = process.env.MICROSOFT_GRAPH_MAILBOX!.trim()
  return `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}`
}

async function graphJson<T>(
  token: string,
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Graph ${init?.method ?? "GET"} ${url} → ${res.status}: ${text}`)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

type FolderList = { value: Array<{ id: string; displayName: string }> }
type FolderNode = { id: string; displayName: string }

async function findOrCreateChildFolder(
  token: string,
  parentId: string | null,
  displayName: string
): Promise<FolderNode> {
  const base = mailboxUserPath()
  const listUrl = parentId
    ? `${base}/mailFolders/${parentId}/childFolders?$top=200`
    : `${base}/mailFolders?$top=200`
  const listed = await graphJson<FolderList>(token, listUrl)
  const existing = listed.value.find(
    (f) => f.displayName.toLowerCase() === displayName.toLowerCase()
  )
  if (existing) return existing

  const createUrl = parentId
    ? `${base}/mailFolders/${parentId}/childFolders`
    : `${base}/mailFolders`
  return await graphJson<FolderNode>(token, createUrl, {
    method: "POST",
    body: JSON.stringify({ displayName }),
  })
}

async function moveMatchingMessages(
  token: string,
  caseReference: string,
  destinationFolderId: string
): Promise<number> {
  const base = mailboxUserPath()
  const filter = encodeURIComponent(
    `contains(subject,'${caseReference.replace(/'/g, "")}')`
  )
  const searchUrl = `${base}/messages?$filter=${filter}&$select=id&$top=25`
  try {
    const list = await graphJson<{ value: Array<{ id: string }> }>(token, searchUrl)
    let moved = 0
    for (const msg of list.value) {
      try {
        await graphJson(token, `${base}/messages/${msg.id}/move`, {
          method: "POST",
          body: JSON.stringify({ destinationId: destinationFolderId }),
        })
        moved += 1
      } catch (err) {
        console.warn("Outlook move message failed", msg.id, err)
      }
    }
    return moved
  } catch (err) {
    console.warn("Outlook message search/move skipped", err)
    return 0
  }
}

/**
 * Create Clients/{LastName}-{AAL}-Paid-{amount} + subfolders after payment.
 * If Graph env is missing, records a stub path and logs (use Power Automate Flow B).
 */
export const createClientOutlookFolder = internalAction({
  args: {
    caseId: v.id("cases"),
    amountCents: v.number(),
  },
  returns: v.object({
    created: v.boolean(),
    path: v.string(),
    folderId: v.optional(v.string()),
    mode: v.union(v.literal("graph"), v.literal("stub")),
    messagesMoved: v.optional(v.number()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const meta = await ctx.runQuery(internal.cases.getOutlookFolderContext, {
      caseId: args.caseId,
    })
    if (!meta) {
      return {
        created: false,
        path: "",
        mode: "stub" as const,
        error: "Case not found",
      }
    }

    const folderName = buildPaidClientFolderName({
      lastName: meta.clientLastName,
      caseReference: meta.caseReference,
      amountCents: args.amountCents,
    })
    const path = `Clients/${folderName}`

    if (!graphConfigured()) {
      console.warn(
        "[outlook] Graph not configured — stub only. Create folder manually or via Power Automate Flow B:",
        path
      )
      await ctx.runMutation(internal.payments.recordOutlookFolder, {
        caseId: args.caseId,
        outlookFolderPath: path,
        outlookFolderId: undefined,
        mode: "stub",
      })
      return {
        created: false,
        path,
        mode: "stub" as const,
        error: "MICROSOFT_GRAPH_* env not set — see docs/OUTLOOK_CLIENT_FILING.md",
      }
    }

    try {
      const token = await getGraphToken()
      const clients = await findOrCreateChildFolder(token, null, "Clients")
      const paidFolder = await findOrCreateChildFolder(token, clients.id, folderName)
      for (const sub of OUTLOOK_CLIENT_SUBFOLDERS) {
        await findOrCreateChildFolder(token, paidFolder.id, sub)
      }
      const moved = await moveMatchingMessages(token, meta.caseReference, paidFolder.id)

      await ctx.runMutation(internal.payments.recordOutlookFolder, {
        caseId: args.caseId,
        outlookFolderPath: path,
        outlookFolderId: paidFolder.id,
        mode: "graph",
      })

      return {
        created: true,
        path,
        folderId: paidFolder.id,
        mode: "graph" as const,
        messagesMoved: moved,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Outlook folder failed"
      console.error("[outlook] createClientOutlookFolder", message)
      await ctx.runMutation(internal.payments.recordOutlookFolder, {
        caseId: args.caseId,
        outlookFolderPath: path,
        outlookFolderId: undefined,
        mode: "stub",
      })
      return {
        created: false,
        path,
        mode: "stub" as const,
        error: message,
      }
    }
  },
})
