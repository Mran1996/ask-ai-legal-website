import { servicesPageContent } from "./services-page"
import {
  CASE_FILE_REVIEW_PRICE_DISPLAY as REVIEW_PRICE,
  PRIMARY_CTA_LABEL,
  CASE_REVIEW_CTA_LABEL,
} from "@/lib/site-config"

export const en = {
  nav: {
    freeReview: "Case review",
    help: "Help",
    about: "About",
    services: "Services",
    pricing: "Pricing",
    whyUs: "Why us",
    process: "Process",
    faq: "FAQ",
    contact: "Contact",
    emailForReview: `Case review — ${REVIEW_PRICE}`,
    language: "Language",
  },
  hero: {
    slogan: "Get the help that you deserve",
    titleLine1: "You shouldn't have to fight this alone.",
    titleHighlight: "We stand with you.",
    titleLine2: "",
    body: "Whatever you're facing — divorce, custody, a dispute, an unfair notice — we understand your situation and guide you on how to fight back. Plain language. Private. Peace of mind.",
    categories: [
      "Divorce & separation",
      "Custody & family",
      "Housing",
      "Civil disputes",
      "Small claims",
      "Green cards & immigration",
      "& more",
    ],
    ctaPrimary: PRIMARY_CTA_LABEL,
    ctaSecondary: "See how it works",
    stat1Value: REVIEW_PRICE,
    stat1Label: "Case review",
    stat1Sub: "We understand your situation — credited toward your support",
    stat2Value: "72 hrs",
    stat2Label: "We listen first",
    stat2Sub: "Your written summary — where you stand and what you need, usually within 72 hours",
    stat3Value: "1",
    stat3Label: "Peace of mind",
    stat3Sub: "One flat quote — no hourly billing, ever",
  },
  services: {
    label: "How we support you",
    titleLine1: "Describe your situation,",
    titleLine2: "generate the documents.",
    intro:
      "You could learn everything yourself — many people try. This is for when you want someone who listens, reads your documents, and guides you — not just a tool, but support with hands-on walkthrough so you're not figuring it out alone. Not a law firm; nothing is filed on your behalf.",
    importantLabel: "Important:",
    importantText:
      "Ask AI Legal generates documents only. We are not a law firm and do not provide legal advice.",
    items: [
      {
        title: "Analysis",
        description:
          "Review your situation, outline the documents you need, and map the order to prepare them — before a single word is drafted.",
      },
      {
        title: "Road map",
        description:
          "A step-by-step plan for your matter — key issues, recommended documents, and what to prepare next. Built from your facts, not a generic template.",
      },
      {
        title: "Document research",
        description:
          "Dig into the facts, filings, and procedural history of your matter so every document is built on what actually happened in your situation.",
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
          "Hearing outlines, talking points, and supporting documents organized for the appearance you handle yourself — written work prepared; you speak for yourself.",
      },
      {
        title: "Document preparation",
        description:
          "Letters, forms, responses, agreements, statements, exhibits, and supporting paperwork — fully drafted, formatted, and ready for your review. Upload what you have; documents are built from your files. You don't write a thing. Call or leave a message to learn more.",
      },
      {
        title: "Document delivery",
        description:
          "You receive a complete, formatted document package — ready for your review. What you do with it, including any filing, is entirely up to you.",
      },
      {
        title: "Revision & refinement",
        description: "Need changes? Revisions until your documents reflect your situation exactly. No hourly clock running.",
      },
    ],
  },
  servicesPage: servicesPageContent,
  compare: {
    label: "The difference",
    titleLine1: "Why pay $10,000 up front",
    titleHighlight: "to be kept in the dark?",
    titleLine2: "",
    subtitle: `A ${REVIEW_PRICE} case review assessment, then one flat quote for the support and documents your situation needs. No hourly clock, ever.`,
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
    usDesc: "Credited in full toward your support package",
    usBullets: [
      "Because quoting before reading your files is guessing — that's how payments balloon. The first payment covers your case review; the second is one fixed price for exactly the support and documents your written summary describes. No hourly billing at either step.",
    ],
    cta: CASE_REVIEW_CTA_LABEL,
    usCompareLabel: "Ask AI Legal",
    traditionalCompareLabel: "Traditional",
    highlightsLabel: "Services we offer",
    highlightsTitleLine1: "",
    highlightsTitleGold: "",
    highlightsTitle: "Four pillars of support",
    highlightsIntro: "Tap a card to explore how we stand with you — not just what we deliver.",
    highlights: [
      {
        title: "We understand first",
        summary: "Your story and documents — heard and read",
        detail:
          "Your case review starts with listening: your filings, your deadlines, your situation in your own words — before anything else moves forward.",
      },
      {
        title: "Guidance you can trust",
        summary: "Plain language, verified sources",
        detail:
          "Research from primary sources — not templates — so you understand your path with confidence, not confusion.",
      },
      {
        title: "You're not alone",
        summary: "Hands-on walkthrough and support",
        detail:
          "We guide you through your materials step by step — so you're not abandoned when it's time to file or respond.",
      },
      {
        title: "Peace of mind pricing",
        summary: "One price, no surprises",
        detail:
          "Flat pricing after your case review — no retainer clock running while someone drafts an email. You know the full cost before you say yes.",
      },
    ],
  },
  process: {
    label: "How it works",
    title: "Three simple steps. No hourly clock.",
    titleLine1: "Three simple steps.",
    titleHighlight: "No hourly clock.",
    cta: CASE_REVIEW_CTA_LABEL,
    steps: [
      {
        title: "Tell us what's going on",
        body: "Share your situation in plain language and upload what you have. Your story matters — you never have to decode confusing paperwork alone.",
      },
      {
        title: "We listen — then explain",
        body: "A written summary by email: where you stand, what you need, and one flat price — usually within 72 hours. Your facts, reflected back clearly.",
      },
      {
        title: "Fight back — with support",
        body: "Hands-on guidance through your materials — including how to open and verify every source yourself — so you know exactly what to do next. You stay in control; you're not abandoned when it counts.",
      },
    ],
  },
  sourceTrust: {
    label: "Built on tools that don't guess",
    title: "Real sources. Verified. Every time.",
    body: "The biggest risk with cheap legal help is paperwork built on cases that don't exist. That's not what happens here. Your setup pulls from real published sources — full opinions, statutes, actual documents — and every reference comes with the source behind it so you can open it and read it yourself. Nothing invented. Nothing you can't check.",
    tiles: [
      {
        title: "Real sources, not summaries",
        description: "Full published opinions and documents, not someone's paraphrase.",
      },
      {
        title: "Every quote traceable",
        description: "You can open the source behind any reference and read it in context.",
      },
      {
        title: "Current, not remembered",
        description: "Pulled fresh from primary sources, not recalled from memory.",
      },
    ],
    closing:
      "We keep the setup current as better tools come out. You get what works now — not what worked two years ago.",
  },
  testimonials: {
    titleWhite: "You'd be surprised ",
    titleGold: "how much lighter this feels.",
    label: "Illustrative examples",
    clients: {
      sandra: {
        quote:
          "Going through my divorce I had no idea where to start. They walked me through the paperwork step by step. I felt like they stood with me for the first time.",
        name: "Sandra M.",
        title: "Divorce",
        case: "Ohio",
        imageAlt: "Photo of Sandra M.",
      },
      marcus: {
        quote:
          "Every lawyer wanted a retainer I couldn't afford. One email, a clear price, and I felt like someone finally had my back — not just documents, but someone who explained what to do next.",
        name: "Marcus J.",
        title: "Civil motion",
        case: "Georgia",
        imageAlt: "Photo of Marcus J.",
      },
      priya: {
        quote:
          "Between work and my two kids, I couldn't keep up with the deadlines. I felt like someone had my back — they explained everything in plain language so I could focus on my children.",
        name: "Priya S.",
        title: "Family court",
        case: "New Jersey",
        imageAlt: "Photo of Priya S.",
      },
      keisha: {
        quote:
          "Facing an unfair eviction with nowhere to turn. I felt like someone had my back — they broke down every paragraph so I understood it before I walked in.",
        name: "Keisha W.",
        title: "Housing",
        case: "Illinois",
        imageAlt: "Photo of Keisha W.",
      },
      carlos: {
        quote:
          "English isn't my first language and legal forms were overwhelming. I felt like someone had my back — they explained everything clearly and made sure I knew exactly what to file.",
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
      "Review your situation first — someone who reads your documents and tells you honestly what you're facing and what it will cost. No surprises, no guessing.",
    body2:
      "You could figure this out alone. Many try. We're here when you want certainty, confidence — we stand with you.",
    cardLabel: "Schedule a consultation",
    cardTitle: "Let's discuss what we can do for you",
    emailLabel: "Email us",
    timing:
      "Consultations are free. Most inquiries receive a reply within one business day. You'll get a clear picture of scope, timeline, and investment.",
    cta: CASE_REVIEW_CTA_LABEL,
  },
  faq: {
    label: "Questions",
    title: "Straight answers",
    intro: "Transparency is part of the service. Here's what clients ask before they start.",
    items: [
      {
        q: "How do I know you understand my situation?",
        a: "We read what you send — your filings, notices, and your story in your own words. Your case review includes a written summary that reflects your facts back to you, not generic templates. You could research everything yourself; many people do. We're here when you want someone who has actually listened, explained your path in plain language, and stays with you — with hands-on support so you're not alone at each step.",
      },
      {
        q: "Are you a law firm?",
        a: "No. Ask AI Legal is not a law firm and does not provide legal advice. We understand your situation and guide you — with documents prepared for your review. No attorney-client relationship.",
      },
      {
        q: `What do I get for ${REVIEW_PRICE}?`,
        a: `A ${REVIEW_PRICE} case review assessment: we listen, read what you send — filings, notices, letters, and any paperwork — then email a plain-English written summary, usually within 72 hours. It explains where things stand, what you still need, and one flat price for support and documents. The ${REVIEW_PRICE} is credited in full toward that price. Part of what you're paying for is judgment about which tools fit your situation — and which don't.`,
      },
      {
        q: "Why two payments instead of one price up front?",
        a: "Because quoting before reading your files is guessing — that's how payments balloon. The first payment covers your case review; the second is one fixed price for exactly the support and documents your written summary describes. No hourly billing at either step.",
      },
      {
        q: "What kinds of matters do you handle?",
        a: "Any issue — there is no limit. Divorce, custody, family matters, civil disputes, business conflicts, tenant issues, and whatever documents your situation needs. Across U.S. jurisdictions.",
      },
      {
        q: "How do I know your sources are real?",
        a: "Every reference is retrieved from the original published source — stored in your file and verified before it appears in your materials. You receive a reference list with your delivery, and we walk you through how to open each source and confirm it yourself.",
      },
      {
        q: "Do you use AI?",
        a: "We use the best research and drafting tools available, and we keep that current as they improve. What matters more is how they're set up — configured for your specific situation, with every source traceable back to a real published document you can open and read. The tools change. The standard doesn't.",
      },
    ],
  },
  footer: {
    tagline: "We stand with you.",
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
    title: "You don't have to fight this alone.",
    body: "Tell us what you're facing — someone who listens, understands your situation, and guides you on how to fight back. Plain language, one flat price, peace of mind.",
    emailConsult: PRIMARY_CTA_LABEL,
    emailQuote: CASE_REVIEW_CTA_LABEL,
    disclaimer:
      "Ask AI Legal provides legal information and document automation for educational and informational purposes only. It does not constitute formal legal advice or an attorney-client relationship.",
  },
}

export type Translations = typeof en
