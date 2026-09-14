import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"
import { changeLocale, supportedLocales } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? "en") as Locale
  const next = supportedLocales.find((locale) => locale !== current) ?? "en"

  return (
    <button
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
      onClick={() => changeLocale(next)}
    >
      <Languages className="size-4" />
      <span className="text-[11px] font-semibold tracking-wide uppercase">
        {next}
      </span>
    </button>
  )
}