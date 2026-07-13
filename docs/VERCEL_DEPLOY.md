# Deploy Ask AI Legal to Vercel

The **website** runs on Vercel. The **backend** (intake, quotes, email) runs on **Convex cloud**. Local Convex (`127.0.0.1:3210`) does not work in production.

## Architecture

| Component | Host | Required env |
|-----------|------|----------------|
| Next.js app | Vercel | See [Vercel env vars](#vercel-environment-variables) |
| Convex API | `*.convex.cloud` | `NEXT_PUBLIC_CONVEX_URL` on Vercel |
| Intake email | Convex actions | `RESEND_*` on Convex |
| Ops dashboard | `/ops/intakes` | `OPS_ACCESS_TOKEN` on Convex + client |

---

## One-time setup

### 1. Push code to GitHub

```bash
cd "/Users/sylasp/ask ai legal web"
git add .
git commit -m "Add Vercel deployment config"
git push origin <your-branch>
```

Repo: `https://github.com/Mran1996/ask-ai-legal-website`

### 2. Convex cloud (not local)

```bash
npx convex login
npx convex dev --configure   # pick or create a cloud project
```

Note your URLs from the Convex dashboard or `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://<deployment>.convex.site
CONVEX_DEPLOYMENT=dev:<deployment-name>
```

Deploy backend functions:

```bash
npm run deploy:convex
# production deployment (when ready):
npm run deploy:convex:prod
```

Set Convex-side secrets:

```bash
npx convex env set RESEND_API_KEY re_xxxxxxxx
npx convex env set RESEND_FROM_EMAIL "Ask AI Legal <notifications@askailegal.com>"
npx convex env set OPS_ACCESS_TOKEN "$(openssl rand -hex 32)"
```

### 3. Import project in Vercel

1. [vercel.com/new](https://vercel.com/new) → Import `Mran1996/ask-ai-legal-website`
2. Framework: **Next.js** (auto-detected)
3. Root directory: `.` (repo root)
4. Build command: `npm run build` (default from `vercel.json`)
5. Add [environment variables](#vercel-environment-variables) **before** first deploy
6. Deploy

### 4. Custom domain (askailegal.com)

1. Vercel → Project → **Settings → Domains**
2. Add **both** `askailegal.com` (apex) and `www.askailegal.com`
3. Set **primary** domain to `askailegal.com` (matches sitemap and canonical URLs in code)
4. Point DNS per Vercel instructions (A/CNAME records)

**www → apex redirect:** `vercel.json` includes a permanent (301) redirect from `www.askailegal.com` to `https://askailegal.com`. After deploy, verify:

```bash
curl -sI https://www.askailegal.com | grep -i location
# Location: https://askailegal.com/
```

Set `NEXT_PUBLIC_SITE_URL=https://askailegal.com` on Vercel (Production).

### 5. Search engine indexing (manual, once)

Code ships `robots.txt` and `sitemap.xml`, but you must submit them to search engines:

#### Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console) → add property for `askailegal.com` (Domain or URL prefix)
2. Verify via **DNS TXT** (recommended) or HTML tag
3. Submit sitemap: `https://askailegal.com/sitemap.xml`
4. After major launches, use **URL Inspection** → Request indexing for `/` and `/services` (and `/pricing`)

#### Bing Webmaster Tools (optional)

1. [bing.com/webmasters](https://www.bing.com/webmasters) → add site
2. Submit the same sitemap URL

#### Live checks

- `https://askailegal.com/robots.txt`
- `https://askailegal.com/sitemap.xml`
- `https://askailegal.com/opengraph-image` (social preview image)

---

## Vercel environment variables

Add in **Vercel → Settings → Environment Variables**. Enable for **Production** and **Preview**.

### Required (site + quote form)

| Variable | Example | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_CONVEX_URL` | `https://affable-hare-544.convex.cloud` | From Convex dashboard |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | `https://affable-hare-544.convex.site` | HTTP actions / site URL |
| `NEXT_PUBLIC_SITE_URL` | `https://askailegal.com` | Or your `*.vercel.app` URL |
| `NEXT_PUBLIC_CALCOM_INTAKE_EVENT_SLUG` | `ask-ai-legal/intake-call` | Intake call embed on `/book` |

### Cal.com webhook (Convex — not Vercel)

Set in **Convex** prod (`robust-wombat-16`), not Vercel:

| Variable | Notes |
|----------|-------|
| `CALCOM_WEBHOOK_SECRET` | `npx convex env set CALCOM_WEBHOOK_SECRET "$(openssl rand -hex 32)"` |
| `PUBLIC_SITE_URL` | `https://askailegal.com` (for intake email `/book` links + Stripe success URLs) |

Cal.com webhook URL: `https://robust-wombat-16.convex.site/calcom-webhook`  
Header: `Authorization: Bearer <CALCOM_WEBHOOK_SECRET>`

See `docs/CALCOM_SETUP.md`.

### Stripe Checkout (Convex — required for Pay to start)

Set in **Convex** (actions + HTTP webhook), not only Vercel:

| Variable | Notes |
|----------|-------|
| `STRIPE_SECRET_KEY` | `sk_test_…` or `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard webhook signing secret |
| `PUBLIC_SITE_URL` | `https://askailegal.com` |

Stripe webhook URL: `https://robust-wombat-16.convex.site/stripe-webhook`  
Event: `checkout.session.completed`

Optional on Vercel: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (hosted Checkout redirect does not require it).

See `docs/PAY_QUOTE_DELIVER_FLOW.md`.

### Required for AI chat (pick one provider)

| Variable | Example |
|----------|---------|
| `CHAT_MODEL_PROVIDER` | `nvidia` \| `openrouter` \| `openai` |
| `NVIDIA_API_KEY` | `nvapi-...` |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` |
| `OPENAI_API_KEY` | `sk-...` |

Optional model overrides: `NVIDIA_MODEL`, `OPENROUTER_MODEL`, `OPENAI_MODEL`.

### Optional — deploy Convex on every Vercel build

| Variable | Notes |
|----------|-------|
| `CONVEX_DEPLOY_KEY` | Convex dashboard → Settings → Deploy Key |

Then change Vercel **Build Command** to:

```bash
npm run build:vercel
```

This runs `npx convex deploy --cmd 'npm run build'` so backend and frontend stay in sync.

### Do **not** set on Vercel

- `CONVEX_DEPLOYMENT=local:...`
- `NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210`
- `RESEND_API_KEY` (belongs on **Convex**, not Vercel)

---

## Deploy commands (local)

```bash
# Verify production build
npm run deploy:check

# Deploy Convex only
npm run deploy:convex

# Preview deploy (Vercel CLI)
npx vercel

# Production deploy (Vercel CLI)
npx vercel --prod
```

Or push to GitHub — Vercel auto-deploys connected branches.

---

## Post-deploy checklist

- [ ] Homepage loads at Vercel URL
- [ ] Chat widget opens
- [ ] **Request Quote** → Submit intake → shows case reference + estimate
- [ ] `/ops/intakes` works with ops token (if configured)
- [ ] `npm run build` passes locally

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Site builds but quote form fails | `NEXT_PUBLIC_CONVEX_URL` wrong or points at local; run `npm run deploy:convex` |
| Chat never replies | Add LLM API key + `CHAT_MODEL_PROVIDER` on Vercel |
| Build fails on Vercel | Run `npm run build` locally; fix TypeScript errors |
| Intake emails not sent | Set `RESEND_*` on Convex (`npx convex env list`) |
| Works locally, not on Vercel | Local uses `.env.local`; copy vars to Vercel dashboard |

---

## Local development (unchanged)

```bash
npm run dev:convex   # terminal 1
npm run dev          # terminal 2
```

Use cloud Convex in `.env.local` for fewer Safari/timeout issues, or local Convex for offline dev (see `.env.example`).
