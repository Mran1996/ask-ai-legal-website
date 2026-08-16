import { servicesPageContent } from "./services-page"
import { CASE_REVIEW_PRICE_DISPLAY, TOTAL_PRICE_DISPLAY } from "@/lib/site-config"

export const en = {
  nav: {
    freeReview: "Get started",
    help: "Help",
    about: "About",
    services: "Services",
    pricing: "Pricing",
    whyUs: "Why us",
    process: "Process",
    faq: "FAQ",
    contact: "Contact",
    emailForReview: `Case review — ${CASE_REVIEW_PRICE_DISPLAY}`,
    payCta: "Start your case review",
    language: "Language",
  },
  hero: {
    slogan: "Get the help that you deserve",
    titleLine1: "You shouldn't have to figure this out",
    titleHighlight: "alone.",
    titleLine2: "",
    body: "Tell us what you're facing. We understand your situation and show you how to fight back — step by step. Hands-on support. Real guidance. Someone in your corner.",
    categories: [
      "Divorce & separation",
      "Custody & family",
      "Housing",
      "Civil disputes",
      "Small claims",
      "& more",
    ],
    ctaPrimary: "Tell us what you're facing",
    ctaSecondary: "See how it works",
    stat1Value: CASE_REVIEW_PRICE_DISPLAY,
    stat1Label: "Case review",
    stat1Sub: "We understand your situation",
    stat2Value: TOTAL_PRICE_DISPLAY,
    stat2Label: "Complete support",
    stat2Sub: "Walkthrough + 30 days guidance",
    stat3Value: "You",
    stat3Label: "In control",
    stat3Sub: "You file. You decide. Your pace.",
  },
  services: {
    label: "You're not alone in this",
    titleLine1: "We actually listen to your situation.",
    titleLine2: "Then we show you how to fight back.",
    intro:
      "This isn't a template library and it isn't a retainer trap. You share your situation. We listen. We understand. Then we guide you through exactly what you need to do — step by step.",
    importantLabel: "Important:",
    importantText:
      "Ask AI Legal is not a law firm and does not provide legal advice. You stay in control of every decision and every filing.",
    items: [
      {
        title: "We listen",
        description:
          "You share your situation. We actually read what you send — not filling in a template, but understanding what YOU'RE dealing with.",
      },
      {
        title: "We assess",
        description:
          "We decide if we can genuinely help you, or if you need something else. $499 buys honest feedback, not a sales pitch.",
      },
      {
        title: "We guide",
        description:
          "If you're a fit, we build your complete setup and walk you through it. Screen share. Video. Call. We're there.",
      },
      {
        title: "You generate",
        description:
          "You learn how to use your setup to generate what you need for your situation. We show you step by step.",
      },
      {
        title: "We support",
        description:
          "30 days. Email, call, Slack — you hit a snag, we help you fix it. You're not abandoned after payment.",
      },
      {
        title: "You move forward",
        description:
          "After 30 days, you have everything you need. You generate documents. You file. You own this.",
      },
      {
        title: "Hands-on walkthrough",
        description:
          "Screen share. Video call. We show you exactly how to use your setup. You ask questions. We answer. You don't move on until you're confident.",
      },
      {
        title: "Real support",
        description:
          "30 days of email and call support. We're here while you need us. No extra charge.",
      },
      {
        title: "Your peace of mind",
        description: "Someone who understands your situation. Someone who won't leave you hanging. Someone in your corner.",
      },
    ],
  },
  servicesPage: servicesPageContent,
  compare: {
    label: "The difference",
    titleLine1: "Why pay $10,000 upfront",
    titleHighlight: "to be kept in the dark?",
    titleLine2: "",
    subtitle: `${CASE_REVIEW_PRICE_DISPLAY} case review. ${TOTAL_PRICE_DISPLAY} total. Hands-on walkthrough. 30-day support. Flat fee.`,
    traditionalHeading: "The retainer trap",
    traditionalPrice: "$3,000–$10,000 upfront",
    traditionalDesc: "Drawn down hourly, whether or not the work moves your situation forward",
    traditionalBullets: [
      "Weeks waiting for callbacks",
      "Costs that grow every time you breathe",
      "You may never see an analysis of your own documents",
    ],
    usBadge: "Ask AI Legal",
    usHeading: "Someone in your corner",
    usPrice: `${CASE_REVIEW_PRICE_DISPLAY} review · ${TOTAL_PRICE_DISPLAY} total`,
    usDesc: "We understand your situation. We guide you. We support you. Flat fee.",
    usBullets: [
      `${CASE_REVIEW_PRICE_DISPLAY} case review → ${TOTAL_PRICE_DISPLAY} total for hands-on support`,
      "Hands-on walkthrough so you know exactly what to do",
      "30-day email and call support included",
    ],
    cta: "Tell us what you're facing",
    usCompareLabel: "Ask AI Legal",
    traditionalCompareLabel: "Traditional",
    highlightsLabel: "What makes us different",
    highlightsTitleLine1: "",
    highlightsTitleGold: "",
    highlightsTitle: "Here's what we actually do",
    highlightsIntro: "Tap a card to flip and explore what you get.",
    highlights: [
      {
        title: "We understand you",
        summary: "We listen. We get it. You're not just a ticket number.",
        detail:
          "You share your situation. We actually read it, ask questions, understand what you're dealing with. This isn't a template.",
      },
      {
        title: "We guide you",
        summary: "Step by step. Hands-on. Not handed off.",
        detail:
          "Screen share. Video call. We show you exactly what to do. You ask questions. We answer. You don't move on until you're confident.",
      },
      {
        title: "We support you",
        summary: "30 days. Email, call, Slack. We're here.",
        detail:
          "You hit a snag? You reach out. We help you fix it. No extra charge. That's what we're here for.",
      },
      {
        title: "Flat price",
        summary: "$499 review + $1,000 support = $1,500 total. That's it.",
        detail:
          "Case review for $499. If you're a fit, complete hands-on support is $1,000 more. No hidden costs. No hourly meter.",
      },
    ],
  },
  process: {
    label: "How it works",
    title: "Five simple steps.",
    titleLine1: "Five simple steps.",
    titleHighlight: "You move forward.",
    cta: "Tell us what you're facing",
    steps: [
      {
        title: "You share your situation",
        body: "Tell us what you're facing. Upload what you have. Pay $499 for a case review.",
      },
      {
        title: "We understand your situation",
        body: "We read what you sent. We ask questions. We understand what you're actually dealing with.",
      },
      {
        title: "We decide if we're the right fit",
        body: "If we think we can help, we build your complete setup and send you everything. If not, we refund you and explain why.",
      },
      {
        title: "We walk you through it",
        body: "You pay $1,000. We jump on a video call. Screen share. We show you exactly how to use your setup until you're confident.",
      },
      {
        title: "You've got 30 days of support",
        body: "Email, call, Slack — you hit a snag, we help. You generate what you need. You move forward. You own this.",
      },
    ],
  },
  testimonials: {
    titleWhite: "I felt like I had ",
    titleGold: "someone in my corner.",
    label: "Real people who've been there",
    clients: {
      sandra: {
        quote:
          "I was terrified. I didn't know where to start. They explained my situation back to me so clearly I realized I wasn't crazy. Then they walked me through everything step by step. For the first time, I felt confident.",
        name: "Sandra M.",
        title: "Divorce",
        case: "Ohio",
        imageAlt: "Photo of Sandra M.",
      },
      marcus: {
        quote:
          "I needed help fast and every lawyer wanted money I didn't have. They reviewed my case, showed me exactly what to do, and I had my documents ready in days. I felt like I actually had a shot.",
        name: "Marcus J.",
        title: "Civil motion",
        case: "Georgia",
        imageAlt: "Photo of Marcus J.",
      },
      priya: {
        quote:
          "Between work and my two kids, I couldn't keep up. They explained everything clearly. They answered all my questions. For the first time, I knew what I was doing.",
        name: "Priya S.",
        title: "Family court",
        case: "New Jersey",
        imageAlt: "Photo of Priya S.",
      },
      keisha: {
        quote:
          "Facing an unfair eviction with nowhere to turn. They showed me I had options. They walked me through it. I felt less alone and more powerful.",
        name: "Keisha W.",
        title: "Housing",
        case: "Illinois",
        imageAlt: "Photo of Keisha W.",
      },
      carlos: {
        quote:
          "English isn't my first language and legal forms terrified me. They explained everything clearly and patiently. They made me feel like it was going to be okay.",
        name: "Carlos R.",
        title: "Small claims response",
        case: "Arizona",
        imageAlt: "Photo of Carlos R.",
      },
    },
  },
  consultation: {
    label: "Your next step",
    titleLine1: "Tell us what you're facing.",
    titleLine2: "We'll show you what's possible.",
    body1:
      "Share your situation. Upload your documents. Pay $499 for a real case review — not a sales pitch.",
    body2:
      "If we can help, we'll build your complete setup and guide you through it. If we can't, we'll tell you honestly and refund you.",
    cardLabel: "Start your case review",
    cardTitle: "Let's see if we can help you fight back",
    emailLabel: "Tell us what you're facing",
    timing:
      "Case reviews are $499. We'll read everything you send and reply within one business day.",
    cta: "Tell us what you're facing",
  },
  faq: {
    label: "Questions",
    title: "Straight answers",
    intro: "Here's what clients ask before they start.",
    items: [
      {
        q: "Are you a law firm?",
        a: "No. We provide guidance and support. Not legal advice. Not representation.",
      },
      {
        q: `What do I get for ${CASE_REVIEW_PRICE_DISPLAY}?`,
        a: `A real case review: we read what you send, we ask clarifying questions, we understand your situation. We tell you honestly if we can help. The ${CASE_REVIEW_PRICE_DISPLAY} is credited in full if you move forward with complete support.`,
      },
      {
        q: `What's the ${TOTAL_PRICE_DISPLAY} total?`,
        a: `${CASE_REVIEW_PRICE_DISPLAY} case review + $1,000 complete support. One flat price. Hands-on walkthrough and 30 days of email and call support included.`,
      },
      {
        q: "How do I know you understand my situation?",
        a: "Because we take time to read what you send. We ask clarifying questions. We don't use templates. We get YOUR situation. That's what the case review is for.",
      },
      {
        q: "What if I'm not a fit?",
        a: "We'll tell you honestly. We'll also explain why and what you could try instead. Your $499 gets refunded. No argument.",
      },
      {
        q: "What happens during the walkthrough?",
        a: "Screen share. Video call. We show you exactly how to use your setup. You ask questions. We answer. We don't move on until you're confident.",
      },
      {
        q: "What if I get stuck during the 30 days?",
        a: "Email or call us. We help you unstick it. No extra charge. That's what the 30 days is for.",
      },
      {
        q: "Do you file for me or go to court?",
        a: "No. You take every legal step on your own. We guide you. We support you. You own it.",
      },
      {
        q: "What kinds of situations do you handle?",
        a: "Any — divorce, custody, housing, disputes, business issues, and more. Across all 50 states.",
      },
    ],
  },
  footer: {
    tagline: "When you need someone in your corner.",
    documentOnly: "Guidance and support only",
    columns: {
      services: "Services",
      company: "Company",
      legal: "Legal",
      social: "Social",
    },
    links: {
      allServices: "All services",
      caseRoadmap: "Case review",
      caseResearch: "Hands-on walkthrough",
      legalResearch: "30-day support",
      outcomeAnalysis: "Real guidance",
      hearingPrep: "Peace of mind",
      documentPrep: "You own this",
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
    label: "Get started",
    title: "You deserve someone in your corner.",
    body: "Tell us what you're facing. We understand. We'll show you how to fight back.",
    emailConsult: "Tell us what you're facing",
    emailQuote: "Start your case review",
    disclaimer:
      "Ask AI Legal is not a law firm and does not provide legal advice. You review everything and take every next step on your own.",
  },
}

export type Translations = typeof en
