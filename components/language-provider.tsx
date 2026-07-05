"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  type Language,
  type Locale,
} from "@/lib/i18n/languages"
import { getTranslations, type Translations } from "@/lib/i18n/translations"

type LanguageContextType = {
  language: Language
  locale: Locale
  t: Translations
  setLanguage: (language: Language) => void
  languages: Language[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = "ask-ai-legal-language"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    const match = LANGUAGES.find((item) => item.value === saved)
    if (match) setLanguageState(match)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language.value
    document.documentElement.dir = language.value === "ar" ? "rtl" : "ltr"
  }, [language])

  const setLanguage = (next: Language) => {
    setLanguageState(next)
    localStorage.setItem(STORAGE_KEY, next.value)
  }

  const value = useMemo(
    () => ({
      language,
      locale: language.value as Locale,
      t: getTranslations(language.value as Locale),
      setLanguage,
      languages: LANGUAGES,
    }),
    [language]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
