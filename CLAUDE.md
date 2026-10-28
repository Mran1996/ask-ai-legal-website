# Ask AI Legal Web — Claude / Cowork project guide

## GitHub (canonical — use this repo only)

| | |
|---|---|
| **Owner** | `Mran1996` |
| **Repository** | `ask-ai-legal-website` |
| **URL** | https://github.com/Mran1996/ask-ai-legal-website |
| **Local path** | `C:\Users\Gwada\ask-ai-legal-website` |
| **Default branch** | `main` |

**Do not use:** `cleanmain`, `ask-ai-legal-work`, or `C:\Users\Gwada\Ask AI legal Auto` for code changes (that folder is handoff docs only, not git).

Deployment repo (separate): `Mran1996/ask-ai-legal-deployment`

## Environment — Windows

This project runs on **Windows**, shell is **PowerShell**. It was migrated from macOS; if you find a `/Users/sylasp/...` path anywhere, it is stale — report it.

- **Paths** are `C:\Users\Gwada\...`. In `.json` files use forward slashes (`C:/Users/Gwada/...`) — a backslash is an escape character in JSON and will make the file invalid.
- **`scripts/*.sh` are bash and do not run in PowerShell.** Invoke them as `bash ./scripts/<name>.sh` (Git Bash ships with Git for Windows). Do not assume `./script.sh` works.
- **No Homebrew.** Install tooling with `winget` (e.g. `winget install --id GitHub.cli --exact`).
- **Quitting Claude** means right-click the tray icon → Quit, or Alt+F4. There is no Cmd+Q.

### Verify before any edit or push

```powershell
cd "C:\Users\Gwada\ask-ai-legal-website"
git remote -v
git branch --show-current
git status -sb
```

Expected `origin`: `https://github.com/Mran1996/ask-ai-legal-website.git`

GitHub MCP must read **`Mran1996/ask-ai-legal-website`** (private). Run the fix script (uses your `gh` token — full private repo access):

```bash
bash ./scripts/setup-claude-github.sh
```

Then **fully quit** Claude (right-click the tray icon → Quit, or Alt+F4), reopen, and start a **new** Cowork session. If the broken remote connector returns, remove **Github** under Settings → Connectors.

See `docs/CLAUDE_GITHUB_SETUP.md`.

## Product

Ask AI Legal LLC — document preparation (not a law firm). Website: **askailegal.com**. Backend: **Convex**. Phase 1: CA unlawful detainer / web chat intake.

Read `docs/ASK_AI_LEGAL_SPEC.md` before architectural decisions.

## Stack

- Next.js (App Router), TypeScript, Tailwind, Convex
- Dev: `npm run dev` + `npx convex dev`
- Deploy: Vercel (frontend), `npx convex deploy` (backend)

## Brand

See `design-reference/DESIGN_SYSTEM.md`. Marketing site uses navy/gold palette in current `app/` (not legacy cleanmain emerald).

## Non-negotiables

1. Counsel review gate — no client-facing legal output without attorney approval
2. UPL framing — document prep / self-help, not a law firm
3. Phase 1 flow: intake → estimate → payment → draft → counsel review → delivery

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.
