/**
 * Builds the personalized client intake Word document (letterhead + Parts A/B).
 * Import only from `"use node"` Convex actions.
 */
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  Packer,
  PageNumber,
  Paragraph,
  TextRun,
  UnderlineType,
} from "docx"
import { LETTERHEAD_LOGO_BASE64 } from "./letterheadLogoBase64"

const NAVY = "0A1628"
const GOLD = "C5A059"

export type IntakeDocxContext = {
  caseReference: string
  clientFirstName: string
  clientLastName: string
  clientEmail: string
  clientPhone?: string
  issueSummary?: string
  state?: string
  county?: string
  caseTypeLabel?: string
  deadline?: string
  opposingParty?: string
  hasDocuments?: string
  preferredContact?: string
  caseNumber?: string
  retrievalRequested?: boolean
  logoBytes?: Uint8Array
}

function blankLine(label: string, prefill?: string): Paragraph[] {
  const answer = prefill?.trim() ? prefill.trim() : "_______________________________________________"
  return [
    new Paragraph({
      spacing: { before: 160, after: 40 },
      children: [
        new TextRun({ text: label, bold: true, size: 20, font: "Calibri", color: NAVY }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC", space: 1 },
      },
      children: [
        new TextRun({
          text: answer,
          size: 20,
          font: "Calibri",
          color: prefill?.trim() ? "333333" : "888888",
        }),
      ],
    }),
  ]
}

function blankBlock(label: string, lines = 3, prefill?: string): Paragraph[] {
  const paras: Paragraph[] = [
    new Paragraph({
      spacing: { before: 160, after: 60 },
      children: [
        new TextRun({ text: label, bold: true, size: 20, font: "Calibri", color: NAVY }),
      ],
    }),
  ]
  if (prefill?.trim()) {
    paras.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: prefill.trim(), size: 20, font: "Calibri", color: "333333" }),
        ],
      })
    )
    paras.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: "(Add or correct above as needed)",
            italics: true,
            size: 18,
            font: "Calibri",
            color: "666666",
          }),
        ],
      })
    )
  }
  for (let i = 0; i < lines; i++) {
    paras.push(
      new Paragraph({
        spacing: { after: 80 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC", space: 1 },
        },
        children: [new TextRun({ text: " ", size: 20, font: "Calibri" })],
      })
    )
  }
  return paras
}

function sectionTitle(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 4 },
    },
    children: [
      new TextRun({ text, bold: true, size: 26, font: "Calibri", color: NAVY }),
    ],
  })
}

function bodyText(text: string, opts?: { italics?: boolean; bold?: boolean }): Paragraph {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({
        text,
        size: 20,
        font: "Calibri",
        color: "333333",
        italics: opts?.italics,
        bold: opts?.bold,
      }),
    ],
  })
}

export function intakeDocxFileName(args: {
  lastName: string
  caseReference: string
}): string {
  const safeLast =
    args.lastName.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") ||
    "Client"
  const safeRef = args.caseReference.replace(/[^a-zA-Z0-9_-]+/g, "")
  return `Ask-AI-Legal-Intake-${safeLast}-${safeRef}.docx`
}

export async function buildPersonalizedIntakeDocx(
  ctx: IntakeDocxContext
): Promise<Uint8Array> {
  const logoBytes =
    ctx.logoBytes && ctx.logoBytes.length > 0
      ? ctx.logoBytes
      : Uint8Array.from(Buffer.from(LETTERHEAD_LOGO_BASE64, "base64"))

  const fullName = `${ctx.clientFirstName} ${ctx.clientLastName}`.trim()
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const stateCounty = [ctx.state, ctx.county].filter(Boolean).join(" / ") || undefined
  const retrievalPrefill =
    ctx.retrievalRequested === true
      ? "Yes — please quote retrieval before pulling records"
      : ctx.retrievalRequested === false
        ? "No"
        : undefined

  const headerChildren: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new ImageRun({
          data: logoBytes,
          transformation: { width: 280, height: 90 },
          type: "png",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "https://askailegal.com  ·  support@askailegal.com",
          size: 16,
          font: "Calibri",
          color: "555555",
        }),
      ],
    }),
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 18, color: GOLD, space: 1 },
      },
      spacing: { after: 200 },
      children: [],
    }),
  ]

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        headers: {
          default: new Header({ children: headerChildren }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${ctx.caseReference}  ·  Document preparation only — not a law firm — not legal advice  ·  Page `,
                    size: 14,
                    font: "Calibri",
                    color: "666666",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 14,
                    font: "Calibri",
                    color: "666666",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "PERSONALIZED INTAKE FORM",
                bold: true,
                size: 28,
                font: "Calibri",
                color: NAVY,
                underline: { type: UnderlineType.SINGLE, color: GOLD },
              }),
            ],
          }),
          bodyText(`Case reference: ${ctx.caseReference}`, { bold: true }),
          bodyText(`Prepared for: ${fullName}`),
          bodyText(`Date: ${today}`),
          ...(ctx.caseTypeLabel
            ? [bodyText(`Matter type (from intake): ${ctx.caseTypeLabel}`)]
            : []),
          ...(stateCounty ? [bodyText(`Jurisdiction (from intake): ${stateCounty}`)] : []),
          bodyText(
            "Instructions: Complete Part A and Part B. Reply to the email from Ask AI Legal with this completed Word file attached, plus any court papers you have. Ask AI Legal prepares legal documents only — we are not a law firm, we do not provide legal advice, and we do not file or appear in court for you. Prefill below may already include what you told us in chat — please correct anything that is wrong."
          ),

          sectionTitle("Part A — Getting started"),
          bodyText(
            "These questions help us confirm contact details and a high-level picture of your matter. Keep answers brief.",
            { italics: true }
          ),
          ...blankLine("1. Preferred full legal name + any AKA", fullName),
          ...blankLine(
            "2. Best phone / best email / preferred contact time",
            [
              ctx.clientPhone ? `Phone: ${ctx.clientPhone}` : null,
              `Email: ${ctx.clientEmail}`,
              ctx.preferredContact ? `Preferred: ${ctx.preferredContact}` : null,
            ]
              .filter(Boolean)
              .join("  ·  ") || undefined
          ),
          ...blankLine(
            "3. State / county where the matter is or will be filed",
            stateCounty
          ),
          ...blankLine(
            "4. Rough matter type (divorce, custody, eviction, civil, other)",
            ctx.caseTypeLabel
          ),
          ...blankBlock(
            "5. Brief situation in your own words (5–8 sentences)",
            4,
            ctx.issueSummary
          ),
          ...blankLine(
            "6. Any hard deadline or court date you know of?",
            ctx.deadline
          ),
          ...blankLine(
            "7. Opposing party name (if known) — or write “unknown”",
            ctx.opposingParty
          ),
          ...blankLine(
            "8. Do you already have court papers? (yes / no) — list what you can attach",
            ctx.hasDocuments === "yes"
              ? "Yes — (list attachments below)"
              : ctx.hasDocuments === "no"
                ? "No"
                : undefined
          ),
          ...blankLine(
            "9. Do you need paid document retrieval? (yes / no) — fee will be quoted in writing before we pull records; never free unpaid work",
            retrievalPrefill
          ),
          ...blankLine("10. How did you hear about Ask AI Legal?"),

          sectionTitle("Part B — Details we need to prepare documents"),
          bodyText(
            "Answer what you can. Skip anything unknown. These facts help us draft documents accurately — they are not a request for legal advice.",
            { italics: true }
          ),
          ...blankLine("11. Case / docket number (if any)", ctx.caseNumber),
          ...blankLine("12. Court name / department (if known)"),
          ...blankLine(
            "13. Filing party status (I filed / other side filed / unsure)"
          ),
          ...blankBlock(
            "14. Key dates — served / filed / hearing / response due (fill what applies)",
            3,
            ctx.deadline ? `Known deadline/urgency from intake: ${ctx.deadline}` : undefined
          ),
          ...blankLine(
            "15. Children involved? If needed for the documents you want, list ages only (not full stories)"
          ),
          ...blankBlock(
            "16. What documents do you want prepared? (petition, response, declaration, letters, motions, etc.)",
            3
          ),
          ...blankBlock(
            "17. Specific facts that must appear in the documents (bullets OK)",
            4
          ),
          ...blankBlock(
            "18. Documents you will upload / attach with your reply (checklist)",
            3
          ),
          ...blankBlock(
            "19. Prior agreements, orders, or temporary orders we should mirror in drafting?",
            3
          ),
          ...blankBlock(
            "20. Anything urgent we must not miss before we send your written quote?",
            2
          ),
          ...blankLine("21. Mailing address for captions / letters (street, city, state, ZIP)"),
          ...blankLine("22. Other party mailing address (if known)"),
          ...blankLine(
            "23. Interpreter or accessibility needs we should know about for written materials?"
          ),

          new Paragraph({ spacing: { before: 400 }, children: [] }),
          bodyText(
            "By returning this form you confirm the information is accurate to the best of your knowledge and that you understand Ask AI Legal provides document preparation only — not legal advice or representation.",
            { italics: true }
          ),
          ...blankLine("Signature / typed name"),
          ...blankLine("Date"),
        ],
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  return new Uint8Array(buffer)
}

export async function loadLetterheadLogoBytes(): Promise<Uint8Array> {
  const site = (process.env.PUBLIC_SITE_URL ?? "https://askailegal.com").replace(
    /\/$/,
    ""
  )
  try {
    const res = await fetch(`${site}/brand/letterhead-logo.png`)
    if (res.ok) {
      return new Uint8Array(await res.arrayBuffer())
    }
  } catch {
    // fall through
  }
  return Uint8Array.from(Buffer.from(LETTERHEAD_LOGO_BASE64, "base64"))
}
