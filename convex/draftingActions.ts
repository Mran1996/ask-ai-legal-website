"use node"

import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"
import {
  buildDraftSystemPrompt,
  buildDraftUserPrompt,
  fallbackDraftDocument,
  type DraftingContext,
} from "./lib/draftingPrompt"

async function callOpenAiDraft(system: string, user: string): Promise<string | null> {
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
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  })
  if (!res.ok) {
    console.error("OpenAI case draft failed", res.status, await res.text())
    return null
  }
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  return json.choices?.[0]?.message?.content?.trim() || null
}

function toDraftingContext(row: {
  caseReference: string
  matterType: string
  clientFirstName: string
  clientLastName: string
  intakeRaw: string
  intakeStructured: {
    tenantName?: string
    landlordName?: string
    propertyAddress?: string
    noticeDate?: string
    rentOwedCents?: number
    hasReceivedSummons?: boolean
    hearingDate?: string
    role?: string
    serviceNeeded?: string
    notes?: string
  }
  issueSummary?: string
  state?: string
  county?: string
  caseTypeLabel?: string
  deadline?: string
  opposingParty?: string
  caseNumber?: string
  estimateServiceLine?: string
  draftIssuesSummary?: string
}): DraftingContext {
  const s = row.intakeStructured
  return {
    caseReference: row.caseReference,
    matterType: row.matterType,
    clientFirstName: row.clientFirstName,
    clientLastName: row.clientLastName,
    intakeRaw: row.intakeRaw,
    issueSummary: row.issueSummary,
    state: row.state,
    county: row.county,
    caseTypeLabel: row.caseTypeLabel,
    deadline: row.deadline,
    opposingParty: row.opposingParty,
    caseNumber: row.caseNumber,
    estimateServiceLine: row.estimateServiceLine,
    draftIssuesSummary: row.draftIssuesSummary,
    structured: {
      tenantName: s.tenantName,
      landlordName: s.landlordName,
      propertyAddress: s.propertyAddress,
      noticeDate: s.noticeDate,
      rentOwedCents: s.rentOwedCents,
      hasReceivedSummons: s.hasReceivedSummons,
      hearingDate: s.hearingDate,
      role: s.role,
      serviceNeeded: s.serviceNeeded,
      notes: s.notes,
    },
  }
}

function draftFileName(caseReference: string): string {
  return `DRAFT-${caseReference}.txt`.replace(/[^\w.-]+/g, "-")
}

/**
 * After payment + Start work: generate primary draft document and queue counsel review.
 */
export const generateCaseDraft = internalAction({
  args: {
    caseId: v.id("cases"),
    agentRunId: v.optional(v.id("agentRuns")),
    force: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const row = await ctx.runQuery(internal.cases.getDraftingContext, {
      caseId: args.caseId,
    })
    if (!row) return null

    if (
      !args.force &&
      (row.status === "in_counsel_review" || row.status === "delivered")
    ) {
      return null
    }

    try {
      const draftingContext = toDraftingContext(row)
      const system = buildDraftSystemPrompt()
      const user = buildDraftUserPrompt(draftingContext)
      const llm = await callOpenAiDraft(system, user)
      const content = llm ?? fallbackDraftDocument(draftingContext)

      const storageId = await ctx.storage.store(
        new Blob([content], { type: "text/plain; charset=utf-8" })
      )

      const { documentId } = await ctx.runMutation(
        internal.documents.saveGeneratedDraftInternal,
        {
          caseId: args.caseId,
          storageId,
          fileName: draftFileName(row.caseReference),
          agentRunId: args.agentRunId,
          mode: llm ? "openai" : "fallback",
        }
      )

      await ctx.runAction(internal.emailActions.sendOpsCounselReviewReadyEmail, {
        caseId: args.caseId,
        documentId,
        preview: content.slice(0, 2000),
      })
    } catch (error) {
      if (args.agentRunId) {
        await ctx.runMutation(internal.documents.markDraftAgentRunFailed, {
          caseId: args.caseId,
          agentRunId: args.agentRunId,
          errorMessage: error instanceof Error ? error.message : "Draft generation failed",
        })
      }
      throw error
    }

    return null
  },
})
