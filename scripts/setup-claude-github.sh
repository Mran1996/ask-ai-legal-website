#!/usr/bin/env bash
# Configure Claude GitHub MCP with private-repo access via gh auth token.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN_DIR="${HOME}/bin"
LAUNCHER="${BIN_DIR}/claude-github-mcp-launcher.sh"
MCP_BINARY="${BIN_DIR}/github-mcp-server"

echo "==> Checking gh login..."
if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  exit 1
fi

echo "==> Verifying private repo access..."
TOKEN="$(gh auth token)"
STATUS="$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/Mran1996/ask-ai-legal-website")"
if [[ "${STATUS}" != "200" ]]; then
  echo "Token cannot read Mran1996/ask-ai-legal-website (HTTP ${STATUS})."
  echo "Run: gh auth refresh -s repo"
  exit 1
fi
echo "    OK — ask-ai-legal-website reachable"

mkdir -p "${BIN_DIR}"

if [[ ! -x "${MCP_BINARY}" ]]; then
  echo "==> Installing github-mcp-server binary..."
  ARCH="$(uname -m)"
  case "${ARCH}" in
    arm64) ASSET="github-mcp-server_Darwin_arm64.tar.gz" ;;
    x86_64) ASSET="github-mcp-server_Darwin_x86_64.tar.gz" ;;
    *) echo "Unsupported arch: ${ARCH}"; exit 1 ;;
  esac
  TMP="$(mktemp -d)"
  gh release download --repo github/github-mcp-server --pattern "${ASSET}" --dir "${TMP}"
  tar -xzf "${TMP}/${ASSET}" -C "${TMP}"
  cp "${TMP}/github-mcp-server" "${MCP_BINARY}"
  chmod +x "${MCP_BINARY}"
  rm -rf "${TMP}"
fi

echo "==> Installing launcher script..."
cp "${REPO_ROOT}/scripts/claude-github-mcp-launcher.sh" "${LAUNCHER}"
chmod +x "${LAUNCHER}"

echo "==> Applying Cowork + Desktop GitHub MCP fix..."
python3 "${REPO_ROOT}/scripts/fix-claude-cowork-github.py"

echo ""
echo "Done. Quit Claude (Cmd+Q), reopen, start a NEW Cowork session."
echo "In Settings → Connectors, remove the remote \"Github\" connector if it reappears."
