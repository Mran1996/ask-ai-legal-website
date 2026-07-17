/**
 * Builds Ask AI Legal Intake Part 1 Word doc matching
 * docs/templates/Ask_AI_Legal_Case_Intake_Part1_Professional.docx
 * Question sets are matter-specific (family, eviction, criminal, etc.).
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
import {
  intakeMatterFileHint,
  intakeMatterSectionTitle,
  resolveIntakeMatterCategory,
  type IntakeMatterCategory,
} from "./intakeMatterCategory"

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
  court?: string
  matterType?: string
  caseTypeLabel?: string
  role?: string
  serviceNeeded?: string
  deadline?: string
  knownDates?: string
  opposingParty?: string
  hasDocuments?: string
  preferredContact?: string
  caseNumber?: string
  retrievalRequested?: boolean
  logoBytes?: Uint8Array
}

type QuestionDef = {
  text: string
  prefill?: string
  extraLines?: number
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

function checkboxQuestion(num: number, text: string, prefill?: string): Paragraph[] {
  return [
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
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 280, after: 100 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 8, color: GOLD, space: 1 },
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22,
        font: "Calibri",
        color: NAVY,
      }),
    ],
  })
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

function documentsPrefill(ctx: IntakeDocxContext): string | undefined {
  if (ctx.hasDocuments === "yes") {
    return "Client indicated they have documents (check above and attach with your reply)."
  }
  if (ctx.hasDocuments === "no") {
    return "Client indicated they do not yet have documents."
  }
  return undefined
}

function opposingPrefill(ctx: IntakeDocxContext, label = "Opposing party"): string | undefined {
  return ctx.opposingParty?.trim()
    ? `${label} named in intake: ${ctx.opposingParty.trim()}`
    : undefined
}

function countyPrefill(ctx: IntakeDocxContext): string | undefined {
  return ctx.county?.trim() ? `County from intake: ${ctx.county.trim()}` : undefined
}

function statePrefill(ctx: IntakeDocxContext): string | undefined {
  return ctx.state?.trim() ? `State from intake: ${ctx.state.trim()}` : undefined
}

function assistancePrefill(ctx: IntakeDocxContext): string | undefined {
  const parts = [
    ctx.caseTypeLabel?.trim() ? `Case type: ${ctx.caseTypeLabel.trim()}` : undefined,
    ctx.serviceNeeded?.trim() ? `Service requested: ${ctx.serviceNeeded.trim()}` : undefined,
    ctx.role?.trim() ? `Your role: ${ctx.role.trim()}` : undefined,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(" | ") : undefined
}

function deadlinePrefill(ctx: IntakeDocxContext): string | undefined {
  const parts = [
    ctx.deadline?.trim() ? `Deadline from intake: ${ctx.deadline.trim()}` : undefined,
    ctx.knownDates?.trim() ? `Other dates from intake: ${ctx.knownDates.trim()}` : undefined,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(" | ") : undefined
}

function coreQuestions(ctx: IntakeDocxContext): QuestionDef[] {
  return [
    {
      text: "In your own words, describe your current situation and what prompted you to contact us.",
      prefill: ctx.issueSummary,
      extraLines: 2,
    },
    {
      text: "What outcome are you hoping to achieve with document preparation?",
      extraLines: 1,
    },
    {
      text: "Are there any upcoming deadlines, hearing dates, or filing dates we should know about?",
      prefill: deadlinePrefill(ctx),
      extraLines: 1,
    },
    {
      text: "What type of document preparation assistance are you requesting from Ask AI Legal?",
      prefill: assistancePrefill(ctx),
      extraLines: 1,
    },
  ]
}

function matterSpecificQuestions(
  category: IntakeMatterCategory,
  ctx: IntakeDocxContext
): { questions: QuestionDef[]; documentChecklist: string } {
  switch (category) {
    case "family":
      return {
        documentChecklist:
          "Which documents do you have?  ☐ Petition  ☐ Summons  ☐ Parenting Plan  ☐ Support Orders  ☐ Temporary Orders  ☐ Other",
        questions: [
          {
            text: "What discussions have taken place between you and your spouse (or other party) regarding this matter?",
            prefill: opposingPrefill(ctx, "Other party"),
            extraLines: 1,
          },
          {
            text: "Are you currently receiving or seeking child support and/or spousal support? Explain.",
            extraLines: 1,
          },
          {
            text: "Has a Petition for Dissolution (or other family-court petition) been filed?",
          },
          {
            text: "If yes, who filed it and in which county?",
            prefill: countyPrefill(ctx),
          },
          {
            text: "If no petition has been filed, who intends to file?",
          },
          {
            text: "Have you been formally served? If yes, on what date?",
          },
          {
            text: "Are temporary orders currently in place? Describe them.",
            extraLines: 1,
          },
          {
            text: "Is a court hearing scheduled? Date, time, and location if known.",
            prefill: ctx.court?.trim() ? `Court from intake: ${ctx.court.trim()}` : undefined,
          },
          {
            text: "What is your date of marriage? (if applicable)",
          },
          {
            text: "How long have you and/or your spouse lived in this state?",
            prefill: statePrefill(ctx),
          },
          {
            text: "Any prior legal filings between you and your spouse / other party?",
          },
          {
            text: "Do you have children together? List names and ages.",
          },
          {
            text: "What is the current parenting/custody arrangement?",
            extraLines: 1,
          },
        ],
      }

    case "unlawful_detainer":
      return {
        documentChecklist:
          "Which documents do you have?  ☐ Notice to Quit / 3-Day Notice  ☐ Summons  ☐ Complaint  ☐ Rental Agreement  ☐ Proof of Rent Paid  ☐ Other",
        questions: [
          {
            text: "Are you the tenant, landlord, or another party?",
            prefill: ctx.role?.trim() ? `Role from intake: ${ctx.role.trim()}` : undefined,
          },
          {
            text: "What is the full property / rental address?",
            extraLines: 1,
          },
          {
            text: "Who is the landlord / opposing party?",
            prefill: opposingPrefill(ctx, "Landlord / opposing party"),
          },
          {
            text: "What notice(s) did you receive (3-day, 30-day, 60-day, other)? Include dates if known.",
            extraLines: 1,
          },
          {
            text: "Have you been served with a summons and complaint (unlawful detainer)? If yes, date of service?",
          },
          {
            text: "What is the answer / response deadline, if you know it?",
            prefill: ctx.deadline?.trim() ? `From intake: ${ctx.deadline.trim()}` : undefined,
          },
          {
            text: "Is a court hearing already scheduled? Date, department, and courthouse if known.",
            prefill: ctx.court?.trim() ? `Court from intake: ${ctx.court.trim()}` : undefined,
          },
          {
            text: "How much rent (if any) is claimed to be owed? Do you dispute the amount? Explain.",
            extraLines: 1,
          },
          {
            text: "Have you already filed an answer or other response? If yes, when and where?",
          },
          {
            text: "Briefly list any defenses or facts you want reflected in your documents (habitability, payment, improper notice, etc.).",
            extraLines: 2,
          },
        ],
      }

    case "civil_answer":
      return {
        documentChecklist:
          "Which documents do you have?  ☐ Summons  ☐ Complaint  ☐ Exhibits  ☐ Prior Orders  ☐ Correspondence  ☐ Other",
        questions: [
          {
            text: "Are you the defendant / respondent, or another party?",
            prefill: ctx.role?.trim() ? `Role from intake: ${ctx.role.trim()}` : undefined,
          },
          {
            text: "Who is the plaintiff / opposing party?",
            prefill: opposingPrefill(ctx),
          },
          {
            text: "In which court and county was the lawsuit filed?",
            prefill: [countyPrefill(ctx), ctx.court?.trim() ? `Court: ${ctx.court.trim()}` : undefined]
              .filter(Boolean)
              .join(" | ") || undefined,
          },
          {
            text: "When were you served with the summons and complaint? What is the response deadline?",
            prefill: deadlinePrefill(ctx),
            extraLines: 1,
          },
          {
            text: "In plain language, what does the complaint claim against you?",
            extraLines: 1,
          },
          {
            text: "Which allegations do you deny, admit, or lack enough information to answer?",
            extraLines: 1,
          },
          {
            text: "Do you have affirmative defenses or counterclaims you want considered for document prep?",
            extraLines: 1,
          },
          {
            text: "Have you already filed any response? If yes, attach it and note the filing date.",
          },
        ],
      }

    case "civil_complaint":
      return {
        documentChecklist:
          "Which documents do you have?  ☐ Contracts  ☐ Invoices  ☐ Correspondence  ☐ Photos / Evidence  ☐ Prior Demand  ☐ Other",
        questions: [
          {
            text: "Are you intending to be the plaintiff / petitioner?",
            prefill: ctx.role?.trim() ? `Role from intake: ${ctx.role.trim()}` : undefined,
          },
          {
            text: "Who would be the defendant / opposing party (name and address if known)?",
            prefill: opposingPrefill(ctx),
            extraLines: 1,
          },
          {
            text: "In which county / court do you expect to file?",
            prefill: [countyPrefill(ctx), statePrefill(ctx)].filter(Boolean).join(" | ") || undefined,
          },
          {
            text: "What happened? Summarize the facts in chronological order.",
            extraLines: 2,
          },
          {
            text: "What legal claims do you believe apply (breach of contract, negligence, fraud, etc.)? If unsure, describe the harm in plain language.",
            extraLines: 1,
          },
          {
            text: "What relief are you seeking (money damages, injunction, other)? Include amounts if known.",
            extraLines: 1,
          },
          {
            text: "Have you already sent a demand or tried to resolve this informally? Describe outcomes.",
            extraLines: 1,
          },
          {
            text: "Are there any filing deadlines or statutes of limitation you are worried about?",
            prefill: deadlinePrefill(ctx),
          },
        ],
      }

    case "small_claims":
      return {
        documentChecklist:
          "Which documents do you have?  ☐ Contracts / Receipts  ☐ Invoices  ☐ Photos  ☐ Texts / Emails  ☐ Prior Demand  ☐ Other",
        questions: [
          {
            text: "Are you the plaintiff (filing) or defendant (responding)?",
            prefill: ctx.role?.trim() ? `Role from intake: ${ctx.role.trim()}` : undefined,
          },
          {
            text: "Who is the other party?",
            prefill: opposingPrefill(ctx),
          },
          {
            text: "How much money are you claiming or defending against? Explain how you calculated it.",
            extraLines: 1,
          },
          {
            text: "What is the dispute about? Summarize the facts.",
            extraLines: 2,
          },
          {
            text: "In which county will the claim be filed (or was it already filed)?",
            prefill: countyPrefill(ctx),
          },
          {
            text: "Have you already filed a small-claims form (e.g., SC-100) or received a claim? Dates?",
            prefill: deadlinePrefill(ctx),
          },
          {
            text: "Have you demanded payment or tried to settle? What happened?",
            extraLines: 1,
          },
          {
            text: "List key evidence you have (receipts, contracts, photos, messages).",
            extraLines: 1,
          },
        ],
      }

    case "demand_letter":
      return {
        documentChecklist:
          "Which documents do you have?  ☐ Contract  ☐ Invoices  ☐ Photos / Evidence  ☐ Prior Correspondence  ☐ Other",
        questions: [
          {
            text: "Who should receive the demand letter (name, company, and mailing / email address if known)?",
            prefill: opposingPrefill(ctx, "Recipient"),
            extraLines: 1,
          },
          {
            text: "What do you want the other party to do (pay money, stop conduct, return property, etc.)?",
            extraLines: 1,
          },
          {
            text: "If money is demanded, what exact amount and how was it calculated?",
            extraLines: 1,
          },
          {
            text: "Summarize the facts supporting your demand in chronological order.",
            extraLines: 2,
          },
          {
            text: "What deadline should the letter give for compliance (e.g., 10 or 14 days)?",
            prefill: ctx.deadline?.trim() ? `From intake: ${ctx.deadline.trim()}` : undefined,
          },
          {
            text: "Have you already contacted them? Attach prior emails/letters if any.",
            extraLines: 1,
          },
          {
            text: "What tone do you prefer (firm but professional, more formal, shorter)? Any language to avoid?",
          },
        ],
      }

    case "criminal":
      return {
        documentChecklist:
          "Which documents do you have?  ☐ Complaint / Information  ☐ Minute Orders  ☐ Probation Terms  ☐ Prior Motions  ☐ Police Report  ☐ Other",
        questions: [
          {
            text: "What are the current charges (and case number if different from above)?",
            prefill: ctx.caseNumber?.trim()
              ? `Case number from intake: ${ctx.caseNumber.trim()}`
              : undefined,
            extraLines: 1,
          },
          {
            text: "Which court, county, and department is the case in?",
            prefill: [countyPrefill(ctx), ctx.court?.trim() ? `Court: ${ctx.court.trim()}` : undefined]
              .filter(Boolean)
              .join(" | ") || undefined,
          },
          {
            text: "What is your next hearing date (if any)?",
            prefill: deadlinePrefill(ctx),
          },
          {
            text: "Do you currently have a public defender or private counsel? Are you self-represented?",
            prefill: ctx.role?.trim() ? `Role/status from intake: ${ctx.role.trim()}` : undefined,
          },
          {
            text: "What motion or document do you want prepared (e.g., motion to dismiss, continue, modify terms)?",
            prefill: ctx.serviceNeeded?.trim()
              ? `From intake: ${ctx.serviceNeeded.trim()}`
              : undefined,
            extraLines: 1,
          },
          {
            text: "What relief are you seeking, in your own words?",
            extraLines: 1,
          },
          {
            text: "Summarize the key facts the motion should address.",
            extraLines: 2,
          },
          {
            text: "Who is the opposing party / prosecutor's office if known?",
            prefill: opposingPrefill(ctx, "Opposing party / prosecutor"),
          },
        ],
      }

    case "post_conviction":
      return {
        documentChecklist:
          "Which documents do you have?  ☐ Judgment / Abstract  ☐ Plea Forms  ☐ Sentencing Minutes  ☐ Prior Petitions  ☐ Transcripts  ☐ Other",
        questions: [
          {
            text: "What was the conviction or disposition (charges, date, county)?",
            prefill: [countyPrefill(ctx), ctx.caseNumber?.trim() ? `Case #: ${ctx.caseNumber.trim()}` : undefined]
              .filter(Boolean)
              .join(" | ") || undefined,
            extraLines: 1,
          },
          {
            text: "What relief are you seeking (expungement / record relief, habeas, appeal-related filing, other)?",
            prefill: ctx.serviceNeeded?.trim()
              ? `From intake: ${ctx.serviceNeeded.trim()}`
              : undefined,
            extraLines: 1,
          },
          {
            text: "Are you currently incarcerated, on probation/parole, or finished with supervision?",
            prefill: ctx.role?.trim() ? `Status from intake: ${ctx.role.trim()}` : undefined,
          },
          {
            text: "What court handled the original case? Any related case numbers?",
            prefill: ctx.court?.trim() ? `Court from intake: ${ctx.court.trim()}` : undefined,
          },
          {
            text: "Have you filed any prior post-conviction petitions? Outcomes?",
            extraLines: 1,
          },
          {
            text: "Are there any deadlines you are aware of?",
            prefill: deadlinePrefill(ctx),
          },
          {
            text: "Summarize why you believe relief is appropriate (new evidence, eligibility, legal error, etc.).",
            extraLines: 2,
          },
          {
            text: "Who else is involved (prosecutor, probation, prior counsel) that we should name in documents?",
            prefill: opposingPrefill(ctx),
          },
        ],
      }

    case "business_dispute":
      return {
        documentChecklist:
          "Which documents do you have?  ☐ Contracts  ☐ Invoices  ☐ Emails  ☐ Corporate Records  ☐ Prior Demand  ☐ Other",
        questions: [
          {
            text: "What is your role (owner, member, employee, vendor, customer, other)?",
            prefill: ctx.role?.trim() ? `Role from intake: ${ctx.role.trim()}` : undefined,
          },
          {
            text: "Name the business(es) and opposing party involved.",
            prefill: opposingPrefill(ctx),
            extraLines: 1,
          },
          {
            text: "What is the dispute about (payment, breach, ownership, services, IP, other)?",
            extraLines: 1,
          },
          {
            text: "What documents do you want prepared (demand, complaint, response, agreement, other)?",
            prefill: assistancePrefill(ctx),
            extraLines: 1,
          },
          {
            text: "Summarize key facts and timeline.",
            extraLines: 2,
          },
          {
            text: "What outcome do you want (payment amount, contract termination, injunction, settlement structure)?",
            extraLines: 1,
          },
          {
            text: "Any deadlines, notice periods, or pending filings?",
            prefill: deadlinePrefill(ctx),
          },
          {
            text: "Is there a governing contract, venue, or arbitration clause we should know about?",
            extraLines: 1,
          },
        ],
      }

    case "general":
    default:
      return {
        documentChecklist:
          "Which documents do you have?  ☐ Court papers  ☐ Letters / Notices  ☐ Contracts  ☐ Orders  ☐ Other",
        questions: [
          {
            text: "What is your role in this matter (plaintiff, defendant, tenant, petitioner, other)?",
            prefill: ctx.role?.trim() ? `Role from intake: ${ctx.role.trim()}` : undefined,
          },
          {
            text: "Who is the other party / opposing side?",
            prefill: opposingPrefill(ctx),
          },
          {
            text: "Has a court case been filed? If yes, which court and county?",
            prefill: [countyPrefill(ctx), ctx.court?.trim() ? `Court: ${ctx.court.trim()}` : undefined]
              .filter(Boolean)
              .join(" | ") || undefined,
          },
          {
            text: "Have you been served with any papers? Dates?",
            prefill: deadlinePrefill(ctx),
          },
          {
            text: `Focusing on your described issue${ctx.issueSummary?.trim() ? ` (“${ctx.issueSummary.trim().slice(0, 120)}${ctx.issueSummary.trim().length > 120 ? "…" : ""}”)` : ""}, what additional facts should we know?`,
            extraLines: 2,
          },
          {
            text: "What specific document(s) do you want prepared?",
            prefill: ctx.serviceNeeded?.trim()
              ? `From intake: ${ctx.serviceNeeded.trim()}`
              : undefined,
            extraLines: 1,
          },
          {
            text: "Any prior filings or attorney involvement?",
            extraLines: 1,
          },
        ],
      }
  }
}

export function intakeDocxFileName(args: {
  lastName: string
  caseReference: string
  matterHint?: string
}): string {
  const safeLast =
    args.lastName.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") ||
    "Client"
  const safeRef = args.caseReference.replace(/[^a-zA-Z0-9_-]+/g, "")
  const hint = args.matterHint?.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/-+/g, "-")
  if (hint) {
    return `Ask-AI-Legal-Intake-Part1-${hint}-${safeLast}-${safeRef}.docx`
  }
  return `Ask-AI-Legal-Intake-Part1-${safeLast}-${safeRef}.docx`
}

function jurisdictionLabel(ctx: IntakeDocxContext, category: IntakeMatterCategory): string {
  const state = ctx.state?.trim()
  const matterBit = intakeMatterSectionTitle(category).replace(/ Follow-Up$/, "")
  if (!state) return `${matterBit} – Document Preparation Intake`
  const long =
    state.toUpperCase() === "WA"
      ? "Washington State"
      : state.toUpperCase() === "CA"
        ? "California"
        : state.length === 2
          ? `${state.toUpperCase()} State`
          : state
  return `${long} – ${matterBit}`
}

function renderQuestions(
  startNum: number,
  defs: QuestionDef[]
): { paragraphs: Paragraph[]; nextNum: number } {
  const paragraphs: Paragraph[] = []
  let n = startNum
  for (const def of defs) {
    paragraphs.push(...question(n, def.text, def.prefill, def.extraLines ?? 0))
    n += 1
  }
  return { paragraphs, nextNum: n }
}

export function listIntakeQuestionTexts(
  category: IntakeMatterCategory,
  ctx: IntakeDocxContext = {
    caseReference: "AAL-TEST",
    clientFirstName: "Test",
    clientLastName: "Client",
    clientEmail: "test@example.com",
  }
): string[] {
  return [
    ...coreQuestions(ctx).map((q) => q.text),
    ...matterSpecificQuestions(category, ctx).questions.map((q) => q.text),
    matterSpecificQuestions(category, ctx).documentChecklist,
  ]
}

export async function buildPersonalizedIntakeDocx(
  ctx: IntakeDocxContext
): Promise<Uint8Array> {
  const logoBytes =
    ctx.logoBytes && ctx.logoBytes.length > 0
      ? ctx.logoBytes
      : Uint8Array.from(Buffer.from(LETTERHEAD_LOGO_BASE64, "base64"))

  const category = resolveIntakeMatterCategory({
    matterType: ctx.matterType,
    caseTypeLabel: ctx.caseTypeLabel,
    serviceNeeded: ctx.serviceNeeded,
    issueSummary: ctx.issueSummary,
    role: ctx.role,
  })

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

  const core = renderQuestions(1, coreQuestions(ctx))
  const specific = matterSpecificQuestions(category, ctx)
  const matter = renderQuestions(core.nextNum, specific.questions)
  const docNum = matter.nextNum

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
                text: jurisdictionLabel(ctx, category),
                size: 22,
                font: "Calibri",
                color: "444444",
              }),
            ],
          }),
          body(`Case reference: ${ctx.caseReference}`, { bold: true }),
          blankAnswer(`Client Name: ${fullName}`),
          blankAnswer(
            ctx.clientEmail.trim()
              ? `Email: ${ctx.clientEmail.trim()}${ctx.clientPhone?.trim() ? `  ·  Phone: ${ctx.clientPhone.trim()}` : ""}`
              : "Email / Phone: ____________________"
          ),
          blankAnswer(`Date: ${today}`),
          blankAnswer(
            ctx.caseNumber
              ? `Case Number (if any): ${ctx.caseNumber}`
              : "Case Number (if any): ____________________"
          ),
          blankAnswer(
            ctx.caseTypeLabel?.trim()
              ? `Matter type (from intake): ${ctx.caseTypeLabel.trim()}`
              : `Matter category: ${intakeMatterSectionTitle(category).replace(/ Follow-Up$/, "")}`
          ),
          body(
            "Please answer each question as completely as possible. Detailed responses help us prepare the right documents for your matter. This questionnaire is for information gathering and document preparation only — it does not create an attorney-client relationship, and Ask AI Legal is not a law firm and does not provide legal advice.",
            { italics: true, size: 18 }
          ),

          sectionHeading("A. Your Situation (all matters)"),
          ...core.paragraphs,

          sectionHeading(`B. ${intakeMatterSectionTitle(category)}`),
          ...matter.paragraphs,

          ...checkboxQuestion(docNum, specific.documentChecklist, documentsPrefill(ctx)),

          ...(ctx.retrievalRequested
            ? question(
                docNum + 1,
                "You indicated interest in document retrieval. Which public filings should we quote for retrieval (never begun without a written quote)?"
              )
            : []),

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

/** Exported for filename wiring in email actions. */
export function resolveIntakeDocxMatterHint(ctx: IntakeDocxContext): string {
  return intakeMatterFileHint(
    resolveIntakeMatterCategory({
      matterType: ctx.matterType,
      caseTypeLabel: ctx.caseTypeLabel,
      serviceNeeded: ctx.serviceNeeded,
      issueSummary: ctx.issueSummary,
      role: ctx.role,
    })
  )
}
