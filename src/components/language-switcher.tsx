import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { changeLocale, supportedLocales } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

/** Simple language toggle — switches between id/en directly, no dropdown. */
export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const current = (i18n.resolvedLanguage ?? "en") as Locale
  const next = supportedLocales.find((locale) => locale !== current) ?? "en"

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5"
      onClick={() => changeLocale(next)}
      aria-label="Switch language"
    >
      <Languages className="size-4" />
      <span className="text-xs font-semibold uppercase">{next}</span>
    </Button>
  )
}