import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import de from "./locales/de.json"
import depp from "./locales/depp.json"

export const LANGUAGES = ["de", "depp"] as const
export type Language = (typeof LANGUAGES)[number]

const STORAGE_KEY = "wichteln.lang"

function storedLanguage(): Language {
  try {
    const lang = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.includes(lang as Language) ? (lang as Language) : "de"
  } catch {
    return "de"
  }
}

i18n.use(initReactI18next).init({
  resources: { de: { translation: de }, depp: { translation: depp } },
  lng: storedLanguage(),
  fallbackLng: "de",
  interpolation: { escapeValue: false },
})

i18n.on("languageChanged", (lang) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // ignore
  }
})

export default i18n
