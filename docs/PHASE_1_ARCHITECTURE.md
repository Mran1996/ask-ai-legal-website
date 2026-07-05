# Phase 1 Architecture — Ask AI Legal

> **Status:** Proposal only (not implemented).  
> **Spec:** [ASK_AI_LEGAL_SPEC.md](./ASK_AI_LEGAL_SPEC.md) Section 9, Phase 1  
> **Progress:** [BUILD_PROGRESS.md](./BUILD_PROGRESS.md)

---

## Phase 1 defaults (chosen for you)

| Decision | Choice | Why |
|----------|--------|-----|
| **Matter type** | California **unlawful detainer** (tenant facing eviction — answer/motion prep) | Clear document deliverable, high demand, fits “document prep not law firm” framing |
| **State** | **California** | Large market; unify templates, statutes, and pricing for one jurisdiction first |
| **Backend** | **Convex** | Real-time case dashboard for counsel review; TypeScript end-to-end with Next.js; matches project tooling |
| **Channel** | **Web chat only** | Reuse existing `components/chat-widget.tsx` — no voice/email in Phase 1 |
| **Retrieval** | **None** | Client uploads all docs manually (spec Phase 1) |
| **Payments** | **Stripe Checkout** | Per-document flat fee on estimate acceptance |

Change matter type or state later by updating Convex seed data and templates — schema stays the same.

---

## What already exists (reuse)

| Asset | Location | Phase 1 role |
|-------|----------|----------------|
| Marketing site | `app/page.tsx`, sections | Unchanged public face |
| Services catalog | `app/services/page.tsx`, `lib/i18n/` | Copy/source for estimates |
| Chat widget | `components/chat-widget.tsx` | Intake + FAQ → becomes **Case creator** |
| Chat API | `app/api/chat/route.ts` | Stays for marketing FAQ; intake calls Convex mutations |
| Intake form (quote tab) | `lib/chat/intake.ts` | Merge into structured Case intake |
| LLM providers | `lib/chat/model-providers.ts` | Drafting agent in Phase 1 (later step) |
| Disclaimers / legal pages | `app/disclaimer`, `app/terms-of-service` | Client-facing compliance copy |

---

## Target repo structure (after Phase 1 build)

```
ask ai legal web/
├── app/                          # Next.js (existing + new routes)
│   ├── (marketing)/              # existing homepage, services, about…
│   ├── portal/                   # client: case status, upload, pay estimate
│   ├── ops/                      # internal: counsel review dashboard (auth-gated)
│   └── api/
│       ├── chat/                 # existing marketing chat
│       ├── stripe/webhook/       # payment confirmation → Convex
│       └── upload/               # optional presigned URL helper
├── components/                   # existing + portal/ops components
├── convex/                       # NEW — database, mutations, actions
│   ├── schema.ts
│   ├── clients.ts
│   ├── cases.ts
│   ├── estimates.ts
│   ├── documents.ts
│   ├── payments.ts
│   ├── agentRuns.ts
│   ├── counselReview.ts
│   ├── lib/auth.ts               # custom wrappers (authedQuery, counselMutation)
│   └── workflows/                # Phase 1: simple status transitions (not full LangGraph yet)
├── lib/
│   ├── chat/                     # existing — extend intake → Convex
│   ├── pricing/                  # CA eviction reference table + estimate calculator
│   └── agents/                   # intake classifier, drafting (Phase 1 minimal)
└── docs/
    ├── ASK_AI_LEGAL_SPEC.md
    ├── PHASE_1_ARCHITECTURE.md
    └── BUILD_PROGRESS.md
```

---

## Data model (Convex tables)

Maps to spec Section 4. Use flat relational documents with indexes (Convex pattern).

### `clients`

| Field | Type | Notes |
|-------|------|-------|
| `email` | string | Primary contact |
| `phone` | optional string | |
| `firstName`, `lastName` | string | |
| `authUserId` | optional string | Clerk/Convex auth when portal ships |
| `createdAt` | number | |

Index: `by_email`

### `cases`

| Field | Type | Notes |
|-------|------|-------|
| `clientId` | id clients | |
| `matterType` | literal `"ca_unlawful_detainer"` | Phase 1 only |
| `jurisdiction` | `{ state: "CA", county?: string }` | |
| `status` | union (see below) | State machine |
| `intakeRaw` | string | Chat transcript excerpt |
| `intakeStructured` | object | Parsed facts (parties, address, notice date, rent owed, etc.) |
| `assignedServices` | array of service ids | e.g. `["document_preparation"]` |
| `storagePrefix` | string | S3/R2 prefix mimicking CaseFolder |
| `createdAt`, `updatedAt` | number | |

**Status enum (Phase 1):**

`intake` → `estimate_sent` → `awaiting_payment` → `awaiting_docs` → `in_drafting` → `in_counsel_review` → `delivered` → `closed`

Index: `by_client`, `by_status`

### `estimates`

| Field | Type | Notes |
|-------|------|-------|
| `caseId` | id cases | |
| `serviceLine` | string | e.g. "Unlawful detainer answer + motion to quash" |
| `baseCostCents` | number | Our price |
| `attorneyCompareLowCents`, `attorneyCompareHighCents` | number | From pricing reference table |
| `retrievalCostCents` | number | 0 in Phase 1 |
| `finalQuoteCents` | number | |
| `status` | `draft` \| `sent` \| `accepted` \| `expired` | |
| `stripeCheckoutSessionId` | optional string | |
| `createdAt` | number | |

Index: `by_case`

### `documents`

| Field | Type | Notes |
|-------|------|-------|
| `caseId` | id cases | |
| `type` | `uploaded_by_client` \| `drafted_by_us` \| `final_delivered` | No `retrieved_by_us` in Phase 1 |
| `folder` | enum path | `intake`, `uploaded_by_client`, `drafts`, `counsel_review`, `final_delivered` |
| `fileName`, `storageId` | string | Convex file storage or R2 URL |
| `status` | `received` \| `processing` \| `reviewed` \| `delivered` | |
| `version` | number | |
| `createdAt` | number | |

Index: `by_case`, `by_case_and_folder`

### `payments`

| Field | Type | Notes |
|-------|------|-------|
| `caseId` | id cases | |
| `estimateId` | id estimates | |
| `type` | `per_document` | Phase 1 |
| `amountCents` | number | |
| `status` | `pending` \| `paid` \| `failed` \| `refunded` | |
| `stripePaymentIntentId` | optional string | |
| `createdAt` | number | |

### `agentRuns`

| Field | Type | Notes |
|-------|------|-------|
| `caseId` | id cases | |
| `agentType` | `intake` \| `pricing` \| `drafting` \| `counsel` | Phase 1 subset |
| `inputRef` | string | doc id or case field ref |
| `outputRef` | string | |
| `status` | `running` \| `completed` \| `failed` | |
| `reviewedBy` | optional string | Counsel user id |
| `createdAt` | number | |

Index: `by_case`

### `counselReviews`

| Field | Type | Notes |
|-------|------|-------|
| `caseId` | id cases | |
| `documentId` | id documents | Draft under review |
| `reviewerId` | string | Licensed reviewer |
| `decision` | `pending` \| `approved` \| `rejected` \| `needs_edit` | |
| `notes` | optional string | |
| `reviewedAt` | optional number | |

**Rule:** `cases.status` cannot move to `delivered` unless a `counselReviews` row exists with `decision === "approved"` for the final document.

---

## Case folder layout (storage)

Auto-provision on case create (`storagePrefix = cases/{caseId}/`):

```
cases/{caseId}/
  intake/
  uploaded_by_client/
  drafts/
  counsel_review/
  final_delivered/
```

Phase 1: use **Convex file storage** or **Cloudflare R2** — pick at implementation (Step 1b).

---

## API & UI routes (Phase 1)

### Public / client

| Route | Purpose |
|-------|---------|
| `/` | Existing marketing site |
| `/portal` | Client login + case list (magic link or Clerk) |
| `/portal/cases/[id]` | Status, upload docs, view estimate, pay Stripe link |
| `/portal/cases/[id]/estimate` | “Attorney $X–$Y vs Ask AI Legal $Z” widget |

### Internal / ops

| Route | Purpose |
|-------|---------|
| `/ops` | Counsel + ops dashboard (role-gated) |
| `/ops/cases/[id]` | Full case file, draft viewer, **approve/reject** UI |
| `/ops/queue` | Cases in `in_counsel_review` |

### Server

| Endpoint | Purpose |
|----------|---------|
| `POST /api/chat` | Keep for site FAQ; add optional `mode=intake` later |
| `POST /api/stripe/webhook` | `checkout.session.completed` → mark estimate paid, advance case |
| Convex mutations | `cases.createFromIntake`, `estimates.generate`, `documents.upload`, etc. |
| Convex actions | LLM drafting (calls existing NVIDIA/OpenRouter stack) |

---

## Phase 1 user flows

### Flow A — New client (happy path)

1. Visitor opens chat → describes CA eviction situation.
2. **Intake** (chat or quote form) → `cases.createFromIntake` with structured fields.
3. **Estimate Agent** (rules + LLM assist) → `estimates` row + attorney comparison from `lib/pricing/ca-eviction.ts`.
4. Client sees estimate in portal/chat widget → accepts → **Stripe Checkout**.
5. Webhook → `awaiting_docs` → client uploads notice, lease, etc.
6. **Drafting Agent** (action) → draft saved to `drafts/` → `in_counsel_review`.
7. Counsel opens `/ops/cases/[id]` → reviews → **Approve**.
8. Final PDF to `final_delivered/` → email/link → `delivered`.

### Flow B — Counsel rejects

7b. Reject with notes → back to `in_drafting` → revised draft → review again.

---

## Auth (Phase 1 minimal)

| Role | Access |
|------|--------|
| **Client** | Own cases only (`portal/*`) |
| **Counsel / ops** | All cases, review queue (`ops/*`) |

Use **Clerk** or **Convex Auth** — decide at Step 1 implementation. Counsel role required before `/ops` ships.

---

## Pricing reference (Phase 1)

File: `lib/pricing/ca-eviction.ts` (to be created)

- Static table: deliverable → `{ ourPriceCents, attorneyLowCents, attorneyHighCents, sourceNote }`
- Example line: *Unlawful detainer answer preparation* — sourced from internal market research doc (not LLM-guessed)
- Estimate mutation reads table + complexity flags from `intakeStructured`

---

## Agent scope (Phase 1 — minimal)

| Agent | Phase 1? | Implementation |
|-------|----------|----------------|
| Intake | Yes | Chat → structured JSON via LLM + validation |
| Pricing/Estimate | Yes | Rules + reference table |
| Retrieval | No | |
| Document understanding | Optional lite | Filename + client labels only |
| Legal research | No (Phase 3) | Use static CA UD checklist in draft template |
| Strategy / upsell | No (Phase 3) | |
| Drafting | Yes | Convex action + system prompt + templates |
| Analytics | No | |
| Counsel review | **Human** | `/ops` UI — mandatory gate |
| Delivery | Yes | Email + portal download after approval |

Orchestration: **Convex mutations + scheduled functions** for Phase 1 (not LangGraph yet). Upgrade in Phase 3 if needed.

---

## Environment variables (Phase 1 additions)

```env
# Existing chat keys (NVIDIA, OpenRouter, etc.)

# Convex (after init)
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Auth (Clerk example)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# File storage (if R2)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

---

## Out of scope for Phase 1

- Voice agent (Section 3.2)
- Email agent (Section 3.3)
- Retrieval agent + retainer billing
- Multi-state / multi-matter-type
- Citation-verified legal research API
- Success rate analytics agent
- Mobile app

---

## Definition of done (Phase 1)

- [ ] One real CA unlawful detainer case can flow: chat intake → estimate with comparison → Stripe pay → upload → AI draft → **counsel approve** → client receives final doc
- [ ] No document reaches client without `counselReviews.approved`
- [ ] All agent steps logged in `agentRuns`
- [ ] Counsel can reject and loop back to drafting
- [ ] `npm run build` passes; Convex dev deploy works

---

## Recommended implementation order

See [BUILD_PROGRESS.md](./BUILD_PROGRESS.md) for the full checklist. **Next coding step:** Step 1.1 — Initialize Convex + schema.
