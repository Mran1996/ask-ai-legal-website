"use node"

import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"
import type { Id } from "./_generated/dataModel"

/**
 * The AI council: a sequence of scoped agents, each logged to agentRuns and
 * narrated into the case chat so the operator can watch the work happen.
 *
 *   1. document_understanding — facts, parties, dates from intake + uploads
 *   2. legal_research        — CourtListener lookup; only VERIFIED citations stored
 *   3. strategy              — roadmap of documents to prepare
 *   4. drafting              — the document itself, verified citations only
 *   5. review_critique       — second AI pass hunting unsupported claims
 *
 * The council never delivers anything: it parks the case at in_counsel_review,
 * where a human must approve in the workspace (documentVersions.approveAndDeliver).
 */

const UPL_SYSTEM_PREFIX = `You are an internal drafting assistant for Ask AI Legal, a DOCUMENT-PREPARATION service. It is NOT a law firm and does NOT give legal advice. Never address the client directly with advice; produce internal work product a human operator will review, edit, and approve. Never invent case law or statutes.`

type CouncilContext = {
  caseReference: string
  clientName: string
  matterType: string
  state: string
  county?: string
  caseTypeLabel?: string
  issueSummary?: string
  role?: string
  opposingParty?: string
  deadline?: string
  knownDates?: string
  caseNumber?: string
  serviceNeeded?: string
  intakeRaw: string
  uploadedDocs: Array<{ fileName: string; folder: string }>
  verifiedCitations: Array<{
    citationId: Id<"citations">
    type: "statute" | "case" | "rule"
    reference: string
    title?: string
    sourceUrl: string
    snippet?: string
  }>
}

async function callLlm(system: string, user: string): Promise<string | null> {
  const openAiKey = process.env.OPENAI_API_KEY?.trim()
  if (openAiKey) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    })
    if (res.ok) {
      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>
      }
      const text = json.choices?.[0]?.message?.content?.trim()
      if (text) return text
    } else {
      console.error("OpenAI call failed", res.status, await res.text())
    }
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim()
  if (anthropicKey) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-5",
        max_tokens: 4000,
        system,
        messages: [{ role: "user", content: user }],
      }),
    })
    if (res.ok) {
      const json = (await res.json()) as {
        content?: Array<{ type: string; text?: string }>
      }
      const text = json.content
        ?.filter((block) => block.type === "text")
        .map((block) => block.text ?? "")
        .join("")
        .trim()
      if (text) return text
    } else {
      console.error("Anthropic call failed", res.status, await res.text())
    }
  }

  return null
}

function contextBlock(c: CouncilContext): string {
  return [
    `Case: ${c.caseReference} | Client: ${c.clientName} | Role: ${c.role ?? "unknown"}`,
    `Jurisdiction: ${c.state}${c.county ? `, ${c.county} County` : ""} | Matter: ${c.caseTypeLabel ?? c.matterType}`,
    `Case #: ${c.caseNumber ?? "none"} | Opposing party: ${c.opposingParty ?? "unknown"}`,
    `Deadline noted: ${c.deadline ?? "none"} | Known dates: ${c.knownDates ?? "none"}`,
    `Service requested: ${c.serviceNeeded ?? "unspecified"}`,
    `Issue summary: ${c.issueSummary ?? "(none)"}`,
    `Uploaded documents: ${
      c.uploadedDocs.length
        ? c.uploadedDocs.map((d) => d.fileName).join("; ")
        : "(none yet)"
    }`,
    "",
    "Raw intake:",
    c.intakeRaw.slice(0, 6000),
  ].join("\n")
}

function verifiedCitationsBlock(c: CouncilContext): string {
  if (!c.verifiedCitations.length) {
    return "VERIFIED CITATIONS: none available. Do NOT cite any case law or statutes — write without citations."
  }
  return [
    "VERIFIED CITATIONS (the ONLY authorities you may reference — never add others):",
    ...c.verifiedCitations.map(
      (cit, i) =>
        `${i + 1}. [${cit.type}] ${cit.reference}${cit.title ? ` — ${cit.title}` : ""} (${cit.sourceUrl})${cit.snippet ? `\n   Relevance: ${cit.snippet.slice(0, 300)}` : ""}`
    ),
  ].join("\n")
}

/** CourtListener search — every stored citation carries a real source URL. */
async function searchCourtListener(
  query: string
): Promise<Array<{ reference: string; title: string; sourceUrl: string; snippet?: string }>> {
  const url = new URL("https://www.courtlistener.com/api/rest/v4/search/")
  url.searchParams.set("q", query)
  url.searchParams.set("type", "o")
  url.searchParams.set("order_by", "score desc")

  const headers: Record<string, string> = { Accept: "application/json" }
  const token = process.env.COURTLISTENER_API_TOKEN?.trim()
  if (token) headers.Authorization = `Token ${token}`

  const res = await fetch(url.toString(), { headers })
  if (!res.ok) {
    console.error("CourtListener search failed", res.status, await res.text())
    return []
  }
  const json = (await res.json()) as {
    results?: Array<{
      caseName?: string
      citation?: string[] | string | null
      absolute_url?: string
      court?: string
      dateFiled?: string
      snippet?: string
    }>
  }

  return (json.results ?? [])
    .slice(0, 4)
    .map((r) => {
      const cite = Array.isArray(r.citation)
        ? r.citation[0]
        : typeof r.citation === "string"
          ? r.citation
          : undefined
      const name = r.caseName?.trim()
      if (!name || !r.absolute_url) return null
      return {
        reference: cite ? `${name}, ${cite}` : name,
        title: `${name}${r.court ? ` (${r.court}${r.dateFiled ? ` ${r.dateFiled.slice(0, 4)}` : ""})` : ""}`,
        sourceUrl: `https://www.courtlistener.com${r.absolute_url}`,
        snippet: r.snippet?.replace(/<[^>]+>/g, "").slice(0, 400),
      }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
}

type StepResult = { summary: string; ok: boolean }

export const runCouncil = internalAction({
  args: { caseId: v.id("cases") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const loadContext = () =>
      ctx.runQuery(internal.councilData.getCouncilContext, { caseId: args.caseId })

    let context = await loadContext()
    if (!context) return null

    const runStep = async (
      agentType:
        | "document_understanding"
        | "legal_research"
        | "strategy"
        | "drafting"
        | "review_critique",
      inputRef: string,
      work: (agentRunId: Id<"agentRuns">) => Promise<StepResult>
    ): Promise<StepResult> => {
      const agentRunId = await ctx.runMutation(internal.councilData.startAgentRun, {
        caseId: args.caseId,
        agentType,
        inputRef,
      })
      try {
        const result = await work(agentRunId)
        await ctx.runMutation(internal.councilData.finishAgentRun, {
          agentRunId,
          status: result.ok ? "completed" : "failed",
          outputRef: agentType,
          summary: result.summary.slice(0, 2000),
        })
        await ctx.runMutation(internal.caseChat.postAgentMessage, {
          caseId: args.caseId,
          agentType,
          body: result.summary,
        })
        return result
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        await ctx.runMutation(internal.councilData.finishAgentRun, {
          agentRunId,
          status: "failed",
          outputRef: agentType,
          errorMessage: message.slice(0, 500),
        })
        await ctx.runMutation(internal.caseChat.postAgentMessage, {
          caseId: args.caseId,
          agentType,
          body: `⚠️ Step failed (${message.slice(0, 200)}). The operator can re-run the council from the workspace.`,
        })
        return { summary: "", ok: false }
      }
    }

    // ── 1. Document understanding ────────────────────────────────────────
    const understanding = await runStep(
      "document_understanding",
      `intake+${context.uploadedDocs.length}_uploads`,
      async () => {
        const llm = await callLlm(
          `${UPL_SYSTEM_PREFIX}\nExtract structured case facts for the team. Markdown, concise. Sections: Parties; Key dates; Document inventory (what the client gave us, what's missing); Core facts; Open questions for the operator.`,
          contextBlock(context!)
        )
        const summary =
          llm ??
          [
            "**Document understanding (offline fallback — no LLM key configured)**",
            `- Parties: ${context!.clientName} (${context!.role ?? "role unknown"}) vs ${context!.opposingParty ?? "unknown"}`,
            `- Key dates: ${context!.deadline ?? "none noted"}${context!.knownDates ? `; ${context!.knownDates}` : ""}`,
            `- Uploads: ${context!.uploadedDocs.map((d) => d.fileName).join("; ") || "none"}`,
            `- Issue: ${context!.issueSummary ?? "see raw intake"}`,
          ].join("\n")
        return { summary: `📂 **Document Understanding Agent**\n\n${summary}`, ok: true }
      }
    )

    // ── 2. Legal research (verified citations only) ──────────────────────
    await runStep("legal_research", `courtlistener:${context.state}`, async (agentRunId) => {
      const searchTerms = [
        context!.caseTypeLabel ?? context!.matterType.replace(/_/g, " "),
        context!.state,
        context!.issueSummary?.slice(0, 120) ?? "",
      ]
        .filter(Boolean)
        .join(" ")

      let results: Awaited<ReturnType<typeof searchCourtListener>> = []
      try {
        results = await searchCourtListener(searchTerms)
      } catch (error) {
        console.error("CourtListener unreachable", error)
      }

      if (!results.length) {
        return {
          summary:
            "🔎 **Legal Research Agent**\n\nNo verifiable authorities retrieved from CourtListener for this matter. Per policy, ZERO citations will be used downstream — the draft will be written without case-law references rather than risk a hallucinated cite.",
          ok: true,
        }
      }

      const stored: string[] = []
      for (const r of results) {
        await ctx.runMutation(internal.councilData.insertCitation, {
          caseId: args.caseId,
          agentRunId,
          type: "case",
          reference: r.reference,
          title: r.title,
          sourceUrl: r.sourceUrl,
          verified: true, // retrieved directly from CourtListener with a live URL
          snippet: r.snippet,
        })
        stored.push(`- **${r.reference}** — ${r.sourceUrl}`)
      }

      return {
        summary: `🔎 **Legal Research Agent**\n\nRetrieved and verified ${stored.length} authorities from CourtListener (each stored with its source URL; only these may be cited):\n\n${stored.join("\n")}`,
        ok: true,
      }
    })

    // Reload so strategy/drafting see the just-verified citations.
    context = await loadContext()
    if (!context) return null

    // ── 3. Strategy ──────────────────────────────────────────────────────
    const strategy = await runStep("strategy", "facts+research", async () => {
      const llm = await callLlm(
        `${UPL_SYSTEM_PREFIX}\nYou are the strategy agent. Synthesize the facts and verified research into a preparation roadmap. Markdown sections: Objective; Documents to prepare (ordered, with purpose); Key facts each document relies on; Risks / missing information. Reference only the verified citations provided, if any.`,
        `${contextBlock(context)}\n\n${verifiedCitationsBlock(context)}\n\nPrior analysis:\n${understanding.summary.slice(0, 3000)}`
      )
      const summary =
        llm ??
        [
          "**Strategy (offline fallback)**",
          `1. Prepare the core ${context.caseTypeLabel ?? "requested"} document package.`,
          "2. Index client-provided exhibits.",
          "3. Operator to confirm scope and priority with client.",
        ].join("\n")
      return { summary: `🧭 **Strategy Agent**\n\n${summary}`, ok: true }
    })

    // ── 4. Drafting (uses ONLY verified citations) ───────────────────────
    let draftFileName = `${context.caseReference} draft.md`
    let draftContent: string | null = null

    await runStep("drafting", "strategy+verified_citations", async () => {
      const llm = await callLlm(
        `${UPL_SYSTEM_PREFIX}\nYou are the drafting agent. Produce the primary document described in the strategy as clean markdown, ready for a human operator to edit. HARD RULES: cite ONLY the verified citations provided verbatim — if none are provided, include no legal citations at all; use only facts from the intake; mark any needed-but-unknown detail as [OPERATOR: fill in]. Start with a title line. Do not include a signature of a lawyer.`,
        `${contextBlock(context!)}\n\n${verifiedCitationsBlock(context!)}\n\nStrategy:\n${strategy.summary.slice(0, 4000)}`
      )
      draftContent =
        llm ??
        [
          `# ${context!.caseTypeLabel ?? "Case"} — working draft (${context!.caseReference})`,
          "",
          "> Offline fallback draft — configure OPENAI_API_KEY or ANTHROPIC_API_KEY for full council drafting.",
          "",
          "## Parties",
          `${context!.clientName} (${context!.role ?? "[OPERATOR: fill in role]"}) — adverse: ${context!.opposingParty ?? "[OPERATOR: fill in]"}`,
          "",
          "## Statement of facts",
          context!.issueSummary ?? "[OPERATOR: summarize facts from intake]",
          "",
              "## Requested preparation",
          context!.serviceNeeded ?? "[OPERATOR: confirm scope]",
          "",
          "_No citations included — none were verified for this matter._",
        ].join("\n")

      const titled = `> **DRAFT — INTERNAL. Not delivered until human review + approval.**\n> Document preparation service — not a law firm; not legal advice.\n\n${draftContent}`
      draftContent = titled

      const blob = new Blob([titled], { type: "text/markdown" })
      const storageId = await ctx.storage.store(blob)

      const documentId = await ctx.runMutation(
        internal.documentVersions.createDraftWithVersion,
        {
          caseId: args.caseId,
          fileName: draftFileName,
          storageId,
          content: titled,
          editedBy: "ai_drafting_agent",
          changeNote: "Council drafting agent — v1",
        }
      )

      return {
        summary: `✍️ **Drafting Agent**\n\nDraft v1 of **${draftFileName}** is in the workspace editor (document ${documentId}). Built from intake facts + ${context!.verifiedCitations.length} verified citation(s)${llm ? "" : " using the offline template"}. Awaiting critique, then human review.`,
        ok: true,
      }
    })

    // ── 5. Review / critique ─────────────────────────────────────────────
    await runStep("review_critique", "draft_vs_research", async () => {
      if (!draftContent) {
        return {
          summary:
            "🧪 **Review/Critique Agent**\n\nNo draft was produced, so there is nothing to critique. Operator should re-run the council.",
          ok: false,
        }
      }
      const llm = await callLlm(
        `${UPL_SYSTEM_PREFIX}\nYou are the review/critique agent — an adversarial second pass. Check the draft against the verified citation list and intake facts. Report in markdown: Unsupported citations (anything cited that is NOT on the verified list — these are potential hallucinations and MUST be flagged); Unsupported factual claims; Missing elements; Suggested edits. Be specific and terse.`,
        `${verifiedCitationsBlock(context!)}\n\nDRAFT:\n${draftContent.slice(0, 12000)}`
      )
      const summary =
        llm ??
        "**Critique (offline fallback)**\n- Automated critique unavailable without an LLM key.\n- Operator must verify every citation and factual claim manually before approval (required anyway)."
      return { summary: `🧪 **Review/Critique Agent**\n\n${summary}`, ok: true }
    })

    // ── Park at the human gate ───────────────────────────────────────────
    await ctx.runMutation(internal.councilData.markCouncilComplete, {
      caseId: args.caseId,
      draftFileName,
    })

    return null
  },
})
