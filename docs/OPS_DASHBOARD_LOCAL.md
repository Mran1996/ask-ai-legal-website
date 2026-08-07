# Ops dashboard — Working Matter OS

Ask AI Legal runs **two sites**:

| Site | URL | Purpose |
|------|-----|---------|
| Marketing | http://localhost:3000 | Public website, chat, intake, uploads |
| **Ops dashboard** | **http://localhost:3001** | Matter files: documents, money, emails, Outlook, LLM + counsel |

**Convex is the source of truth.** Do **not** rebuild the fulfillment spine in n8n. Power Automate / n8n is only an optional Outlook edge (see `OUTLOOK_CLIENT_FILING.md`).

## Start both

**Terminal 1 — Convex (marketing repo):**

```bash
cd "/Users/sylasp/ask ai legal web"
npx convex dev
```

**Terminal 2 — Marketing site:**

```bash
cd "/Users/sylasp/ask ai legal web"
npm run dev
```

**Terminal 3 — Ops dashboard:**

```bash
cd /Users/sylasp/ask-ai-legal-ops
npm run sync:convex   # after backend API changes
npm run dev
```

Open **http://localhost:3001** → enter `OPS_ACCESS_TOKEN` (or **Use local .env token** in development).

## Matter file (the product)

Open any matter from Home or Matters. You should see:

1. **Header** — client, issue, quoted $, paid $, next action  
2. **Fulfillment rail** — Part 1 → return/ack → gaps → LLM draft → approve+invoice → paid → Outlook → counsel → deliver  
3. **Documents** — downloads + ops upload  
4. **Money** — ledger + **Record payment (amount)**  
5. **Communications** — outbound email checklist + agent log  
6. **LLM + Counsel** — edit/approve draft (ops-only until approve); counsel gate before delivery  

Home shows **System status** (Resend / Stripe / Outlook / LLM) and **Needs attention**.

## Automation env (Convex deployment)

Set on the deployment ops talks to (`npx convex env set …` from the marketing repo):

| Var | Purpose |
|-----|---------|
| `RESEND_API_KEY` | Customer emails |
| `RESEND_FROM_EMAIL` | From address |
| `RESEND_INBOUND_WEBHOOK_SECRET` | Form-return via email |
| `OPS_NOTIFY_EMAIL` | LLM draft alerts to you |
| `OPENAI_API_KEY` | LLM issues draft (else template) |
| `STRIPE_SECRET_KEY` | Pay links |
| `STRIPE_WEBHOOK_SECRET` | Auto mark-paid |
| `MICROSOFT_GRAPH_*` | Live Outlook folders |
| `OPS_ACCESS_TOKEN` | Ops login |

Check green/red chips on the ops home **System status** strip.

## Intended customer journey

See [`PAY_QUOTE_DELIVER_FLOW.md`](./PAY_QUOTE_DELIVER_FLOW.md). Website uploads call `documents.attachIntakeDocument` and appear on the matter Documents tab.

## Architecture

- Backend: Convex functions only in the marketing repo (`convex/`)
- Ops app: Next.js on port 3001; sync `_generated` with `npm run sync:convex`
- Same `NEXT_PUBLIC_CONVEX_URL` in both apps
