import { useTranslation } from "react-i18next"
import { Sun, Moon, Monitor, X, Check } from "lucide-react"
import { Dialog } from "@base-ui/react/dialog"
import { Tabs } from "@base-ui/react/tabs"
import { useTheme } from "@/shared/theme-provider"
import { changeLocale, supportedLocales } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface ChatSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const THEME_OPTIONS = [
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "system" as const, label: "System", icon: Monitor },
]

export function ChatSettingsDialog({ open, onOpenChange }: ChatSettingsDialogProps) {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const language = (i18n.resolvedLanguage ?? "en") as Locale

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-zinc-950/35 backdrop-blur-sm data-[starting-style]:animate-fade-in data-[ending-style]:animate-fade-in dark:bg-zinc-950/50" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-950/10 outline-none data-[starting-style]:animate-scale-in dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/50">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <Dialog.Title className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t("chat.settings.title")}
            </Dialog.Title>
            <Dialog.Close className="flex size-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <Tabs.Root defaultValue="general">
            <Tabs.List className="flex gap-0.5 border-b border-zinc-100 px-3 pt-2 dark:border-zinc-800">
              {[
                { value: "general", label: t("chat.settings.tabGeneral") },
                { value: "models", label: t("chat.settings.tabModels") },
                { value: "interface", label: t("chat.settings.tabInterface") },
                { value: "audio", label: t("chat.settings.tabAudio") },
              ].map((tab) => (
                <Tabs.Tab
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "rounded-t-lg px-3.5 py-2 text-[12.5px] font-medium text-zinc-500 outline-none transition-colors",
                    "hover:text-zinc-800 dark:hover:text-zinc-200",
                    "data-[selected]:bg-zinc-100/80 data-[selected]:text-zinc-900",
                    "dark:data-[selected]:bg-zinc-800/80 dark:data-[selected]:text-zinc-50"
                  )}
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            <div className="max-h-[60vh] overflow-y-auto p-5">
              <Tabs.Panel value="general" className="space-y-6 outline-none">
                <div>
                  <p className="mb-2.5 text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                    {t("chat.settings.theme")}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {THEME_OPTIONS.map((opt) => {
                      const Icon = opt.icon
                      const active = theme === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setTheme(opt.value)}
                          className={cn(
                            "flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[12px] font-medium transition-all duration-150",
                            "outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 active:scale-[0.97]",
                            active
                              ? "border-sky-400 bg-sky-50/60 text-sky-600 ring-1 ring-sky-400/30 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-400"
                              : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/60"
                          )}
                        >
                          <Icon className="size-4" />
                          {opt.label}
                          {active && <Check className="size-3" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-2.5 text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                    {t("chat.settings.language")}
                  </p>
                  <div className="flex gap-2">
                    {supportedLocales.map((locale) => (
                      <button
                        key={locale}
                        onClick={() => changeLocale(locale)}
                        className={cn(
                          "rounded-lg border px-4 py-2 text-[12.5px] font-medium transition-all duration-150 outline-none",
                          "focus-visible:ring-2 focus-visible:ring-sky-500/40 active:scale-[0.97]",
                          language === locale
                            ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                            : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                        )}
                      >
                        {locale === "en" ? "English" : "Bahasa Indonesia"}
                      </button>
                    ))}
                  </div>
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="models" className="outline-none">
                <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Model management coming soon. Connect to Ollama or add custom API endpoints.
                </p>
              </Tabs.Panel>

              <Tabs.Panel value="interface" className="outline-none">
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-700">
                  <div>
                    <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                      {t("chat.settings.enterToSend")}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      Shift+Enter for a new line
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="audio" className="outline-none">
                <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Text-to-speech settings coming soon.
                </p>
              </Tabs.Panel>
            </div>
          </Tabs.Root>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}