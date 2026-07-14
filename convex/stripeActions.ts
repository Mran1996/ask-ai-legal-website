"use node"

import { v } from "convex/values"
import Stripe from "stripe"
import { action, internalAction } from "./_generated/server"
import { internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"

type CheckoutContext = {
  caseReference: string
  clientEmail: string
  clientName: string
  serviceLine: string
  documentPrepCents: number
  retrievalCents: number
  totalDueCents: number
  retrievalRequested: boolean
  estimateId: Id<"estimates">
  status: string
}

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set on Convex")
  }
  return new Stripe(key)
}

function publicSiteUrl(): string {
  return process.env.PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://askailegal.com"
}

/**
 * Soft-disabled for the email funnel: chat UI does not call this.
 * Kept for optional future Checkout / Payment Link API use. Prefer ops-pasted
 * Stripe Payment Links emailed from markContractInvoiceSent.
 */
export const createCheckoutSession = action({
  args: { caseId: v.id("cases") },
  returns: v.object({
    url: v.string(),
    sessionId: v.string(),
  }),
  handler: async (ctx, args): Promise<{ url: string; sessionId: string }> => {
    const checkout = (await ctx.runQuery(internal.payments.getCheckoutContextInternal, {
      caseId: args.caseId,
    })) as CheckoutContext | null

    if (!checkout) {
      throw new Error("Case or estimate not ready for checkout")
    }

    if (checkout.status !== "awaiting_payment" && checkout.status !== "estimate_sent") {
      throw new Error("This case is not awaiting payment")
    }

    if (checkout.totalDueCents < 50) {
      throw new Error("Invalid checkout amount")
    }

    const stripe = getStripe()
    const site = publicSiteUrl()

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: checkout.documentPrepCents,
          product_data: {
            name: `Document preparation — ${checkout.serviceLine}`,
            description: `Case ${checkout.caseReference}. Document generation only — not a law firm, not legal advice.`,
          },
        },
      },
    ]

    if (checkout.retrievalCents > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: checkout.retrievalCents,
          product_data: {
            name: "Document retrieval (add-on)",
            description:
              "Retrieve public case documents / filings for your matter. Fulfilled by our team after payment.",
          },
        },
      })
    }

    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: checkout.clientEmail,
      client_reference_id: args.caseId,
      line_items: lineItems,
      success_url: `${site}/?checkout=success&ref=${encodeURIComponent(checkout.caseReference)}`,
      cancel_url: `${site}/?checkout=cancel&ref=${encodeURIComponent(checkout.caseReference)}`,
      metadata: {
        caseId: args.caseId,
        caseReference: checkout.caseReference,
        estimateId: checkout.estimateId,
      },
    })

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL")
    }

    await ctx.runMutation(internal.payments.recordCheckoutSession, {
      caseId: args.caseId,
      estimateId: checkout.estimateId,
      amountCents: checkout.totalDueCents,
      stripeCheckoutSessionId: session.id,
    })

    if (checkout.status === "estimate_sent") {
      await ctx.runMutation(internal.payments.ensureAwaitingPayment, {
        caseId: args.caseId,
      })
    }

    return { url: session.url, sessionId: session.id }
  },
})

export const handleStripeWebhook = internalAction({
  args: {
    rawBody: v.string(),
    signature: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set on Convex")
    }

    const stripe = getStripe()
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(args.rawBody, args.signature, secret)
    } catch (error) {
      console.error("Stripe webhook signature failed", error)
      throw new Error("Invalid Stripe signature")
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const amountCents = session.amount_total ?? 0
      const paymentIntent =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id

      await ctx.runMutation(internal.payments.markCheckoutPaid, {
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntent,
        amountCents,
      })
    }

    return null
  },
})
