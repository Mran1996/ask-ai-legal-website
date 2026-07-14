# Ask AI Legal — Build Progress

Track implementation against [ASK_AI_LEGAL_SPEC.md](./ASK_AI_LEGAL_SPEC.md) Section 9.

**Phase 1 defaults:** CA unlawful detainer · California · Convex · web chat only

**Legend:** Check boxes as each step ships and is verified.

---

## Phase 0 — Foundation (docs & rules)

- [x] Platform spec in repo (`docs/ASK_AI_LEGAL_SPEC.md`)
- [x] Cursor rule (`.cursor/rules/ask-ai-legal-platform.mdc`)
- [x] Phase 1 architecture proposal (`docs/PHASE_1_ARCHITECTURE.md`)
- [x] This progress tracker
- [ ] Compliance: schedule UPL review with real counsel (spec Section 10)
- [ ] Choose / confirm licensed attorney for Counsel Review gate
- [ ] Stripe account (test mode) created
- [ ] Auth provider chosen (Clerk vs Convex Auth)

---

## Phase 1 — MVP (single matter, one channel)

### 1.1 Backend scaffold

- [x] Initialize Convex in monorepo (`npx convex dev`)
- [x] Wire `ConvexProvider` in Next.js `app/layout.tsx`
- [x] Implement `convex/schema.ts` (clients, cases, estimates, documents, payments, agentRuns, counselReviews)
- [x] Custom auth wrappers (`convex/lib/customFunctions.ts` — authedQuery, counselMutation)
- [x] Seed pricing reference stub (`lib/pricing/ca-eviction.ts`)

### 1.2 Intake → Case record

- [x] Define CA UD `intakeStructured` TypeScript type + validator
- [x] Convex mutation: `cases.createFromIntake`
- [x] Connect chat widget / quote form to create Case (not mailto-only)
- [x] Auto-provision case storage prefix on create
- [x] Log Intake `agentRun`
- [x] Intake auto-email (client + support@) via Resend + `notifications` table
- [x] Post-intake **Intake call** booking (Cal.com + `/book` + Convex webhook + ops view) — see `docs/CALCOM_SETUP.md`
- [ ] v2: Document planning calls gated on $499 case file review (3 included)
- [ ] v3: Paid follow-up calls ($50 / 30 min) via Cal.com or Stripe

### 1.3 Estimate + value comparison UI

- [x] Convex mutation: `estimates.generateForCase`
- [x] Attorney comparison from reference table (not LLM-invented rates)
- [x] Client UI: estimate page/widget (“Attorneys typically $X–$Y · Ask AI Legal $Z”)
- [x] Case status → `estimate_sent`
- [x] Log Pricing `agentRun`
- [x] Minimal ops intake list: `/ops/intakes` + case detail

### 1.4 Email quote + payment (off-site)

- [x] Remove on-site Pay / Stripe Checkout CTA from chat quote success (email funnel)
- [x] Ops checklist: personalized form → form returned → contract/invoice emailed → mark paid → work → deliver
- [x] Resend templates: personalized form + quote/contract/invoice (`convex/emailActions.ts`); subjects include `AAL-…`
- [x] Stripe: Payment Link / invoice pasted in ops email (Checkout code kept unused for later)
- [x] Money before work: `markWorkStarted` / `markDelivered` require paid
- [x] Flow docs: `docs/PAY_QUOTE_DELIVER_FLOW.md` + Outlook filing `docs/OUTLOOK_CLIENT_FILING.md`

### 1.5 Document upload

- [x] Intake + post-intake uploads via chat widget (`documents.attachIntakeDocument`)
- [ ] Client portal route: `/portal/cases/[id]`
- [x] `documents` rows with version tracking (intake folder)
- [ ] Auth: client sees own cases only

### 1.6 Drafting agent (minimal)

- [ ] Convex action: generate CA UD draft from intake + uploads
- [ ] Save to `drafts/`; case status → `in_counsel_review`
- [ ] Log Drafting `agentRun`
- [ ] Reuse existing LLM provider stack; strict no-legal-advice system prompt

### 1.7 Counsel Review gate (mandatory)

- [ ] Ops routes: `/ops`, `/ops/cases/[id]`, `/ops/queue`
- [ ] Review UI: view draft, notes, approve / reject / needs_edit
- [ ] `counselReviews` table + enforce: no `delivered` without `approved`
- [ ] Reject loops case back to `in_drafting`
- [ ] Role-gate: counsel/ops only

### 1.8 Delivery

- [ ] On approve: copy to `final_delivered/`, case status → `delivered`
- [ ] Client notification (email with link or portal download)
- [ ] Log Delivery `agentRun`
- [ ] Optional: upsell placeholder (Phase 3)

### 1.9 Phase 1 QA

- [ ] End-to-end test case (test Stripe + test draft + counsel approve)
- [ ] `npm run build` passes
- [ ] Disclaimers visible on portal + delivered docs
- [ ] Audit trail: all agentRuns queryable per case

---

## Phase 2 — Multi-channel intake

- [ ] Email agent: inbound webhook → same Case record
- [ ] Email: FAQ/logistics only; no new legal content without approved docs
- [ ] Voice agent: business info + intake + account status (authenticated)
- [ ] Voice: escalate on legal-advice requests
- [ ] Outbound voice/email: payment reminders, doc requests
- [ ] Unified case timeline across chat / email / phone

---

## Phase 3 — Retrieval + full agent pipeline

- [ ] Retrieval Agent + retainer payment flow
- [ ] Document Understanding Agent (OCR/parsing)
- [ ] Legal Research Agent + citation verification
- [ ] Strategy Agent + roadmap upsell bundles
- [ ] Analytics Agent (success rate) with grounded data only
- [ ] Workflow orchestration upgrade (LangGraph/Temporal if needed)

---

## Phase 4 — Scale

- [ ] Multi-jurisdiction pricing + template libraries
- [ ] Additional matter types beyond CA UD
- [ ] Attorney review network (per-state reviewers)
- [ ] Production hardening: monitoring, retention policy, access logs
- [ ] Launch checklist: spec Section 10 resolved with counsel
- [ ] Vercel deployment configured (`vercel.json`, `docs/VERCEL_DEPLOY.md`)
- [ ] Convex cloud deployed (`npm run deploy:convex`)
- [ ] Vercel env vars set (`NEXT_PUBLIC_CONVEX_URL`, chat keys, `NEXT_PUBLIC_SITE_URL`)

---

## Current focus

**Next step:** Create Stripe Payment Links as needed; file client mail per `docs/OUTLOOK_CLIENT_FILING.md`. Ops email funnel is live on `/ops/intakes/[caseId]`.

---

## Session log (optional)

| Date | Step | Notes |
|------|------|-------|
| 2026-07-02 | Phase 0 | Spec, rule, architecture docs added |
| 2026-07-02 | Phase 1.1 | Convex schema, auth wrappers, pricing stub, ConvexProvider |
| 2026-07-03 | Phase 1.2–1.3 | Cloud Convex, intake emails, ops list, estimates + value comparison UI |
| 2026-07-13 | Email funnel | No site Pay; ops form→invoice→paid; Outlook playbook |
