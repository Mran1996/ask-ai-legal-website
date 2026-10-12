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
      "We confirm your computer requirements, install and configure your workspace, help you set up your first case, and show you how to use it. Installation support covers the first 30 days; maintenance afterward is optional.",
    steps: ["Consultation", "Installation", "First case", "Training", "Support", "Optional maintenance"],
  },
  deepDivesLabel: "What each part includes",
  deepDivesTitle: "Installed and explained — then yours to run",
  includesLabel: "What you get",
  items: [
    {
      detail:
        "Research connections let you open the source behind a reference. CourtListener (court opinions) is the confirmed connection today; it uses a free CourtListener account token. Other providers depend on your installation and may require a separate subscription.",
      includes: [
        "Source links you can open and read",
        "CourtListener connection for court opinions",
        "Paid research databases are not included",
        "Check every citation before relying on it",
      ],
    },
    {
      detail:
        "Prepare editable drafts using the templates supported by your installation. You review the facts, citations, formatting, and applicable court requirements before filing.",
      includes: [
        "Editable drafts",
        "Templates supported by your installation",
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
        "The one-time purchase includes a computer compatibility check and installation, configuration of your workspace and supported connections, guided setup of your first case, personal training, a written getting-started guide, and 30 days of installation support beginning when installation is completed. Guided case setup means organizing the workspace and explaining the software, not legal advice.",
      includes: [
        "Computer compatibility check and installation",
        "Configuration of your workspace and supported connections",
        "Guided setup of your first case",
        "Personal training on using the installed software",
        "A written getting-started guide",
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
