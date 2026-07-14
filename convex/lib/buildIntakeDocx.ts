/**
 * Builds Ask AI Legal Intake Part 1 Word doc matching
 * docs/templates/Ask_AI_Legal_Case_Intake_Part1_Professional.docx
 * Import only from `"use node"` Convex actions.
 */
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
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

function blankAnswer(prefill?: string): Paragraph {
  const text = prefill?.trim()
    ? prefill.trim()
    : "_______________________________________________________________________________"
  return new Paragraph({
    spacing: { after: 140 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC", space: 1 },
    },
    children: [
      new TextRun({
        text,
        size: 20,
        font: "Calibri",
        color: prefill?.trim() ? "333333" : "888888",
      }),
    ],
  })
}

function question(num: number, text: string, prefill?: string, extraLines = 0): Paragraph[] {
  const paras: Paragraph[] = [
    new Paragraph({
      spacing: { before: 180, after: 60 },
      children: [
        new TextRun({
          text: `${num}. ${text}`,
          bold: true,
          size: 20,
          font: "Calibri",
          color: NAVY,
        }),
      ],
    }),
    blankAnswer(prefill),
  ]
  for (let i = 0; i < extraLines; i++) {
    paras.push(blankAnswer())
  }
  return paras
}

function body(text: string, opts?: { italics?: boolean; bold?: boolean; size?: number }): Paragraph {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({
        text,
        size: opts?.size ?? 20,
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
  return `Ask-AI-Legal-Intake-Part1-${safeLast}-${safeRef}.docx`
}

function jurisdictionLabel(ctx: IntakeDocxContext): string {
  const state = ctx.state?.trim()
  if (!state) return "Document Preparation Intake"
  const long =
    state.toUpperCase() === "WA"
      ? "Washington State"
      : state.toUpperCase() === "CA"
        ? "California"
        : state.length === 2
          ? `${state.toUpperCase()} State`
          : state
  return `${long} – Document Preparation Intake`
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

  const headerChildren: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new ImageRun({
          data: logoBytes,
          transformation: { width: 300, height: 96 },
          type: "png",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "support@askailegal.com  ·  https://askailegal.com",
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
      spacing: { after: 180 },
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
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: "CASE INTAKE QUESTIONNAIRE – PART 1",
                bold: true,
                size: 28,
                font: "Calibri",
                color: NAVY,
                underline: { type: UnderlineType.SINGLE, color: GOLD },
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: jurisdictionLabel(ctx),
                size: 22,
                font: "Calibri",
                color: "444444",
              }),
            ],
          }),
          body(`Case reference: ${ctx.caseReference}`, { bold: true }),
          blankAnswer(`Client Name: ${fullName}`),
          blankAnswer(`Date: ${today}`),
          blankAnswer(
            ctx.caseNumber
              ? `Case Number (if any): ${ctx.caseNumber}`
              : "Case Number (if any): ____________________"
          ),
          body(
            "Please answer each question as completely as possible. Detailed responses help us evaluate your matter and determine how we may be able to assist. This questionnaire is for information gathering only and does not create an attorney-client relationship.",
            { italics: true, size: 18 }
          ),

          ...question(
            1,
            "In your own words, describe your current situation and what prompted you to contact us.",
            ctx.issueSummary,
            2
          ),
          ...question(2, "What outcome are you hoping to achieve?", undefined, 1),
          ...question(
            3,
            "What discussions have taken place between you and your spouse (or other party) regarding the matter?",
            ctx.opposingParty
              ? `Opposing party named in chat: ${ctx.opposingParty}`
              : undefined,
            1
          ),
          ...question(
            4,
            "Are you currently receiving or seeking child support and/or spousal support?"
          ),
          ...question(
            5,
            "Are you seeking spousal support, increased child support, or both? Explain.",
            undefined,
            1
          ),
          ...question(
            6,
            "Are there any upcoming deadlines or hearings?",
            ctx.deadline,
            1
          ),
          ...question(
            7,
            "What type of assistance are you requesting from Ask AI Legal?",
            ctx.caseTypeLabel
              ? `From intake: ${ctx.caseTypeLabel}`
              : undefined,
            1
          ),
          ...question(8, "Has a Petition for Dissolution (or other petition) been filed?"),
          ...question(
            9,
            "If yes, who filed it and in which county?",
            ctx.county ? `County from intake: ${ctx.county}` : undefined
          ),
          ...question(10, "If no petition has been filed, who intends to file?"),
          ...question(11, "Have you been formally served? If yes, date?"),
          ...question(12, "Are temporary orders currently in place?"),
          ...question(13, "Is a court hearing scheduled?"),
          ...question(14, "Are there deadlines within the next 30 days?", ctx.deadline),
          new Paragraph({
            spacing: { before: 180, after: 60 },
            children: [
              new TextRun({
                text: "15. Which documents do you have?  ☐ Petition  ☐ Summons  ☐ Parenting Plan  ☐ Court Orders  ☐ Other",
                bold: true,
                size: 20,
                font: "Calibri",
                color: NAVY,
              }),
            ],
          }),
          blankAnswer(
            ctx.hasDocuments === "yes"
              ? "Client indicated they have documents (list / check above and attach with your reply)."
              : ctx.hasDocuments === "no"
                ? "Client indicated they do not yet have documents."
                : undefined
          ),
          ...question(16, "What is your date of marriage? (if applicable)"),
          ...question(
            17,
            "How long have you and/or your spouse lived in this state?",
            ctx.state ? `State from intake: ${ctx.state}` : undefined
          ),
          ...question(18, "Any prior legal filings between you and your spouse / other party?"),
          ...question(19, "Do you have children together? List names and ages."),
          ...question(20, "What is the current parenting/custody arrangement?", undefined, 1),

          new Paragraph({ spacing: { before: 280 }, children: [] }),
          body(
            "Disclaimer: Ask AI Legal is a document preparation service and is not a law firm. We do not provide legal representation or legal advice. Submission of this questionnaire does not create an attorney-client relationship.",
            { italics: true, size: 18 }
          ),
          body(
            "Return this completed Part 1 Word file by replying to the email from Ask AI Legal (keep your case reference in the subject). Attach any court papers you have. After we review Part 1, we will email the issues we can start with and an invoice to begin document preparation.",
            { size: 18 }
          ),
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
  for (const path of [
    "/brand/letterhead-from-template.png",
    "/brand/letterhead-logo.png",
  ]) {
    try {
      const res = await fetch(`${site}${path}`)
      if (res.ok) {
        return new Uint8Array(await res.arrayBuffer())
      }
    } catch {
      // try next
    }
  }
  return Uint8Array.from(Buffer.from(LETTERHEAD_LOGO_BASE64, "base64"))
}
