/** Services page copy (English). Merged into en.ts as servicesPage. */
import { CASE_REVIEW_PRICE_DISPLAY, TOTAL_PRICE_DISPLAY } from "@/lib/site-config"

export const servicesPageContent = {
  label: "Services",
  title: "Someone in your corner — from case review to complete support",
  intro:
    "Ask AI Legal is hands-on guidance and support — not a template library and not a retainer trap. We listen to your situation, tell you honestly if we can help, walk you through your complete setup, and stay with you for 30 days. We are not a law firm and do not provide legal advice.",
  flow: {
    label: "How it fits together",
    title: "From case review to confidence on your own",
    narrative:
      "Every client moves through a clear sequence: you share your situation, we understand it, we decide together if we're the right fit, we walk you through your setup hands-on, and we support you while you move forward.",
    steps: [
      "Case review",
      "Understand",
      "Right fit",
      "Walkthrough",
      "30-day support",
    ],
  },
  deepDivesLabel: "What you get",
  deepDivesTitle: "Support at every step",
  includesLabel: "What's included",
  items: [
    {
      detail:
        "You share your situation in plain language. We actually read what you send — not filling in a template, but understanding what you're dealing with.",
      includes: [
        "We listen to your facts and goals",
        "Clarifying questions when something isn't clear",
        "Honest read on whether we can help",
        "Foundation for everything that follows",
      ],
    },
    {
      detail:
        "We take time to understand your matter — what's at stake, what you've already received, and what you're trying to achieve. This is about your situation, not a generic checklist.",
      includes: [
        "Plain-language summary of what we heard",
        "Key issues and priority actions",
        "What we'd build for you if you're a fit",
        "Timeline for next steps",
      ],
    },
    {
      detail:
        "If we think we can genuinely help, we tell you how. If not, we refund your case review and explain why — no sales pitch, no pressure.",
      includes: [
        "Honest fit decision",
        "Refund if we're not the right match",
        "Clear explanation either way",
        "No hourly meter at any step",
      ],
    },
    {
      detail:
        "Screen share. Video call. We show you exactly how to use your setup. You ask questions. We answer. We don't move on until you're confident.",
      includes: [
        "Live walkthrough on your schedule",
        "Step-by-step guidance",
        "Q&A until you're ready",
        "Complete setup installed with you",
      ],
    },
    {
      detail:
        "30 days of email and call support. You hit a snag? You reach out. We help you fix it. No extra charge — that's what we're here for.",
      includes: [
        "30 days of email and call support",
        "Help when you get stuck",
        "No surprise fees",
        "Someone still in your corner",
      ],
    },
    {
      detail:
        "You learn how to use your setup to generate what you need for your situation. We show you step by step — you stay in control of every filing and every decision.",
      includes: [
        "Hands-on training on your setup",
        "Generate what your situation needs",
        "You file. You decide. Your pace.",
        "Confidence to move forward alone",
      ],
    },
    {
      detail:
        "After 30 days, you have everything you need. You generate documents. You file. You own this — with the peace of mind that someone understood your situation first.",
      includes: [
        "Complete setup tailored to you",
        "Skills to use it on your own",
        "No abandonment after payment",
        "Real guidance, not a link and goodbye",
      ],
    },
    {
      detail:
        "Flat pricing from the start: case review, then complete hands-on support if you're a fit. No hidden costs. No hourly clock.",
      includes: [
        `${CASE_REVIEW_PRICE_DISPLAY} case review`,
        `${TOTAL_PRICE_DISPLAY} total for complete support`,
        "Walkthrough included",
        "30-day support included",
      ],
    },
    {
      detail:
        "Someone who understands your situation. Someone who won't leave you hanging. Someone in your corner — that's what this service is built around.",
      includes: [
        "Empathy-first intake",
        "Real human walkthrough",
        "Ongoing support while you need it",
        "Confidence, not confusion",
      ],
    },
  ],
  disclaimer: {
    label: "What we do not do",
    text: "Ask AI Legal is not a law firm and does not provide legal advice. We never appear in court on your behalf and do not file documents for you. You take every legal step on your own — we guide and support you.",
  },
  cta: {
    title: "Tell us what you're facing",
    body: `Start with a ${CASE_REVIEW_PRICE_DISPLAY} case review. We'll read everything you send, understand your situation, and tell you honestly if we can help — credited in full toward ${TOTAL_PRICE_DISPLAY} complete support if you're a fit.`,
    button: "Tell us what you're facing",
  },
  homeLink: "Learn more about our services",
}
