# Ask AI Legal — Platform Specification (for Cursor)

> Drop this file into your repo root (e.g. `docs/ASK_AI_LEGAL_SPEC.md`) and reference it in
> your Cursor rules / first prompt: *"Read docs/ASK_AI_LEGAL_SPEC.md before making any
> architectural decisions. Build in phases as described in Section 9."*

---

## 0. Read This First — Compliance Framing (Non-Negotiable)

**"A law firm without the lawyers" is a legal liability, not just a slogan.** Every U.S.
state prohibits the Unauthorized Practice of Law (UPL) — giving specific legal advice,
selecting legal strategy, or drafting legal documents tailored to a person's facts without
attorney involvement. Services like LegalZoom and Rocket Lawyer survive by being **legal
document preparation / self-help services**, not law firms, and by keeping a licensed
attorney (or attorney network) genuinely in the loop for anything that crosses from
"template filling" into "legal advice."

**Design consequence for this build:** Every workflow below that touches strategy,
document drafting, or case-specific advice must terminate in a **human-attorney review
gate** before anything is sent to the client. The AI does the labor; a licensed attorney
(employee, contractor, or partner firm) approves the output. This is not a "nice to have"
— it is the thing that keeps the business legal. Get a UPL review from real counsel,
state-by-state, before launch. This spec treats "Counsel Review" as a mandatory pipeline
stage, not an optional add-on.

---

## 1. Business Model Summary

**Ask AI Legal** is an AI-driven legal document and case-support service. Non-lawyers
(consumers/small businesses) engage via web chat, phone, or email to:

1. Describe their legal situation.
2. Get an instant, itemized cost estimate to prepare their document(s) / case file.
3. Pay a retainer/deposit if document *retrieval* (e.g., court records, prior filings) is required.
4. Upload existing documents.
5. Receive a researched, drafted, attorney-reviewed work product (document, case roadmap,
   strategy memo) with a bill/payment link.
6. Get upsold into a broader "case strategy plan" (multiple documents/services) rather than
   a single one-off document.

Revenue model: per-document flat fee + tiered "strategy plan" bundles + retainer fees for
document retrieval + optional subscription for ongoing case monitoring.

---

## 2. Core Services (Product Catalog)

Mirror this to your `/services` page structure:

| Service | What it is | AI Agent(s) involved |
|---|---|---|
| Case Roadmap | Step-by-step plan of what the client's case needs | Strategy Agent |
| Case Research | Findings specific to the client's fact pattern | Research Agent |
| Legal Research | Statutes/case law relevant to the matter | Legal Research Agent |
| Success Rate Analysis | Data-informed likelihood assessment | Analytics Agent |
| Hearing Preparation | Prep materials/talking points for a hearing | Strategy Agent + Counsel |
| Document Preparation | Drafted, court-ready documents | Drafting Agent + Counsel |

Each service should have its own **pricing formula** (Section 6) and its own **agent
pipeline** (Section 5), but they all funnel through the same intake → estimate → payment →
fulfillment → counsel review → delivery spine.

---

## 3. Entry Channels

### 3.1 Web Chat (primary)
- Chatbot embedded on site, always-on.
- Conversational intake → structured case data (see Section 4 data model).
- Produces a real-time estimate widget the user can accept and pay against.

### 3.2 Voice Agent (inbound + outbound)
- Handles: general business info, "what does Ask AI Legal do," case intake by voice,
  account status questions ("where's my document," "what do I owe"), appointment/callback
  scheduling.
- Needs to **authenticate the caller** (phone number match, DOB/last-4, or account PIN)
  before disclosing any account-specific info.
- Outbound use cases: payment reminders, "we need more documents from you," status updates,
  intake follow-up if a web chat was abandoned.
- Must escalate to a human (or clearly say "I can't advise you on that, an attorney will
  follow up") the moment the caller asks for actual legal advice/opinion rather than
  process/status info. This escalation boundary is a compliance control, not just a UX nicety.

### 3.3 Email
- Dedicated business inbox (e.g. `intake@askailegal.com`, `billing@askailegal.com`).
- An LLM watches the inbox and can: answer FAQ-type questions, attach/generate a document,
  attach an invoice or Stripe payment link, request missing information, or route to a human.
- Every outbound email that includes a legal document or advice-adjacent language must have
  passed the Counsel Review gate first — the email agent should never freelance new legal
  content, only deliver/re-send already-approved output or answer logistics questions.

All three channels write to the **same case record** — a client should be able to start on
chat, continue by phone, and get the invoice by email without repeating themselves.

---

## 4. Case Data Model (minimum viable schema)

```
Client
  id, name, contact (phone/email), auth_method, created_at

Case
  id, client_id, matter_type (e.g. "eviction," "divorce," "LLC formation"),
  status (intake | estimate_sent | awaiting_payment | awaiting_docs |
          in_research | in_drafting | in_counsel_review | delivered | closed),
  jurisdiction (state/county — drives which law/templates apply),
  intake_summary (raw + structured facts),
  assigned_services [Case Roadmap, Document Prep, ...]

Estimate
  id, case_id, service_line, base_cost, retrieval_cost (if applicable),
  attorney_cost_comparison (see Section 6), final_quote, status (draft|sent|accepted)

Document
  id, case_id, type (uploaded_by_client | retrieved_by_us | drafted_by_us),
  source, storage_url, status (received|processing|reviewed|delivered),
  version_history

CaseFolder
  id, case_id, structure: {
     /intake
     /uploaded_by_client
     /retrieved_documents
     /research (case law, statutes)
     /drafts
     /counsel_review
     /final_delivered
  }

Payment
  id, case_id, type (retainer | per_document | plan_bundle),
  amount, status, stripe_ref

AgentRun
  id, case_id, agent_type (drafting|research|strategy|analytics|counsel),
  input_ref, output_ref, status, reviewed_by (human id, nullable until reviewed)
```

Each case gets an auto-generated **folder structure** (Google Drive / S3 prefix) the moment
it's created — this is what lets the "get documents → understand them → organize into
folders → build a plan" step actually work operationally, and gives your human counsel a
consistent place to review from.

---

## 5. Multi-Agent Pipeline (the "back office")

Design this as a **pipeline of specialized agents**, each with a narrow job, orchestrated
by a controller/workflow engine (not one giant prompt). Suggested stages:

```
1. Intake Agent
   - Converts free-text (chat/voice/email) into structured Case + intake_summary.
   - Flags jurisdiction, matter type, urgency.

2. Pricing/Estimate Agent
   - Reads matter_type + jurisdiction + complexity signals.
   - Produces: (a) our price, (b) the "what an attorney would typically charge"
     comparison (Section 6), (c) retrieval cost if documents must be sourced.
   - Sends estimate to client via chat/email/voice for acceptance.

3. Retrieval Agent (only if paid retainer received)
   - Pulls court records / prior filings / whatever is needed.
   - Logs source + retrieval method for audit trail.

4. Document Understanding Agent
   - OCR/parses uploaded + retrieved documents.
   - Identifies document type, drafter/author if listed, key dates, parties, claims.
   - Populates CaseFolder.

5. Legal Research Agent
   - Pulls relevant statutes/case law for the jurisdiction + matter type.
   - Cites sources (never fabricates case law — hallucinated citations are a real,
     already-litigated risk in this space; require citation verification before
     anything downstream uses a citation).

6. Strategy Agent
   - Synthesizes intake + documents + research into a case roadmap / plan.
   - This is where upsell logic lives: "your roadmap includes X, Y, Z documents —
     here's the bundle price vs. one-off price."

7. Drafting Agent
   - Generates the actual document(s) using verified research + client facts.

8. Analytics Agent (Success Rate Analysis)
   - Optional, data-driven likelihood scoring — must be clearly labeled as
     informational, not a guarantee, and reviewed for defensible methodology.

9. COUNSEL REVIEW GATE (human, licensed attorney)
   - Reviews accuracy of drafted documents + strategy + cited law before anything
     is generated in final form or sent to the client.
   - System should make this a genuine review UI (diff view, citation checker,
     approve/reject/edit), not a rubber-stamp button.

10. Delivery Agent
    - Generates final document, invoice/payment link, sends via client's preferred
      channel, updates case status, triggers upsell offer for next service in roadmap.
```

Each agent run should be logged (`AgentRun` table) so you have a full audit trail —
important both for quality control and for defending your process if UPL questions ever
come up.

---

## 6. Pricing / "Show Our Value" Workflow

This is a specific requested feature — make it visible in the UI, not just internal logic:

1. Estimate Agent computes **internal cost to fulfill** (compute + retrieval + counsel
   review time).
2. Estimate Agent computes/looks up a **market attorney-hourly comparison** for the same
   deliverable (you'll want a maintained reference table by matter type + jurisdiction,
   since AI shouldn't be asserting real-time "average attorney rates" without a data
   source behind it).
3. UI shows: *"An attorney would typically charge $X–$Y for this. Ask AI Legal: $Z."*
4. Upsell block: *"Clients who need [Document A] typically also need [Roadmap items B, C].
   Bundle price: $N (vs. $N+ individually)."*

---

## 7. Payment & Retainer Logic

- **Per-document flat fee**: charged on estimate acceptance, before drafting begins.
- **Retrieval retainer**: charged upfront, before the Retrieval Agent runs, exactly like a
  law firm retainer — non-refundable framing should be reviewed by counsel/your ToS.
- **Plan bundles**: discounted multi-document pricing surfaced by the Strategy Agent.
- Use Stripe (Checkout + Payment Links) so email/voice/chat can all generate a payable link
  without custom payment UI per channel.

---

## 8. Suggested Tech Stack

| Layer | Options |
|---|---|
| Orchestration / agent workflow | LangGraph, Temporal, or a custom queue-based state machine — avoid one monolithic prompt |
| LLM | Claude (via Anthropic API) for drafting/reasoning; consider a cheaper model for simple intake classification |
| Voice agent | Vapi, Bland AI, Retell, or Twilio + your own LLM orchestration |
| Email agent | Inbound parsing via SendGrid/Postmark webhook → LLM → reply; or Gmail API + LLM |
| Document storage | S3 or Google Drive API (per-case folder auto-provisioning) |
| Document parsing/OCR | Textract, Unstructured.io, or Claude's native PDF/image handling |
| Legal research grounding | A licensed case-law/statute API (avoid free-text hallucinated citations) — see Section 5.5 |
| Payments | Stripe |
| CRM / case status | Postgres + a lightweight internal dashboard (this is your counsel-review + ops tool) |
| E-signature (if needed) | DocuSign or HelloSign API |
| Auth | Clerk/Auth0 for client portal; separate phone-based verification for voice |

---

## 9. Phased Build Roadmap

**Phase 1 — MVP (single matter type, one channel)**
- Web chat intake → structured case data → estimate → Stripe payment.
- Manual document upload.
- One drafting agent + hard-required human counsel review before delivery.
- No voice, no email agent yet. No retrieval agent yet (client uploads everything).
- Goal: prove the estimate → pay → draft → counsel-review → deliver loop works end to end
  for one matter type in one state.

**Phase 2 — Multi-channel intake**
- Add email agent (read/reply/attach/invoice).
- Add voice agent for account status + basic intake (no legal advice).
- Unify all channels into the same Case record.

**Phase 3 — Retrieval + full agent pipeline**
- Add Retrieval Agent + retainer payment flow.
- Add Legal Research Agent with a real citation-verification step.
- Add Strategy Agent + upsell roadmap logic.
- Add Analytics Agent (success rate) once you have enough case-outcome data to ground it
  honestly.

**Phase 4 — Scale**
- Multi-jurisdiction support (pricing table + template library grows per state).
- Expand matter types.
- Formalize the attorney-review network (in-house vs. contracted per-state reviewers) as
  volume grows.

---

## 10. Open Compliance Questions to Resolve With Real Counsel Before Launch

- Which entity structure keeps this out of UPL territory in your target states (document
  preparation service vs. attorney-owned/managed practice, non-lawyer ownership rules vary
  by state)?
- What disclaimers are required on every AI-generated output ("this is not legal advice")?
- Who is the attorney(s) of record for the Counsel Review gate, and are they licensed in
  every jurisdiction you serve?
- Retainer/refund policy language for retrieval fees.
- Data privacy/retention policy for uploaded legal documents (this is sensitive personal
  data — plan for encryption at rest, access logging, and a retention/deletion policy).

---

## 11. How to Use This With Cursor

1. Save this file as `docs/ASK_AI_LEGAL_SPEC.md` in your repo.
2. Create a `.cursorrules` (or `.cursor/rules`) file that says something like:
   > "This project builds Ask AI Legal per docs/ASK_AI_LEGAL_SPEC.md. Always check that
   > new features route through the Counsel Review gate (Section 5, stage 9) before any
   > client-facing legal document or advice is finalized. Build in the phases described in
   > Section 9 — do not skip ahead to voice/email/retrieval agents before the Phase 1 core
   > loop (intake → estimate → payment → draft → counsel review → delivery) is solid."
3. Start a Cursor session with: *"Read docs/ASK_AI_LEGAL_SPEC.md. Let's scaffold Phase 1:
   the web chat intake → estimate → Stripe payment → drafting → counsel-review dashboard
   loop, for a single matter type. Propose the repo structure first."*
