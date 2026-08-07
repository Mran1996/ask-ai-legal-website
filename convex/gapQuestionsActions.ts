"use node"

import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"
import {
  detectIntakeGaps,
  formatGapQuestionsForEmail,
  formatGapQuestionsSummary,
  type GapQuestion,
} from "./lib/gapQuestions"

async function refineGapsWithOpenAi(args: {
  deterministic: GapQuestion[]
  caseReference: string
  intakeExcerpt: string
}): Promise<GapQuestion[] | null> {
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
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You help Ask AI Legal (document preparation only — NOT a law firm) write missing-info questions for clients.
Return JSON: {"questions":[{"id":"snake_case","question":"..."}]}
Rules:
- Ask only for facts, dates, names, addresses, and document attachments
- Never give legal advice or suggest strategy
- Prefer clarifying the provided draft questions; add at most 2 new ones if critical facts are clearly missing
- Max 8 questions total
- Keep each question under 220 characters`,
        },
        {
          role: "user",
          content: [
            `Case: ${args.caseReference}`,
            "Draft questions:",
            formatGapQuestionsSummary(args.deterministic) || "(none)",
            "",
            "Intake excerpt:",
            args.intakeExcerpt.slice(0, 5000),
          ].join("\n"),
        },
      ],
    }),
  })

  if (!res.ok) {
    console.error("OpenAI gap refine failed", res.status, await res.text())
    return null
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const raw = json.choices?.[0]?.message?.content?.trim()
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as {
      questions?: Array<{ id?: string; question?: string }>
    }
    const questions = (parsed.questions ?? [])
      .map((q, i) => ({
        id: (q.id?.trim() || `gap_${i + 1}`).slice(0, 64),
        question: (q.question ?? "").trim(),
      }))
      .filter((q) => q.question.length > 0)
      .slice(0, 8)
    return questions.length > 0 ? questions : null
  } catch {
    console.error("OpenAI gap refine JSON parse failed")
    return null
  }
}

/**
 * After Part 1 return: detect missing facts/docs and email the client (auto).
 * Ops can force-resend via payments.sendGapQuestions.
 */
export const assessAndSendGapQuestions = internalAction({
  args: {
    caseId: v.id("cases"),
    force: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.cases.getGapAssessmentContext, {
      caseId: args.caseId,
    })
    if (!context) return null

    if (
      !args.force &&
      (context.gapQuestionsStatus === "sent" || context.gapQuestionsStatus === "answered")
    ) {
      return null
    }

    const deterministic = detectIntakeGaps({
      issueSummary: context.issueSummary,
      state: context.state,
      county: context.county,
      role: context.role,
      opposingParty: context.opposingParty,
      landlordName: context.landlordName,
      tenantName: context.tenantName,
      caseTypeLabel: context.caseTypeLabel,
      deadline: context.deadline,
      knownDates: context.knownDates,
      caseNumber: context.caseNumber,
      propertyAddress: context.propertyAddress,
      hasDocuments: context.hasDocuments,
      documentCount: context.documentCount,
      serviceNeeded: context.serviceNeeded,
      intakeRaw: context.intakeRaw,
    })

    const refined =
      deterministic.length > 0
        ? await refineGapsWithOpenAi({
            deterministic,
            caseReference: context.caseReference,
            intakeExcerpt: context.intakeRaw,
          })
        : null

    const questions = refined ?? deterministic
    const mode = refined ? "openai+rules" : "rules"

    if (questions.length === 0) {
      await ctx.runMutation(internal.payments.saveGapAssessmentInternal, {
        caseId: args.caseId,
        status: "none_needed",
        summary: "",
      })
      await ctx.runMutation(internal.payments.logGapAgentRun, {
        caseId: args.caseId,
        mode: `${mode}:none`,
      })
      return null
    }

    const summary = formatGapQuestionsSummary(questions)
    const emailBody = formatGapQuestionsForEmail(questions)

    await ctx.runMutation(internal.payments.saveGapAssessmentInternal, {
      caseId: args.caseId,
      summary,
    })

    await ctx.runAction(internal.emailActions.sendGapQuestionsEmail, {
      caseId: args.caseId,
      questionsText: emailBody,
      force: args.force === true,
    })

    await ctx.runMutation(internal.payments.logGapAgentRun, {
      caseId: args.caseId,
      mode: `${mode}:${questions.length}`,
    })

    return null
  },
})
