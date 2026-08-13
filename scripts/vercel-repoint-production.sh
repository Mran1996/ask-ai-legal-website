#!/usr/bin/env bash
# Repoint ask-ai-legal-deployment-4 to ask-ai-legal-website @ main and deploy.
# Prereq: vercel login (CLI — separate from vercel.com browser session)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TEAM_SCOPE="${VERCEL_TEAM_SCOPE:-sylaspuri-gmailcoms-projects}"
PROJECT="${VERCEL_PROJECT:-ask-ai-legal-deployment-4}"
REPO_URL="https://github.com/Mran1996/ask-ai-legal-website"
PIXEL_ID="776368482218917"

SCOPE_ARGS=(-S "$TEAM_SCOPE")

echo "==> Vercel account"
vercel whoami

echo "==> Link local checkout to $PROJECT (team: $TEAM_SCOPE)"
vercel link --project "$PROJECT" "${SCOPE_ARGS[@]}" --yes

echo "==> Connect Git to website repo"
vercel git connect "$REPO_URL" "${SCOPE_ARGS[@]}" || {
  echo ""
  echo "STOP: vercel git connect failed. Use the dashboard:"
  echo "  $PROJECT → Settings → Git → connect $REPO_URL, production branch main"
  exit 1
}

echo "==> Production env vars"
echo "$PIXEL_ID" | vercel env add NEXT_PUBLIC_META_PIXEL_ID production "${SCOPE_ARGS[@]}" --force 2>/dev/null || \
  echo "$PIXEL_ID" | vercel env add NEXT_PUBLIC_META_PIXEL_ID production "${SCOPE_ARGS[@]}"

echo "==> Existing production env vars (confirm Convex + site URL):"
vercel env ls production "${SCOPE_ARGS[@]}" || true

REQUIRED=(
  NEXT_PUBLIC_CONVEX_URL
  NEXT_PUBLIC_CONVEX_SITE_URL
  NEXT_PUBLIC_SITE_URL
  CHAT_MODEL_PROVIDER
  NVIDIA_API_KEY
)
for name in "${REQUIRED[@]}"; do
  if ! vercel env ls production "${SCOPE_ARGS[@]}" 2>/dev/null | rg -q "$name"; then
    echo "WARNING: missing production env var: $name"
  fi
done

echo "==> Production deploy (no cache)"
vercel --prod --force "${SCOPE_ARGS[@]}"

echo ""
echo "Done. Confirm askailegal.com shows the new deployment in Vercel → Deployments."
