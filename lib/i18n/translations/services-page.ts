/** Services page copy (English). Merged into en.ts as servicesPage. */
import { FILE_REVIEW_DEPOSIT_LABEL, CASE_REVIEW_CTA_LABEL } from "@/lib/site-config"

export const servicesPageContent = {
  label: "Services",
  title: "We install. You work from home.",
  intro:
    "Ask AI Legal installs and configures the tools you use from home — research, planning, drafting, and next steps in your workspace. We are not a law firm and do not provide legal advice. You run the work yourself; we do the install.",
  flow: {
    label: "How it fits together",
    title: "From install to working from home",
    narrative:
      "Every matter moves through a clear sequence: we learn your situation, install a roadmap into your workspace, wire research and source tools, set up document tools, hand the setup to you at home, and refine the install until it fits.",
    steps: [
      "Analysis",
      "Road map",
      "Research",
      "Documents",
      "Home setup",
      "Refinement",
    ],
  },
  deepDivesLabel: "What each part of the install includes",
  deepDivesTitle: "Configured for you — ready to run from home",
  includesLabel: "What you get in your setup",
  items: [
    {
      detail:
        "We start by reviewing your situation in plain language — what happened, what you need, and where you want to go. That tells us what to install before you start using the tools yourself. Ideal when you feel overwhelmed and need a clear setup first.",
      includes: [
        "Review of your facts and goals",
        "Identification of what your home setup needs",
        "Written summary of install options",
        "Foundation for every tool we configure",
      ],
    },
    {
      detail:
        "Once we understand your matter, we install a step-by-step plan into your workspace — key issues, recommended documents, deadlines to watch, and what to do next from home. This is your roadmap, not a generic checklist from the internet.",
      includes: [
        "Sequential plan in your workspace",
        "Key issues and priority actions",
        "Recommended document sequence",
        "Timeline guidance you can follow from home",
      ],
    },
    {
      detail:
        "Your setup is wired to dig into the factual record of your matter — prior filings, procedural history, orders, and evidence references — so you can research what actually happened yourself from home, not guess from assumptions.",
      includes: [
        "Tools to review prior filings and records",
        "Procedural history mapped to your matter",
        "Fact chronology you can build from home",
        "Issue spotting tied to your record",
      ],
    },
    {
      detail:
        "We configure research tools for rules, requirements, and published sources that apply to your issue and jurisdiction — connected to your facts so you can pull what applies yourself from home.",
      includes: [
        "Rule and requirement research for your jurisdiction",
        "Published sources tied to your factual pattern",
        "Reference-ready source summaries",
        "Framework applied to your situation",
      ],
    },
    {
      detail:
        "Every source stays traceable to the original publication, stored in your file, and verified — so from home you can open it, read it, and check it yourself. Nothing invented. Nothing you cannot verify.",
      includes: [
        "Every reference retrieved from source",
        "Stored in your file for reference",
        "Verified in a separate review pass",
        "Full reference list in your home workspace",
      ],
    },
    {
      detail:
        "When you have a hearing or appearance you handle yourself, your install includes written materials — outlines, talking points, and supporting documents organized so you can prepare from home. We do not appear on your behalf or speak for you.",
      includes: [
        "Hearing or appearance outline",
        "Key talking points in plain language",
        "Supporting document index",
        "Organized materials in your workspace",
      ],
    },
    {
      detail:
        "Letters, forms, responses, agreements, and supporting paperwork live in your installed workspace — so you draft and refine from the comfort of your home. We set up the tools; you write and decide what to file.",
      includes: [
        "Document tools configured for your matter",
        "Professional formatting and structure",
        "Headings, sections, and reference placeholders",
        "Ready for you to review before any filing",
      ],
    },
    {
      detail:
        "Once install is complete, you run Ask AI Legal from home. What you create and whether you file is entirely your decision.",
      includes: [
        "Configured home workspace delivery",
        "Tools ready to use from home",
        "Clear organization by tool and task",
        "Guidance summary where applicable",
      ],
    },
    {
      detail:
        "Need the setup adjusted? Revisions refine the install until it fits your situation — wording, structure, and configuration. No hourly meter running in the background.",
      includes: [
        "Install refinements within your quoted scope",
        "Fact and structure adjustments",
        "Formatting and workspace tweaks",
        "Follow-up until the setup matches your situation",
      ],
    },
  ],
  disclaimer: {
    label: "What we do not do",
    text: "Ask AI Legal installs and configures tools you use from home. We are not a law firm and do not provide legal advice. We never appear in court on your behalf and do not file documents for you. You stay in control of the work.",
  },
  cta: {
    title: "Let's get you set up —",
    body: `Start with a custom-quote ${FILE_REVIEW_DEPOSIT_LABEL.toLowerCase()}. We install Ask AI Legal so you can do everything you need from home — then one flat price for your configured setup.`,
    button: CASE_REVIEW_CTA_LABEL,
  },
  homeLink: "See how the install works",
}
