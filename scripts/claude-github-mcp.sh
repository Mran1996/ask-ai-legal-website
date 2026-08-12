#!/usr/bin/env bash
# Deprecated wrapper — run setup-claude-github.sh once, then use ~/bin launcher.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "${SCRIPT_DIR}/claude-github-mcp-launcher.sh"
