# Claude Desktop / Cowork — GitHub access fix

## Quick fix (run this)

```bash
cd "/Users/sylasp/ask ai legal web"
./scripts/setup-claude-github.sh
```

Then **Cmd+Q** to quit Claude completely, reopen, and start a **new** Cowork session.

## What was wrong

Cowork’s **Github** connector (`api.githubcopilot.com/mcp`) uses OAuth that only saw **`cleanmain`** (public). Changing **github.com/settings/installations → All repositories** does **not** fix that — it is a different GitHub App.

## What the script does

1. Installs official `github-mcp-server` + launcher using your **`gh auth token`**
2. Configures **HTTP** GitHub MCP in Claude Desktop (`claude_desktop_config.json`) with Bearer auth — verified to read private repos
3. Writes `.mcp.json` for Cowork (`~/Claude/` and this repo)
4. Disables the broken OAuth **Github** connector in Cowork session files where possible

## Verify

Ask Claude in a new Cowork session: *“List files in Mran1996/ask-ai-legal-website”*

## If it still fails

1. Claude Desktop → **Settings → Connectors** → **remove** remote **Github**
2. Run `./scripts/setup-claude-github.sh` again
3. Cmd+Q, reopen, **new** Cowork session (not an old “Drafting 2” tab)

## Repos

| Repo | Purpose |
|------|---------|
| `Mran1996/ask-ai-legal-website` | Canonical website + Convex |
| `Mran1996/ask-ai-legal-deployment` | Deployment (optional) |

**Do not use:** `cleanmain`, `ask-ai-legal-work`
