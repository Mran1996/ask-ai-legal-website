# Email quote → contract → invoice flow

Ask AI Legal fulfills **document generation only** (not a law firm). Payment happens **off-site** via emailed Stripe invoice / Payment Link — not a Pay button on the website or contact section.

## Order of operations

1. **Intake** — Request Quote / chat: problem + contact (+ optional uploads).
2. **Auto Part 1 Word** — Convex emails letterhead **Case Intake Questionnaire – Part 1** (matches `docs/templates/Ask_AI_Legal_Case_Intake_Part1_Professional.docx`). Ops can resend from case detail.
3. **Client returns Part 1** — replies to `support@askailegal.com` with completed Word + docs (keep `AAL-…` in subject).
4. **Auto acknowledgment** — Resend inbound webhook → Convex marks `formReturnedAt`, emails client “we received your Part 1 / will be in touch / may need more docs”, notifies ops.
5. **Issues + invoice package** — Ops pastes issues list + Stripe Payment Link + amount → emails start scope/cost.
6. **Paid** — Ops **Mark paid (manual)** after Stripe clears.
7. **Work → Deliver** — Only after paid.

Part 2 (deeper questions) is **not** auto-sent with Part 1.

## Inbound email setup (Resend)

1. In Resend: enable **Receiving** for `support@askailegal.com` (or forwarding domain).
2. Webhook URL: `https://robust-wombat-16.convex.site/resend-inbound`
3. Optional secret:
   ```bash
   npx convex env set RESEND_INBOUND_WEBHOOK_SECRET "$(openssl rand -hex 24)" --prod
   ```
   Send as `Authorization: Bearer …` or header `x-resend-inbound-secret`.

Until inbound is connected, use ops **Mark form returned + send ack**.

## Case / ops fields

| Field | Meaning |
|-------|---------|
| `personalizedFormSentAt` | Part 1 Word emailed |
| `formReturnedAt` | Client returned form |
| `formReceivedAckSentAt` | Receipt acknowledgment emailed |
| `contractInvoiceSentAt` | Issues + invoice package emailed |
| `paidAt` | Payment noted |
| `paymentLinkUrl` | Stripe Payment Link / invoice URL |

## Pricing (chat planning estimate)

- Maintained reference rows per matter type (not midpoint-of-attorney-range).
- Ask AI Legal doc-prep quote uses template price + state factor + issue fingerprint so unrelated matters do not share identical `$1,999` clones.
- Attorney low–high is a typical market reference for the state/matter.
- Final package price is confirmed after Part 1 review in the emailed invoice.

## Outlook

See `docs/OUTLOOK_CLIENT_FILING.md`. Every client email subject includes `AAL-…` so rules/Power Automate can file mail into `Clients/{LastName}-{AAL}/`.

## Email branding (Resend)

```bash
npx convex env set RESEND_FROM_EMAIL "Ask AI Legal <support@askailegal.com>" --prod
npx convex env set PUBLIC_SITE_URL https://askailegal.com --prod
# Optional Google Business Profile review link:
# npx convex env set GOOGLE_REVIEW_URL "https://g.page/r/YOUR_PLACE_ID/review" --prod
```

## Source of truth

**Convex `/ops/intakes/[caseId]`** is primary. Outlook folders mirror filing for humans.
