# Outlook client filing (Ask AI Legal)

**Convex ops is the source of truth.** Outlook folders are the human mirror for email + attachments.

Microsoft 365 / Outlook is already connected for the business (same stack as Cal.com).

## Folder structure (create once)

In Outlook (or Outlook on the web):

```
Inbox
Clients
  _Inbox-To-File
  _Paid-To-File
  {LastName}-{AAL-REF}/     ← create per client when first email arrives or when paid
    01-Intake
    02-Forms
    03-Contract-Invoice
    04-Client-Docs
    05-Delivery
```

Example: `Clients/Garcia-AAL-CH8AE8TW/04-Client-Docs`

## Outlook rules (one-time)

### Rule 1 — All Ask AI Legal case mail

1. Outlook → **Rules** → **New rule**
2. Condition: **specific words in the subject** → `AAL-`
3. Action: **move to folder** → `Clients/_Inbox-To-File`  
   (or assign category `Ask AI Legal Client`)
4. Optional: also run on body containing `AAL-`

### Rule 2 — Stripe payment receipts

1. New rule
2. Condition: from Stripe (`receipt@stripe.com` / `invoice@stripe.com`) **or** subject contains `payment` / `receipt` / `invoice`
3. Action: move to `Clients/_Paid-To-File`
4. When you reconcile: create/move into `Clients/{LastName}-{AAL}/03-Contract-Invoice`

## Always put case ref in the subject

Resend templates already use:

- `{AAL-…} — Personalized intake form | Ask AI Legal`
- `{AAL-…} — Quote, contract & invoice | Ask AI Legal`
- `{AAL-…}` on delivery mail

Reply-all threads keep the reference so rules keep working.

## Power Automate — Flow A (new case mail → OneDrive folders)

1. Go to [make.powerautomate.com](https://make.powerautomate.com) (same Microsoft account as Outlook).
2. **Create** → **Automated cloud flow**
3. Trigger: **When a new email arrives (V3)** in Office 365 Outlook  
   - Folder: Inbox (or `Clients/_Inbox-To-File`)  
   - Filter: Subject includes `AAL-`
4. Actions (approximate):
   - **Compose** case ref: extract with expression from subject (or use the full subject as folder hint).
   - **Create folder** in OneDrive / SharePoint: `Clients/{FromLastName}-{CaseRef}`
   - Create subfolders `01-Intake` … `05-Delivery` (five Create folder steps).
   - **Get attachments** → **Create file** into `04-Client-Docs` or `01-Intake`.
5. Save and turn **On**. Test by emailing yourself with subject `AAL-TEST — hello`.

## Power Automate — Flow B (paid)

1. New automated flow.
2. Trigger: new email in `Clients/_Paid-To-File` **or** subject contains `Paid` + `AAL-`.
3. Actions:
   - Ensure OneDrive folder `Clients/{LastName}-{CaseRef}` exists (create if missing).
   - Save PDF attachments into `03-Contract-Invoice`.
   - Optional: post a Teams message “Paid: AAL-…”.

## Daily operator habit

1. Work from **`/ops/intakes/[caseId]`** (checklist + emails).
2. Sweep `Clients/_Inbox-To-File` → rename into `LastName-AAL-…` once.
3. When Stripe pays → **Mark paid** in ops, file receipt under `03-Contract-Invoice`.

## Do not rely on inbox alone

Search Convex by case reference if Outlook search fails. Attachments uploaded in the website chat also live in Convex `documents` on the case.
