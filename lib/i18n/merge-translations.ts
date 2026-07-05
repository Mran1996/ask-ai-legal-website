import { en, type Translations } from "./translations/en"

type DeepPartial<T> = T extends object
  ? {
      [K in keyof T]?: DeepPartial<T[K]>
    }
  : T

/** Deep-merge partial locale overrides onto English defaults. */
export function mergeTranslations(overrides: DeepPartial<Translations>): Translations {
  const testimonials = overrides.testimonials
  return {
    ...en,
    ...overrides,
    nav: { ...en.nav, ...overrides.nav },
    hero: { ...en.hero, ...overrides.hero },
    services: overrides.services
      ? {
          ...en.services,
          ...overrides.services,
          items: overrides.services.items ?? en.services.items,
        }
      : en.services,
    compare: overrides.compare
      ? {
          ...en.compare,
          ...overrides.compare,
          traditionalBullets: overrides.compare.traditionalBullets ?? en.compare.traditionalBullets,
          usBullets: overrides.compare.usBullets ?? en.compare.usBullets,
          highlights: overrides.compare.highlights ?? en.compare.highlights,
        }
      : en.compare,
    process: overrides.process
      ? { ...en.process, ...overrides.process, steps: overrides.process.steps ?? en.process.steps }
      : en.process,
    consultation: overrides.consultation ? { ...en.consultation, ...overrides.consultation } : en.consultation,
    faq: overrides.faq
      ? { ...en.faq, ...overrides.faq, items: overrides.faq.items ?? en.faq.items }
      : en.faq,
    footer: overrides.footer
      ? {
          ...en.footer,
          ...overrides.footer,
          columns: { ...en.footer.columns, ...overrides.footer?.columns },
          links: { ...en.footer.links, ...overrides.footer?.links },
        }
      : en.footer,
    cta: { ...en.cta, ...overrides.cta },
    testimonials: testimonials
      ? {
          ...en.testimonials,
          ...testimonials,
          clients: { ...en.testimonials.clients, ...testimonials.clients },
        }
      : en.testimonials,
    servicesPage: overrides.servicesPage
      ? {
          ...en.servicesPage,
          ...overrides.servicesPage,
          flow: {
            ...en.servicesPage.flow,
            ...overrides.servicesPage.flow,
            steps: overrides.servicesPage.flow?.steps ?? en.servicesPage.flow.steps,
          },
          items: overrides.servicesPage.items ?? en.servicesPage.items,
        }
      : en.servicesPage,
  } as Translations
}
