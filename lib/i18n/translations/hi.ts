import { mergeTranslations } from "../merge-translations"

/** Nav labels only — homepage marketing copy falls back to English (install / work-from-home model). */
export const hi = mergeTranslations({
  nav: {
    freeReview: "मुफ़्त केस समीक्षा",
    help: "सहायता",
    about: "हमारे बारे में",
    services: "सेवाएँ",
    whyUs: "क्यों हम",
    process: "प्रक्रिया",
    faq: "प्रश्न",
    contact: "संपर्क",
    emailForReview: "समीक्षा के लिए ईमेल",
    language: "भाषा",
  },
})
