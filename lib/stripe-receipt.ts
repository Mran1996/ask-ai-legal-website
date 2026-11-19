import Stripe from "stripe"
import { MAINTENANCE_PRICE_USD, PURCHASE_PRICE_USD, STARTER_PRICE_USD } from "@/lib/site-config"

/** Server only. Checks the Stripe receipt code that Stripe adds to the /pay/success link
 *  (?session_id={CHECKOUT_SESSION_ID}), so the page is only shown after a real, paid purchase. */

export type PaidItem = "starter" | "complete" | "maintenance" | "unknown"

export type VerifiedPurchase = {
  sessionId: string
  item: PaidItem
  /** What the buyer actually paid, in dollars. */
  value: number
}

/** A receipt link older than this no longer opens the page (stops old links being shared around). */
const MAX_AGE_DAYS = 30

const SESSION_ID = /^cs_(live|test)_[A-Za-z0-9]{10,200}$/

function itemFromAmount(cents: number, mode: Stripe.Checkout.Session.Mode): PaidItem {
  if (mode === "subscription" || cents === MAINTENANCE_PRICE_USD * 100) return "maintenance"
  if (cents === STARTER_PRICE_USD * 100) return "starter"
  if (cents === PURCHASE_PRICE_USD * 100) return "complete"
  return "unknown"
}

/** Returns the purchase when the code is a real, completed, paid Stripe checkout; otherwise null. */
export async function verifyCheckoutSession(
  sessionId: string | undefined,
  itemHint?: string
): Promise<VerifiedPurchase | null> {
  if (!sessionId || !SESSION_ID.test(sessionId)) return null

  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) {
    console.error("[pay/success] STRIPE_SECRET_KEY is not set; cannot check the receipt")
    return null
  }

  try {
    const session = await new Stripe(key).checkout.sessions.retrieve(sessionId)
    const paid = session.payment_status === "paid" || session.payment_status === "no_payment_required"
    if (session.status !== "complete" || !paid) return null

    const ageDays = (Date.now() / 1000 - session.created) / 86400
    if (ageDays > MAX_AGE_DAYS) return null

    // Pre-tax price: both plan links collect sales tax, so the total can differ by state.
    const cents = session.amount_subtotal ?? session.amount_total ?? 0
    let item = itemFromAmount(cents, session.mode)
    // A discount changes the amount; then trust the plan name the Stripe link was set up with.
    if (item === "unknown" && (itemHint === "starter" || itemHint === "complete" || itemHint === "maintenance")) {
      item = itemHint
    }
    return { sessionId: session.id, item, value: cents / 100 }
  } catch (error) {
    const type = error instanceof Stripe.errors.StripeError ? error.type : "unknown"
    console.error(`[pay/success] Stripe receipt check failed (${type})`)
    return null
  }
}
