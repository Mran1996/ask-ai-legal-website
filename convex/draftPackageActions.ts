"use node"

import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"
import { DOCUMENT_PREP_START_FEE_CENTS } from "./lib/quoteTotal"

function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

function fallbackDraft(args: {
  issueSummary?: string
  caseTypeLabel?: string
  state?: string
  deadline?: string
}): string {
  const lines = [
    "Documents Ask AI Legal can prepare (draft — review before sending to client):",
    "",
    "1. Intake / case information packet based on Part 1 responses",
    args.caseTypeLabel
      ? `2. Document set related to: ${args.caseTypeLabel}`
      : "2. Core document package for the described matter (scope TBD after ops review)",
    "3. Supporting exhibits index / checklist of filings the client already has",
    "",
    "Suggested first priority: Confirm the single issue the client wants prepared first.",
    `Suggested start amount: ${formatUsdFromCents(DOCUMENT_PREP_START_FEE_CENTS)}`,
    "",
    "Notes / missing docs:",
    args.issueSummary
      ? `- Client described: ${args.issueSummary.slice(0, 500)}`
      : "- Add notes from returned Part 1 Word + attachments",
    args.deadline
      ? `- Deadline noted in intake: ${args.deadline}`
      : "- Confirm any court deadlines from client documents",
    args.state ? `- Jurisdiction note: ${args.state}` : "- Confirm filing jurisdiction",
    "",
    "UPL: Document preparation only — not a law firm; not legal advice; client reviews and files.",
  ]
  return lines.join("\n")
}

async function callOpenAiDraft(prompt: string): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) return null
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini"
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `You draft internal ops memos for Ask AI Legal, a document-preparation service (NOT a law firm).
Rules:
- Output markdown only
- Label items as "documents Ask AI Legal can prepare" — never "you should file" or legal advice
- Numbered list of possible documents/motions/packets the team could prepare from the intake
- Include: Suggested first priority; Suggested start amount ${formatUsdFromCents(DOCUMENT_PREP_START_FEE_CENTS)}; Notes / missing docs
- Mention trial/court dates only as facts if present in the intake
- End with a one-line UPL reminder`,
        },
        { role: "user", content: prompt },
      ],
    }),
  })
  if (!res.ok) {
    console.error("OpenAI draft failed", res.status, await res.text())
    return null
  }
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  return json.choices?.[0]?.message?.content?.trim() || null
}

/**
 * After form returned: draft issues/docs list for ops approval (never auto-send to client).
 */
export const generateDraftIssuesPackage = internalAction({
  args: {
    caseId: v.id("cases"),
    force: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.cases.getDraftPackageContext, {
      caseId: args.caseId,
    })
    if (!context) return null

    if (
      !args.force &&
      context.draftPackageStatus === "awaiting_ops_approval" &&
      context.draftIssuesSummary
    ) {
      return null
    }

    const prompt = [
      `Case: ${context.caseReference}`,
      `Client: ${context.clientFirstName} ${context.clientLastName}`,
      `State: ${context.state ?? "unknown"}`,
      `County: ${context.county ?? "unknown"}`,
      `Case type: ${context.caseTypeLabel ?? "unknown"}`,
      `Deadline: ${context.deadline ?? "none noted"}`,
      `Case number: ${context.caseNumber ?? "none"}`,
      `Opposing party: ${context.opposingParty ?? "unknown"}`,
      `Issue summary: ${context.issueSummary ?? "(none)"}`,
      `Estimate service line: ${context.estimateServiceLine ?? "(none)"}`,
      "",
      "Raw intake excerpt:",
      context.intakeRaw.slice(0, 6000),
    ].join("\n")

    const llm = await callOpenAiDraft(prompt)
    const draft =
      llm ??
      fallbackDraft({
        issueSummary: context.issueSummary,
        caseTypeLabel: context.caseTypeLabel,
        state: context.state,
        deadline: context.deadline,
      })

    await ctx.runMutation(internal.payments.saveDraftPackageInternal, {
      caseId: args.caseId,
      draftIssuesSummary: draft,
      quotedStartAmountCents: DOCUMENT_PREP_START_FEE_CENTS,
      status: "awaiting_ops_approval",
    })

    await ctx.runMutation(internal.payments.logDraftAgentRun, {
      caseId: args.caseId,
      mode: llm ? "openai" : "fallback",
    })

    await ctx.runAction(internal.emailActions.sendOpsDraftPackageReadyEmail, {
      caseId: args.caseId,
      draftPreview: draft.slice(0, 3500),
    })

    return null
  },
})
