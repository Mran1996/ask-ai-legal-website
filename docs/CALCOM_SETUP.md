# Cal.com + Outlook setup (Ask AI Legal)

Connect Cal.com to **Microsoft Outlook / Microsoft 365** for intake call booking after a customer submits the Request Quote form.

## 1. Create Cal.com account

1. Sign up at [cal.com](https://cal.com) with your business Outlook email.
2. **Settings → Calendars → Connect** → **Microsoft Outlook / Office 365**.
3. Set your availability, timezone, and a 10–15 minute buffer between calls.

## 2. Create event types

### v1 — Intake call (ship first)

| Field | Value |
|-------|--------|
| **Name** | Intake call |
| **Duration** | 15–20 minutes |
| **Price** | Free |
| **Description** | Discuss your situation and what documents we can prepare — plus flat-fee pricing. Document preparation and pricing only; not legal advice. |
| **Location** | Microsoft Teams or phone (your choice) |

**Booking questions** (required):

| Question label | Identifier / slug | Required |
|----------------|-------------------|----------|
| Case reference | `case-reference` | Yes |
| Case ID | `caseId` | Hidden if possible, or optional |

The webhook matches bookings to Convex cases using **case reference** (`AAL-…`) or **caseId**.

### v2 — Document planning call (after $499 review)

- 15 min, free, max 3 per case (enforced in Convex when Stripe review payment ships).
- Slug example: `document-planning-call`

### v3 — Follow-up call

- 30 min, **$50** — use Cal.com paid event or Stripe + Cal.com.
- Slug example: `follow-up-call`

## 3. Environment variables

Verify your event is live before setting the slug:

```bash
curl -sI "https://cal.com/ask-ai-legal/intake-call" | head -1
# HTTP/2 200 — good. HTTP/2 404 — fix username/slug in Cal.com first.
```

### Next.js / Vercel (`.env.local` / Vercel dashboard)

```bash
NEXT_PUBLIC_SITE_URL=https://askailegal.com
# Cal.com event path, e.g. ask-ai-legal/intake-call (must return HTTP 200 at https://cal.com/<slug>)
NEXT_PUBLIC_CALCOM_INTAKE_EVENT_SLUG=ask-ai-legal/intake-call
```

### Convex (production)

```bash
npx convex env set PUBLIC_SITE_URL https://askailegal.com
npx convex env set CALCOM_WEBHOOK_SECRET your-long-random-secret
```

`PUBLIC_SITE_URL` is used in intake emails for `/book?…` links.

## 4. Webhook (Convex)

1. Convex dashboard → your deployment → **Settings** → copy **HTTP Actions URL**  
   (e.g. `https://robust-wombat-16.convex.site`)
2. In Cal.com: **Settings → Developer → Webhooks → New**
   - **URL:** `https://<deployment>.convex.site/calcom-webhook`
   - **Events:** `BOOKING_CREATED`, `BOOKING_CANCELLED`, `BOOKING_RESCHEDULED`
   - **Custom header:** `Authorization: Bearer <same as CALCOM_WEBHOOK_SECRET>`

When a client books, Convex:

- Saves an `appointments` row linked to the case
- Emails `support@askailegal.com` with date/time and meeting link
- Shows the call on `/ops/intakes/[caseId]`

## 5. Test flow

1. Submit Request Quote on askailegal.com.
2. Click **Book your intake call** in the success banner (or use the link in the confirmation email).
3. Complete booking on `/book`.
4. Confirm in Outlook calendar and ops dashboard.

## 6. Compliance copy

Use on the Cal.com event and `/book` page:

> Ask AI Legal is not a law firm. This call is for document preparation and pricing only — not legal advice.

Do **not** use “scope” or “legal consultation” in customer-facing call labels.
