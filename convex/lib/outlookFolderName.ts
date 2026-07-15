/** Build Outlook Clients/ folder label after payment. */

export function sanitizeFolderSegment(value: string): string {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)
}

export function formatPaidAmountForFolder(amountCents: number): string {
  const dollars = (amountCents / 100).toFixed(2)
  return dollars.replace(/\.00$/, "")
}

export function buildPaidClientFolderName(args: {
  lastName: string
  caseReference: string
  amountCents: number
}): string {
  const last = sanitizeFolderSegment(args.lastName || "Client") || "Client"
  const ref = sanitizeFolderSegment(args.caseReference.toUpperCase()) || "AAL"
  const paid = formatPaidAmountForFolder(args.amountCents)
  return `${last}-${ref}-Paid-${paid}`
}

export const OUTLOOK_CLIENT_SUBFOLDERS = [
  "01-Intake",
  "02-Forms",
  "03-Contract-Invoice",
  "04-Client-Docs",
  "05-Delivery",
] as const
