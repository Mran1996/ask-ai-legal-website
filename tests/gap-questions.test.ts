import { describe, it, expect } from "vitest"
import { detectIntakeGaps } from "../convex/lib/gapQuestions"

describe("detectIntakeGaps", () => {
  it("returns no gaps for a complete eviction-ish file with docs", () => {
    const gaps = detectIntakeGaps({
      issueSummary:
        "Received 3-day notice and summons; need help preparing an answer to unlawful detainer.",
      state: "CA",
      county: "Los Angeles",
      role: "tenant",
      opposingParty: "ABC Properties LLC",
      caseTypeLabel: "Eviction / unlawful detainer",
      deadline: "Answer due 2026-08-01",
      knownDates: "Hearing 2026-08-15",
      caseNumber: "24UD01234",
      propertyAddress: "123 Main St, Los Angeles, CA",
      hasDocuments: "yes",
      documentCount: 2,
      serviceNeeded: "Answer to complaint",
      intakeRaw: "Detailed intake about eviction and summons already filed.",
    })
    expect(gaps).toEqual([])
  })

  it("asks for core missing facts when intake is thin", () => {
    const gaps = detectIntakeGaps({
      documentCount: 0,
      intakeRaw: "help",
    })
    const ids = gaps.map((g) => g.id)
    expect(ids).toContain("issue_summary")
    expect(ids).toContain("state")
    expect(ids).toContain("role")
    expect(ids).toContain("opposing_party")
    expect(ids).toContain("service_needed")
  })

  it("asks for attachments when client said they have documents but none uploaded", () => {
    const gaps = detectIntakeGaps({
      issueSummary: "Need documents prepared for my landlord dispute after a pay-or-quit notice.",
      state: "CA",
      role: "tenant",
      opposingParty: "Landlord",
      caseTypeLabel: "Eviction",
      deadline: "Tomorrow",
      caseNumber: "none yet",
      propertyAddress: "1 Oak Ave",
      hasDocuments: "yes",
      documentCount: 0,
      serviceNeeded: "Answer",
      intakeRaw: "Long enough intake text about eviction and landlord notice details here.",
    })
    expect(gaps.some((g) => g.id === "attachments")).toBe(true)
  })
})
