import { describe, it, expect } from "vitest"
import {
  computeOurAverageCents,
  resolvePricing,
} from "../convex/lib/servicePricing"
import {
  FIXED_DEPOSIT_CENTS,
  MIN_DOCUMENT_PREP_QUOTE_CENTS,
  applyMinimumDocumentPrepQuoteCents,
  balanceRemainingCents,
  depositAmountCents,
  retrievalFeeCents,
} from "../convex/lib/quoteTotal"

describe("computeOurAverageCents — half of attorney low", () => {
  it("returns half of attorney low, rounded to nearest $1", () => {
    expect(computeOurAverageCents(287500)).toBe(143800) // $2,875 → $1,438
    expect(computeOurAverageCents(150000)).toBe(75000) // $1,500 → $750
    expect(computeOurAverageCents(100000)).toBe(50000) // $1,000 → $500
  })

  it("returns 0 for zero or negative input", () => {
    expect(computeOurAverageCents(0)).toBe(0)
    expect(computeOurAverageCents(-100)).toBe(0)
  })

  it("cent-safe: result is always a multiple of 100", () => {
    for (const low of [10000, 33300, 49900, 74900, 287500]) {
      expect(computeOurAverageCents(low) % 100).toBe(0)
    }
  })
})

describe("minimum document prep quote", () => {
  it("floor is $1,489", () => {
    expect(MIN_DOCUMENT_PREP_QUOTE_CENTS).toBe(148900)
  })

  it("raises calculated quotes below the floor", () => {
    expect(applyMinimumDocumentPrepQuoteCents(86300)).toBe(148900)
    expect(applyMinimumDocumentPrepQuoteCents(143800)).toBe(148900)
  })

  it("leaves quotes at or above the floor unchanged", () => {
    expect(applyMinimumDocumentPrepQuoteCents(148900)).toBe(148900)
    expect(applyMinimumDocumentPrepQuoteCents(158125)).toBe(158125)
  })

  it("does not floor custom/zero quotes", () => {
    expect(applyMinimumDocumentPrepQuoteCents(0)).toBe(0)
  })
})

describe("resolvePricing quote is half of displayed attorney low", () => {
  it("Family / divorce in WA → half of attorney low before floor", () => {
    const result = resolvePricing({
      state: "WA",
      caseType: "Family / divorce",
      issue: "divorce petition",
    })
    const low = result.deliverable.attorneyLowCents
    const our = result.deliverable.ourPriceCents!
    // WA high-cost factor 1.15 on $2,500 template → $2,875
    expect(low).toBe(287500)
    expect(our).toBe(143800)
    expect(our).toBe(Math.round(low / 2 / 100) * 100)
    expect(applyMinimumDocumentPrepQuoteCents(our)).toBe(148900)
  })

  it("housing / eviction quote equals half of its attorney low", () => {
    const result = resolvePricing({
      state: "CA",
      caseType: "Housing / eviction",
      issue: "unlawful detainer test",
    })
    const low = result.deliverable.attorneyLowCents
    const our = result.deliverable.ourPriceCents!
    expect(our).toBe(Math.round(low / 2 / 100) * 100)
    expect(our % 100).toBe(0)
  })

  it("eviction case type never returns divorce pricing even if issue mentions family", () => {
    const result = resolvePricing({
      state: "WA",
      caseType: "Housing / eviction",
      issue: "family emergency and eviction notice from landlord",
    })
    expect(result.matchedBy).toBe("caseType")
    expect(result.deliverable.id).toBe("housing_eviction")
    expect(result.deliverable.serviceLine.toLowerCase()).toContain("unlawful detainer")
    expect(result.deliverable.serviceLine.toLowerCase()).not.toContain("divorce")
  })

  it("Custody alias maps to Family / custody", () => {
    const result = resolvePricing({
      state: "CA",
      caseType: "Custody",
      issue: "need help with kids",
    })
    expect(result.deliverable.caseType).toBe("Family / custody")
    expect(result.matchedBy).toBe("caseType")
  })

  it("matter types below floor quote at $1,489; higher tiers stay distinct", () => {
    const caseTypes = [
      "Housing / eviction",
      "Small claims",
      "Criminal motion",
      "Post-conviction",
    ] as const
    const prices = caseTypes.map((caseType) => {
      const result = resolvePricing({
        state: "WA",
        caseType,
        issue: `test matter for ${caseType}`,
      })
      const raw = result.deliverable.ourPriceCents!
      return {
        caseType,
        id: result.deliverable.id,
        quoted: applyMinimumDocumentPrepQuoteCents(raw),
      }
    })
    expect(prices.find((p) => p.id === "housing_eviction")!.quoted).toBe(148900)
    expect(prices.find((p) => p.id === "small_claims")!.quoted).toBe(148900)
    expect(prices.find((p) => p.id === "criminal_motion")!.quoted).toBeGreaterThan(
      148900
    )
    expect(prices.find((p) => p.id === "post_conviction")!.quoted).toBeGreaterThan(
      148900
    )
  })
})

describe("deposit and balance accounting", () => {
  it("fixed deposit is $499", () => {
    expect(FIXED_DEPOSIT_CENTS).toBe(49900)
    expect(depositAmountCents()).toBe(49900)
  })

  it("balance = quote − deposit − discount − additional paid", () => {
    expect(
      balanceRemainingCents({
        quotedTotalCents: 100000,
        depositPaidCents: 49900,
        referralDiscountCents: 0,
        additionalPaidCents: 0,
      })
    ).toBe(50100)
  })

  it("balance never goes negative", () => {
    expect(
      balanceRemainingCents({
        quotedTotalCents: 30000,
        depositPaidCents: 49900,
        referralDiscountCents: 0,
        additionalPaidCents: 0,
      })
    ).toBe(0)
  })

  it("referral discount reduces balance", () => {
    expect(
      balanceRemainingCents({
        quotedTotalCents: 100000,
        depositPaidCents: 49900,
        referralDiscountCents: 10000,
        additionalPaidCents: 0,
      })
    ).toBe(40100)
  })

  it("discount greater than remaining balance → 0", () => {
    expect(
      balanceRemainingCents({
        quotedTotalCents: 50000,
        depositPaidCents: 49900,
        referralDiscountCents: 50000,
        additionalPaidCents: 0,
      })
    ).toBe(0)
  })
})

describe("retrieval fee", () => {
  it("returns 9900 when requested", () => {
    expect(retrievalFeeCents(true)).toBe(9900)
  })

  it("returns 0 when not requested", () => {
    expect(retrievalFeeCents(false)).toBe(0)
  })
})
