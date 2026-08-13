"use node"

import { v } from "convex/values"
import Stripe from "stripe"
import { action, internalAction } from "./_generated/server"
import { internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"

import { FIXED_DEPOSIT_CENTS } from "./lib/quoteTotal"
import { assertOpsToken } from "./lib/opsAuth"

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

    const depositCents = FIXED_DEPOSIT_CENTS
    if (depositCents < 50) {
      throw new Error("Invalid checkout amount")
    }

    const stripe = getStripe()
    const site = publicSiteUrl()

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: depositCents,
          product_data: {
            name: `Document preparation deposit — ${checkout.serviceLine}`,
            description: `Case ${checkout.caseReference}. $${(depositCents / 100).toFixed(2)} deposit toward your quoted total. Document generation only — not a law firm, not legal advice.`,
          },
        },
      },
    ]

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
        paymentType: "deposit",
      },
    })

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL")
    }

    await ctx.runMutation(internal.payments.recordCheckoutSession, {
      caseId: args.caseId,
      estimateId: checkout.estimateId,
      amountCents: depositCents,
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

/**
 * Ops: create a one-time Stripe Checkout URL for the start fee (default $499.99).
 * Paste remains supported if Stripe is not configured.
 */
export const createStartPaymentLink = action({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
    amountCents: v.optional(v.number()),
  },
  returns: v.object({
    url: v.string(),
    amountCents: v.number(),
  }),
  handler: async (
    ctx,
    args
  ): Promise<{ url: string; amountCents: number }> => {
    assertOpsToken(args.opsToken)

    const meta = await ctx.runQuery(internal.cases.getOutlookFolderContext, {
      caseId: args.caseId,
    })
    if (!meta) throw new Error("Case not found")

    const checkout = (await ctx.runQuery(internal.payments.getCheckoutContextInternal, {
      caseId: args.caseId,
    })) as CheckoutContext | null

    const amountCents = args.amountCents ?? FIXED_DEPOSIT_CENTS
    if (amountCents < 50) throw new Error("Invalid amount")

    const stripe = getStripe()
    const site = publicSiteUrl()
    const clientEmail = checkout?.clientEmail

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: clientEmail,
      client_reference_id: args.caseId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: `Document preparation start — ${meta.caseReference}`,
              description:
                "Ask AI Legal document preparation start fee. Not a law firm — not legal advice. Paying accepts the Document Preparation Service Agreement.",
            },
          },
        },
      ],
      success_url: `${site}/?paid=1&ref=${encodeURIComponent(meta.caseReference)}`,
      cancel_url: `${site}/ops/intakes/${args.caseId}`,
      metadata: {
        caseId: args.caseId,
        caseReference: meta.caseReference,
      },
    })

    if (!session.url) throw new Error("Stripe did not return a checkout URL")

    if (checkout?.estimateId) {
      await ctx.runMutation(internal.payments.recordCheckoutSession, {
        caseId: args.caseId,
        estimateId: checkout.estimateId,
        amountCents,
        stripeCheckoutSessionId: session.id,
      })
    }

    await ctx.runMutation(internal.payments.savePaymentLinkInternal, {
      caseId: args.caseId,
      paymentLinkUrl: session.url,
      quotedStartAmountCents: amountCents,
    })

    return { url: session.url, amountCents }
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
