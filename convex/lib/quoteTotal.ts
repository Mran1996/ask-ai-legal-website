/**
 * Authoritative pricing constants and helpers.
 *
 * - `FIXED_DEPOSIT_CENTS` ($499) is the upfront deposit Stripe charges.
 * - `finalQuoteCents` (already marked up 10% by servicePricing) is the
 *   total the client is quoted for the engagement.
 * - Balance = quotedTotal − deposit − referralDiscount − paidSoFar.
 */

/** Fixed upfront deposit charged via Stripe Checkout. */
export const FIXED_DEPOSIT_CENTS = 49900 // $499.00

/** Legacy alias — some ops code still references this name. */
export const CASE_FILE_REVIEW_PRICE_CENTS = FIXED_DEPOSIT_CENTS

/** @deprecated Use FIXED_DEPOSIT_CENTS. Kept for backward compat. */
export const DOCUMENT_PREP_START_FEE_CENTS = FIXED_DEPOSIT_CENTS

/** Optional document retrieval add-on. */
export const DOCUMENT_RETRIEVAL_FEE_CENTS = 9900

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** How much the deposit should be (always the fixed $499 for now). */
export function depositAmountCents(): number {
  return FIXED_DEPOSIT_CENTS
}

export function retrievalFeeCents(requested: boolean): number {
  return requested ? DOCUMENT_RETRIEVAL_FEE_CENTS : 0
}

/**
 * Remaining balance after deposit and any discount.
 * Never negative — if the deposit exceeds the quote we owe nothing more.
 */
export function balanceRemainingCents(args: {
  quotedTotalCents: number
  depositPaidCents: number
  referralDiscountCents: number
  additionalPaidCents: number
}): number {
  const owed =
    args.quotedTotalCents -
    args.depositPaidCents -
    args.referralDiscountCents -
    args.additionalPaidCents
  return Math.max(0, owed)
}

/**
 * @deprecated — replaced by depositAmountCents(). Kept so callers compile.
 */
export function documentPrepStartCents(args: {
  finalQuoteCents: number
  isCustomQuote: boolean
}): number {
  if (args.isCustomQuote || args.finalQuoteCents <= 0) {
    return FIXED_DEPOSIT_CENTS
  }
  return args.finalQuoteCents
}

/**
 * @deprecated — replaced by depositAmountCents(). Kept so callers compile.
 */
export function totalDueBeforeWorkCents(args: {
  finalQuoteCents: number
  isCustomQuote: boolean
  retrievalRequested: boolean
}): number {
  return (
    documentPrepStartCents(args) + retrievalFeeCents(args.retrievalRequested)
  )
}
