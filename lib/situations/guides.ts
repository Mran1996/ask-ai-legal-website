export type SituationGuide = {
  slug: string
  title: string
  intro: string
  weHelpWith: string[]
  commonQuestions: { q: string; a: string }[]
  documentsExamples: string[]
  ctaLabel: string
}

export const SITUATION_GUIDES: Record<string, SituationGuide> = {
  divorce: {
    slug: "divorce",
    title: "Divorce & separation",
    intro:
      "Whether you are starting a divorce, responding to papers your spouse filed, or untangling finances and parenting — we install Ask AI Legal so you can work through the paperwork from home. Not a law firm; not legal advice.",
    weHelpWith: [
      "Child support — establishing, modifying, or documenting support requests",
      "Spousal support / financial support — written requests and supporting paperwork",
      "Property and debt division — inventories, declarations, and settlement drafts",
      "Separation agreements and marital settlement outlines",
      "Responses to a divorce petition when you were served first",
      "Temporary orders while your matter is pending",
    ],
    commonQuestions: [
      {
        q: "Can I ask for child support in my divorce paperwork?",
        a: "Yes — child support is one of the most common areas people configure in their home setup. Tell us your children’s ages, custody arrangement, and income information; we install the tools so you can draft the forms and declarations from home.",
      },
      {
        q: "What if my spouse already filed and I don’t know what to do?",
        a: "Send us what you were served. We read it in plain language, explain your deadlines, and configure your setup so you can prepare a written response plus any counter-requests from home.",
      },
      {
        q: "Do you handle financial support for a spouse, not just children?",
        a: "Your install can include tools for spousal-support requests and related financial declarations when your facts support them. You decide what to draft and file from home.",
      },
      {
        q: "Is this the same as hiring a divorce lawyer?",
        a: "No. We are not a law firm. We install and configure Ask AI Legal; you run the work from home. We do not represent you in court or give legal strategy.",
      },
    ],
    documentsExamples: [
      "Divorce petition or response",
      "Financial declaration / income & expense forms",
      "Child support worksheets and declarations",
      "Parenting plan drafts",
      "Marital settlement agreement outlines",
    ],
    ctaLabel: "Start your divorce setup",
  },
  custody: {
    slug: "custody",
    title: "Custody & family",
    intro:
      "Custody fights are stressful — and the forms are confusing on purpose. We install Ask AI Legal so you can translate what the court is asking for and work on parenting plans, custody requests, and support paperwork from home.",
    weHelpWith: [
      "Parenting plans and visitation schedules",
      "Child custody and legal decision-making requests",
      "Child support — new requests, modifications, and arrears documentation",
      "Guardianship and third-party care paperwork",
      "Modifications when an old order no longer fits your life",
      "Responses when the other parent filed first",
    ],
    commonQuestions: [
      {
        q: "Can I ask for sole custody?",
        a: "Your home setup helps you draft custody requests based on what you tell us about safety, stability, and the children’s needs. We do not predict outcomes — we configure tools so your documents can clearly state your requests and supporting facts.",
      },
      {
        q: "What is a parenting plan?",
        a: "It is the schedule and rules for how children split time between parents — holidays, exchanges, school decisions, and more. With your install, you draft a plan from your inputs so you can review it before filing.",
      },
      {
        q: "Can you help with child support only?",
        a: "Yes. Many people need support paperwork without a full custody battle. Send your existing orders (if any) and income info; we configure your setup so you can prepare the written request or modification from home.",
      },
      {
        q: "The other parent already filed — can you still help?",
        a: "Absolutely. Send what you received. We explain it in plain English and install tools so you can prepare your written response plus any requests for support, custody, or visitation changes from home.",
      },
    ],
    documentsExamples: [
      "Parenting plan",
      "Custody / visitation motion or response",
      "Child support request or modification",
      "Declaration in support of custody",
      "Request to modify existing family orders",
    ],
    ctaLabel: "Start your custody setup",
  },
  housing: {
    slug: "housing",
    title: "Housing",
    intro:
      "Eviction notices, lease disputes, and repair fights move fast. We install Ask AI Legal so you can prepare written responses and housing-related documents from home — and understand every paragraph and deadline.",
    weHelpWith: [
      "Unlawful detainer / eviction responses",
      "Answers when a landlord sues to remove you",
      "Repair-and-deduct or habitability documentation",
      "Security deposit demand letters",
      "Lease violation responses",
      "Rent dispute written statements",
    ],
    commonQuestions: [
      {
        q: "How fast do I need to respond to an eviction notice?",
        a: "Deadlines are short — often a few days to a few weeks depending on your state and notice type. Send us your notice immediately; we help you see what the deadline likely is and configure tools so you can prepare response documents from home.",
      },
      {
        q: "Can I stay in my home while I fight an eviction?",
        a: "That depends on your jurisdiction and what has been filed. We do not give legal advice — we install tools and explain what each filing is for so you can make informed decisions from home.",
      },
      {
        q: "My landlord won’t fix anything — can you help?",
        a: "Your setup can include tools for written repair requests, habitability declarations, and related documents many tenants use before or alongside court filings. Tell us what’s broken and what you’ve already asked for in writing.",
      },
      {
        q: "Do you file for me?",
        a: "No. We install and configure tools you use from home. You file, serve, and appear on your own behalf (or with an attorney you hire separately).",
      },
    ],
    documentsExamples: [
      "Answer to unlawful detainer",
      "Written repair demand",
      "Security deposit demand letter",
      "Declaration of habitability issues",
      "Response to lease termination",
    ],
    ctaLabel: "Start your housing setup",
  },
  civil: {
    slug: "civil",
    title: "Civil disputes",
    intro:
      "Sued in civil court? Need to sue someone back? We install Ask AI Legal so you are not staring at blank forms alone — researched tools, formatted templates, and plain-language guidance you run from home.",
    weHelpWith: [
      "Answers to civil complaints",
      "Counterclaims and cross-complaints",
      "Demand letters before litigation",
      "Contract and business dispute responses",
      "Motion outlines and supporting declarations",
      "Discovery request drafts (written only)",
    ],
    commonQuestions: [
      {
        q: "I was served — what happens if I do nothing?",
        a: "Ignoring court papers often leads to a default judgment against you. Send us what you were served; we explain the timeline and configure your setup so you can prepare a written answer from home.",
      },
      {
        q: "Can you help with a business or contract fight?",
        a: "Yes — tell us the contract, what went wrong, and any letters you’ve already sent. We install tools so you can work on demand letters, responses, and civil pleadings from home.",
      },
      {
        q: "Do you go to court for me?",
        a: "Never. We install tools you use from home. You handle appearances and filing.",
      },
      {
        q: "How is pricing worked out?",
        a: "Start with a custom-quote setup install; we learn your situation and email a written summary plus one flat price for the configured setup you use from home — no hourly billing.",
      },
    ],
    documentsExamples: [
      "Civil answer",
      "Demand letter",
      "Counterclaim draft",
      "Motion for extension (where applicable)",
      "Declaration in support of motion",
    ],
    ctaLabel: "Start your civil setup",
  },
  "small-claims": {
    slug: "small-claims",
    title: "Small claims",
    intro:
      "Small claims court is meant to be simple — but the forms still matter. We install Ask AI Legal so you can prepare your response or claim from home with organized facts, clear requests, and documents that match what the court expects.",
    weHelpWith: [
      "Defendant’s response when you are sued",
      "Plaintiff’s claim statements and exhibits lists",
      "Written demand letters before filing",
      "Counterclaims in small claims (where allowed)",
      "Organized fact summaries for your hearing",
    ],
    commonQuestions: [
      {
        q: "Do I need a lawyer for small claims?",
        a: "Many people represent themselves in small claims. We install tools you use from home; we are not a law firm and do not appear for you.",
      },
      {
        q: "What if I disagree with how much they say I owe?",
        a: "Send the claim and any contracts or receipts. Your setup helps you prepare a written response that states your side and the amount you believe is correct.",
      },
      {
        q: "Can I sue someone in small claims through you?",
        a: "We configure tools for plaintiff paperwork — demand letters, claim forms, and exhibit lists — based on your facts. You draft, file, and appear yourself from home.",
      },
      {
        q: "Will you tell me if I’ll win?",
        a: "No. We do not predict outcomes or give legal advice. We install tools and explain what each part is for so you can work from home.",
      },
    ],
    documentsExamples: [
      "Small claims answer",
      "Plaintiff claim statement",
      "Pre-filing demand letter",
      "Exhibit index",
      "Hearing outline (written)",
    ],
    ctaLabel: "Start your small claims setup",
  },
  immigration: {
    slug: "immigration",
    title: "Green cards & immigration",
    intro:
      "Visa applications, green card paperwork, responses to USCIS notices, and family-based petitions — the forms are long and the stakes are high. We install Ask AI Legal so you can work through the paperwork from home. Not a law firm; not legal advice.",
    weHelpWith: [
      "Responses to USCIS requests for evidence (RFE)",
      "Family-based petition supporting documents and cover letters",
      "Affidavits and declaration drafts for immigration filings",
      "Document organization for adjustment-of-status packages",
      "Written summaries of what each form is asking for",
      "Renewal and extension paperwork preparation",
    ],
    commonQuestions: [
      {
        q: "Can you help with my green card application?",
        a: "We install tools so you can prepare written documents and supporting paperwork based on your facts — petitions, affidavits, responses, and organized filing packages. You submit to USCIS yourself; we do not represent you before immigration authorities.",
      },
      {
        q: "I received an RFE — can you help me respond?",
        a: "Send the notice and any documents USCIS asked for. We explain what the RFE means in plain language and configure your setup so you can prepare written response materials from home before you file.",
      },
      {
        q: "Is this the same as hiring an immigration lawyer?",
        a: "No. We are not a law firm and do not provide legal advice or representation. Many people use our custom-quote home setup and file on their own or bring materials to a licensed attorney.",
      },
      {
        q: "Do you handle asylum or removal proceedings?",
        a: "We install tools for many immigration matters. Share your notice and paperwork in your setup intake — we'll tell you honestly if your situation is one we can configure.",
      },
    ],
    documentsExamples: [
      "RFE response cover letter and exhibit index",
      "Affidavit of support supporting documents",
      "I-130 supporting declaration drafts",
      "Written timeline of your immigration history",
      "Plain-English summary of USCIS notices",
    ],
    ctaLabel: "Start your immigration setup",
  },
}

export const HERO_CATEGORY_LINKS = [
  { slug: "divorce", label: "Divorce & separation" },
  { slug: "custody", label: "Custody & family" },
  { slug: "housing", label: "Housing" },
  { slug: "civil", label: "Civil disputes" },
  { slug: "small-claims", label: "Small claims" },
  { slug: "immigration", label: "Green cards & immigration" },
  { slug: "more", label: "& more", href: "/services" },
] as const

export function getSituationGuide(slug: string): SituationGuide | null {
  return SITUATION_GUIDES[slug] ?? null
}

export function listSituationSlugs(): string[] {
  return Object.keys(SITUATION_GUIDES)
}
