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
      "Whether you are starting a divorce, responding to papers your spouse filed, or trying to untangle finances and parenting from one household into two — we prepare the written documents so you know exactly what to file and what each section means. Not legal advice; document preparation only.",
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
        a: "Yes — child support is one of the most common requests we document. Tell us your children’s ages, custody arrangement, and income information; we prepare the written forms and declarations your situation needs for your review.",
      },
      {
        q: "What if my spouse already filed and I don’t know what to do?",
        a: "Send us what you were served. We read it in plain language, explain your deadlines, and prepare a written response plus any counter-requests (support, custody, property) you want included.",
      },
      {
        q: "Do you handle financial support for a spouse, not just children?",
        a: "We prepare written spousal-support requests and related financial declarations when your facts support them. We explain what each document is for — you decide what to file.",
      },
      {
        q: "Is this the same as hiring a divorce lawyer?",
        a: "No. We are not a law firm. We prepare documents; we do not represent you in court or give legal strategy. Many clients use our flat-fee documents and handle filing themselves or bring them to an attorney later.",
      },
    ],
    documentsExamples: [
      "Divorce petition or response",
      "Financial declaration / income & expense forms",
      "Child support worksheets and declarations",
      "Parenting plan drafts",
      "Marital settlement agreement outlines",
    ],
    ctaLabel: "Get help with divorce paperwork",
  },
  custody: {
    slug: "custody",
    title: "Custody & family",
    intro:
      "Custody fights are stressful — and the forms are confusing on purpose. We translate what the court is asking for and prepare parenting plans, custody requests, and support paperwork built on your facts, in language you can actually read.",
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
        a: "We prepare written custody requests based on what you tell us about safety, stability, and the children’s needs. We do not predict outcomes — we make sure your documents clearly state your requests and supporting facts.",
      },
      {
        q: "What is a parenting plan?",
        a: "It is the schedule and rules for how children split time between parents — holidays, exchanges, school decisions, and more. We draft a plan from your inputs so you can review it before filing.",
      },
      {
        q: "Can you help with child support only?",
        a: "Yes. Many clients need support paperwork without a full custody battle. Send your existing orders (if any) and income info; we prepare the written request or modification documents.",
      },
      {
        q: "The other parent already filed — can you still help?",
        a: "Absolutely. Send what you received. We explain it in plain English and prepare your written response plus any requests for support, custody, or visitation changes.",
      },
    ],
    documentsExamples: [
      "Parenting plan",
      "Custody / visitation motion or response",
      "Child support request or modification",
      "Declaration in support of custody",
      "Request to modify existing family orders",
    ],
    ctaLabel: "Get help with custody & family paperwork",
  },
  housing: {
    slug: "housing",
    title: "Housing",
    intro:
      "Eviction notices, lease disputes, and repair fights move fast. We prepare written responses and housing-related documents so you understand every paragraph before anything is filed — and so you know your deadlines.",
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
        a: "Deadlines are short — often a few days to a few weeks depending on your state and notice type. Send us your notice immediately; we tell you what the deadline likely is and prepare response documents for your review.",
      },
      {
        q: "Can I stay in my home while I fight an eviction?",
        a: "That depends on your jurisdiction and what has been filed. We do not give legal advice — we prepare documents and explain what each filing is for so you can make informed decisions.",
      },
      {
        q: "My landlord won’t fix anything — can you help?",
        a: "We prepare written repair requests, habitability declarations, and related documents many tenants use before or alongside court filings. Tell us what’s broken and what you’ve already asked for in writing.",
      },
      {
        q: "Do you file for me?",
        a: "No. We prepare documents only. You file, serve, and appear on your own behalf (or with an attorney you hire separately).",
      },
    ],
    documentsExamples: [
      "Answer to unlawful detainer",
      "Written repair demand",
      "Security deposit demand letter",
      "Declaration of habitability issues",
      "Response to lease termination",
    ],
    ctaLabel: "Get help with housing paperwork",
  },
  civil: {
    slug: "civil",
    title: "Civil disputes",
    intro:
      "Sued in civil court? Need to sue someone back? We prepare answers, motions, and demand letters so you are not staring at blank forms alone — researched, formatted, and explained in plain language.",
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
        a: "Ignoring court papers often leads to a default judgment against you. Send us what you were served; we explain the timeline and prepare a written answer for your review.",
      },
      {
        q: "Can you help with a business or contract fight?",
        a: "Yes — tell us the contract, what went wrong, and any letters you’ve already sent. We prepare demand letters, responses, and civil pleadings based on your documents.",
      },
      {
        q: "Do you go to court for me?",
        a: "Never. We prepare written documents only. You handle appearances and filing.",
      },
      {
        q: "How is pricing worked out?",
        a: "Start with a flat file review deposit; we read your papers and email a written summary plus one flat price for the exact documents your situation needs — no hourly billing.",
      },
    ],
    documentsExamples: [
      "Civil answer",
      "Demand letter",
      "Counterclaim draft",
      "Motion for extension (where applicable)",
      "Declaration in support of motion",
    ],
    ctaLabel: "Get help with a civil dispute",
  },
  "small-claims": {
    slug: "small-claims",
    title: "Small claims",
    intro:
      "Small claims court is meant to be simple — but the forms still matter. We prepare your response or claim so you walk in with organized facts, clear requests, and documents that match what the court expects.",
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
        a: "Many people represent themselves in small claims. We prepare your documents; we are not a law firm and do not appear for you.",
      },
      {
        q: "What if I disagree with how much they say I owe?",
        a: "Send the claim and any contracts or receipts. We prepare a written response that states your side and the amount you believe is correct.",
      },
      {
        q: "Can I sue someone in small claims through you?",
        a: "We prepare plaintiff paperwork — demand letters, claim forms, and exhibit lists — based on your facts. You file and appear yourself.",
      },
      {
        q: "Will you tell me if I’ll win?",
        a: "No. We do not predict outcomes or give legal advice. We prepare documents and explain what each part is for.",
      },
    ],
    documentsExamples: [
      "Small claims answer",
      "Plaintiff claim statement",
      "Pre-filing demand letter",
      "Exhibit index",
      "Hearing outline (written)",
    ],
    ctaLabel: "Get help with small claims paperwork",
  },
}

export const HERO_CATEGORY_LINKS = [
  { slug: "divorce", label: "Divorce & separation" },
  { slug: "custody", label: "Custody & family" },
  { slug: "housing", label: "Housing" },
  { slug: "civil", label: "Civil disputes" },
  { slug: "small-claims", label: "Small claims" },
  { slug: "more", label: "& more", href: "/services" },
] as const

export function getSituationGuide(slug: string): SituationGuide | null {
  return SITUATION_GUIDES[slug] ?? null
}

export function listSituationSlugs(): string[] {
  return Object.keys(SITUATION_GUIDES)
}
