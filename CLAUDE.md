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

GitHub MCP / connector must be able to read **`Mran1996/ask-ai-legal-website`** (private). If 404, fix at https://github.com/settings/installations → Claude app → grant access to this repo.

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
