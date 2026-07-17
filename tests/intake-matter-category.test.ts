import { describe, it, expect } from "vitest"
import { resolveIntakeMatterCategory } from "../convex/lib/intakeMatterCategory"
import { intakeDocxFileName } from "../convex/lib/buildIntakeDocx"

describe("resolveIntakeMatterCategory", () => {
  it("maps Family / divorce label to family (even if matterType is still custom)", () => {
    expect(
      resolveIntakeMatterCategory({
        matterType: "custom",
        caseTypeLabel: "Family / divorce",
        issueSummary: "I need a divorce petition",
      })
    ).toBe("family")
  })

  it("maps Housing / eviction to unlawful_detainer without family spillover", () => {
    expect(
      resolveIntakeMatterCategory({
        matterType: "custom",
        caseTypeLabel: "Housing / eviction",
        issueSummary: "Got a 3-day notice and summons",
        role: "tenant",
      })
    ).toBe("unlawful_detainer")
  })

  it("maps Criminal motion to criminal", () => {
    expect(
      resolveIntakeMatterCategory({
        matterType: "ca_criminal",
        caseTypeLabel: "Criminal motion",
        issueSummary: "Need a motion related to sentencing",
      })
    ).toBe("criminal")
  })

  it("maps Demand letter and Small claims distinctly", () => {
    expect(
      resolveIntakeMatterCategory({
        caseTypeLabel: "Demand letter",
        issueSummary: "Want a cease and desist",
      })
    ).toBe("demand_letter")

    expect(
      resolveIntakeMatterCategory({
        caseTypeLabel: "Small claims",
        issueSummary: "File SC-100 for unpaid invoice",
      })
    ).toBe("small_claims")
  })

  it("distinguishes civil complaint vs civil answer", () => {
    expect(
      resolveIntakeMatterCategory({
        matterType: "ca_civil",
        caseTypeLabel: "Civil complaint",
        issueSummary: "I want to sue for breach",
      })
    ).toBe("civil_complaint")

    expect(
      resolveIntakeMatterCategory({
        matterType: "ca_civil",
        caseTypeLabel: "Response / answer",
        issueSummary: "Need to answer a summons and complaint",
        role: "defendant",
      })
    ).toBe("civil_answer")
  })

  it("maps post-conviction and business dispute", () => {
    expect(
      resolveIntakeMatterCategory({
        caseTypeLabel: "Post-conviction",
        issueSummary: "Seeking expungement / record relief",
      })
    ).toBe("post_conviction")

    expect(
      resolveIntakeMatterCategory({
        caseTypeLabel: "Business dispute",
        issueSummary: "Partnership and breach of contract",
      })
    ).toBe("business_dispute")
  })

  it("falls back to general when type is unclear", () => {
    expect(
      resolveIntakeMatterCategory({
        matterType: "custom",
        caseTypeLabel: "Other",
        issueSummary: "Need help with paperwork for a unique situation",
      })
    ).toBe("general")
  })
})

describe("intake question sets stay matter-scoped", () => {
  it("eviction questions exclude spouse/custody/dissolution", async () => {
    const { listIntakeQuestionTexts } = await import("../convex/lib/buildIntakeDocx")
    const texts = listIntakeQuestionTexts("unlawful_detainer").join("\n").toLowerCase()
    expect(texts).toContain("unlawful detainer")
    expect(texts).not.toMatch(/spouse|custody|dissolution|parenting/)
  })

  it("criminal questions exclude divorce/custody", async () => {
    const { listIntakeQuestionTexts } = await import("../convex/lib/buildIntakeDocx")
    const texts = listIntakeQuestionTexts("criminal").join("\n").toLowerCase()
    expect(texts).toMatch(/charges|hearing|motion/)
    expect(texts).not.toMatch(/spouse|dissolution|parenting|child support/)
  })

  it("family questions include marriage/custody themes", async () => {
    const { listIntakeQuestionTexts } = await import("../convex/lib/buildIntakeDocx")
    const texts = listIntakeQuestionTexts("family").join("\n").toLowerCase()
    expect(texts).toMatch(/spouse|parenting|dissolution|child support/)
  })
})

describe("intakeDocxFileName", () => {
  it("includes matter hint when provided", () => {
    expect(
      intakeDocxFileName({
        lastName: "Nguyen",
        caseReference: "AAL-ABC12345",
        matterHint: "Housing-Eviction",
      })
    ).toBe("Ask-AI-Legal-Intake-Part1-Housing-Eviction-Nguyen-AAL-ABC12345.docx")
  })
})
