import { useTranslation } from "react-i18next"
import { Settings, Moon, Sun, Monitor } from "lucide-react"
import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { changeLocale, supportedLocales } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

interface ChatUserFooterProps {
  onOpenSettings: () => void
}

export function ChatUserFooter({ onOpenSettings }: ChatUserFooterProps) {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const language = (i18n.resolvedLanguage ?? "en") as Locale
  const nextLanguage = supportedLocales.find((l) => l !== language) ?? "en"

  const themeIcon =
    theme === "dark" ? (
      <Moon className="h-4 w-4" />
    ) : theme === "light" ? (
      <Sun className="h-4 w-4" />
    ) : (
      <Monitor className="h-4 w-4" />
    )

  const themeLabel =
    theme === "dark"
      ? "Dark"
      : theme === "light"
        ? "Light"
        : "System"

  return (
    <div className="flex items-center gap-2 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-2 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              U
            </div>
            <span className="truncate text-sm">User</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={onOpenSettings}>
            <Settings className="h-4 w-4 mr-2" />
            {t("chat.sidebar.settings")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {themeIcon}
            <span className="ml-2">{themeLabel}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => changeLocale(nextLanguage)}>
            <span className="h-4 w-4 mr-2 flex items-center justify-center text-xs font-bold">
              {nextLanguage.toUpperCase()}
            </span>
            {nextLanguage === "id" ? "Bahasa Indonesia" : "English"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
