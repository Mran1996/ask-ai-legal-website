# Convex security setup (one-time)

After the security hardening merge, production webhooks **reject** unauthenticated requests. Complete this once.

## Prerequisites

- Convex production deployment: **robust-wombat-16**
- Convex deploy key **or** `npx convex login` on your Mac

## Fastest path (Mac Terminal)

```bash
cd "/Users/sylasp/ask ai legal web"
git pull origin main
npx convex login
./scripts/apply-security-env.sh --prod
```

This sets `CALCOM_WEBHOOK_SECRET`, `RESEND_INBOUND_WEBHOOK_SECRET`, and `COUNSEL_EMAILS=support@askailegal.com`, deploys Convex prod, and writes **`security-env.local.txt`** (gitignored) with values for Cal.com and Resend.

## Alternative: GitHub Actions

1. Convex dashboard → **robust-wombat-16** → Settings → **Deploy Key** → copy production key
2. GitHub → repo **Settings → Secrets → Actions** → add `CONVEX_DEPLOY_KEY`
3. GitHub → **Actions** → **Convex Security Setup** → **Run workflow**
4. Download the **webhook-setup** artifact from the run — it contains Cal.com and Resend header values

## Alternative: Cursor local Agent + Convex MCP

1. Open project in **Cursor on your Mac** (not Cloud Agent)
2. **Settings → MCP → Convex** → Sign in
3. Ask Agent: *"Run `./scripts/apply-security-env.sh --prod`"*

## Cal.com webhook

**Settings → Developer → Webhooks → New**

| Field | Value |
|-------|--------|
| URL | `https://robust-wombat-16.convex.site/calcom-webhook` |
| Events | `BOOKING_CREATED`, `BOOKING_CANCELLED`, `BOOKING_RESCHEDULED` |
| Header | `Authorization: Bearer <CALCOM_WEBHOOK_SECRET>` |

See also [`docs/CALCOM_SETUP.md`](CALCOM_SETUP.md).

## Resend inbound webhook

**Resend → Receiving** (for `support@askailegal.com`)

| Field | Value |
|-------|--------|
| URL | `https://robust-wombat-16.convex.site/resend-inbound` |
| Header | `Authorization: Bearer <RESEND_INBOUND_WEBHOOK_SECRET>` |

See also [`docs/PAY_QUOTE_DELIVER_FLOW.md`](PAY_QUOTE_DELIVER_FLOW.md).

## Verify

```bash
# Should return 401 without Bearer token after setup:
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://robust-wombat-16.convex.site/calcom-webhook
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Content-Type: application/json" -d '{}' \
  https://robust-wombat-16.convex.site/resend-inbound
```

With correct `Authorization: Bearer …` header, Cal.com should return **200**; Resend with a valid payload should return **200** (not 401).
