#!/usr/bin/env bash
# GitHub MCP for Claude Desktop/Cowork — uses gh CLI token (full private repo access).
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install: brew install gh && gh auth login" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "gh not logged in. Run: gh auth login" >&2
  exit 1
fi

export GITHUB_PERSONAL_ACCESS_TOKEN="$(gh auth token)"
export PATH="${HOME}/.nvm/versions/node/v24.11.0/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"

exec "${HOME}/bin/github-mcp-server" stdio
