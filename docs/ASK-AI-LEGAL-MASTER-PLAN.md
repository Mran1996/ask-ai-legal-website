# Ask AI Legal — Master Plan & Checklist

**Version:** 1.1  
**Last updated:** 2026-07-05 (sync)  
**Owner:** [Your name]  
**Repo:** `/Users/sylasp/ask ai legal web`  
**Status key:** ☐ Not started · ◐ In progress · ☑ Done · ⏸ Blocked

**Copies of this file:**

- `~/Downloads/ASK-AI-LEGAL-MASTER-PLAN.md`
- `~/Documents/Ask AI Legal/ASK-AI-LEGAL-MASTER-PLAN.md`
- `docs/ASK-AI-LEGAL-MASTER-PLAN.md` (this file — source of truth in repo)

---

## How to use this doc

1. Keep a copy in `~/Documents/Ask AI Legal/` for daily review.
2. After each work session, update checkboxes and the **Change log** at the bottom.
3. In Cursor Agent mode, say **"sync master plan"** to update checkboxes from repo progress.

---

## North star (v2 model — no attorney handoff)

We sell **document preparation + citation-verified research** for pro se clients — NOT legal advice, NOT guaranteed outcomes.

**Customer flow:**

Intake → Pay #1 (retrieval + review) → Scope memo (~30–120 min) → Pay #2 (draft + case law work) → Citation pipeline → Deliver

**Product differentiator:** Every cited case is retrieved, stored per customer, and checked against the draft in isolated LLM passes.

---

## PHASE 0 — Legal & positioning (DO FIRST)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 0.1 | Book 1-hour UPL consult (California) — explain: AI drafts, no attorney, citation verification only | ☐ | |
| 0.2 | Get written guidance: allowed service descriptions, disclaimers, forbidden claims | ☐ | |
| 0.3 | Rewrite positioning: "document prep + research" not "law firm" / not "we will win" | ☐ | |
| 0.4 | Draft Terms of Service + Privacy Policy (data isolation, no legal advice) | ◐ | Draft in `~/Documents/Ask AI Legal/legal/disclaimers-draft.md` — needs UPL review |
| 0.5 | Remove/update any "attorney-reviewed" copy on site and in docs | ☐ | Spec + intake email still reference attorney review |
| 0.6 | Define forbidden marketing words (guarantee, win, success rate, etc.) | ◐ | Listed in disclaimers-draft.md |

**Exit criteria:** Counsel or self-approved disclaimer pack ready before taking money.

---

## PHASE 1 — Brand & marketing foundation

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Write brand enemy: "We exist because we're tired of ______" | ◐ | Draft in `~/Documents/Ask AI Legal/branding/enemy-statement.txt` |
| 1.2 | One-liner + tagline (not "premium" or "trusted") | ☐ | |
| 1.3 | Define ideal customer (CA UD first: landlord or tenant?) | ☐ | |
| 1.4 | Create IG + FB business profiles | ☐ | |
| 1.5 | Content pillars: Educate + Document process (not product-as-hero every post) | ☐ | |
| 1.6 | Write 10 organic post ideas (carousels, Reels scripts) | ☑ | `~/Documents/Ask AI Legal/branding/social-post-ideas.md` |
| 1.7 | Lead magnet idea (e.g. "CA UD filing checklist") → links to chat intake | ☐ | |
| 1.8 | Review Meta ad restrictions for legal services before paid ads | ☐ | |
| 1.9 | Optional: 1 explainer video (HyperFrames/Remotion skills) | ☐ | |

**Exit criteria:** Profiles live, enemy statement approved, 4 posts ready to publish.

---

## PHASE 2 — Business operations (manual first)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Define Pay #1 line items: retrieval fee + review fee (amounts in cents) | ☐ | |
| 2.2 | Define Pay #2 tiers: simple motion / brief / full research | ☐ | |
| 2.3 | Scope memo template (what we have, missing docs, both sides?, Pay #2 quote) | ☑ | `~/Documents/Ask AI Legal/ops/scope-memo-template.md` |
| 2.4 | Document checklist per matter type (CA UD): complaint, answer, notices, lease, etc. | ☐ | |
| 2.5 | Process for "both sides" — require plaintiff + defendant filings before quote | ☐ | |
| 2.6 | Manual retrieval SOP (PACER, court portal, client uploads) | ☐ | |
| 2.7 | Support email workflow (`support@askailegal.com` / Outlook) | ☐ | Resend wired for intake emails |
| 2.8 | Ops checklist: who does review, who sends Stripe links, SLA (not always 30 min) | ☐ | |

**Exit criteria:** You can run one fake case end-to-end on paper without code.

---

## PHASE 3 — Product & website (this repo)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Update `docs/ASK_AI_LEGAL_SPEC.md` for v2 (no counsel gate → citation audit gate) | ☐ | |
| 3.2 | Update `docs/BUILD_PROGRESS.md` with new phases | ☐ | |
| 3.3 | Homepage copy: enemy, disclaimers, two-pay process explained | ☐ | |
| 3.4 | Services page aligned with real offerings | ☐ | |
| 3.5 | Chat/intake: capture matter type, jurisdiction, what they need filed | ◐ | Intake + case create shipped |
| 3.6 | Stripe Pay #1 checkout (retrieval + review) | ☐ | Next in BUILD_PROGRESS |
| 3.7 | Case status after Pay #1: `awaiting_review` | ☐ | |
| 3.8 | Ops UI: review queue + scope memo + send Pay #2 link | ☐ | `/ops/intakes` exists |
| 3.9 | Stripe Pay #2 checkout (dynamic quote from review) | ☐ | |
| 3.10 | Client portal: upload documents (per-case folder) | ◐ | Chat widget upload + `convex/documents.ts`; `/portal/cases/[id]` not built |
| 3.11 | Email: Pay #1 receipt, review complete, Pay #2 link, delivery | ◐ | Intake emails shipped |
| 3.12 | SEO basics: robots.txt, sitemap, metadata | ☐ | |

**Exit criteria:** One test client can pay #1, upload docs, receive scope memo, pay #2.

---

## PHASE 4 — Citation verification pipeline (core product)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Per-case storage layout: `uploads/`, `authorities/`, `drafts/`, `audits/` | ☐ | `storagePrefix` on cases exists |
| 4.2 | Citation extract step from draft | ☐ | |
| 4.3 | Authority retrieval SOP + sources: CourtListener, LII, Justia, Scholar, etc. | ☑ | `~/Documents/Ask AI Legal/ops/citation-audit-sop.md` (manual v1) |
| 4.4 | Store full text PDF/HTML per authority in case folder ONLY | ☐ | |
| 4.5 | LLM Pass A: draft + authorities → flag mismatches (separate context) | ☐ | |
| 4.6 | LLM Pass B: suggest better cases → retrieve → re-audit | ☐ | |
| 4.7 | LLM Pass C: readability/format (NOT outcome prediction) | ☐ | |
| 4.8 | Human spot-check on flagged citations before delivery (v1) | ☐ | |
| 4.9 | Delivery pack: final PDF/DOCX + citation index + disclaimer | ☐ | |
| 4.10 | Replace `counselReviews` concept with `citationAudits` / quality gate in schema | ☐ | |

**Exit criteria:** One sample motion audited with saved authority files and audit log.

---

## PHASE 5 — Data isolation & security

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Every query scoped by `caseId` + authenticated client | ◐ | Authed wrappers exist; portal pending |
| 5.2 | No shared LLM context across cases | ☐ | |
| 5.3 | Ops role access only; log document views | ☐ | |
| 5.4 | `.env.local` secrets never committed | ☑ | gitignored |
| 5.5 | Retention policy: how long you keep client files | ☐ | |
| 5.6 | Client data deletion request process (GDPR-style best practice) | ☐ | |

**Exit criteria:** Documented isolation rules; test two cases cannot cross-leak.

---

## PHASE 6 — Launch & iterate

| # | Task | Status | Notes |
|---|------|--------|-------|
| 6.1 | Stripe test mode: full dry run | ☐ | |
| 6.2 | Stripe live mode + business bank | ☐ | |
| 6.3 | 3 beta clients (friends/discounted) with manual ops | ☐ | |
| 6.4 | Collect feedback; fix scope memo + pricing | ☐ | |
| 6.5 | Publish 2 weeks organic content before paid ads | ☐ | |
| 6.6 | `/last30days` research: competitors + pricing monthly | ☐ | |
| 6.7 | Measure: Pay #1→#2 conversion, time to scope memo, refunds | ☐ | |

**Exit criteria:** 3 paid real cases delivered with citation audit trail.

---

## Already done (repo — synced from BUILD_PROGRESS)

| Item | Status |
|------|--------|
| Platform spec (`docs/ASK_AI_LEGAL_SPEC.md`) | ☑ |
| Cursor rule (`.cursor/rules/ask-ai-legal-platform.mdc`) | ☑ |
| Phase 1 architecture doc | ☑ |
| Build progress tracker | ☑ |
| Convex backend + schema (cases, estimates, documents, payments, agentRuns) | ☑ |
| ConvexProvider in Next.js layout | ☑ |
| Custom auth wrappers (`convex/lib/customFunctions.ts`) | ☑ |
| CA UD pricing stub | ☑ |
| Intake structured type + `cases.createFromIntake` | ☑ |
| Chat widget → case create (not mailto-only) | ☑ |
| Case storage prefix on create | ☑ |
| Intake `agentRun` logging | ☑ |
| Intake auto-email (client + support) via Resend | ☑ |
| `estimates.generateForCase` + attorney comparison UI | ☑ |
| Ops `/ops/intakes` + case detail | ☑ |
| Homepage sections (hero, FAQ, testimonials, etc.) | ☑ |
| Service pricing tables (CA UD stub) | ☑ |
| Cursor skills (gstack, graphify, taste-skill, last30days, etc.) | ☑ |
| Graphify rule (`.cursor/rules/graphify.mdc`) | ☑ |
| Master plan doc created | ☑ |
| Planning folder (`~/Documents/Ask AI Legal/` + supporting templates) | ☑ |
| Document upload in chat (`generateUploadUrl`, `attachIntakeDocument`) | ☑ |

**Current focus (BUILD_PROGRESS):** Phase 1.4 — Stripe payment → maps to master plan **3.6–3.7**.

**Recommended before taking money:** Phase **0.1** UPL consult.

**Not done yet (from BUILD_PROGRESS):**

- UPL review scheduled
- Stripe account / checkout
- Auth provider chosen (Clerk vs Convex Auth)
- Client portal, drafting, counsel/citation gate, delivery

---

## Weak spots to revisit (review monthly)

- [ ] UPL exposure without attorney
- [ ] LLM citation hallucination
- [ ] Promising timelines ("30 min") you can't hit
- [ ] Drop-off between Pay #1 and Pay #2
- [ ] Meta legal ad policy
- [ ] "Success" or "win" language anywhere

---

## Change log

| Date | What changed | Completed tasks |
|------|--------------|-----------------|
| 2026-07-05 | Master plan v1 created; synced from BUILD_PROGRESS | Repo scaffold, intake, estimates, ops, emails |
| 2026-07-05 | Sync #1 — no new code shipped; planning docs + upload status verified | 1.6, 2.3, 4.3 ☑; 0.4, 0.6, 1.1 ◐; chat upload confirmed |
| | | |

---

## Quick reference — Cursor prompts

- **Spec update:** "Read ASK-AI-LEGAL-MASTER-PLAN.md Phase 3. Update docs/ASK_AI_LEGAL_SPEC.md for v2 citation gate."
- **Stripe Pay #1:** "Implement Phase 3.6–3.7 per master plan."
- **Design:** "Redesign homepage using design-taste-frontend; enemy: [paste your sentence]."
- **Research:** "/last30days California unlawful detainer document prep pricing"
- **Sync plan:** "sync master plan" (see Living doc prompt below)

---

## Living doc prompt (paste in Agent mode)

```
Sync the Ask AI Legal master plan:

1. Read docs/BUILD_PROGRESS.md and docs/ASK-AI-LEGAL-MASTER-PLAN.md in the repo.
2. Update checkboxes (☐ ◐ ☑) in all three copies:
   - docs/ASK-AI-LEGAL-MASTER-PLAN.md
   - ~/Documents/Ask AI Legal/ASK-AI-LEGAL-MASTER-PLAN.md
   - ~/Downloads/ASK-AI-LEGAL-MASTER-PLAN.md
3. Add a row to the Change log with today's date and what shipped.
4. Do not commit unless I ask.
```

---

## Supporting docs folder

```
~/Documents/Ask AI Legal/
├── ASK-AI-LEGAL-MASTER-PLAN.md
├── branding/
│   ├── enemy-statement.txt
│   └── social-post-ideas.md
├── legal/
│   └── disclaimers-draft.md
└── ops/
    ├── scope-memo-template.md
    └── citation-audit-sop.md
```
