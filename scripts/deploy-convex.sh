#!/usr/bin/env bash
# Deploy Convex backend (run before or during Vercel deploy).
# Usage: ./scripts/deploy-convex.sh [--prod]
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v npx >/dev/null 2>&1; then
  echo "error: npx not found" >&2
  exit 1
fi

echo "→ Deploying Convex functions..."
if [[ "${1:-}" == "--prod" ]]; then
  # Target production (robust-wombat-16) without interactive confirm.
  # Override local CONVEX_DEPLOYMENT=local:... from .env.local.
  CONVEX_DEPLOYMENT="${CONVEX_PROD_DEPLOYMENT:-prod:robust-wombat-16}" npx convex deploy
else
  npx convex deploy
fi

echo ""
echo "✓ Convex deployed. Copy deployment URL to Vercel:"
echo "  NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud"
echo "  NEXT_PUBLIC_CONVEX_SITE_URL=https://<your-deployment>.convex.site"
echo ""
echo "Set Convex secrets (if not already):"
echo "  npx convex env set RESEND_API_KEY re_... --prod"
echo "  npx convex env set RESEND_FROM_EMAIL 'Ask AI Legal <support@askailegal.com>' --prod"
echo "  npx convex env set OPS_ACCESS_TOKEN <secret> --prod"
echo "  # Optional: npx convex env set GOOGLE_REVIEW_URL 'https://g.page/r/…/review' --prod"
