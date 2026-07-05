import type { Locale } from "../languages"
import { en, type Translations } from "./en"
import { hi } from "./hi"
import { es } from "./es"
import { zh } from "./zh"
import { fr } from "./fr"
import { ar } from "./ar"
import { vi } from "./vi"
import { tl } from "./tl"

const catalog: Record<Locale, Translations> = {
  en,
  hi,
  es,
  zh,
  fr,
  ar,
  vi,
  tl,
}

export function getTranslations(locale: Locale): Translations {
  return catalog[locale] ?? en
}

export { en, type Translations }
