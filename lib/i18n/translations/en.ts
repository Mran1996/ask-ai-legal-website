import { servicesPageContent } from "./services-page"
import { ALL_FAQ } from "@/lib/faq"
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
    slogan: "Install it in minutes. Ask AI Legal does the heavy lifting. You make the decisions.",
    titleLine1: "Your legal workspace.",
    titleHighlight: "Installed on your computer.",
    titleLine2: "",
    body: "Ask AI Legal runs on your own computer. Bring your information together, generate personalized documents, and build on what your Second Brain remembers.",
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
    stat1Value: "$1,497",
    stat1Label: "One-time purchase",
    stat1Sub: "Starting price, paid once, with a walkthrough video and support after install",
    stat2Value: "$125/mo",
    stat2Label: "Optional maintenance",
    stat2Sub: "Supported updates and technical assistance within the plan's stated limits",
    stat3Value: "14 or 30 days",
    stat3Label: "Support after install",
    stat3Sub: "14 days with Starter, 30 days with Complete",
  },
  services: {
    label: "What your workspace includes",
    titleLine1: "Your legal workspace.",
    titleLine2: "Installed on your computer.",
    intro:
      "Ask AI Legal is software on your own computer. You install it in minutes with our walkthrough video. You stay in control of your matter, and nothing is filed on your behalf.",
    importantLabel: "Important:",
    importantText: SITE_DISCLAIMER,
    items: [
      {
        title: "Supported research connections",
        description:
          "Connect your workspace to supported legal research platforms such as Westlaw, LexisNexis, Bloomberg Law, and CourtListener. Provider subscriptions and usage fees are separate. Open the original sources and check each citation before relying on it.",
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
        title: "Walkthrough video and support",
        description:
          "Your download, a step-by-step walkthrough video, and 14 days of support with Starter, 30 days with Complete. You can reach us 24/7.",
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
      "Ask AI Legal is a one-time software purchase: Starter is $1,497 and Complete is $2,997. Optional maintenance is $125 per month. You download it, follow the walkthrough video, and we help by chat, email, or phone.",
    traditionalHeading: "One-time purchase",
    traditionalPrice: "$1,497",
    traditionalDesc:
      "Your download, a walkthrough video, and support after install",
    traditionalBullets: [
      "Step-by-step walkthrough video",
      "Install in minutes on your own computer",
      "14 days of support with Starter, 30 days with Complete",
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
        title: "You install it in minutes",
        summary: "Download, walkthrough video, license code",
        detail:
          "We email your download and a walkthrough video. Follow the steps and activate it with your license code.",
      },
      {
        title: "Set up around your issues and goals",
        summary: "Guided setup and personal training",
        detail:
          "We set up your workspace around your issues and goals and show you how to use it. Guided setup means organizing the workspace and explaining the software, not legal advice.",
      },
      {
        title: "Support after install",
        summary: "14 days of support with Starter, 30 days with Complete",
        detail:
          "Support begins when you install and covers setup problems and questions about using the installed features. You can reach us 24/7.",
      },
      {
        title: "Clear pricing",
        summary: "From $1,497 once, maintenance optional",
        detail:
          "Starter is $1,497 and Complete is $2,997, each paid once. Optional maintenance is $125 per month. Third-party services you connect are billed separately.",
      },
    ],
  },
  process: {
    label: "How it works",
    title: "Three steps. From checkout to your own workspace.",
    titleLine1: "Three steps.",
    titleHighlight: "From checkout to your own workspace.",
    cta: PRIMARY_CTA_LABEL,
    steps: [
      {
        title: "Choose your plan and pay once",
        body: "Pick Starter or Complete and check out securely. Then tell us which computer you use.",
      },
      {
        title: "Download and install",
        body: "We email your download and a step-by-step walkthrough video. Install it in minutes and activate it with your license code.",
      },
      {
        title: "You work from home",
        body: "Organize documents, research legal sources, and prepare drafts for your review, with support by chat, email, or phone.",
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
    label: "Getting started",
    titleLine1: "Pay once.",
    titleLine2: "Install it in minutes.",
    body1:
      "After you pay, choose Windows or Mac. We send your download and a step-by-step walkthrough video, and help by chat, email, or phone whenever you need it. Our support phone number comes with your download.",
    body2:
      "Plans start at $1,497, paid once, with optional maintenance at $125 per month. Third-party services you connect are billed separately.",
    cardLabel: PRIMARY_CTA_LABEL,
    cardTitle: "Questions before you buy?",
    emailLabel: "Email us",
    timing: "Email us or ask our website chat. We reply by email.",
    cta: PRIMARY_CTA_LABEL,
  },
  faq: {
    label: "FAQ",
    title: "Frequently asked questions",
    intro: "",
    items: ALL_FAQ,
  },
  footer: {
    tagline: "Your legal workspace on your own computer. Optional maintenance.",
    documentOnly: "Software and support, not a law firm",
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
    body: "Pay once, download, and install in minutes. Plans start at $1,497, with optional maintenance at $125 per month.",
    emailConsult: PRIMARY_CTA_LABEL,
    emailQuote: PRIMARY_CTA_LABEL,
    disclaimer: SITE_DISCLAIMER,
  },
}

export type Translations = typeof en
