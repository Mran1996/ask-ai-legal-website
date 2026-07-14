# Email quote → contract → invoice flow

Ask AI Legal fulfills **document generation only** (not a law firm). Payment happens **off-site** via emailed Stripe invoice / Payment Link — not a Pay button on the website or contact section.

## Order of operations

1. **Intake** — Request Quote / chat: problem + contact (+ optional uploads).
2. **Details** — Case/docket # + docs upload + optional “need retrieval” (quoted later; never free unpaid work).
3. **Personalized intake form** — Ops emails letterhead-style form (`Email personalized intake form` in `/ops`).
4. **Form returned** — Ops marks form returned when client replies.
5. **Quote package email** — Ops pastes Stripe Payment Link, scope, amount → emails cost + agreement summary + invoice link.
6. **Paid** — Ops **Mark paid (manual)** after Stripe clears (or webhook if Checkout is used later).
7. **Work → Deliver** — Only after paid.

## Case / ops fields

| Field | Meaning |
|-------|---------|
| `personalizedFormSentAt` | Form email sent |
| `formReturnedAt` | Client returned form |
| `contractInvoiceSentAt` | Quote/contract/invoice email sent |
| `paidAt` | Payment noted |
| `paymentLinkUrl` | Stripe Payment Link / invoice URL |

## Stripe (email Payment Links — not chat checkout)

- Chat UI does **not** call Stripe Checkout.
- Create a **Payment Link** or Invoice in Stripe Dashboard → paste URL in ops when sending the quote package.
- Optional future: reuse `convex/stripeActions.ts` webhook if you switch links to Checkout sessions.

Convex env (if using Checkout webhook later):

```bash
npx convex env set STRIPE_SECRET_KEY sk_...
npx convex env set STRIPE_WEBHOOK_SECRET whsec_...
npx convex env set PUBLIC_SITE_URL https://askailegal.com
```

## Outlook

See `docs/OUTLOOK_CLIENT_FILING.md`. Every client email subject includes `AAL-…` so rules can file mail.

## Source of truth

**Convex `/ops/intakes/[caseId]`** is primary. Outlook folders mirror filing for humans.
