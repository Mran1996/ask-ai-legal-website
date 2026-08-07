#!/usr/bin/env bash
# Verify this folder is the canonical ask-ai-legal-website repo.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

EXPECTED_ORIGIN="https://github.com/Mran1996/ask-ai-legal-website.git"
ORIGIN="$(git remote get-url origin 2>/dev/null || true)"

echo "=== Ask AI Legal repo verification ==="
echo "Local path: $REPO_ROOT"
echo "Origin:     ${ORIGIN:-MISSING}"
echo "Branch:     $(git branch --show-current)"
echo "Status:     $(git status -sb | head -1)"

if [[ "$ORIGIN" == "$EXPECTED_ORIGIN" ]] || [[ "$ORIGIN" == "${EXPECTED_ORIGIN%.git}" ]]; then
  echo "RESULT: OK — connected to ask-ai-legal-website"
  exit 0
fi

echo "RESULT: FAIL — wrong or missing origin (expected $EXPECTED_ORIGIN)"
exit 1
