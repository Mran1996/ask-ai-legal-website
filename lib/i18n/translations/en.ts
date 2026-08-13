import { servicesPageContent } from "./services-page"
import { CASE_FILE_REVIEW_PRICE_DISPLAY as REVIEW_PRICE } from "@/lib/site-config"

export const en = {
  nav: {
    freeReview: "File review",
    help: "Help",
    about: "About",
    services: "Services",
    pricing: "Pricing",
    whyUs: "Why us",
    process: "Process",
    faq: "FAQ",
    contact: "Contact",
    emailForReview: `File review — ${REVIEW_PRICE}`,
    language: "Language",
  },
  hero: {
    slogan: "Get the help that you deserve",
    titleLine1: "Help — without the",
    titleHighlight: "$10,000 retainer.",
    titleLine2: "",
    body: "Whatever you're facing — divorce, custody, a dispute, an unfair notice — we prepare the documents your situation needs, for a fraction of what a lawyer's retainer costs. Plain language. Private. On your side.",
    categories: [
      "Divorce & separation",
      "Custody & family",
      "Housing",
      "Civil disputes",
      "Small claims",
      "& more",
    ],
    ctaPrimary: "Get help today",
    ctaSecondary: "See how it works",
    stat1Value: REVIEW_PRICE,
    stat1Label: "File review deposit",
    stat1Sub: "Credited toward your documents",
    stat2Value: "72 hrs",
    stat2Label: "Your written document summary",
    stat2Sub: "After all documents are received — usually within 72 hours",
    stat3Value: "1",
    stat3Label: "Flat quote",
    stat3Sub: "No hourly billing, ever",
  },
  services: {
    label: "What we handle for you",
    titleLine1: "You describe your situation.",
    titleLine2: "We do everything else.",
    intro:
      "This isn't a DIY template library. We research, draft, format, and deliver your documents — the written work only. We generate documents; we do not file on your behalf or represent you.",
    importantLabel: "Important:",
    importantText:
      "Ask AI Legal generates documents only. We are not a law firm and do not provide legal advice.",
    items: [
      {
        title: "Analysis",
        description:
          "We review your situation, outline the documents you need, and map the order to prepare them — before a single word is drafted.",
      },
      {
        title: "Road map",
        description:
          "A step-by-step plan for your matter — key issues, recommended documents, and what to prepare next. Built from your facts, not a generic template.",
      },
      {
        title: "Document research",
        description:
          "We dig into the facts, filings, and procedural history of your matter so every document is built on what actually happened in your situation.",
      },
      {
        title: "In-depth research",
        description:
          "Rules, requirements, and published sources relevant to your issue — researched and applied to your facts so your documents reference the right material.",
      },
      {
        title: "Source verification",
        description:
          "Every source we use is retrieved from the original publication, stored in your document file, and verified in a separate review pass before it appears in your documents — never invented, never guessed.",
      },
      {
        title: "Hearing preparation",
        description:
          "Hearing outlines, talking points, and supporting documents organized for the appearance you handle yourself — we prepare the written work; you speak for yourself.",
      },
      {
        title: "Document preparation",
        description:
          "Letters, forms, responses, agreements, statements, exhibits, and supporting paperwork — fully drafted, formatted, and ready for your review. Upload what you have and we build from your files. You don't write a thing. Call us or leave us a message to see how we can help.",
      },
      {
        title: "Document delivery",
        description:
          "You receive a complete, formatted document package — ready for your review. What you do with it, including any filing, is entirely up to you.",
      },
      {
        title: "Revision & refinement",
        description: "Need changes? We revise until your documents reflect your situation exactly. No hourly clock running.",
      },
    ],
  },
  servicesPage: servicesPageContent,
  compare: {
    label: "The difference",
    titleLine1: "Why pay $10,000 up front",
    titleHighlight: "to be kept in the dark?",
    titleLine2: "",
    subtitle: `A ${REVIEW_PRICE} file review deposit, then one flat quote for exactly what your situation needs. No hourly clock, ever.`,
    traditionalHeading: "The retainer trap",
    traditionalPrice: "$3,000–$10,000 retainer",
    traditionalDesc: "Drawn down hourly, whether or not the work moves your situation forward",
    traditionalBullets: [
      "Weeks waiting for callbacks",
      "You may never see an analysis of your own documents",
      "Costs grow with every call and every email",
    ],
    usBadge: "Ask AI Legal",
    usHeading: "Two-step flat fee",
    usPrice: `${REVIEW_PRICE} to start`,
    usDesc: "Credited in full toward your document package",
    usBullets: [
      `${REVIEW_PRICE} file review deposit — credited toward your documents`,
      "One flat quote after your written document summary, no hourly billing",
      "Every source retrieved, stored, and verified",
    ],
    cta: "Start my file review",
    usCompareLabel: "Ask AI Legal",
    traditionalCompareLabel: "Traditional",
    highlightsLabel: "Services we offer",
    highlightsTitleLine1: "",
    highlightsTitleGold: "",
    highlightsTitle: "Four pillars of every situation",
    highlightsIntro: "Tap a card to flip and explore what we deliver with every situation.",
    highlights: [
      {
        title: "Full document preparation",
        summary: "Researched, drafted, formatted, and ready for your review",
        detail:
          "Every document is checked against the formatting and reference standards that apply to your situation — no missed requirements, no rejected paperwork, no billing you to fix a margin.",
      },
      {
        title: "Research & document planning",
        summary: "Built from your files and verified sources",
        detail:
          "We research from primary sources — not from memory or generic templates — so your documents are built on current, verified material.",
      },
      {
        title: "Source verification",
        summary: "Every reference retrieved and checked twice",
        detail:
          "Every source we use is pulled from the original publication, stored in your document file, and verified in a separate review pass before it reaches your draft — never invented, never guessed.",
      },
      {
        title: "Transparent quote",
        summary: "One price, no surprises",
        detail:
          "Flat pricing, calculated upfront after we review your files. No clock running while someone drafts an email — you know the full cost before you say yes.",
      },
    ],
  },
  process: {
    label: "How it works",
    title: "Three simple steps. No hourly clock.",
    titleLine1: "Three simple steps.",
    titleHighlight: "No hourly clock.",
    cta: "Get help today",
    steps: [
      {
        title: "Tell us what's going on",
        body: "Share your situation in plain language and upload what you have. We ask the right questions — you never touch confusing paperwork.",
      },
      {
        title: "Get answers you understand",
        body: "We email you a written summary: where you stand, the documents you need, and one flat price — usually within 72 hours.",
      },
      {
        title: "We prepare your documents",
        body: "We research, draft, and format everything your situation needs, ready for your review. You stay in control of every next step.",
      },
    ],
  },
  testimonials: {
    titleWhite: "You'd be surprised ",
    titleGold: "how much lighter this feels.",
    label: "Illustrative examples",
    clients: {
      sandra: {
        quote:
          "Going through my divorce I had no idea where to start. They walked me through the paperwork step by step. I felt like I had someone in my corner for the first time.",
        name: "Sandra M.",
        title: "Divorce",
        case: "Ohio",
        imageAlt: "Photo of Sandra M.",
      },
      marcus: {
        quote:
          "I needed a motion filed fast and every lawyer wanted a retainer I couldn't afford. One email, a clear price, and my documents were back in 72 hours. They looked like something a real attorney wrote.",
        name: "Marcus J.",
        title: "Civil motion",
        case: "Georgia",
        imageAlt: "Photo of Marcus J.",
      },
      priya: {
        quote:
          "Between work and my two kids, I couldn't keep up with the deadlines. They handled it and explained everything in plain language so I could focus on my children.",
        name: "Priya S.",
        title: "Family court",
        case: "New Jersey",
        imageAlt: "Photo of Priya S.",
      },
      keisha: {
        quote:
          "Facing an unfair eviction with nowhere to turn. They drafted my response and broke down every paragraph so I understood it before I walked in.",
        name: "Keisha W.",
        title: "Housing",
        case: "Illinois",
        imageAlt: "Photo of Keisha W.",
      },
      carlos: {
        quote:
          "English isn't my first language and legal forms were overwhelming. They explained everything clearly, prepared my response, and made sure I knew exactly what to file.",
        name: "Carlos R.",
        title: "Small claims response",
        case: "Arizona",
        imageAlt: "Photo of Carlos R.",
      },
    },
  },
  consultation: {
    label: "Your investment",
    titleLine1: "Every situation is different.",
    titleLine2: "So is every solution.",
    body1:
      "We learn about your situation first — then tell you exactly what we can prepare for you and what it will cost. No surprises.",
    body2:
      "Email us your details. We'll reply with what we can do for your situation and whether we're the right fit.",
    cardLabel: "Schedule a consultation",
    cardTitle: "Let's discuss what we can do for you",
    emailLabel: "Email us",
    timing:
      "Consultations are free. Most inquiries receive a reply within one business day. You'll get a clear picture of scope, timeline, and investment.",
    cta: "Email for a free document review",
  },
  faq: {
    label: "Questions",
    title: "Straight answers",
    intro: "Transparency is part of the service. Here's what clients ask before they start.",
    items: [
      {
        q: "Are you a law firm?",
        a: "No. Ask AI Legal generates documents only. We prepare complete documents for your review and use. We do not provide legal advice and do not establish an attorney-client relationship.",
      },
      {
        q: `What do I get for ${REVIEW_PRICE}?`,
        a: `A ${REVIEW_PRICE} file review: we read what you send us — filings, notices, letters, and any paperwork you have — and email you a plain-English written summary, usually within 72 hours. It explains where things stand, what documents you still need, and one flat price to prepare them. The ${REVIEW_PRICE} is credited in full toward that price.`,
      },
      {
        q: "Why two payments instead of one price up front?",
        a: "Because quoting document work before reading your files is guessing — that's how retainers balloon. The first payment covers reviewing what you sent; the second is one fixed price for exactly the documents your written summary describes. No hourly billing at either step.",
      },
      {
        q: "What kinds of matters do you handle?",
        a: "Any issue — there is no limit. Divorce, custody, family matters, civil disputes, business conflicts, tenant issues, and whatever documents your situation needs. Across U.S. jurisdictions.",
      },
      {
        q: "How do I know your sources are real?",
        a: "Every reference we include is retrieved from the original source, stored in your document file, and verified in a separate review pass before it appears in your documents. You receive a reference list with your delivery.",
      },
      {
        q: "Will you appear in court for me?",
        a: "No — never. We only generate documents. You are responsible for filing, serving, and appearing in court on your own behalf or through an attorney you hire separately.",
      },
      {
        q: "Can I request revisions?",
        a: "Yes. Revisions are included in your quoted scope until your documents reflect your situation accurately. We refine until you're confident filing.",
      },
    ],
  },
  footer: {
    tagline: "We prepare complete document packages for you — researched, drafted, and delivered.",
    documentOnly: "Document generation only",
    columns: {
      services: "Services",
      company: "Company",
      legal: "Legal",
      social: "Social",
    },
    links: {
      allServices: "All services",
      caseRoadmap: "Road map",
      caseResearch: "Document research",
      legalResearch: "In-depth research",
      outcomeAnalysis: "Source verification",
      hearingPrep: "Hearing preparation",
      documentPrep: "Document prep",
      about: "About us",
      pricing: "Pricing",
      process: "How it works",
      whyUs: "Why us",
      contact: "Contact",
      faq: "FAQ",
      terms: "Terms of service",
      privacy: "Privacy policy",
      disclaimer: "Disclaimer",
    },
  },
  cta: {
    label: "Begin today",
    title: "You deserve help you can actually afford.",
    body: "Tell us what you're facing and get real answers — plain language, one flat price, and someone finally on your side.",
    emailConsult: "Get help today",
    emailQuote: "Email to get your quote",
    disclaimer:
      "Ask AI Legal provides legal information and document automation for educational and informational purposes only. It does not constitute formal legal advice or an attorney-client relationship.",
  },
}

export type Translations = typeof en
