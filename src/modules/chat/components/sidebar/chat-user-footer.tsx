import { useTranslation } from "react-i18next"
import { Settings, Sun, Moon, Languages } from "lucide-react"
import {
  MenuRoot,
  MenuContent,
  MenuItem,
  MenuTrigger,
  MenuSeparator,
} from "@/components/ui/menu"
import { useTheme } from "@/shared/theme-provider"
import { changeLocale, supportedLocales } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

interface ChatUserFooterProps {
  onOpenSettings: () => void
}

export function ChatUserFooter({ onOpenSettings }: ChatUserFooterProps) {
  const { t, i18n } = useTranslation()
  const { setTheme, resolvedTheme } = useTheme()
  const language = (i18n.resolvedLanguage ?? "en") as Locale
  const nextLanguage = supportedLocales.find((l) => l !== language) ?? "en"

  return (
    <div className="shrink-0 border-t border-zinc-200 p-2.5 dark:border-zinc-800">
      <MenuRoot>
        <MenuTrigger className="flex h-10 w-full items-center gap-2.5 rounded-xl px-2 text-left outline-none transition-colors hover:bg-zinc-100 data-[popup-open]:bg-zinc-100 focus-visible:bg-zinc-100 dark:hover:bg-zinc-800 dark:data-[popup-open]:bg-zinc-800 dark:focus-visible:bg-zinc-800">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 text-[11px] font-bold text-white dark:from-zinc-200 dark:to-zinc-400 dark:text-zinc-900">
            U
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
              User
            </p>
            <p className="truncate text-[10px] text-zinc-400 dark:text-zinc-500">
              User account
            </p>
          </div>
          <Settings className="size-3.5 shrink-0 text-zinc-400" />
        </MenuTrigger>
        <MenuContent align="start" sideOffset={6}>
          <MenuItem onClick={onOpenSettings}>
            <Settings className="size-3.5" />
            {t("chat.sidebar.settings")}
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-3.5" />
            ) : (
              <Moon className="size-3.5" />
            )}
            {resolvedTheme === "dark" ? "Light" : "Dark"}
          </MenuItem>
          <MenuSeparator />
          <MenuItem onClick={() => changeLocale(nextLanguage)}>
            <Languages className="size-3.5" />
            {nextLanguage === "id" ? "Bahasa Indonesia" : "English"}
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </div>
  )
}