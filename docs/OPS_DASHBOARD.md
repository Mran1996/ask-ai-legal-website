# Ops Dashboard — Matters + Insights

One token-gated dashboard at **`/ops`** with two panels:

```
/ops  (OPS_ACCESS_TOKEN gate, same token as before)
├── Matters   ← client cases, money, docs, emails, drafts
└── Insights  ← site clicks, funnels, top research, revenue  (/ops?tab=insights)
```

`/ops/intakes` redirects to `/ops`. Matter detail stays at `/ops/intakes/[caseId]`.

## Localhost preview

```bash
npm run dev          # + npx convex dev in another terminal
# open http://localhost:3000/ops and enter your ops token
```

## Matters panel

- Stat strip: paid last 7 days · drafts awaiting approval · unpaid contracts · gap questions unanswered.
- Matters table (newest first) with stage stamps: Intake → Form sent → Form returned → Awaiting approval → Invoice sent → Paid → In work → Delivered.
- Cases-by-status bars.

### Matter file (`/ops/intakes/[caseId]`)

Header: client, AAL reference, matter type, stage stamp, fulfillment timeline.
Tabs:

| Tab | Contents |
|-----|----------|
| Overview | Case facts, structured + raw intake, scheduled calls, gap-question status |
| Documents | All uploads/drafts with folder, type, status, links |
| Money | Start fee, Stripe pay link generator, mark paid, Outlook retry, planning estimate; no-refunds agreement note |
| Communications | Part 1 send/resend, form-returned + ack, **gap-questions composer** (one question per line → branded email; mark answered), full email log from `notifications` |
| Drafts | LLM issues draft edit/regenerate/**Approve & send** (client never sees it before approval), start drafting / mark delivered (locked until paid) |

## Gap questions (ask missing info)

- `payments.sendGapQuestions` — saves `gapQuestions`, stamps `gapQuestionsSentAt`, emails the
  client via `emailActions.sendGapQuestionsEmail` (Resend, notification type `gap_questions_client`).
- `payments.markGapQuestionsAnswered` — stamps `gapQuestionsAnsweredAt` when the client replies.
- Insights counts unanswered gap emails under Ops health.

## Insights panel

Events live in the Convex `events` table. The site records them via
`components/analytics-tracker.tsx` (mounted in `Providers`):

- `page_view` — every route change (path, referrer host, device bucket, session id).
  `/ops` pages are excluded so internal work doesn't skew numbers.
- `chat_open` — fired whenever any CTA opens the chat widget (hooks the
  `ask-ai-legal:open-chat` window event; meta = `chat` | `quote`).
- `cta_click` — any element with `data-track="some_id"` (event delegation; add the attribute to
  new CTAs and they show up automatically).

`insights.summary` (ops-token gated, default 14-day window) aggregates:

| Category | Shown |
|----------|-------|
| Traffic | Views/day chart, page views, sessions, top pages, referrers, devices |
| Clicks | CTA clicks by id |
| Research | Case types selected, languages, chat opens/messages |
| Funnel | Visits → chat → intake → form returned → paid → delivered |
| Money | Paid last 7 days / window, unpaid contracts, avg time-to-pay |
| Ops health | Cases by status, drafts awaiting approval, gap emails unanswered, forms outstanding |

**Privacy rule:** Insights stores and shows counts/topics only. Client document text stays on the
matter file. The `events.track` mutation whitelists event names and clips all fields to 200 chars.

## Compliance (unchanged, enforced)

- Document preparation, not a law firm; AI drafts, humans approve every client send.
- **No refunds** — Terms of Service §7 and the Document Preparation Agreement now carry a strict
  no-refund policy (pay = accept).
- Delivery still blocked server-side until paid (and counsel approval once the counsel pipeline
  lands).

## Still to port (Phase 5)

Multi-model counsel pipeline (research → citation verify → draft) lives in the old
`ask-ai-legal-work` repo and is not in this codebase yet. The Drafts tab and `agentRuns` /
`counselReviews` tables are the landing points; the ~day-3 client review email should trigger
after `markWorkStarted` + draft upload.
