#!/usr/bin/env python3
"""Disable broken Cowork Github OAuth connector; enable PAT-based HTTP MCP."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

BROKEN_UUID = "bccd186f-16ce-4674-9465-af4f2319db8d"
MCP_URL = "https://api.githubcopilot.com/mcp/"
WEBSITE_PROJECT = "/Users/sylasp/ask ai legal web"


def gh_token() -> str:
    return subprocess.check_output(["gh", "auth", "token"], text=True).strip()


def github_http_server(token: str) -> dict:
    return {
        "type": "http",
        "url": MCP_URL,
        "headers": {"Authorization": f"Bearer {token}"},
    }


def patch_sessions(sessions_root: Path) -> int:
    patched = 0
    for path in sessions_root.rglob("*.json"):
        if "outputs" in path.parts or path.name.endswith(".jsonl"):
            continue
        try:
            data = json.loads(path.read_text())
        except (json.JSONDecodeError, OSError):
            continue
        if not isinstance(data, dict):
            continue

        changed = False
        remote = data.get("remoteMcpServersConfig")
        if isinstance(remote, list):
            filtered = [r for r in remote if r.get("uuid") != BROKEN_UUID]
            if len(filtered) != len(remote):
                data["remoteMcpServersConfig"] = filtered
                changed = True

        tools = data.get("enabledMcpTools")
        if isinstance(tools, dict):
            for key in list(tools):
                if key.startswith(f"{BROKEN_UUID}:") and tools[key]:
                    tools[key] = False
                    changed = True

        if changed:
            path.write_text(json.dumps(data, indent=2) + "\n")
            patched += 1
    return patched


def main() -> int:
    token = gh_token()
    http_cfg = github_http_server(token)
    launcher = str(Path.home() / "bin/claude-github-mcp-launcher.sh")

    desktop = Path.home() / "Library/Application Support/Claude/claude_desktop_config.json"
    desktop_data = json.loads(desktop.read_text()) if desktop.exists() else {}
    servers = desktop_data.setdefault("mcpServers", {})
    servers["github"] = http_cfg
    servers["github-local"] = {"command": launcher, "args": []}
    desktop.parent.mkdir(parents=True, exist_ok=True)
    desktop.write_text(json.dumps(desktop_data, indent=2) + "\n")
    print(f"Updated {desktop}")

    claude_json = Path.home() / ".claude.json"
    if claude_json.exists():
        cj = json.loads(claude_json.read_text())
        cj.setdefault("mcpServers", {})["github-private"] = http_cfg
        proj = cj.setdefault("projects", {}).setdefault(WEBSITE_PROJECT, {})
        proj["mcpServers"] = {"github-private": http_cfg}
        proj["enabledMcpjsonServers"] = ["github-private"]
        claude_json.write_text(json.dumps(cj, indent=2) + "\n")
        print(f"Updated {claude_json}")

    cowork_mcp = Path.home() / "Claude/.mcp.json"
    cowork_mcp.parent.mkdir(parents=True, exist_ok=True)
    cowork_mcp.write_text(
        json.dumps({"mcpServers": {"github-private": http_cfg}}, indent=2) + "\n"
    )
    print(f"Wrote {cowork_mcp}")

    repo_mcp = Path(WEBSITE_PROJECT) / ".mcp.json"
    repo_mcp.write_text(
        json.dumps({"mcpServers": {"github-private": http_cfg}}, indent=2) + "\n"
    )
    print(f"Wrote {repo_mcp}")

    sessions_root = Path.home() / "Library/Application Support/Claude/local-agent-mode-sessions"
    count = patch_sessions(sessions_root) if sessions_root.exists() else 0
    print(f"Disabled broken OAuth Github connector in {count} Cowork session file(s)")
    print("Quit Claude (Cmd+Q), reopen, and start a new Cowork session.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
