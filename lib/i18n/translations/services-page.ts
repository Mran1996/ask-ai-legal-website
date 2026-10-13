/** Services page copy (English). Merged into en.ts as servicesPage — also feeds the website chat assistant. */
import { CASE_REVIEW_CTA_LABEL } from "@/lib/site-config"

export const servicesPageContent = {
  label: "Features",
  title: "Your legal workspace. Installed on your computer.",
  intro:
    "Ask AI Legal is software installed on your computer — research, drafting, and organization in one workspace. Available features depend on your installation.",
  flow: {
    label: "How it fits together",
    title: "From consultation to your own workspace",
    narrative:
      "We confirm your computer requirements, install and configure your workspace, set it up around your issues and goals, and show you how to use it. Installation support covers the first 30 days; maintenance afterward is optional.",
    steps: ["Consultation", "Installation", "Setup around your goals", "Training", "Support", "Optional maintenance"],
  },
  deepDivesLabel: "What each part includes",
  deepDivesTitle: "Installed and explained — then yours to run",
  includesLabel: "What you get",
  items: [
    {
      detail:
        "We can connect supported legal research platforms — including Westlaw, LexisNexis, Bloomberg Law, Fastcase / vLex, CourtListener, UniCourt, Docket Alarm, GovInfo, eCFR, Open States, Caselaw Access Project, OpenLaws, Vaquill AI, and judyrecords — using the customer's own account or API key. Provider subscriptions and usage fees are separate. Options are covered in the consultation.",
      includes: [
        "Connections to the research platforms you choose",
        "Source links you can open and read",
        "Provider subscriptions and usage fees are separate",
        "Check every citation before relying on it",
      ],
    },
    {
      detail:
        "Prepare editable drafts with personalized document generation. You review the facts, citations, formatting, and applicable court requirements before filing.",
      includes: [
        "Editable drafts",
        "Personalized document generation",
        "Your review before anything is filed",
      ],
    },
    {
      detail:
        "Your workspace keeps track of the people, dates, filings, and events in your matter so your information stays organized in one place.",
      includes: ["People, dates, and filings in one place", "A record of what happened when"],
    },
    {
      detail:
        "Supported email and calendar connections help organize messages, dates, and reminders. Review extracted dates and confirm deadlines against the applicable rules and court orders.",
      includes: ["Supported email and calendar connections", "Reminders you confirm against the rules"],
    },
    {
      detail:
        "Your setup may combine local storage with connected AI and cloud services. We explain which features operate locally, which send information to outside providers, and the settings available to you.",
      includes: ["Explanation of local and connected features", "Settings available to you"],
    },
    {
      detail:
        "The one-time purchase includes a computer compatibility check and installation, configuration of your workspace and supported connections, guided setup around your issues and goals, personal training, a written getting-started guide, and 30 days of installation support beginning when installation is completed. Guided case setup means organizing the workspace and explaining the software, not legal advice.",
      includes: [
        "Computer compatibility check and installation",
        "Configuration of your workspace and supported connections",
        "Guided setup around your issues and goals",
        "Personal training on using the installed software",
        "Personal training and a written getting-started guide",
        "30 days of installation support",
      ],
    },
  ],
  disclaimer: {
    label: "What we do not do",
    text: "Ask AI Legal provides software, installation, training, and technical assistance. We do not provide legal representation, appear in court, or file documents for you. You stay in control of your matter.",
  },
  cta: {
    title: "Ready to set up your legal workspace?",
    body: "Book a consultation to confirm your computer requirements, review the included features, and discuss installation. The one-time purchase is $3,997, with optional maintenance at $125 per month.",
    button: CASE_REVIEW_CTA_LABEL,
  },
  homeLink: "See how the install works",
}
