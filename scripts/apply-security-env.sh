#!/usr/bin/env bash
# Apply security env vars to Convex prod and redeploy.
# Requires CONVEX_DEPLOY_KEY (CI / agent) or `npx convex login` (local).
# Usage: ./scripts/apply-security-env.sh [--prod]
set -euo pipefail
cd "$(dirname "$0")/.."

PROD_FLAG=""
DEPLOYMENT="${CONVEX_PROD_DEPLOYMENT:-prod:robust-wombat-16}"
CONVEX_SITE="https://robust-wombat-16.convex.site"

if [[ "${1:-}" == "--prod" ]] || [[ "${1:-}" == "" ]]; then
  PROD_FLAG=" --prod"
fi

convex_authed() {
  if [[ -n "${CONVEX_DEPLOY_KEY:-}" ]]; then
    return 0
  fi
  CONVEX_DEPLOYMENT="$DEPLOYMENT" npx convex env list ${PROD_FLAG} >/dev/null 2>&1
}

if ! convex_authed; then
  cat >&2 <<'EOF'
error: Convex is not authenticated.

Option 1 — local (Mac Terminal):
  npx convex login
  ./scripts/apply-security-env.sh --prod

Option 2 — deploy key (CI / Cursor Agent):
  Export CONVEX_DEPLOY_KEY from Convex dashboard → robust-wombat-16 → Settings → Deploy Key
  CONVEX_DEPLOY_KEY='prod:…' ./scripts/apply-security-env.sh --prod

Option 3 — GitHub Actions:
  Add CONVEX_DEPLOY_KEY to repo secrets, then run workflow "Convex Security Setup"
EOF
  exit 1
fi

CALCOM_SECRET="$(openssl rand -hex 32)"
RESEND_SECRET="$(openssl rand -hex 32)"
COUNSEL="${COUNSEL_EMAILS:-support@askailegal.com}"

echo "→ Setting Convex security env vars on prod…"
export CONVEX_DEPLOYMENT="$DEPLOYMENT"
npx convex env set CALCOM_WEBHOOK_SECRET "$CALCOM_SECRET" ${PROD_FLAG}
npx convex env set RESEND_INBOUND_WEBHOOK_SECRET "$RESEND_SECRET" ${PROD_FLAG}
npx convex env set COUNSEL_EMAILS "$COUNSEL" ${PROD_FLAG}

echo "→ Deploying Convex prod…"
./scripts/deploy-convex.sh --prod

OUTFILE="security-env.local.txt"
cat > "$OUTFILE" <<EOF
# Generated $(date -u +"%Y-%m-%dT%H:%M:%SZ") — DO NOT COMMIT
# Paste these into Cal.com and Resend dashboards, then delete this file.

CALCOM_WEBHOOK_SECRET=${CALCOM_SECRET}
RESEND_INBOUND_WEBHOOK_SECRET=${RESEND_SECRET}
COUNSEL_EMAILS=${COUNSEL}

--- Cal.com (Settings → Developer → Webhooks → New) ---
URL: ${CONVEX_SITE}/calcom-webhook
Events: BOOKING_CREATED, BOOKING_CANCELLED, BOOKING_RESCHEDULED
Header: Authorization: Bearer ${CALCOM_SECRET}
  (or header x-cal-webhook-secret: ${CALCOM_SECRET})

--- Resend (Receiving → Webhook for support@askailegal.com) ---
URL: ${CONVEX_SITE}/resend-inbound
Header: Authorization: Bearer ${RESEND_SECRET}
  (or header x-resend-inbound-secret: ${RESEND_SECRET})
EOF

chmod 600 "$OUTFILE"
echo ""
echo "✓ Convex env vars set and prod deployed."
echo "✓ Webhook credentials written to ${OUTFILE} (gitignored)."
echo "  Next: paste Cal.com + Resend settings from that file into their dashboards."
