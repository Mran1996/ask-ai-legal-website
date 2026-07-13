# Pay → Quote → Deliver flow

Ask AI Legal fulfills **document generation only** (not a law firm; no attorney/counsel gate in this product loop).

## Order of operations

1. **Intake** — Request Quote / chat form creates a Case + Estimate.
2. **Quote** — Client sees document-prep start price (+ optional **document retrieval** add-on).
3. **Pay** — Stripe Checkout for prep + retrieval (if selected). No work until paid.
4. **Work** — Ops retrieves records if paid; prepares documents (manual retrieval for now).
5. **Deliver** — Ops marks delivered; client gets email.

## Pricing lines

| Line | Source |
|------|--------|
| Document preparation | Estimate package price, or **$499** case file review when the estimate is a custom-quote / $0 package |
| Document retrieval | Flat **$99** placeholder (`DOCUMENT_RETRIEVAL_FEE_USD` in `lib/site-config.ts` + `convex/lib/quoteTotal.ts`) — ops-fulfilled; no court API yet |

Update both constants together if you change the fee.

## Case statuses

| Status | Meaning |
|--------|---------|
| `intake` / `estimate_sent` | Prefill / quote shown |
| `awaiting_payment` | Quote locked; waiting for Stripe |
| `awaiting_docs` | Paid, but no uploads and no paid retrieval |
| `in_drafting` | Paid and materials covered (uploads and/or paid retrieval) — work may proceed |
| `delivered` | Package handed off; delivery email sent |

## Stripe (Convex)

Set on **Convex production** (not only Vercel):

```bash
npx convex env set STRIPE_SECRET_KEY sk_live_...   # or sk_test_...
npx convex env set STRIPE_WEBHOOK_SECRET whsec_...
npx convex env set PUBLIC_SITE_URL https://askailegal.com
```

Stripe Dashboard → Developers → Webhooks → Add endpoint:

- **URL:** `https://robust-wombat-16.convex.site/stripe-webhook`  
  (or your deployment’s `*.convex.site` HTTP actions URL)
- **Events:** `checkout.session.completed`

Optional on Vercel: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (not required for hosted Checkout redirect).

## Ops

`/ops/intakes/[caseId]`:

- Payment status + amount
- Retrieval requested Y/N
- Uploaded document list
- **Mark work started** / **Mark delivered (email client)** — both require a paid payment row
