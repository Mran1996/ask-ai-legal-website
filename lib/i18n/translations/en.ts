import { servicesPageContent } from "./services-page"
import { PRIMARY_CTA_LABEL, SITE_DISCLAIMER } from "@/lib/site-config"

export const en = {
  nav: {
    freeReview: "Get started",
    help: "Help",
    about: "About",
    services: "Features",
    pricing: "Pricing",
    whyUs: "What you buy",
    process: "Process",
    faq: "FAQ",
    contact: "Contact",
    emailForReview: PRIMARY_CTA_LABEL,
    language: "Language",
  },
  hero: {
    slogan: "We do the install. Ask AI Legal does the heavy lifting. You make the decisions.",
    titleLine1: "Your legal workspace.",
    titleHighlight: "Installed on your computer.",
    titleLine2: "",
    body: "Ask AI Legal is installed on your computer and configured around your issues and goals. Bring your information together, generate personalized documents, and build on what your Second Brain remembers.",
    categories: [
      "Divorce & separation",
      "Custody & family",
      "Housing",
      "Civil disputes",
      "Small claims",
      "Criminal",
      "& more",
    ],
    ctaPrimary: PRIMARY_CTA_LABEL,
    ctaSecondary: "See pricing",
    stat1Value: "$3,997",
    stat1Label: "One-time purchase",
    stat1Sub: "Installation, setup, personal training, and 30 days of installation support",
    stat2Value: "$125/mo",
    stat2Label: "Optional maintenance",
    stat2Sub: "Supported updates and technical assistance within the plan's stated limits",
    stat3Value: "30 days",
    stat3Label: "Installation support",
    stat3Sub: "Begins when installation is completed",
  },
  services: {
    label: "What your workspace includes",
    titleLine1: "Your legal workspace.",
    titleLine2: "Installed on your computer.",
    intro:
      "Ask AI Legal is software installed on your computer. We install and configure it, set it up around your issues and goals, and show you how to use it. You stay in control of your matter — nothing is filed on your behalf.",
    importantLabel: "Important:",
    importantText: SITE_DISCLAIMER,
    items: [
      {
        title: "Supported research connections",
        description:
          "Connect your workspace to supported legal research platforms such as Westlaw, LexisNexis, Bloomberg Law, and CourtListener. Provider subscriptions and usage fees are separate. Open the original sources and review AI-generated citations before relying on them.",
      },
      {
        title: "Document drafting for your review",
        description:
          "Prepare editable drafts with personalized document generation. Review the facts, citations, formatting, and applicable court requirements before filing.",
      },
      {
        title: "Case organization",
        description:
          "A workspace that keeps track of your matter — the people, dates, filings, and what happened when — so your information stays organized in one place.",
      },
      {
        title: "Inbox & calendar connections",
        description:
          "Use supported email and calendar connections to help organize messages, dates, and reminders. Review extracted dates and confirm deadlines against the applicable rules and court orders.",
      },
      {
        title: "Privacy and data handling",
        description:
          "Your setup may combine local storage with connected AI and cloud services. We explain which features operate locally, which send information to outside providers, and the settings available to you.",
      },
      {
        title: "Installation, training, and support",
        description:
          "Computer compatibility check, installation, guided setup around your issues and goals, personal training, a written getting-started guide, and 30 days of installation support.",
      },
    ],
  },
  servicesPage: servicesPageContent,
  compare: {
    label: "Clear pricing",
    titleLine1: "Know what you are buying.",
    titleHighlight: "",
    titleLine2: "",
    subtitle:
      "Ask AI Legal is a software purchase with installation and onboarding for $3,997. Optional maintenance is $125 per month. You receive a clear explanation of included services and additional costs before purchase.",
    traditionalHeading: "One-time purchase",
    traditionalPrice: "$3,997",
    traditionalDesc:
      "Your installed copy, setup, personal training, a written getting-started guide, and 30 days of installation support",
    traditionalBullets: [
      "Computer compatibility check and installation",
      "Guided setup around your issues and goals",
      "30 days of installation support",
    ],
    usBadge: "Ask AI Legal",
    usHeading: "Optional maintenance",
    usPrice: "$125 per month",
    usDesc: "Optional. Coverage, billing, service limits, and cancellation terms are provided before enrollment.",
    usBullets: [
      "Maintenance includes supported software updates, maintenance of existing AI connections, compatibility fixes, and technical assistance within the maintenance plan’s stated limits.",
    ],
    cta: PRIMARY_CTA_LABEL,
    usCompareLabel: "Maintenance",
    traditionalCompareLabel: "Purchase",
    highlightsLabel: "What you get",
    highlightsTitleLine1: "",
    highlightsTitleGold: "",
    highlightsTitle: "Four parts of your purchase",
    highlightsIntro: "Tap a card to see what each part includes.",
    highlights: [
      {
        title: "We install first",
        summary: "Checked, installed, and configured",
        detail:
          "We check computer compatibility, then install and configure the included software and supported connections.",
      },
      {
        title: "Set up around your issues and goals",
        summary: "Guided setup and personal training",
        detail:
          "We set up your workspace around your issues and goals and show you how to use it. Guided setup means organizing the workspace and explaining the software, not legal advice.",
      },
      {
        title: "Support after installation",
        summary: "30 days of installation support",
        detail:
          "Installation support begins when installation is completed and covers setup problems and questions about using the installed features.",
      },
      {
        title: "Clear pricing",
        summary: "$3,997 once, maintenance optional",
        detail:
          "The one-time purchase is $3,997. Optional maintenance is $125 per month. We explain additional costs before installation.",
      },
    ],
  },
  process: {
    label: "How it works",
    title: "Three steps. From consultation to your own workspace.",
    titleLine1: "Three steps.",
    titleHighlight: "From consultation to your own workspace.",
    cta: PRIMARY_CTA_LABEL,
    steps: [
      {
        title: "Request an installation consultation",
        body: "We confirm your computer requirements, review the included features, and explain any additional costs before you purchase.",
      },
      {
        title: "We do the install",
        body: "We install and configure your workspace and supported connections, then set it up around your issues and goals and show you how to use it.",
      },
      {
        title: "You work from home",
        body: "Organize documents, research legal sources, and prepare drafts for your review — with a written getting-started guide, plus 30 days of installation support.",
      },
    ],
  },
  sourceTrust: {
    label: "Research you can check",
    title: "Open the source. Check the citation.",
    body: "Use source links to read the opinions, statutes, court rules, and documents behind your research. AI can make mistakes, including incorrect citations. Check each source and confirm that it supports your point before relying on it.",
    tiles: [
      {
        title: "Read the original",
        description: "Open the source behind a reference and read it in context.",
      },
      {
        title: "Check every citation",
        description: "Confirm that each source exists and supports your point before you rely on it.",
      },
      {
        title: "Know what is connected",
        description: "Available connections depend on your installation. Some sources require a separate subscription.",
      },
    ],
    closing: "Optional maintenance helps keep your installation current as technology changes.",
  },
  testimonials: {
    titleWhite: "People who got set up ",
    titleGold: "and worked from home.",
    label: "Illustrative examples",
    clients: {
      sandra: {
        quote:
          "Going through my divorce I had no idea where to start. They installed Ask AI Legal for my situation — then I handled the paperwork myself from home, step by step.",
        name: "Sandra M.",
        title: "Divorce",
        case: "Ohio",
        imageAlt: "Photo of Sandra M.",
      },
      marcus: {
        quote:
          "They did the install, explained how to use it, and I ran everything from my kitchen table.",
        name: "Marcus J.",
        title: "Civil motion",
        case: "Georgia",
        imageAlt: "Photo of Marcus J.",
      },
      priya: {
        quote:
          "Between work and my two kids, I couldn't keep up. Once they set me up, I could do what I needed at night from home.",
        name: "Priya S.",
        title: "Family court",
        case: "New Jersey",
        imageAlt: "Photo of Priya S.",
      },
      keisha: {
        quote:
          "They installed the tools for my housing matter — I opened every source myself and worked through it from home.",
        name: "Keisha W.",
        title: "Housing",
        case: "Illinois",
        imageAlt: "Photo of Keisha W.",
      },
      carlos: {
        quote:
          "English isn't my first language and legal forms were overwhelming. After the install, I could go at my own pace from home.",
        name: "Carlos R.",
        title: "Small claims response",
        case: "Arizona",
        imageAlt: "Photo of Carlos R.",
      },
    },
  },
  consultation: {
    label: "Installation consultation",
    titleLine1: "Every computer is different.",
    titleLine2: "We confirm yours first.",
    body1:
      "Before you purchase, we confirm supported computer requirements, explain the included features and connected services, and review installation arrangements with you.",
    body2:
      "The one-time purchase is $3,997, with optional maintenance at $125 per month. We explain additional costs before installation.",
    cardLabel: PRIMARY_CTA_LABEL,
    cardTitle: "Let's discuss your installation",
    emailLabel: "Email us",
    timing: "Send us a message and we'll reply by email to arrange your consultation.",
    cta: PRIMARY_CTA_LABEL,
  },
  faq: {
    label: "FAQ",
    title: "Frequently asked questions",
    intro: "",
    items: [
      {
        q: "What does Ask AI Legal cost?",
        a: "The one-time price is $3,997 for your installed workspace, setup, personal training, a written getting-started guide, and 30 days of installation support. Optional maintenance is $125 per month. Third-party AI usage and paid services are billed separately.",
      },
      {
        q: "What is included in installation?",
        a: "A computer compatibility check and installation, guided setup around your issues and goals, personalized workspace configuration, agent setup, supported API and plugin connections, Second Brain memory setup, personal training, and a written getting-started guide.",
      },
      {
        q: "Do I keep my workspace?",
        a: "Yes. Purchase Ask AI Legal once and keep your installed workspace on your computer under your license. Your saved information, documents, and accumulated memory stay with you.",
      },
      {
        q: "What does the 30-day support period cover?",
        a: "It begins when installation is completed and covers setup problems and questions about using the installed features. It does not include legal representation or unlimited custom development.",
      },
      {
        q: "Is monthly maintenance required?",
        a: "No. The $125 monthly maintenance service is optional. Your purchase and maintenance agreements explain what is included, what remains available without maintenance, and which features depend on third-party services.",
      },
      {
        q: "What does maintenance include?",
        a: "Optional maintenance provides ongoing support, supported software updates, and help maintaining your API and plugin connections as services change. Your saved learning stays in your workspace either way.",
      },
      {
        q: "Which research platforms can I connect?",
        a: "We can connect supported legal research platforms such as Westlaw, LexisNexis, Bloomberg Law, Fastcase / vLex, and CourtListener. Provider subscriptions and usage fees are separate. We'll go over the options for your installation during your consultation.",
      },
      {
        q: "Are AI and research subscriptions included?",
        a: "Third-party AI usage and paid services are billed separately.",
      },
      {
        q: "Does my information stay on my computer?",
        a: "Your documents and Second Brain memory are saved on your computer. With privacy mode on, when a connected AI service is used, personal identifiers are removed locally before the request is sent and restored locally in the returned document.",
      },
      {
        q: "Can Ask AI Legal make mistakes?",
        a: "Yes. AI can misread documents, produce incorrect citations, or give inaccurate information. Review generated work, check original sources, and confirm applicable court requirements before using a document.",
      },
      {
        q: "Are you a law firm?",
        a: "No. Ask AI Legal provides software, installation, training, and technical assistance. We do not provide legal representation.",
      },
    ],
  },
  footer: {
    tagline: "Your installed legal workspace. Setup by us. Optional maintenance.",
    documentOnly: "Software, installation, and support — not a law firm",
    columns: {
      services: "Features",
      company: "Company",
      legal: "Legal",
      social: "Social",
    },
    links: {
      allServices: "All features",
      caseRoadmap: "Research",
      caseResearch: "Document drafting",
      legalResearch: "Case organization",
      outcomeAnalysis: "Email & calendar",
      hearingPrep: "Privacy & data",
      documentPrep: "Installation & support",
      about: "About us",
      pricing: "Pricing",
      process: "How it works",
      whyUs: "What you buy",
      contact: "Contact",
      faq: "FAQ",
      terms: "Terms of service",
      privacy: "Privacy policy",
      disclaimer: "Disclaimer",
    },
  },
  cta: {
    label: "Get started",
    title: "Ready to set up your legal workspace?",
    body: "Book a consultation to confirm your computer requirements, review the included features, and discuss installation. The one-time purchase is $3,997, with optional maintenance at $125 per month.",
    emailConsult: PRIMARY_CTA_LABEL,
    emailQuote: PRIMARY_CTA_LABEL,
    disclaimer: SITE_DISCLAIMER,
  },
}

export type Translations = typeof en
