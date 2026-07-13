/** Mirrors lib/site-config.ts — keep in sync (Convex cannot import app lib). */
export const CASE_FILE_REVIEW_PRICE_CENTS = 49900
export const DOCUMENT_RETRIEVAL_FEE_CENTS = 9900

export function documentPrepStartCents(args: {
  finalQuoteCents: number
  isCustomQuote: boolean
}): number {
  if (args.isCustomQuote || args.finalQuoteCents <= 0) {
    return CASE_FILE_REVIEW_PRICE_CENTS
  }
  return args.finalQuoteCents
}

export function retrievalFeeCents(requested: boolean): number {
  return requested ? DOCUMENT_RETRIEVAL_FEE_CENTS : 0
}

export function totalDueBeforeWorkCents(args: {
  finalQuoteCents: number
  isCustomQuote: boolean
  retrievalRequested: boolean
}): number {
  return (
    documentPrepStartCents(args) + retrievalFeeCents(args.retrievalRequested)
  )
}
