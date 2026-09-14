import { Button, Tooltip } from "@mui/material"
import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"
import { changeLocale, supportedLocales } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? "en") as Locale
  const next = supportedLocales.find((locale) => locale !== current) ?? "en"

  return (
    <Tooltip title="Language">
      <Button
        variant="outlined"
        size="small"
        onClick={() => changeLocale(next)}
        startIcon={<Languages size={15} />}
        sx={{
          borderRadius: 1.5,
          px: 1.5,
          "& .MuiButton-startIcon": { mr: 0.75 },
        }}
      >
        {next}
      </Button>
    </Tooltip>
  )
}