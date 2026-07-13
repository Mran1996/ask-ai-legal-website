import {
  CASE_FILE_REVIEW_PRICE_CENTS,
  DOCUMENT_RETRIEVAL_FEE_CENTS,
} from "@/lib/site-config"

/** Document prep line due before work starts (custom quotes fall back to case file review). */
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
