# Ask AI Legal Web — Claude / Cowork project guide

## GitHub (canonical — use this repo only)

| | |
|---|---|
| **Owner** | `Mran1996` |
| **Repository** | `ask-ai-legal-website` |
| **URL** | https://github.com/Mran1996/ask-ai-legal-website |
| **Local path** | `/Users/sylasp/ask ai legal web` |
| **Default branch** | `main` |

**Do not use:** `cleanmain`, `ask-ai-legal-work`, or `/Users/sylasp/Ask AI legal Auto` for code changes (that folder is handoff docs only, not git).

Deployment repo (separate): `Mran1996/ask-ai-legal-deployment`

### Verify before any edit or push

```bash
cd "/Users/sylasp/ask ai legal web"
git remote -v
git branch --show-current
git status -sb
```

Expected `origin`: `https://github.com/Mran1996/ask-ai-legal-website.git`

GitHub MCP must read **`Mran1996/ask-ai-legal-website`** (private). Run the fix script (uses your `gh` token — full private repo access):

```bash
./scripts/setup-claude-github.sh
```

Then **Cmd+Q** Claude, reopen, and start a **new** Cowork session. If the broken remote connector returns, remove **Github** under Settings → Connectors.

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
