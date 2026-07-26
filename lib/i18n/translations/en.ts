import { servicesPageContent } from "./services-page"
import { CASE_FILE_REVIEW_PRICE_DISPLAY as REVIEW_PRICE } from "@/lib/site-config"

export const en = {
  nav: {
    freeReview: "Case file review",
    help: "Help",
    about: "About",
    services: "Services",
    pricing: "Pricing",
    whyUs: "Why us",
    process: "Process",
    faq: "FAQ",
    contact: "Contact",
    emailForReview: `Case file review — ${REVIEW_PRICE}`,
    language: "Language",
  },
  hero: {
    slogan: "Know your case. Own your case.",
    titleLine1: "You paid the retainer.",
    titleHighlight: "Do you know",
    titleLine2: "what's in your case file?",
    body: `Full document preparation service for people handling important paperwork on their own — any issue, any jurisdiction. Start with a flat ${REVIEW_PRICE} case file review. We email you a written summary with your exact price, usually within 72 hours — credited in full toward your documents.`,
    ctaPrimary: `Start my case file review — ${REVIEW_PRICE}`,
    ctaSecondary: "See how it works",
    stat1Value: REVIEW_PRICE,
    stat1Label: "Case file review",
    stat1Sub: "Credited toward your documents",
    stat2Value: "72 hrs",
    stat2Label: "Your written case summary",
    stat2Sub: "After all documents are received — usually within 72 hours",
    stat3Value: "1",
    stat3Label: "Flat quote",
    stat3Sub: "No hourly billing, ever",
  },
  services: {
    label: "What we handle for you",
    titleLine1: "You describe your case.",
    titleLine2: "We do everything else.",
    intro:
      "This isn't a DIY template library. We research, draft, format, and deliver your documents — the written work only. We generate documents; we do not file on your behalf or represent you.",
    importantLabel: "Important:",
    importantText:
      "Ask AI Legal generates documents only. We are not a law firm and do not provide legal advice.",
    items: [
      {
        title: "Case analysis",
        description:
          "We review your situation, outline the documents you need, and map the order to prepare them — before a single word is drafted.",
      },
      {
        title: "Case roadmap",
        description:
          "A step-by-step plan for your matter — key issues, recommended filings, and what to prepare next. Built from your facts, not a generic template.",
      },
      {
        title: "Case research",
        description:
          "We dig into the facts, filings, and procedural history of your matter so every document is built on what actually happened in your case.",
      },
      {
        title: "In-depth research",
        description:
          "Rules, requirements, and published sources relevant to your issue — researched and applied to your facts so your documents reference the right material.",
      },
      {
        title: "Source verification",
        description:
          "Every source we use is retrieved from the original publication, stored in your case file, and verified in a separate review pass before it appears in your documents — never invented, never guessed.",
      },
      {
        title: "Hearing preparation",
        description:
          "Hearing outlines, talking points, and supporting documents organized for the appearance you handle yourself — we prepare the written work; you speak for yourself.",
      },
      {
        title: "Document preparation",
        description:
          "Motions, petitions, responses, complaints, answers, affidavits, declarations, discovery papers, demand letters, and more — fully drafted, formatted, and ready for your review. Upload what you have and we build from your files. You don't write a thing. Call us or leave us a message to see how we can help.",
      },
      {
        title: "Document delivery",
        description:
          "You receive a complete, formatted document package — ready for your review. What you do with it, including any filing, is entirely up to you.",
      },
      {
        title: "Revision & refinement",
        description: "Need changes? We revise until your documents reflect your case exactly. No hourly clock running.",
      },
    ],
  },
  servicesPage: servicesPageContent,
  compare: {
    label: "The difference",
    titleLine1: "The retainer trap —",
    titleHighlight: "solved",
    titleLine2: "with a two-step flat fee",
    subtitle: `A ${REVIEW_PRICE} case file review, then one flat quote for exactly what your case needs. No hourly clock, ever.`,
    traditionalHeading: "The retainer trap",
    traditionalPrice: "$3,000–$10,000 retainer",
    traditionalDesc: "Drawn down hourly, whether or not the work moves your case forward",
    traditionalBullets: [
      "Weeks waiting for callbacks",
      "You may never see an analysis of your own case file",
      "Costs grow with every call and every email",
    ],
    usBadge: "Ask AI Legal",
    usHeading: "Two-step flat fee",
    usPrice: `${REVIEW_PRICE} to start`,
    usDesc: "Credited in full toward your document package",
    usBullets: [
      `${REVIEW_PRICE} case file review — credited toward your documents`,
      "One flat quote after your written case summary, no hourly billing",
      "Every source retrieved, stored, and verified",
    ],
    cta: "Start my case file review",
    usCompareLabel: "Ask AI Legal",
    traditionalCompareLabel: "Traditional",
    highlightsLabel: "Services we offer",
    highlightsTitle: "Four pillars of every case",
    highlightsIntro: "Tap a card to flip and explore what we deliver with every case.",
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
          "Every source we use is pulled from the original publication, stored in your case file, and verified in a separate review pass before it reaches your draft — never invented, never guessed.",
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
    label: "Our process",
    title: "Two payments. No hourly clock. Ever.",
    cta: "Start my case file review",
    steps: [
      {
        title: "Tell us your case",
        body: "Share your situation in plain language and upload what you have. We ask the right questions — you never touch confusing paperwork language.",
      },
      {
        title: `${REVIEW_PRICE} case file review`,
        body: `We review your case file and email you a plain-English written summary of your situation — what's missing, what documents you need, and your exact price — usually within 72 hours. The ${REVIEW_PRICE} is credited in full toward your documents.`,
      },
      {
        title: "One flat quote",
        body: "Your written summary ends with a single recommendation and one flat price for the documents your situation needs. No hourly surprises.",
      },
      {
        title: "Complete document delivery",
        body: "We research, draft, and verify every reference, then deliver your complete document package. You review and use the documents yourself.",
      },
    ],
  },
  testimonials: {
    titleWhite: "What customers say ",
    titleGold: "about us",
    label: "Illustrative examples",
    clients: {
      sandra: {
        quote:
          "Going through my divorce I had no idea where to start. They walked me through the paperwork step by step — custody, property, all of it. I felt like I had someone in my corner for the first time.",
        name: "Sandra M.",
        title: "Divorce filing",
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
          "Between work and my two kids, I couldn't keep up with family court deadlines. They handled the research and prepared my documents so I could focus on my children — everything was explained in plain language.",
        name: "Priya S.",
        title: "Family court",
        case: "New Jersey",
        imageAlt: "Photo of Priya S.",
      },
      keisha: {
        quote:
          "Facing an unfair eviction with nowhere to turn. They researched tenant rights, drafted my response, and broke down every paragraph so I understood it before I walked into court.",
        name: "Keisha W.",
        title: "Housing defense",
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
    titleLine1: "Every case is different.",
    titleLine2: "So is every solution.",
    body1:
      "We learn about your situation first — then tell you exactly what we can prepare for you and what it will cost. No surprises.",
    body2:
      "Email us your details. We'll reply with what we can do for your case and whether we're the right fit.",
    cardLabel: "Schedule a consultation",
    cardTitle: "Let's discuss what we can do for you",
    emailLabel: "Email us",
    timing:
      "Consultations are free. Most inquiries receive a reply within one business day. You'll get a clear picture of scope, timeline, and investment.",
    cta: "Email for a free case review",
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
        a: `A case file review: we read what you send us — filings, notices, letters, and any paperwork you have — and email you a plain-English written summary, usually within 72 hours. It explains where things stand, what documents you still need, and one flat price to prepare them. The ${REVIEW_PRICE} is credited in full toward that price.`,
      },
      {
        q: "Why two payments instead of one price up front?",
        a: "Because quoting document work before reading your files is guessing — that's how retainers balloon. The first payment covers reviewing what you sent; the second is one fixed price for exactly the documents your written summary describes. No hourly billing at either step.",
      },
      {
        q: "What kinds of cases do you handle?",
        a: "Any issue — there is no limit. Divorce, custody, family matters, civil disputes, business conflicts, tenant issues, and whatever documents your situation needs. Across U.S. jurisdictions.",
      },
      {
        q: "How do I know your sources are real?",
        a: "Every reference we include is retrieved from the original source, stored in your case file, and verified in a separate review pass before it appears in your documents. You receive a reference list with your delivery.",
      },
      {
        q: "Will you appear in court for me?",
        a: "No — never. We only generate documents. You are responsible for filing, serving, and appearing in court on your own behalf or through an attorney you hire separately.",
      },
      {
        q: "Can I request revisions?",
        a: "Yes. Revisions are included in your quoted scope until your documents reflect your case accurately. We refine until you're confident filing.",
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
      caseRoadmap: "Case roadmap",
      caseResearch: "Case research",
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
    title: "Stop paying for hours. Start with your file.",
    body: `A ${REVIEW_PRICE} case file review tells you exactly where your case stands and what it will cost to prepare — before you commit to anything else. Credited in full toward your documents.`,
    emailConsult: "Start my case file review",
    emailQuote: "Email to get your quote",
    disclaimer: "Not a law firm · No legal advice · Document preparation & research only",
  },
}

export type Translations = typeof en
