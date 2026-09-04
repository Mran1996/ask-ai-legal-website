import { mergeTranslations } from "../merge-translations"

/** Nav labels only — homepage marketing copy falls back to English (install / work-from-home model). */
export const ar = mergeTranslations({
  nav: {
    freeReview: "مراجعة مجانية",
    help: "مساعدة",
    about: "من نحن",
    services: "الخدمات",
    whyUs: "لماذا نحن",
    process: "العملية",
    faq: "الأسئلة",
    contact: "اتصل",
    emailForReview: "بريد للمراجعة",
    language: "اللغة",
  },
})
