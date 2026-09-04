import { mergeTranslations } from "../merge-translations"

/** Nav labels only — homepage marketing copy falls back to English (install / work-from-home model). */
export const es = mergeTranslations({
  nav: {
    freeReview: "Revisión gratuita",
    help: "Ayuda",
    about: "Nosotros",
    services: "Servicios",
    whyUs: "Por qué nosotros",
    process: "Proceso",
    faq: "Preguntas",
    contact: "Contacto",
    emailForReview: "Correo para revisión",
    language: "Idioma",
  },
})
