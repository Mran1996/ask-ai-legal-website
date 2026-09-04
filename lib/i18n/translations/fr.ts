import { mergeTranslations } from "../merge-translations"

/** Nav labels only — homepage marketing copy falls back to English (install / work-from-home model). */
export const fr = mergeTranslations({
  nav: {
    freeReview: "Examen gratuit",
    help: "Aide",
    about: "À propos",
    services: "Services",
    whyUs: "Pourquoi nous",
    process: "Processus",
    faq: "FAQ",
    contact: "Contact",
    emailForReview: "E-mail pour examen",
    language: "Langue",
  },
})
