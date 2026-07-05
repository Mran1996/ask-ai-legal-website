export type Language = {
  value: string
  label: string
}

export const LANGUAGES: Language[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
  { value: "es", label: "Español" },
  { value: "zh", label: "中文" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "tl", label: "Tagalog" },
]

export const DEFAULT_LANGUAGE = LANGUAGES[0]

export type Locale = (typeof LANGUAGES)[number]["value"]
