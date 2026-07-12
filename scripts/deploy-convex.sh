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
  npx convex deploy --prod
else
  npx convex deploy
fi

echo ""
echo "✓ Convex deployed. Copy deployment URL to Vercel:"
echo "  NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud"
echo "  NEXT_PUBLIC_CONVEX_SITE_URL=https://<your-deployment>.convex.site"
echo ""
echo "Set Convex secrets (if not already):"
echo "  npx convex env set RESEND_API_KEY re_..."
echo "  npx convex env set RESEND_FROM_EMAIL 'Ask AI Legal <notifications@yourdomain.com>'"
echo "  npx convex env set OPS_ACCESS_TOKEN <secret>"
