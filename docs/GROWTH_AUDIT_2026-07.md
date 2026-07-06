# Ask AI Legal — Growth & Website Audit (July 2026)

**Scope:** Audited from source in this repo (`app/`, `components/`, `lib/i18n/translations/en.ts`, `lib/pricing/`, `lib/chat/`, `convex/`, `docs/`). The production domain is not live; no live-site review was possible. `docs/ASK-AI-LEGAL-MASTER-PLAN.md` and the `~/Documents/Ask AI Legal/` attachments were **not present** — the v2 business model (two-pay, citation pipeline, retainer-trap audience) is taken from the founder brief and compared against what the repo actually says and ships.

**Business model audited against (v2):**
Intake → Pay #1 (retrieval + case file review) → Scope memo (30–120 min) → Pay #2 (draft + case law work) → Citation pipeline (retrieve, store per customer, verify in separate LLM passes) → Delivery. Document preparation + citation-verified research. Not a law firm, not legal advice, no outcome guarantees. Audience: US adults in divorce/custody/civil/family/business disputes, budget ~$750–$2,500.

---

## 1. Executive summary

**What works**
1. The intake loop is genuinely shipped: chat widget → structured intake form → Convex case record → instant estimate with attorney-cost comparison → email notifications → ops queue (`convex/cases.ts`, `convex/estimates.ts`, `/ops/intakes`). Most competitors at this stage have a Typeform.
2. The brand system is real and matches v2: navy `#0c1929` family / cream / gold `#C5A059` / green `#00A95C` are all in `tailwind.config.ts`; the site looks like a premium firm, not an AI template.
3. Disclaimers exist in many of the right places already: chat footer ("Not legal advice · Document generation only · Not a law firm"), services section, CTA section, footer, and the chat system prompt hard-blocks legal advice and invented prices.

**What's broken**
4. **The two-pay model appears nowhere on the site.** `en.ts` sells a one-step "email us for a free case review → custom quote" flow. No Pay #1, no scope memo, no Pay #2, no citation pipeline. The site is selling a business model you've replaced.
5. **The testimonials are fabricated and labeled "Verified client."** Named people with states, case types, star ratings, headshot photos (`public/clients/*.jpg`, plus Unsplash stock URLs in `lib/client-outcomes.ts` — "diverse, professional headshot style"). This is an FTC violation waiting for its first screenshot, and Meta will reject ads pointing at the page. Hard P0.
6. **"Success rate analysis" overclaims:** "run it through our proprietary analysis to estimate how similar matters have resolved," "benchmark your case against thousands of similar outcomes for real, data-backed probability" (`en.ts` services + compare highlights). Per `BUILD_PROGRESS.md`, the Analytics Agent is Phase 3 and unbuilt. This is both false advertising and the closest thing on the site to outcome-prediction (UPL-adjacent).
7. **Wrong audience:** FAQ says "Criminal motions, civil complaints, post-conviction petitions"; a testimonial is post-conviction relief. v2 audience is divorce/custody/civil/family/business. Meanwhile the actual pricing table (`lib/pricing/service-pricing.ts`) only covers CA eviction/civil/small-claims — divorce and custody, your headline market, aren't priced at all.

**Top 3 revenue leaks**
8. **Leak 1 — the primary CTA is `mailto:`.** Hero, nav, compare, consultation, and CTA sections all fire `mailto:support@askailegal.com`. Mailto breaks on desktop-without-mail-client and on most mobile browsers-in-app; industry mailto abandonment is brutal. You built a chat intake that creates a case record and shows a quote — and the hero doesn't point at it. **Leak 2 — you cannot take money:** Stripe (Phase 1.4) is unbuilt, so even a perfect funnel ends in an email thread. **Leak 3 — no price anchoring for the two-pay:** the chat instantly shows a full quote (e.g. $499) with no Pay #1 on-ramp, so the visitor's first number is the biggest one — maximizing sticker-shock bounce.

**Top 3 fixes (in order)**
9. **Fix 1:** Rewrite the homepage around the two-pay flow + retainer-trap enemy + family/civil matter types, delete fabricated testimonials and success-rate claims (copy provided in §6). **Fix 2:** Make "Start your case review" open the chat intake (not mailto) everywhere; mailto becomes the fallback in the footer. **Fix 3:** Ship Stripe Checkout for Pay #1 only (one price, one product) before any ad spend — Pay #2 can stay invoice-by-email for the first 20 customers.
10. **Do not spend a dollar on ads** until: testimonials removed, success-rate copy removed, Pay #1 payable, and a UPL review of the final copy by licensed counsel (the repo's own spec, Section 10, says the same).

---

## 2. End-to-end customer journey map

| Stage | Customer emotion | Our job | Failure mode | KPI | Owner |
|---|---|---|---|---|---|
| **Awareness** (IG/FB reel or ad) | Frustrated, betrayed by legal system; "I paid a lawyer and still lost ground" | Name the retainer trap in their words; be entertaining first, product second | Sounding like a law firm ad or an AI gimmick | 3-sec hold rate >30%; saves/shares | Founder (content), automation (scheduling) |
| **Social profile** | Skeptical curiosity: "is this real?" | Bio states exactly what we are/aren't; highlights show process + pricing logic | Bio vagueness; no link path | Profile→link tap >8% | Founder |
| **Site landing** | Hopeful but burned before; scanning for a catch | Two-pay flow above the fold; enemy named; disclaimer visible but not dominant | Mailto CTA; "AI legal magic" vibes; wall of services | Land→chat open >12%; bounce <55% | Automation |
| **Chat / intake** | Anxious to be understood; fear of being judged | Plain-language questions; confirm state + matter type; set scope-memo expectation | Asking for payment before demonstrating understanding; robotic tone | Chat→intake submit >35% | Automation (built ✅) |
| **Pay #1** | Commitment anxiety: "is $X going to be wasted like the retainer was?" | Frame Pay #1 as a diagnostic that *credits toward* Pay #2; instant receipt with what happens next + exact clock | No Stripe (current state = dead end); unclear deliverable | Intake→Pay #1 >25% | Automation (Stripe — **unbuilt**) |
| **Scope memo (30–120 min)** | Waiting; refreshing inbox | Deliver *early*; memo readable by a non-lawyer; ends with one clear Pay #2 recommendation + price | Memo late, jargon-heavy, or reads like an upsell | Memo on-time rate 100%; memo→Pay #2 >50% | Founder (manual v1) |
| **Pay #2** | "Okay, they actually read my file" — highest trust moment of funnel | Strike within 24h of memo: one-click pay link, deadline urgency if real | Letting the memo sit >48h; re-negotiating scope | Memo→Pay #2 conversion; time-to-pay | Founder nudge + automation link |
| **Drafting + citation pipeline** | Impatience + fear of quality | Status updates at start/50%/done; citation verification note in delivery | Silence; missed turnaround promise | Promised-date hit rate 100% | Founder + pipeline (partial) |
| **Delivery** | Relief, pride ("I can walk into court with this") | Delivery email that explains each document in plain English + what to do next; ask nothing yet | Dumping PDFs with no guidance | Revision requests <30%; NPS ask at +3 days | Founder (manual v1) |
| **Referral** | Evangelical if it worked | +7 days: ask for a private text-a-friend referral (NOT a public review yet — see §7) | Asking for public testimonials without a consent/compliance process | Referral rate >15% | Automation (email) |

---

## 3. Operations map (max profit)

### Automate vs. stay manual in v1

| Step | v1 decision | Why |
|---|---|---|
| Intake + estimate | **Automated** (already built) | Working; don't touch except copy |
| Pay #1 checkout | **Automate now** (Stripe Checkout, single price) | One product, one price = 1 day of work; unblocks all revenue |
| Scope memo | **Manual (founder)** | This is your quality signal and your pricing-judgment training data; automating it early produces generic memos and kills Pay #2 conversion |
| Pay #2 invoicing | **Manual** (Stripe payment link pasted into email) | Volume doesn't justify build |
| Case-law retrieval + citation verification | **Semi-manual**: use tooling interactively, but the *storage per customer* discipline from day 1 | The differentiator claim must be true before it goes on the site |
| Drafting | **Manual with AI assist** | Quality control; you are the counsel-review gate the spec demands until real counsel is retained |
| Delivery + follow-ups | **Automate emails** (Resend already wired) | Templates in §5 |
| Ops queue | Built (`/ops/intakes`) — keep | |

### Pricing psychology, Pay #1 vs Pay #2

1. **Pay #1 = $149–$249 flat, everywhere, every matter type.** It must feel like a no-brainer against the $3,500 retainer memory. Name it something concrete: **"Case File Review — $199."** Do not call it a retainer, deposit, or consultation fee.
2. **Credit it:** "Your $199 is credited in full toward your document package." This converts Pay #1 from a cost into a down payment and is your single biggest drop-off reducer.
3. **Pay #2 = quoted in the scope memo, $600–$2,300 band.** Always present as *one recommended package + price*, with at most one smaller alternative ("motion only: $750 / motion + hearing prep: $1,400"). Never a menu of nine services — the current `/services` grid is browsing material, not a pricing model.
4. **Anchor in the memo, not the homepage:** memo shows "Attorneys typically charge $X–$Y for this scope" (from `service-pricing.ts` reference rows — extend the table to divorce/custody/family first, keep the "maintained data, not LLM guesses" rule already in the code comments).
5. Psychology of the sequence: Pay #1 buys *certainty* ("know exactly what your case file says and what it needs"), Pay #2 buys *output*. People burned by retainers will pay small for certainty; they will not pay large for promises.

### Reducing Pay #1 → Pay #2 drop-off

| Lever | Mechanic |
|---|---|
| Speed | Deliver the memo faster than promised (promise 120 min, deliver in 45 when possible) |
| Credit | $199 credit stated in memo header AND in Pay #2 checkout line item |
| Deadline honesty | If their filing deadline is real, state it in the memo with a "start by [date] to make it" line — urgency you didn't invent |
| One decision | Memo ends with a single recommendation and a single button/link |
| 24h + 72h nudges | Email templates in §5; stop after two — desperate follow-up smells like the lawyers they left |
| Expiry | Quote valid 14 days (case files go stale; also true) |

---

## 4. Marketing plan — 90 days

### Organic (IG @askailegal + FB, same brand)

**Four weekly themes (rotate all 90 days):**
1. **Retainer Trap Stories** (Mon/Tue) — anonymized composite stories of paying thousands and getting silence. Entertainment/validation first. *(Composite = clearly framed as "stories we hear," never fake named clients.)*
2. **Read Your Own Case File** (Wed) — education: what a docket is, what "answer" means, what that motion against you actually says. Pure value, screen-recorded plain-English breakdowns of public/sample documents.
3. **How We Actually Work** (Thu/Fri) — behind the curtain: what a $199 case file review contains, what citation verification means, why we store every cited case. Product education *after* the audience is warm.
4. **Courtroom Confidence** (Sat/Sun) — self-represented litigant wins culture (news stories, rule changes, "you're allowed to ask the clerk this") — shareable, follows-driver.

**30-day content calendar** (1 Reel + 1 carousel/day; Reel = hook → beat → CTA):

| Day | Theme | Reel: hook → script beat → CTA | Carousel |
|---|---|---|---|
| 1 | Trap | "She paid $4,500 and her lawyer never read the file." → what a retainer actually buys → "Follow for what they don't tell you" | "5 signs you're in the retainer trap" |
| 2 | Trap | "The invoice said 0.2 hours: read email." → billable-hour math on screen → follow | "What $350/hr really buys (a breakdown)" |
| 3 | File | "You're allowed to read your own court file. Here's how." → county portal walkthrough → save this | "How to pull your case docket in 10 min" |
| 4 | How | "What's actually in a $199 case file review?" → show a (sample) scope memo page by page → "Link in bio" | "Scope memo, annotated" |
| 5 | Confidence | "Judges don't hate self-represented people. Unprepared ones." → clerk etiquette → share with someone in court | "7 things clerks wish you knew" |
| 6 | Trap | "Why your lawyer goes quiet after the retainer clears" → incentive structure explained → follow | "Retainer vs flat fee vs two-pay, compared" |
| 7 | File | "This one page decides your custody schedule." → parenting-plan section breakdown → save | "Custody paperwork glossary" |
| 8 | How | "We verify every case citation twice. Here's why." → hallucinated-citation news stories → bio link | "How citation verification works (3 steps)" |
| 9 | Trap | "'We'll need another $2,000 to continue.' Sound familiar?" → evergreen-retainer mechanics → follow | "Questions to ask before paying any retainer" |
| 10 | Confidence | "She showed up with a binder. Opposing counsel had a folder." → preparation beats posturing → share | "Build your court binder (checklist)" |
| 11 | File | "What 'Answer due in 30 days' actually means" → default-judgment stakes → save | "Deadlines that can end your case" |
| 12 | How | "Watch me turn a shoebox of papers into a case file" (timelapse) → organization is 50% of prep → bio link | "Intake → memo → draft: our pipeline" |
| 13 | Trap | "$12,000 later, the motion was 6 pages." → cost-per-page math → follow | "What legal documents actually cost to produce" |
| 14 | Confidence | "You can ask the judge to explain. Really." → courtroom rights → share | "10 phrases that work in family court" |
| 15 | File | "Divorce petition, translated to English" → paragraph-by-paragraph → save | "Petition vs decree vs order" |
| 16 | How | "Why we make you pay twice (it's cheaper)" → two-pay logic in 30 seconds → bio link | "Pay #1 / Pay #2 explained" |
| 17 | Trap | "The consultation was free. Everything after wasn't." → free-consult funnel exposed → follow | "Free consult red flags" |
| 18 | File | "What the other side's lawyer filed against you, decoded" → sample motion walkthrough → save | "Anatomy of a motion" |
| 19 | Confidence | "Self-represented and won the hearing. Here's the pattern." → preparation narrative (no client specifics) → share | "Hearing-day checklist" |
| 20 | How | "Where your $199 goes, line by line" → radical price transparency → bio link | "Our pricing, itemized" |
| 21 | Trap | "Lawyers bill you to read the documents you gave them." → intake double-billing → follow | "Your intake rights" |
| 22 | File | "The custody factor judges weigh most (it's in the statute)" → read the actual statute on screen → save | "Best-interest factors, plain English" |
| 23 | How | "AI wrote it. A human verified every citation. That's the order that matters." → our pipeline vs 'AI lawyer' apps → bio link | "AI + human review: what we check" |
| 24 | Confidence | "The clerk's office is free legal infrastructure." → what clerks can/can't do → share | "What to bring to the clerk's window" |
| 25 | Trap | "Why he fired his lawyer and finished the case himself" → composite story arc → follow | "When self-representation makes sense (and when it doesn't)" |
| 26 | File | "Your proof of service is why you're losing" → procedural traps → save | "Service of process in 6 slides" |
| 27 | How | "From memo to court-ready draft in 72 hours" → drafting montage → bio link | "What 'court-ready' means (formatting rules)" |
| 28 | Confidence | "Prepared beats expensive." → thesis reel, brand manifesto → share + follow | "Our manifesto" |
| 29 | Trap | "Add up what you've paid. Now ask what you can show for it." → direct-address → bio link | "The $199 alternative to another retainer" |
| 30 | How | "Month one, unfiltered: what we shipped" → founder-facing recap → follow for month 2 | "30 days of building in public" |

**Bio:** `Court-ready documents + verified case-law research for people handling their own case. Not a law firm · No legal advice · Flat fees. Start with a $199 case file review ⬇️`

**Highlight covers (navy/gold, 5):** `How it works` · `Pricing` · `Case file 101` · `FAQ` · `Not a law firm` (yes, make the disclaimer a highlight — it converts skeptics).

**Hashtag sets (rotate 3):**
- A (family): `#divorcesupport #custodybattle #familycourt #selfrepresented #prose #divorcecommunity #coparenting`
- B (empowerment): `#knowyourrights #legalhelp #courtprep #legaldocuments #accesstojustice #diylegal`
- C (money): `#lawyerfees #retainer #legalfees #divorcecost #custodycost #flatfee`

### Paid ads (Meta) — only after §7 P0s are cleared

**Angle 1 — The Retainer Trap (cold, emotional):**
- Primary text: *"Thousands paid. Calls unreturned. And you still don't know what's actually in your case file. There's another way to get court-ready: a flat-fee case file review that tells you exactly where your case stands and exactly what documents it needs — in plain English, usually within 2 hours. $199, credited toward any document package. We're not a law firm and we don't give legal advice — we prepare documents and verified research so you can move your own case forward."*
- Headline: **"Know what's in your case file — $199 flat."** CTA button: Learn More.
- ⚠️ Note the framing: describes *our service and the reader's situation with money*, never asserts the reader's personal legal status ("your divorce") — see §7 Meta rules.

**Angle 2 — Price transparency (cold/warm, rational):**
- Primary text: *"Legal document preparation shouldn't be a mystery invoice. Our pricing has two numbers: a $199 case file review, then one flat quote for the exact documents your matter needs — motions, responses, petitions, hearing prep. Every case citation we use is retrieved, stored, and verified before it reaches your draft. No hourly billing. No surprise retainers. Not a law firm, no legal advice — document preparation and research you review and file yourself."*
- Headline: **"Two prices. Zero hourly billing."** CTA: Learn More.

**Angle 3 — Citation verification / anti-AI-slop (warm, differentiation):**
- Primary text: *"You've seen the headlines: AI 'lawyers' citing cases that don't exist. Here's our rule — every case we cite gets pulled from the actual reporter, stored in your file, and verified in a separate review pass before it ever appears in your document. AI does the heavy lifting. Verification makes it court-ready. Flat-fee document preparation for people handling their own civil, family, and business matters."*
- Headline: **"Every citation verified. Every price flat."** CTA: Learn More.

**Targeting:** US, 28–60, broad with interest layers per angle — Angle 1/2: interests "family law," "mediation," "LegalZoom," "Avvo"; Angle 3: "artificial intelligence" ∩ legal interests. Exclude your followers for cold. **Do NOT use** relationship-status targeting or "recently divorced" style segments — policy risk and creepiness. Advantage+ placements, IG Reels priority.

**Budget ramp:** Wk 1–2: $20/day, 3 angles × 1 creative, optimize for landing-page views. Wk 3–4: $35/day on the 2 surviving angles, optimize for InitiateCheckout (Pay #1 click). Wk 5+: $50–75/day only if blended CAC per Pay #1 < 0.7 × Pay #1 price.

**Kill / scale rules:** Kill any ad with CPM-adjusted CTR <0.8% after $50 spend, or landing→chat-open <8% after 200 clicks. Scale (+20%/3 days, never double overnight) anything producing Pay #1 checkouts under $140 CAC. Judge angles on Pay #1s, not clicks — Angle 3 will win clicks and may lose wallets.

---

## 5. Brand messaging kit

**Enemy statement (one sentence):**
> The retainer trap: paying thousands up front for a lawyer's time and still not knowing what's in your own case file.

**Tagline (3 options):**
1. **"Know your case. Own your case."**
2. "Court-ready documents. Verified research. Flat fees."
3. "Out of the retainer trap. Into your case file."

**Elevator pitch (15 sec):**
> "We do document preparation and citation-verified legal research for people handling their own divorce, family, civil, or business matters. You pay a flat $199 for a review of your case file, get a plain-English memo on exactly what your case needs, then one flat quote for the documents. Every case we cite is retrieved and verified. We're not a law firm and we don't give legal advice — we make you the most prepared person in the room."

**10 approved phrases:** document preparation · citation-verified research · court-ready documents · flat fee, quoted up front · case file review · plain-English scope memo · you review and file yourself · credited toward your document package · we are not a law firm · the most prepared person in the room

**10 forbidden phrases:** win / winning your case · guarantee(d) · legal advice (as an offering) · your lawyer / your attorney (re: us) · law firm without the lawyers · success rate · we'll fight for you · attorney-quality (invites the comparison you can't defend) · verified client (until real, consented reviews exist) · represent you

**Email subjects:**
| Email | Subject | Note |
|---|---|---|
| Pay #1 receipt | `Your case file review is underway — memo within 2 hours` | Receipt + expectation in one line |
| Scope memo delivery | `Your scope memo is ready: what your case file needs next` | No price in the subject |
| Pay #2 nudge (24h) | `Your $199 credit is waiting — quote inside expires [date]` | Credit + real expiry |
| Pay #2 nudge (72h, final) | `Before your quote expires: one question?` | Invites reply, then stop |

---

## 6. Website audit (page-by-page, P0/P1/P2)

### P0 — must change before any launch or ad spend

| # | Location | Problem | Fix |
|---|---|---|---|
| 1 | `components/testimonials.tsx`, `lib/client-outcomes.ts`, `en.ts testimonials`, `public/clients/*.jpg` | Fabricated named testimonials with photos, states, star ratings, and a "Verified client" badge. FTC §255 violation; Meta ad-account risk; catastrophic if screenshotted at launch | **Remove the section entirely.** Replace with a "How a case file review works" walkthrough (sample memo screenshots) or a founder's-note block. Real testimonials only with written consent + no outcome claims, later |
| 2 | `en.ts` `services.items[4]` + `compare.highlights[2]` ("Success rate analysis", "know your odds", "thousands of similar outcomes", "data-backed probability") | Claims an unbuilt capability (Analytics Agent = Phase 3, unchecked in `BUILD_PROGRESS.md`); outcome-prediction is also the most UPL-adjacent copy on the site | Delete both blocks. If you want a 4th pillar, replace with **"Citation verification"** — the differentiator that's real |
| 3 | Whole homepage | **Two-pay flow absent.** Site sells "email for a free case review → custom quote" — the v1-that-never-launched model | Rebuild `HowItWorks` as 4 steps: **1. Tell us your case (chat, ~10 min) → 2. $199 case file review → 3. Scope memo in plain English (usually within 2 hours) → 4. One flat quote; documents delivered court-ready.** Add "$199 credited toward your documents" |
| 4 | All CTAs (`hero-section.tsx`, `navigation.tsx`, `cta-section.tsx`, compare, consultation — all `SUPPORT_MAILTO`) | Primary conversion path is `mailto:` while a working chat intake exists | Primary CTA opens the chat widget's Quote tab (expose an `openChat()` via context or a custom event). Email moves to footer/fallback |
| 5 | `en.ts` `faq.items[5]` ("Criminal motions… post-conviction petitions") + Denise/post-conviction testimonial | Wrong audience vs v2 (divorce/custody/civil/family/business), and criminal work is the highest-risk place for a non-firm to play | Matter types everywhere become: "Divorce & custody · Family court · Civil disputes · Small business disputes · Responses & motions." Remove criminal/post-conviction references |
| 6 | `en.ts` `hero` stats ("72 hrs", "100%", "Custom") | Unsubstantiated claims presented as stats; "100% Documents" is meaningless | Replace with process facts: **"$199 to start" / "2 hrs typical scope memo" / "1 flat quote, no hourly billing"** (only if operationally true) |
| 7 | Pricing table (`lib/pricing/service-pricing.ts`, `convex/lib/servicePricing.ts`) | CA-eviction-centric placeholder rows; divorce/custody — the launch audience — has no pricing at all; code comments themselves say "replace before launch" | Add counsel-reviewed rows for divorce/custody/family across launch states; until then the chat estimate will quote family cases as "custom quote," which undercuts the transparency positioning |
| 8 | Compliance process | Repo spec §0/§10 mandates a UPL review + counsel-review gate before launch; `BUILD_PROGRESS.md` shows both unchecked | Get the final site copy + ToS/disclaimer pages reviewed by licensed counsel before go-live. Non-negotiable per your own spec |

**P0 copy rewrites:**

**Hero** (`en.ts` `hero`):
> **Headline:** You paid the retainer. Do you know what's in your case file?
> **Subhead:** We prepare court-ready documents and citation-verified research for people handling their own divorce, family, civil, and business matters. Start with a flat **$199 case file review** — get a plain-English memo on exactly where your case stands and what it needs. Credited in full toward your documents.
> **Primary CTA:** Start my case file review — $199
> **Secondary CTA:** See how the two-step process works
> **Under-CTA line:** Not a law firm · No legal advice · You review and file everything yourself

**FAQ** (replace `faq.items`; keep #1/#3 as-is, they're good):
1. *Are you a law firm?* — (keep current answer; it's correct)
2. *What do I get for $199?* — "A case file review: we read what you send us — filings, notices, letters, court documents — and deliver a plain-English scope memo, usually within 2 hours. It tells you where your case stands procedurally, what documents it needs next, and one flat quote to prepare them. The $199 is credited in full toward that quote."
3. *Why two payments instead of one price up front?* — "Because quoting document work before reading your file is guessing — that's how retainers balloon. The small first payment covers actually reviewing your case file; the second is a fixed quote for exactly the work the memo describes. No hourly billing at either step."
4. *What kinds of cases do you handle?* — "Divorce and custody, family court matters, civil disputes, small business disputes, and the responses, motions, and letters they require — across U.S. jurisdictions. If your matter isn't a fit, we'll say so in the memo and refund your review fee." *(only promise the refund if you'll honor it — recommended: it's cheap trust)*
5. *How do I know your legal citations are real?* — "Every case we cite is retrieved from the actual source, stored in your case file, and verified in a separate review pass before it appears in your document. You receive the citation list with your delivery."
6. *Will you appear in court or file for me?* — (keep current "No — never" answer)
7. *Can I request revisions?* — (keep, tie to quoted scope)

**CTA section** (`en.ts` `cta`):
> **Title:** Stop paying for hours. Start with your file.
> **Body:** A $199 case file review tells you exactly where your case stands and what it will cost to prepare — before you commit to anything else. Credited in full toward your documents.
> **Button:** Start my case file review
> **Disclaimer line (keep visible):** Not a law firm · No legal advice · Document preparation & research only

### P1 — before scaling spend

| # | Location | Problem | Fix |
|---|---|---|---|
| 9 | `en.ts` FAQ #2 ("Why don't you list prices?") vs chat estimate | Site says "we don't list prices"; the chat widget instantly displays one. Contradiction erodes the transparency claim | With the two-pay model, prices *are* listed ($199 + memo quote) — delete this FAQ, replaced by rewrite #3 above |
| 10 | `compare` section (`en.ts`) | Good bones (retainer vs flat) but generic; "The difference" doesn't name the enemy | Retitle **"The retainer trap vs. the two-step flat fee."** Traditional column: "$3,000–$10,000 retainer, drawn down hourly · You may never see your own case file analysis · Costs grow with every call." Our column: "$199 file review → plain-English memo → one flat quote → verified citations" |
| 11 | Chat estimate screen (`chat-widget.tsx` intake success) | Shows a full-price quote with attorney comparison — the old one-pay model in UI form | Reframe result as: "Recommended service + estimated range. Next step: $199 case file review (credited) → exact quote in your scope memo." When Stripe ships, the Pay #1 button lives here |
| 12 | `layout.tsx` metadata | Title/OG still "Legal Document Generation… Attorney-quality motions" — "attorney-quality" is a forbidden phrase | `title: "Ask AI Legal — Court-Ready Documents & Verified Legal Research, Flat Fee"`; description leads with $199 review + not-a-law-firm |
| 13 | `SITE_TAGLINE` ("Where Law Meets Intelligence.") | Brand-voice mismatch: abstract, AI-clever, says nothing to a scared parent in custody proceedings | Adopt tagline option 1 (§5): "Know your case. Own your case." |
| 14 | Services grid (9 items, `en.ts` + `/services`) | Menu-of-everything dilutes; several items ("Success rate analysis") are P0-removed anyway | Collapse to 5: Case file review · Case & legal research (verified citations) · Document preparation · Hearing preparation (written materials) · Revisions. Map each to the phase of the two-pay flow it belongs to |
| 15 | No pricing page | Two-pay model deserves its own explainer URL for ads (`/pricing` or `/how-it-works`) | Build a simple page: the 4 steps, $199, quote band ("most document packages fall between $750–$2,500"), FAQ anchors. Ads land here |
| 16 | Disclaimer placement | Present in footer/chat/services but *not* within the hero viewport | Add the one-line disclaimer under the hero CTA (rewrite above includes it) |

### P2 — post-launch polish

| # | Item |
|---|---|
| 17 | `CLAUDE.md` says primary brand color is emerald `#00A95C`/sky with the old tagline — stale vs the shipped navy/gold system; update so future AI/dev work doesn't regress the brand |
| 18 | 8 locales shipped (`ar/es/fr/hi/tl/vi/zh`) — every P0 copy change must propagate or those locales will still sell the dead model; consider launching EN+ES only |
| 19 | Hero is a full-viewport navy shader with typewriter effect — beautiful, but test LCP/CLS on mid-range Android before ad traffic; `prefers-reduced-motion` is respected (good) |
| 20 | Add an "Our process" page with a real (redacted/sample) scope memo — the single most persuasive asset you can ship |
| 21 | `/ops` routes: confirm they're excluded from sitemap/robots and gated beyond the token before the domain goes live |

---

## 7. Compliance guardrails

**UPL-safe language rules (site + ads):**
1. Always pair capability with limitation in the same breath: "we prepare documents **you review and file yourself**."
2. Never: advise, recommend a legal strategy *to a specific person in public copy*, predict outcomes, use "your lawyer/attorney" about yourselves, or say "we'll tell you if you have a case" (say "where your case file stands procedurally").
3. The scope memo is the riskiest artifact: it must describe *documents and procedure* ("your file shows an answer is due; the following documents are commonly required"), not *strategy advice* ("you should argue X"). Have counsel review the memo **template**, not just the site.
4. Keep the repo spec's counsel-review discipline: until a licensed attorney reviews outbound drafts, the founder is doing quality review only and copy must not imply attorney involvement (currently the site never claims it — keep it that way; also remove "attorney-quality").
5. Disclaimer trio appears: hero (one line), chat footer (✅ built), every delivery email, ToS/Disclaimer pages.
6. Testimonials: FTC 16 CFR Part 255 — endorsements must reflect real, typical experience; fabricated personas are actionable. When real ones exist: written consent, no outcome language ("I won"), no "verified" badge without a verification process you can describe.

**Meta legal-ad cautions:**
- Legal services is **not** a Special Ad Category (that's housing/employment/credit/social issues) — but Meta's **personal attributes policy** applies hard: ad copy may not assert or imply the reader's legal situation, marital status, or financial status. ❌ "Going through a divorce?" ✅ "Divorce paperwork shouldn't cost a second retainer." All three §4 ad drafts follow this.
- No outcome promises, no "win," no fear-mongering imagery (gavel-slamming-on-family type creative gets rejected as sensational).
- Expect higher review friction: keep a clean landing page (P0s fixed), matching claims between ad and page, and the disclaimer visible on the landing page.
- Run everything through a checking pass before publish: does any sentence promise an outcome, claim a stat we can't source, or address the reader's personal legal status? If yes, rewrite.

---

## 8. Metrics dashboard (weekly spreadsheet)

**Columns:** Week · IG followers (Δ) · Reel views (top/median) · Profile→link taps · Site sessions · Chat opens · Chat→intake submits · Intakes · Pay #1 count · Pay #1 revenue · Intake→Pay #1 % · Memos delivered on time % · Memo→Pay #2 % · Pay #2 revenue · Avg Pay #2 $ · Blended CAC (spend ÷ Pay #1s) · Ad spend · Refunds/complaints · NPS asks sent/answered

**Targets:**

| Metric | Month 1 | Month 2 | Month 3 |
|---|---|---|---|
| Site sessions/wk | 150 (organic only) | 500 | 1,000 |
| Chat open rate | 10% | 12% | 14% |
| Chat→intake submit | 30% | 35% | 40% |
| Intake→Pay #1 | 15% (new flow) | 22% | 28% |
| Memo→Pay #2 | 40% | 50% | 55% |
| Pay #1s/wk | 2–3 | 8 | 15 |
| Revenue/mo | ~$3–5k | ~$12k | ~$25k |
| CAC per Pay #1 | n/a (organic) | <$140 | <$120 |
| Memo on-time | 100% | 100% | 100% |

---

## 9. 30-day founder checklist (before scaling ads)

**Week 1 — stop the bleeding (site):**
1. Remove testimonials section + `public/clients/` photos + `client-outcomes.ts` usage (P0-1).
2. Delete success-rate copy from services + pillars (P0-2).
3. Apply hero/FAQ/CTA rewrites from §6; matter types → family/civil/business (P0-3,5,6).
4. Rewire all CTAs from `mailto:` to chat-open (P0-4).
5. Update metadata + tagline (P1-12,13).

**Week 2 — make money possible:**
6. Stripe account (test → live); Checkout for one product: "Case File Review — $199" (spec Phase 1.4).
7. Wire Pay #1 button into chat intake-success screen; webhook flips case status.
8. Write the scope-memo template; send it + final site copy to licensed counsel for UPL review (P0-8).
9. Extend pricing table with counsel-reviewed divorce/custody/family rows (P0-7).
10. Email templates (§5 subjects) into Resend.

**Week 3 — organic engine:**
11. Publish IG/FB bio, highlights, first 7 days of §4 calendar; batch-record 10 Reels in one session.
12. Build `/how-it-works` landing page for future ads (P1-15).
13. Post daily; 30 min/day engaging in divorce/custody/pro-se communities (give answers, never pitch).
14. Run 3 friendlies through the full flow: intake → Pay #1 (test mode) → memo in <2h → Pay #2 quote. Fix every snag.

**Week 4 — controlled ignition:**
15. Counsel sign-off received? If no → keep organic only. If yes:
16. Launch §4 ads at $20/day, 3 angles.
17. Daily: check metrics sheet (§8); deliver every memo same-day; send Pay #2 nudges on schedule.
18. Weekly retro: kill/scale per §4 rules; write down every intake question you couldn't answer — that's next month's content and FAQ.

**Daily non-negotiables:** respond to every intake within 2 business hours · memo on time, every time · one content post · log the numbers.

---

## 10. Gaps & contradictions in the master plan vs. repo

| # | Gap | Detail | Recommendation |
|---|---|---|---|
| 1 | **Master plan v2 isn't in the repo** | `docs/` has only the v1 spec, build tracker, architecture doc. Anyone (human or AI) building from this repo builds the wrong model | Commit `docs/ASK-AI-LEGAL-MASTER-PLAN-V2.md` (two-pay, citation pipeline, retainer-trap audience, brand voice, forbidden phrases). Make it the referenced source in `.cursor/rules` and `CLAUDE.md` |
| 2 | **v1 spec contradicts v2 on payment structure** | Spec §7: per-document flat fee + optional retrieval retainer. v2: Pay #1 review → memo → Pay #2 | Amend spec §7 or supersede with v2 doc; update `BUILD_PROGRESS.md` Phase 1.4 to build Pay #1 checkout (not estimate-accept checkout) |
| 3 | **v1 spec mandates an attorney counsel-review gate; v2 brief never mentions attorneys** | Spec §0 calls the human-attorney gate "the thing that keeps the business legal"; v2 describes LLM verification passes only | This is the most important unresolved question in the business. Get an explicit counsel opinion: is doc-prep-without-attorney-review defensible in your launch states? Don't silently drop the gate — decide it |
| 4 | **Launch audience vs. built pricing** | v2 audience = divorce/custody/family; the only priced matters are CA eviction/civil/small-claims/demand letters | Either launch where pricing exists (CA housing/civil) or price the family vertical before marketing to it |
| 5 | **Site copy vs. chat behavior on pricing** | FAQ: "we don't list prices"; chat: instantly displays a price | Resolved by two-pay copy (§6 rewrites) — prices become public and consistent |
| 6 | **Citation differentiator invisible** | v2's core moat (retrieve, store per customer, verify in separate passes) appears nowhere in `en.ts` | Make it pillar #1 on the site and Ad Angle 3; it's also the honest replacement for the success-rate claims |
| 7 | **`CLAUDE.md` brand is stale** | Says primary = emerald `#00A95C`/sky with old tagline; shipped site is navy/gold/cream (matching v2) | Update `CLAUDE.md` so future sessions don't "fix" the site back to the old palette |
| 8 | **Social direction vs. site tone** | v2 voice: plain English, entertainment-led social. Site tagline "Where Law Meets Intelligence" + Cormorant serif "prestige firm" aesthetic skews old-law | Keep the premium look (it counters AI-gimmick perception) but swap the abstract tagline for plain-English (§5); social stays entertainment-first per §4 |
| 9 | **8 languages with no ops capacity** | Full intake + chat in 8 locales; a Vietnamese-speaking client's memo/emails will arrive in English from a solo founder | Launch EN+ES; hide other locales until fulfillment can match them |
| 10 | **No refund/expiry policy anywhere** | Two-pay creates new questions (memo says we can't help — now what?) that ToS/FAQ don't answer | Add: Pay #1 refunded if we decline the matter; quotes valid 14 days; revision scope. Counsel reviews the language |

---

*Prepared July 2026 from repo source at commit `8c2983d`. Nothing in this document is legal advice; compliance items require review by licensed counsel before launch.*
