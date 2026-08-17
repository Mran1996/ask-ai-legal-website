# AGENTS.md

Project-level guidance for AI agents. See also `README.md`, `CLAUDE.md`, and `docs/` (start with `docs/ASK_AI_LEGAL_SPEC.md` and `docs/PHASE_1_ARCHITECTURE.md`).

## Cursor Cloud specific instructions

This is a **Next.js 16 (App Router, React 19, Turbopack) + Convex** app. Dependencies are installed by the startup update script (`npm install`); the notes below cover only the non-obvious bits of running it here.

### Services

Two long-running processes are needed for the full product to work locally. Run each in its own `tmux` session (never `npm run dev:all`, which backgrounds Convex and hides its interactive prompt).

| Service | Command | Port | Notes |
| --- | --- | --- | --- |
| Convex backend | `CONVEX_AGENT_MODE=anonymous npx convex dev` | 3210 (HTTP actions 3211) | Required for intake, cases, estimates, uploads, ops. See Convex notes below. |
| Next.js web app | `npm run dev` | 3000 | Marketing site + chat widget. Renders even if Convex is down (provider no-ops), but intake/quote needs Convex. |

- The site still boots without Convex, but any case/intake/estimate action needs the Convex backend running.
- All third-party integrations (chat LLM via `CHAT_MODEL_PROVIDER`, Stripe, Resend email, Cal.com, PostHog, Meta Pixel, Microsoft Graph) are **optional** and degrade gracefully with no keys — chat falls back to a static FAQ, email/notifications no-op, pricing/estimates are computed locally. Server-side secrets belong on the Convex deployment (`npx convex env set …`), not in `.env.local`.

### Convex local backend (important gotchas)

- Start it with `CONVEX_AGENT_MODE=anonymous npx convex dev` — this spins up an isolated local backend with **no login required** (there are no Convex credentials in this environment). Plain `npx convex dev` would try to log in and hang.
- **First run is interactive.** It downloads a backend binary and then prompts `Set up Convex AI files? (Y/n)`. Answer **`n`** (sending `n` + Enter) so it does not scaffold/overwrite `AGENTS.md`, guidelines, or skills. After that it deploys functions and prints `Convex functions ready!`.
- On startup it writes `.env.local` (gitignored) with `NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210`, `NEXT_PUBLIC_CONVEX_SITE_URL=http://127.0.0.1:3211`, and `CONVEX_DEPLOYMENT=anonymous:anonymous-agent`. Next.js reads `NEXT_PUBLIC_CONVEX_URL` via `components/convex-client-provider.tsx`.
- `convex dev` regenerates `convex/_generated/api.d.ts`; **do not commit** that churn.
- Inspect data with e.g. `CONVEX_AGENT_MODE=anonymous npx convex data cases`.

### Lint / typecheck / test / build

- **`npm run lint` is broken** in the current repo state: it runs `next lint`, which Next.js 16 removed, so it errors with `Invalid project directory provided, no such directory: /workspace/lint`. There is no ESLint config or `eslint` dependency. Use **`npx tsc --noEmit`** as the type/lint gate instead (passes clean).
- Tests: there is no `test` npm script. Run **`npx vitest run`** (unit tests over `convex/lib/*` pricing/intake helpers; needs no services).
- Build: `npm run build` (Next production build). `npm run deploy:check` runs `build && lint` and will hit the same broken-lint issue above.

### Next.js CLAUDE.md regeneration

`npm run dev` (Next 16 `agentRules`) **regenerates `CLAUDE.md`** on start, overwriting the committed project guide. If you see `CLAUDE.md` modified in `git status` after starting the dev server, restore it with `git checkout -- CLAUDE.md`.

### Hello-world / smoke test

Open http://localhost:3000 → click the chat FAB (bottom-right) → pick **English** → open the **Request Quote** tab → fill the intake form (name, email, State = California, an eviction/"Housing / eviction" matter type, issue text) → **Submit intake**. Success shows a `AAL-XXXXXXXX` case reference and a planning estimate. This creates a `cases` row (`matterType: ca_unlawful_detainer`, `status: estimate_sent`) in the local Convex backend.
