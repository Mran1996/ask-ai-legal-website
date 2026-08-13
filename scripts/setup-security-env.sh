#!/usr/bin/env bash
# Print Convex security env set commands (dry-run).
# To apply automatically, use: ./scripts/apply-security-env.sh --prod
# Usage: ./scripts/setup-security-env.sh [--prod]
set -euo pipefail

PROD_FLAG=""
if [[ "${1:-}" == "--prod" ]]; then
  PROD_FLAG=" --prod"
fi

CALCOM_SECRET="$(openssl rand -hex 32)"
RESEND_SECRET="$(openssl rand -hex 32)"
COUNSEL="${COUNSEL_EMAILS:-support@askailegal.com}"

cat <<EOF
# Run these after: npx convex login

npx convex env set CALCOM_WEBHOOK_SECRET "${CALCOM_SECRET}"${PROD_FLAG}
npx convex env set RESEND_INBOUND_WEBHOOK_SECRET "${RESEND_SECRET}"${PROD_FLAG}
npx convex env set COUNSEL_EMAILS "${COUNSEL}"${PROD_FLAG}

# Cal.com webhook: Authorization: Bearer \${CALCOM_WEBHOOK_SECRET}
#   or header x-cal-webhook-secret
# Resend inbound: Bearer \${RESEND_INBOUND_WEBHOOK_SECRET}
#   or header x-resend-inbound-secret

# After setting, redeploy Convex:
#   npm run deploy:convex:prod
EOF
