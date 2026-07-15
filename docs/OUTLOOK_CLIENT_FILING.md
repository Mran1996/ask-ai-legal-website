# Outlook client filing (Ask AI Legal)

**Convex ops is the source of truth.** Outlook folders are the human mirror for email + attachments.

## Preferred naming (after paid)

When ops clicks **Mark paid** (or Stripe Checkout completes), Convex schedules `outlookActions.createClientOutlookFolder`:

```
Clients/{LastName}-{AAL-REF}-Paid-{amount}/
  01-Intake
  02-Forms
  03-Contract-Invoice
  04-Client-Docs
  05-Delivery
```

Example: `Clients/Puri-AAL-HN8AH8DG-Paid-499.99`

Path is stored on the case as `outlookFolderPath` / `outlookFolderId` / `outlookFolderCreatedAt`.

## Microsoft Graph (Convex automation)

### 1. Azure app registration

1. [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations** → **New**.
2. Name: `Ask AI Legal Outlook Folders`.
3. Accounts: single tenant.
4. **Certificates & secrets** → new client secret → copy value.
5. **API permissions** → Microsoft Graph → **Application** permissions:
   - `Mail.ReadWrite`
   - `MailboxSettings.Read` (optional)
6. Click **Grant admin consent** for the tenant.
7. Note **Directory (tenant) ID** and **Application (client) ID**.

### 2. Convex production env

```bash
npx convex env set MICROSOFT_GRAPH_TENANT_ID "<tenant-id>" --prod
npx convex env set MICROSOFT_GRAPH_CLIENT_ID "<client-id>" --prod
npx convex env set MICROSOFT_GRAPH_CLIENT_SECRET "<secret>" --prod
npx convex env set MICROSOFT_GRAPH_MAILBOX "support@askailegal.com" --prod
```

Mailbox must be the user/shared mailbox where folders should appear.

### 3. Behavior

- If all four env vars are set: Graph creates `Clients` → paid folder → five subfolders; best-effort moves messages whose subject contains `AAL-…` into the paid folder.
- If any var is missing: **stub mode** — still writes `outlookFolderPath` on the case and logs “Graph not configured”; use Power Automate Flow B below.
- Ops can click **Retry Outlook folder** on the case page.

## Power Automate — Flow B (paid — backup / until Graph is live)

1. [make.powerautomate.com](https://make.powerautomate.com) → **Automated cloud flow**.
2. Trigger: **When a new email arrives (V3)** (Office 365 Outlook)
   - Folder: Inbox or `Clients/_Paid-To-File`
   - Subject filter includes `AAL-` (and optionally `Paid`)
3. Actions:
   - **Compose** folder name: `{LastName}-{AAL}-Paid-{amount}` (parse subject / use fixed $499.99 until Convex Graph is on).
   - **Create folder** under Inbox: `Clients` (if missing), then the client folder, then:
     - `01-Intake`, `02-Forms`, `03-Contract-Invoice`, `04-Client-Docs`, `05-Delivery`
   - **Move email** into that client folder (or `03-Contract-Invoice` for Stripe receipts).
4. Save → **On**. Test with subject `AAL-TEST — Paid 499.99`.

### Alternate Flow B trigger (ops email)

When Convex marks paid without Graph, have ops BCC themselves a one-line mail with subject `{AAL} — Paid` so Flow B still fires.

## Folder structure helpers

```
Inbox
Clients
  _Inbox-To-File
  _Paid-To-File
  {LastName}-{AAL}-Paid-{amount}/
    01-Intake … 05-Delivery
```

## Outlook rules (one-time)

### Rule 1 — Case mail → staging

Subject contains `AAL-` → move to `Clients/_Inbox-To-File`.

### Rule 2 — Stripe receipts

From Stripe receipt/invoice → `Clients/_Paid-To-File` → reconcile into the paid client folder `03-Contract-Invoice`.

## Always put case ref in the subject

Resend templates include `AAL-…` on Part 1, ack, issues/invoice, and delivery mail.

## Power Automate — Flow A / Flow C

- **Flow A**: new case mail → ensure nested folders for early intake.
- **Flow C**: Part 1 returned with attachments → file Word into `02-Forms` / docs into `04-Client-Docs`.

(Keep these even when Graph is on — Graph currently focuses on **paid** folder creation + optional move.)

## Daily operator habit

1. Work from **`/ops/intakes/[caseId]`**.
2. Approve & send → client pays → **Mark paid** (creates/stubs Outlook folder).
3. Confirm folder path on the case checklist; if stub, run Flow B or **Retry Outlook folder** after Graph env is set.

## Do not rely on inbox alone

Search Convex by case reference if Outlook search fails.
