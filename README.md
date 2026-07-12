# Ask AI Legal — Web

Next.js marketing site + chat intake for document-preparation services (not a law firm).

## Local development

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev:convex           # terminal 1 — Convex backend
npm run dev                  # terminal 2 — http://localhost:3000
```

Or: `npm run dev:all`

## Deploy to Vercel

See **[docs/VERCEL_DEPLOY.md](docs/VERCEL_DEPLOY.md)** for full steps (GitHub → Vercel → Convex env vars).

```bash
npm run deploy:check    # verify build
npm run deploy:convex   # push Convex backend
npx vercel --prod       # optional CLI deploy
```

## Docs

- [Product spec](docs/ASK_AI_LEGAL_SPEC.md)
- [Phase 1 architecture](docs/PHASE_1_ARCHITECTURE.md)
- [Build progress](docs/BUILD_PROGRESS.md)
