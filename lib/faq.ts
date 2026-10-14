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
  q: "What does the $3,997 purchase include?",
  a: "A one-time purchase of $3,997 includes a computer compatibility check and installation, guided setup around your issues and goals, personalized workspace configuration, agent setup, supported API and plugin connections, Second Brain memory setup, personal training, a written getting-started guide, and 30 days of installation support. Third-party AI usage and paid services are billed separately.",
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
  a: "In your installation consultation we confirm supported computer requirements, explain the included features and connected services, and review any additional costs before you purchase. We then install and configure your workspace and supported connections on your screen, set it up around your issues and goals, and show you how to use it. Installation support covers the first 30 days after installation is completed.",
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
        a: "It begins when installation is completed and covers setup problems and questions about using the installed features. It does not include legal representation or unlimited custom development.",
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
        a: "We can connect supported legal research platforms such as Westlaw, LexisNexis, Bloomberg Law, Fastcase / vLex, and CourtListener. Provider subscriptions and usage fees are separate. We'll go over the options for your installation during your consultation.",
      },
    ],
  },
]

export const ALL_FAQ: FaqItem[] = FAQ_CATEGORIES.flatMap((c) => c.items)
