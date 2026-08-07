import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/site-config"
import type { IntakeFormData } from "./types"

export function buildIntakeMailto(data: IntakeFormData): string {
  const subject = encodeURIComponent(
    `Case review request — ${data.firstName} ${data.lastName}`.trim() || "Case review request"
  )

  const bodyLines = [
    "Hello Ask AI Legal,",
    "",
    "I would like a free case review and custom quote.",
    "",
    `Name: ${data.firstName} ${data.lastName}`.trim(),
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    `State / jurisdiction: ${data.state || "Not provided"}`,
    `Case type: ${data.caseType || "Not specified"}`,
    `Preferred language: ${data.preferredLanguage || "Not specified"}`,
    `Preferred contact: ${data.preferredContact || "Either"}`,
    `Deadline / urgency: ${data.deadline || "Not specified"}`,
    `Opposing party: ${data.opposingParty || "Not provided"}`,
    `Documents ready to upload: ${data.hasDocuments === "yes" ? "Yes — I will attach files to this email" : data.hasDocuments === "no" ? "Not yet" : "Not specified"}`,
    "",
    "Issue summary:",
    data.issue || "(Please describe your situation)",
    "",
    "---",
    "Sent via Ask AI Legal website chat intake form.",
  ]

  const body = encodeURIComponent(bodyLines.join("\n"))
  return `${SUPPORT_MAILTO}?subject=${subject}&body=${body}`
}

export function isIntakeValid(data: IntakeFormData): boolean {
  return (
    data.firstName.trim().length > 0 &&
    data.lastName.trim().length > 0 &&
    data.email.includes("@") &&
    data.caseType.trim().length > 0 &&
    data.issue.trim().length > 10
  )
}

export { SUPPORT_EMAIL }
