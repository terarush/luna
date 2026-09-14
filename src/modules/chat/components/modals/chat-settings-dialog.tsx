import { useTranslation } from "react-i18next"
import { Moon, Sun, Monitor } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "#/components/ui/dialog"
import { Button } from "#/components/ui/button"
import { Label } from "#/components/ui/label"
import { Switch } from "#/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"
import { changeLocale, supportedLocales } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

interface ChatSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatSettingsDialog({ open, onOpenChange }: ChatSettingsDialogProps) {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const language = (i18n.resolvedLanguage ?? "en") as Locale

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("chat.settings.title")}</DialogTitle>
          <DialogDescription>{t("chat.settings.description")}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1">
              {t("chat.settings.tabGeneral")}
            </TabsTrigger>
            <TabsTrigger value="models" className="flex-1">
              {t("chat.settings.tabModels")}
            </TabsTrigger>
            <TabsTrigger value="interface" className="flex-1">
              {t("chat.settings.tabInterface")}
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex-1">
              {t("chat.settings.tabAudio")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("chat.settings.theme")}</Label>
              <div className="flex gap-2">
                {(["light", "dark", "system"] as const).map((value) => (
                  <Button
                    key={value}
                    variant={theme === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme(value)}
                  >
                    {value === "light" && <Sun className="h-4 w-4 mr-1.5" />}
                    {value === "dark" && <Moon className="h-4 w-4 mr-1.5" />}
                    {value === "system" && <Monitor className="h-4 w-4 mr-1.5" />}
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("chat.settings.language")}</Label>
              <div className="flex gap-2">
                {supportedLocales.map((locale) => (
                  <Button
                    key={locale}
                    variant={language === locale ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeLocale(locale)}
                  >
                    {locale === "en" ? "English" : "Bahasa Indonesia"}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Model management coming soon. Connect to Ollama or add custom API endpoints.
            </p>
          </TabsContent>

          <TabsContent value="interface" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("chat.settings.enterToSend")}</Label>
              </div>
              <Switch defaultChecked />
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Text-to-speech settings coming soon.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
