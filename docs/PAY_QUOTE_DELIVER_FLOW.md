# Email quote → contract → invoice flow

Ask AI Legal fulfills **document generation only** (not a law firm). Payment happens **off-site** via emailed Stripe Checkout / Payment Link — not a Pay button on the website.

## Order of operations

1. **Intake** — Request Quote / chat: problem + contact (+ optional uploads).
2. **Auto Part 1 Word** — letterhead Case Intake Questionnaire – Part 1 emailed; questions are **matter-specific** (family, eviction, civil, criminal, demand letter, etc.) from case type / issue — not a fixed divorce form.
3. **Client returns Part 1** — to `support@askailegal.com` with `AAL-…` in subject.
4. **Auto acknowledgment** — Resend inbound → marks `formReturnedAt`, emails client receipt ack, notifies ops.
5. **Gap questions (auto)** — If key facts/docs are missing, Convex emails the client numbered questions (facts/attachments only). Status: `gapQuestionsStatus` = `sent` → `answered` on next inbound reply (or ops mark). If nothing critical is missing → `none_needed`.
6. **LLM draft (ops only)** — Convex drafts “documents we can prepare” → saves `draftIssuesSummary` → emails **ops** (`OPS_NOTIFY_EMAIL` or support) with deep link to `/ops`. **Never auto-sends this draft to the client.**
7. **Human approve** — Ops edits draft, **must** generate/paste Stripe pay link ($499 fixed deposit), **Approve & send** → client gets issues + agreement (no refunds) + invoice/pay URL. Approve is blocked without a pay link.
8. **Paid** — Client pays $499 deposit (Stripe Checkout or manual mark) → status advances → **Outlook folder** created. Deposit ≠ full payment; balance is tracked on the estimate.
9. **Work → Deliver** — Only after paid **and** licensed counsel approves the final document (`counselReviews` table). Delivery without counsel approval is blocked server-side.

Part 2 is **not** auto-sent with Part 1.

## Inbound email setup (Resend)

1. Enable **Receiving** for `support@askailegal.com`.
2. Webhook: `https://robust-wombat-16.convex.site/resend-inbound`
3. Optional secret:
   ```bash
   npx convex env set RESEND_INBOUND_WEBHOOK_SECRET "$(openssl rand -hex 24)" --prod
   ```
   Header: `Authorization: Bearer …` or `x-resend-inbound-secret`.

Until inbound is connected, use ops **Mark form returned + send ack** (still triggers LLM draft).

## Ops notify + LLM

```bash
npx convex env set OPS_NOTIFY_EMAIL "you@askailegal.com" --prod
npx convex env set OPENAI_API_KEY "sk-…" --prod   # optional; fallback template draft if missing
npx convex env set OPENAI_MODEL "gpt-4o-mini" --prod
```

## Case / ops fields

| Field | Meaning |
|-------|---------|
| `personalizedFormSentAt` | Part 1 Word emailed |
| `formReturnedAt` | Client returned form |
| `formReceivedAckSentAt` | Receipt acknowledgment emailed |
| `gapQuestionsSummary` / `gapQuestionsStatus` / `gapQuestionsSentAt` | Auto missing-info email (`none_needed` \| `sent` \| `answered`) |
| `draftIssuesSummary` / `draftPackageStatus` | LLM/ops draft awaiting approval |
| `contractInvoiceSentAt` | Issues + agreement + invoice emailed (after approve) |
| `paidAt` | Payment noted |
| `paymentLinkUrl` | Stripe Checkout / Payment Link (**required** for Approve & send) |
| `quotedStartAmountCents` | Start fee (default 49999 = $499.99) |
| `outlookFolderPath` | Outlook Clients/… folder after paid |

## Agreement

Client package links to: `https://askailegal.com/document-preparation-agreement`  
Paying accepts that Document Preparation Service Agreement (v1 — no DocuSign required). **Fees are non-refundable once paid** (except where required by law), mirrored in Terms §7 and the contract/invoice email.

## Pricing (chat planning estimate)

- Matter signature reuse; no identical midpoint clones.
- Final start package confirmed in emailed invoice after Part 1 + human approve.

## Outlook

See `docs/OUTLOOK_CLIENT_FILING.md`. Mark paid triggers Graph folder create when `MICROSOFT_GRAPH_*` is set; otherwise stub path + Power Automate Flow B.

## Source of truth

**Convex `/ops/intakes/[caseId]`** is primary. Outlook mirrors filing for humans.
