/** Services page copy (English). Merged into en.ts as servicesPage. */
import { CASE_FILE_REVIEW_PRICE_DISPLAY } from "@/lib/site-config"

export const servicesPageContent = {
  label: "Services",
  title: "Everything we prepare for your case",
  intro:
    "Ask AI Legal is full-service document preparation — research, planning, drafting, and delivery. We are not a law firm and do not provide legal advice. You review what we prepare and handle any filing or appearance on your own behalf.",
  flow: {
    label: "How it fits together",
    title: "From first review to complete document packages",
    narrative:
      "Every matter moves through a clear sequence: we understand your situation, map the path forward, research your files and sources, draft your documents, deliver a complete package, and refine until it reflects your case.",
    steps: [
      "Case analysis",
      "Case roadmap",
      "Research",
      "Documents",
      "Delivery",
      "Revisions",
    ],
  },
  deepDivesLabel: "What each service includes",
  deepDivesTitle: "Prepared for you — in detail",
  includesLabel: "What you receive",
  items: [
    {
      detail:
        "We start by reviewing your situation in plain language — what happened, what you need, and where you want to go. You receive a clear picture of the recommended document plan before any drafting begins. Ideal when you feel overwhelmed and need direction first.",
      includes: [
        "Review of your facts and goals",
        "Identification of next steps for your paperwork",
        "Written summary of preparation options",
        "Foundation for all downstream work",
      ],
    },
    {
      detail:
        "Once we understand your matter, we build a step-by-step plan tailored to your case — key issues, recommended documents, deadlines to watch, and what to prepare next. This is your roadmap, not a generic checklist from the internet.",
      includes: [
        "Sequential preparation plan",
        "Key issues and priority actions",
        "Recommended document sequence",
        "Timeline guidance for your review",
      ],
    },
    {
      detail:
        "We investigate the factual record of your matter — prior filings, procedural history, orders, and evidence references — so every document we draft reflects what actually happened in your case, not assumptions.",
      includes: [
        "Review of prior filings and records",
        "Procedural history mapped to your matter",
        "Fact chronology for drafting reference",
        "Issue spotting tied to your record",
      ],
    },
    {
      detail:
        "We research rules, requirements, and published sources that apply to your issue and jurisdiction, then connect that material to your facts. Your documents reference the right sources — prepared for your review, not copy-pasted templates.",
      includes: [
        "Rule and requirement research for your jurisdiction",
        "Published sources tied to your factual pattern",
        "Reference-ready source summaries",
        "Framework applied to your situation",
      ],
    },
    {
      detail:
        "Every source we use is retrieved from the original publication, stored in your case file, and verified in a separate review pass before it ever appears in your document. Advanced research technology does the heavy lifting; verification makes it complete and accurate.",
      includes: [
        "Every reference retrieved from source",
        "Stored in your case file for reference",
        "Verified in a separate review pass",
        "Full reference list delivered with your documents",
      ],
    },
    {
      detail:
        "When you have a hearing or appearance you handle yourself, we prepare the written materials — outlines, talking points, and supporting documents organized so you can walk in prepared. We do not appear on your behalf or speak for you.",
      includes: [
        "Hearing or appearance outline",
        "Key talking points in plain language",
        "Supporting document index",
        "Organized packet for your review",
      ],
    },
    {
      detail:
        "This is the core of what we do: motions, petitions, responses, demand letters, and more — fully drafted, properly formatted, and structured for your situation. You describe your case; we write the document content.",
      includes: [
        "Full draft of requested documents",
        "Professional formatting and structure",
        "Headings, sections, and reference placeholders",
        "Ready for your review before any filing",
      ],
    },
    {
      detail:
        "You receive a complete, formatted document package — organized, labeled, and ready for your review. What you do next, including any filing or service, is entirely your decision.",
      includes: [
        "Complete document package delivery",
        "Formatted files ready for review",
        "Clear organization by document type",
        "Instructions summary where applicable",
      ],
    },
    {
      detail:
        "Need changes after review? Revisions are part of full-service preparation — we refine wording, facts, and structure until the documents accurately reflect your case. No hourly meter running in the background.",
      includes: [
        "Revisions within your quoted scope",
        "Fact and argument refinements",
        "Formatting adjustments",
        "Follow-up until documents match your case",
      ],
    },
  ],
  disclaimer: {
    label: "What we do not do",
    text: "Ask AI Legal generates documents only. We are not a law firm and do not provide legal advice. We never appear in court on your behalf and do not file documents for you. All materials are prepared for your review and use at your own discretion.",
  },
  cta: {
    title: "Ready to see what we can prepare for you?",
    body: `Start with a flat ${CASE_FILE_REVIEW_PRICE_DISPLAY} case file review. You'll get a plain-English written summary and one flat price for the documents your situation needs — credited in full toward your total.`,
    button: "Start my case file review",
  },
  homeLink: "Learn more about our services",
}
