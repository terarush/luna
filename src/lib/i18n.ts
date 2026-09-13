import i18n from "i18next"
import { initReactI18next } from "react-i18next"

export const supportedLocales = ["en", "id"] as const
export type Locale = (typeof supportedLocales)[number]

export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
}

type NamespaceResource = Record<string, unknown>

const namespaceModules = import.meta.glob("../locales/*/*.json", {
  eager: true,
})

function loadLocale(lang: string): NamespaceResource {
  const merged: NamespaceResource = {}
  for (const [path, value] of Object.entries(namespaceModules)) {
    if (!path.includes(`/locales/${lang}/`)) continue
    const mod = value as { default?: Record<string, unknown> } | Record<string, unknown>
    const content = "default" in mod && mod.default ? mod.default : mod
    Object.assign(merged, content)
  }
  return merged
}

const resources = Object.fromEntries(
  supportedLocales.map((locale) => [locale, { translation: loadLocale(locale) }])
)

function syncHtmlLang(lang: string) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang
  }
}

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale
  try {
    const cookie = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/)?.[1]
    if (cookie && supportedLocales.includes(cookie as Locale)) {
      return cookie as Locale
    }
    const stored = window.localStorage.getItem("locale")
    if (stored && supportedLocales.includes(stored as Locale)) {
      return stored as Locale
    }
    const browserLang = window.navigator.language.toLowerCase()
    if (browserLang.startsWith("id")) return "id"
  } catch {
    // fall through to default
  }
  return defaultLocale
}

export function setStoredLocale(locale: Locale) {
  try {
    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`
    window.localStorage.setItem("locale", locale)
  } catch {
    // ignore storage errors
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLocale(),
  fallbackLng: defaultLocale,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

syncHtmlLang(i18n.resolvedLanguage ?? defaultLocale)
i18n.on("languageChanged", syncHtmlLang)

export function changeLocale(locale: Locale) {
  setStoredLocale(locale)
  void i18n.changeLanguage(locale)
}

export function currentLocale(): Locale {
  const resolved = i18n.resolvedLanguage
  return resolved && supportedLocales.includes(resolved as Locale)
    ? (resolved as Locale)
    : defaultLocale
}

export function tl(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options)
}

export default i18n