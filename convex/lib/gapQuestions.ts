/**
 * Deterministic missing-info detection for post–Part 1 gap emails.
 * Document-prep only — questions ask for facts/docs, never legal advice.
 */

export type GapQuestion = {
  id: string
  question: string
}

export type GapAssessmentInput = {
  issueSummary?: string
  state?: string
  county?: string
  role?: string
  opposingParty?: string
  landlordName?: string
  tenantName?: string
  caseTypeLabel?: string
  deadline?: string
  knownDates?: string
  caseNumber?: string
  propertyAddress?: string
  hasDocuments?: "yes" | "no"
  documentCount: number
  serviceNeeded?: string
  intakeRaw: string
}

function blank(value: string | undefined): boolean {
  return !value || value.trim().length === 0
}

function short(value: string | undefined, min = 30): boolean {
  return blank(value) || (value?.trim().length ?? 0) < min
}

function mentionsCourtMatter(input: GapAssessmentInput): boolean {
  const blob = [
    input.caseTypeLabel,
    input.issueSummary,
    input.serviceNeeded,
    input.intakeRaw.slice(0, 2000),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
  return /evict|unlawful detainer|summons|complaint|hearing|court|lawsuit|petition|motion|ud\b|landlord|tenant/.test(
    blob
  )
}

function looksLikeEviction(input: GapAssessmentInput): boolean {
  const blob = [input.caseTypeLabel, input.issueSummary, input.intakeRaw.slice(0, 1500)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
  return /evict|unlawful detainer|landlord|tenant|notice to quit|3-day|pay or quit/.test(blob)
}

/** Returns ordered gap questions for the client email (empty = file looks complete enough). */
export function detectIntakeGaps(input: GapAssessmentInput): GapQuestion[] {
  const gaps: GapQuestion[] = []

  if (short(input.issueSummary, 40) && short(input.intakeRaw, 80)) {
    gaps.push({
      id: "issue_summary",
      question:
        "In a few sentences, what happened and what documents do you need prepared? (facts only — dates, parties, notices, and what you want drafted)",
    })
  } else if (short(input.issueSummary, 40)) {
    gaps.push({
      id: "issue_clarify",
      question:
        "Please clarify the main issue in your own words (what notice/complaint you received, key dates, and the document(s) you want us to prepare).",
    })
  }

  if (blank(input.state)) {
    gaps.push({
      id: "state",
      question: "Which U.S. state is this matter in (where the property/court/filing would be)?",
    })
  }

  if (blank(input.role)) {
    gaps.push({
      id: "role",
      question:
        "What is your role in this matter (for example: tenant, landlord, plaintiff, defendant, petitioner, respondent)?",
    })
  }

  if (blank(input.opposingParty) && blank(input.landlordName) && blank(input.tenantName)) {
    gaps.push({
      id: "opposing_party",
      question: "Who is the other party (full name or business name as it appears on papers)?",
    })
  }

  if (looksLikeEviction(input) && blank(input.propertyAddress)) {
    gaps.push({
      id: "property_address",
      question: "What is the full property / rental address involved?",
    })
  }

  if (mentionsCourtMatter(input) && blank(input.deadline) && blank(input.knownDates)) {
    gaps.push({
      id: "deadlines",
      question:
        "What deadlines or hearing dates are on your papers (answer deadline, hearing date, notice date)? Please quote the dates exactly as written.",
    })
  }

  if (mentionsCourtMatter(input) && blank(input.caseNumber)) {
    gaps.push({
      id: "case_number",
      question:
        "If you already have a court case, what is the case / docket number? (Reply “none yet” if you have not been sued or assigned a number.)",
    })
  }

  if (blank(input.serviceNeeded)) {
    gaps.push({
      id: "service_needed",
      question:
        "Which document(s) should we prepare first (for example: answer, motion, demand letter, declaration)? List your top priority.",
    })
  }

  if (
    (input.hasDocuments === "yes" || mentionsCourtMatter(input)) &&
    input.documentCount === 0
  ) {
    gaps.push({
      id: "attachments",
      question:
        "Please reply to this email with copies of your key papers attached (notices, complaint/summons, lease, prior filings). Keep your case reference in the subject line.",
    })
  }

  // Cap so the email stays actionable
  return gaps.slice(0, 8)
}

export function formatGapQuestionsForEmail(questions: GapQuestion[]): string {
  return questions.map((q, i) => `${i + 1}. ${q.question}`).join("\n")
}

export function formatGapQuestionsSummary(questions: GapQuestion[]): string {
  return questions.map((q) => `- [${q.id}] ${q.question}`).join("\n")
}
