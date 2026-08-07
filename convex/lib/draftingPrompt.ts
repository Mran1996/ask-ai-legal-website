/** Prompt helpers for the Phase 1 document drafting agent (testable, no Convex imports). */

export type DraftingContext = {
  caseReference: string
  matterType: string
  clientFirstName: string
  clientLastName: string
  intakeRaw: string
  issueSummary?: string
  state?: string
  county?: string
  caseTypeLabel?: string
  deadline?: string
  opposingParty?: string
  caseNumber?: string
  estimateServiceLine?: string
  draftIssuesSummary?: string
  structured: {
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
}

export function buildDraftSystemPrompt(): string {
  return `You draft document-preparation materials for Ask AI Legal (NOT a law firm).
Rules:
- Output plain text only (no markdown code fences)
- Prepare formatted document CONTENT for the client's review — not legal advice
- Use [BRACKET PLACEHOLDERS] for any fact you do not have
- Include a short header: DRAFT — FOR CLIENT REVIEW ONLY
- Include a footer disclaimer: Document preparation only; not legal advice; client reviews and files.
- Do not tell the client what they "should" argue — describe sections and factual placeholders only
- For California unlawful detainer matters, structure like an answer/response with caption placeholders when facts support it`
}

export function buildDraftUserPrompt(context: DraftingContext): string {
  const rent =
    context.structured.rentOwedCents !== undefined
      ? `$${(context.structured.rentOwedCents / 100).toFixed(2)}`
      : "unknown"

  return [
    `Case reference: ${context.caseReference}`,
    `Matter type: ${context.matterType}`,
    `Client: ${context.clientFirstName} ${context.clientLastName}`,
    `State: ${context.state ?? "unknown"}`,
    `County: ${context.county ?? "unknown"}`,
    `Case type label: ${context.caseTypeLabel ?? "unknown"}`,
    `Service line: ${context.estimateServiceLine ?? "document preparation package"}`,
    `Deadline: ${context.deadline ?? "none noted"}`,
    `Case number: ${context.caseNumber ?? "none"}`,
    `Opposing party: ${context.opposingParty ?? "unknown"}`,
    `Issue summary: ${context.issueSummary ?? "(none)"}`,
    "",
    "Structured intake facts:",
    `- Role: ${context.structured.role ?? "unknown"}`,
    `- Tenant/respondent: ${context.structured.tenantName ?? context.clientFirstName + " " + context.clientLastName}`,
    `- Landlord/plaintiff: ${context.structured.landlordName ?? "[LANDLORD NAME]"}`,
    `- Property: ${context.structured.propertyAddress ?? "[PROPERTY ADDRESS]"}`,
    `- Notice date: ${context.structured.noticeDate ?? "[NOTICE DATE]"}`,
    `- Rent claimed: ${rent}`,
    `- Summons received: ${context.structured.hasReceivedSummons === true ? "yes" : context.structured.hasReceivedSummons === false ? "no" : "unknown"}`,
    `- Hearing date: ${context.structured.hearingDate ?? "[HEARING DATE]"}`,
    `- Service requested: ${context.structured.serviceNeeded ?? "unknown"}`,
    `- Client notes: ${context.structured.notes ?? "(none)"}`,
    "",
    "Ops scope memo (if any):",
    context.draftIssuesSummary?.slice(0, 4000) ?? "(none — use intake only)",
    "",
    "Raw intake excerpt:",
    context.intakeRaw.slice(0, 8000),
    "",
    "Draft the primary document package content described above.",
  ].join("\n")
}

export function fallbackDraftDocument(context: DraftingContext): string {
  const clientName =
    context.structured.tenantName ??
    `${context.clientFirstName} ${context.clientLastName}`.trim()
  const caption = [
    "SUPERIOR COURT OF CALIFORNIA",
    `COUNTY OF ${(context.county ?? "[COUNTY]").toUpperCase()}`,
    "",
    `${context.structured.landlordName ?? "[PLAINTIFF NAME]"},`,
    "                    Plaintiff,",
    "",
    `    vs.                         Case No. ${context.caseNumber ?? "[CASE NUMBER]"}`,
    "",
    `${clientName},`,
    "                    Defendant.",
  ].join("\n")

  return [
    "DRAFT — FOR CLIENT REVIEW ONLY",
    "",
    caption,
    "",
    context.estimateServiceLine ?? "DOCUMENT PREPARATION DRAFT",
    "",
    "1. INTRODUCTION",
    `This draft was prepared from intake reference ${context.caseReference}. Replace every bracketed placeholder before use.`,
    "",
    "2. RESPONSE SECTIONS (outline)",
    "   A. Parties and property — verify names and address.",
    context.structured.propertyAddress
      ? `      Property: ${context.structured.propertyAddress}`
      : "      Property: [PROPERTY ADDRESS]",
    "   B. Timeline — list notice, service, and hearing dates from your records.",
    context.structured.noticeDate
      ? `      Notice date noted: ${context.structured.noticeDate}`
      : "      Notice date: [NOTICE DATE]",
    context.structured.hearingDate
      ? `      Hearing date noted: ${context.structured.hearingDate}`
      : "      Hearing date: [HEARING DATE]",
    "   C. Factual responses — one numbered paragraph per allegation in the complaint/unlawful detainer.",
    "   D. Affirmative responses — add only sections supported by the client's facts.",
    "   E. Signature block — client signs under penalty of perjury.",
    "",
    "3. EXHIBIT INDEX",
    "   List each attachment the client will file with this response.",
    "",
    "4. NEXT STEPS FOR CLIENT",
    "   Review every fact, date, and name. File or serve according to your court's local rules.",
    "",
    "—",
    "Document preparation only. Ask AI Legal is not a law firm and does not provide legal advice.",
  ].join("\n")
}
