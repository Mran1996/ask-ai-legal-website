/**
 * Every FAQ on the site, in one place. The homepage shows HOME_FAQ; /faq shows FAQ_CATEGORIES.
 * Each page's FAQPage JSON-LD is built from the same items it renders.
 */
export type FaqItem = { q: string; a: string }

const WHAT_IS: FaqItem = {
  q: "What is Ask AI Legal?",
  a: "Ask AI Legal is a legal workspace installed on your computer and configured around your issues and goals. Bring your information together, generate personalized documents, and build on what your Second Brain remembers. We provide software, installation, training, and technical assistance — not legal representation.",
}

const INCLUDES: FaqItem = {
  q: "What do the plans include?",
  a: "Plans start at $1,497, paid once. You buy on the plans page, choose Windows or Mac, and we email your download with a step-by-step walkthrough video. The Complete plan includes guided setup around your issues and goals, personalized workspace configuration, agent setup, supported API and plugin connections, Second Brain memory setup, personal training, a written getting-started guide, and 30 days of support. See the plans page to compare both. Third-party usage and paid services are billed separately.",
}

const MAINTENANCE_OPTIONAL: FaqItem = {
  q: "Is the $125 monthly maintenance optional?",
  a: "Yes. The $125 monthly maintenance service is optional. Your purchase and maintenance agreements explain what is included, what remains available without maintenance, and which features depend on third-party services.",
}

const PRIVACY: FaqItem = {
  q: "How is my personal information protected?",
  a: "Your documents and Second Brain memory are saved on your computer. With privacy mode on, when a connected AI service is used, personal identifiers are removed locally before the request is sent and restored locally in the returned document.",
}

const SETUP: FaqItem = {
  q: "How does installation and setup work?",
  a: "After you pay, choose Windows or Mac on the thank-you page. We email your download, a step-by-step walkthrough video, and setup steps, usually within one business day. Install it, open it, and send us the computer code it shows; we reply with your license code to activate it. If you get stuck, reach us by chat, email, or phone. Support covers the first 30 days after activation.",
}

export const HOME_FAQ: FaqItem[] = [WHAT_IS, INCLUDES, MAINTENANCE_OPTIONAL, PRIVACY, SETUP]

export const FAQ_CATEGORIES: { title: string; items: FaqItem[] }[] = [
  {
    title: "About Ask AI Legal",
    items: [
      WHAT_IS,
      {
        q: "Are you a law firm?",
        a: "No. Ask AI Legal provides software, installation, training, and technical assistance. We do not provide legal representation.",
      },
      {
        q: "Does Ask AI Legal learn and get better over time?",
        a: "Yes, in both plans. It learns from you: when you edit a draft or correct it in chat, it saves that as a rule for later drafts. It learns your case: Second Brain memory reads and sorts the papers you upload and remembers the facts, dates, and names. It learns the law: it studies case law with source links, your state's court rules, legal guides, and videos from legal YouTube channels, and uses what it learns when drafting. Learning runs on your own AI account within a daily limit you set, and it stays with you.",
      },
      {
        q: "Can Ask AI Legal make mistakes?",
        a: "Yes. AI can misread documents, produce incorrect citations, or give inaccurate information. Review generated work, check original sources, and confirm applicable court requirements before using a document.",
      },
    ],
  },
  {
    title: "Purchase and pricing",
    items: [
      INCLUDES,
      {
        q: "Do I keep my workspace?",
        a: "Yes. Purchase Ask AI Legal once and keep your installed workspace on your computer under your license. Your saved information, documents, and accumulated memory stay with you.",
      },
      {
        q: "Are AI and research subscriptions included?",
        a: "Third-party AI usage and paid services are billed separately.",
      },
    ],
  },
  {
    title: "Installation and support",
    items: [
      SETUP,
      {
        q: "What does the 30-day support period cover?",
        a: "It begins when your workspace is activated and covers setup problems and questions about using the installed features. It does not include legal representation or unlimited custom development.",
      },
    ],
  },
  {
    title: "Maintenance",
    items: [
      MAINTENANCE_OPTIONAL,
      {
        q: "What does maintenance include?",
        a: "Optional maintenance provides ongoing support, supported software updates, and help maintaining your API and plugin connections as services change. Your saved learning stays in your workspace either way.",
      },
    ],
  },
  {
    title: "Privacy and research",
    items: [
      PRIVACY,
      {
        q: "Which research platforms can I connect?",
        a: "We can connect supported legal research platforms such as Westlaw, LexisNexis, Bloomberg Law, Fastcase / vLex, and CourtListener. Provider subscriptions and usage fees are separate. Email support@askailegal.com and we will help you connect the ones you use.",
      },
    ],
  },
]

export const ALL_FAQ: FaqItem[] = FAQ_CATEGORIES.flatMap((c) => c.items)
