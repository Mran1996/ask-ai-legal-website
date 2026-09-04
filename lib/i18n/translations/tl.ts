import { mergeTranslations } from "../merge-translations"

/** Nav labels only — homepage marketing copy falls back to English (install / work-from-home model). */
export const tl = mergeTranslations({
  nav: {
    freeReview: "Libreng document review",
    help: "Tulong",
    about: "Tungkol sa amin",
    services: "Serbisyo",
    whyUs: "Bakit kami",
    process: "Proseso",
    faq: "FAQ",
    contact: "Makipag-ugnayan",
    emailForReview: "Email para sa review",
    language: "Wika",
  },
})
