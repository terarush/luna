import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Switch,
  Button,
  Tooltip,
  TextField,
  Chip,
} from "@mui/material"
import { Sun, Moon, Monitor, X, Check } from "lucide-react"
import { useMuiTheme } from "@/shared/themes/mui-theme-provider"
import { changeLocale, supportedLocales } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"
import { useChatStore } from "../../hooks/use-chat-store"

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
  const { mode, setMode } = useMuiTheme()
  const language = (i18n.resolvedLanguage ?? "en") as Locale
  const { apiBaseUrl, apiKey, setApiBaseUrl, setApiKey, fetchModels, remoteModels, isLoadingModels } = useChatStore()
  const [tab, setTab] = React.useState("general")
  const [baseUrl, setBaseUrl] = React.useState(apiBaseUrl)
  const [key, setKey] = React.useState(apiKey)

  React.useEffect(() => {
    if (open) {
      setTab("general")
      setBaseUrl(apiBaseUrl)
      setKey(apiKey)
    }
  }, [open, apiBaseUrl, apiKey])

  const handleSaveBaseUrl = async () => {
    setApiBaseUrl(baseUrl)
    setApiKey(key.trim())
    await fetchModels()
  }

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1.5, pb: 1.5 }}>
        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, letterSpacing: "-0.01em" }}>
          {t("chat.settings.title")}
        </Typography>
        <Tooltip title="Close">
          <IconButton size="small" onClick={() => onOpenChange(false)}>
            <X size={16} />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{
          px: 2,
          "& .MuiTabs-flexContainer": { gap: 0.5 },
          "& .MuiTab-root": { borderRadius: 2, minHeight: 36, fontSize: "0.75rem", py: 0.75 },
          "& .MuiTabs-indicator": { display: "none" },
          "& .Mui-selected": { bgcolor: "action.selected", fontWeight: 600 },
        }}
      >
        <Tab label={t("chat.settings.tabGeneral")} value="general" />
        <Tab label={t("chat.settings.tabModels")} value="models" />
        <Tab label={t("chat.settings.tabInterface")} value="interface" />
        <Tab label={t("chat.settings.tabAudio")} value="audio" />
      </Tabs>

      <DialogContent sx={{ pt: 2.5, display: "flex", flexDirection: "column", gap: 3, pb: 3 }}>
        {tab === "general" && (
          <>
            <Box>
              <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, mb: 1.5 }}>
                {t("chat.settings.theme")}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
                {THEME_OPTIONS.map((opt) => {
                  const Icon = opt.icon
                  const active = mode === opt.value
                  return (
                    <Button
                      key={opt.value}
                      variant="outlined"
                      onClick={() => setMode(opt.value)}
                      sx={{
                        flexDirection: "column",
                        gap: 0.75,
                        py: 1.5,
                        borderRadius: 2,
                        borderColor: active ? "text.primary" : "divider",
                        color: active ? "text.primary" : "text.secondary",
                        bgcolor: active ? "action.selected" : "transparent",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        transition: "all 0.15s ease",
                        "&:hover": {
                          borderColor: "text.primary",
                          bgcolor: active ? "action.selected" : "action.hover",
                        },
                        "&:active": { transform: "scale(0.97)" },
                      }}
                    >
                      <Icon size={16} />
                      {opt.label}
                      {active && <Check size={12} />}
                    </Button>
                  )
                })}
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, mb: 1.5 }}>
                {t("chat.settings.language")}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {supportedLocales.map((locale) => (
                  <Button
                    key={locale}
                    size="small"
                    variant={language === locale ? "contained" : "outlined"}
                    onClick={() => changeLocale(locale)}
                    sx={{ borderRadius: 1.5, fontSize: "0.75rem" }}
                  >
                    {locale === "en" ? "English" : "Bahasa Indonesia"}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 2, border: "1px solid", borderColor: "divider", px: 2, py: 1.5 }}>
              <Box>
                <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>{t("chat.settings.enterToSend")}</Typography>
                <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", mt: 0.25 }}>Shift+Enter for a new line</Typography>
              </Box>
              <Switch defaultChecked size="small" />
            </Box>
          </>
        )}

        {tab === "models" && (
          <>
            <Box>
              <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, mb: 0.5 }}>
                API Base URL
              </Typography>
              <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", mb: 1.5 }}>
                OpenAI-compatible endpoint used to fetch <code>/models</code> and send chat completions. Example: <code>http://localhost:11434/v1</code>
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://api.openai.com/v1"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveBaseUrl()
                  }}
                />
                <Button size="small" variant="contained" onClick={handleSaveBaseUrl} sx={{ flexShrink: 0 }}>
                  Save
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, mb: 0.5 }}>
                API Key
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="sk-..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                type="password"
              />
            </Box>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                  Available Models
                </Typography>
                <Button size="small" variant="text" onClick={() => fetchModels()} disabled={isLoadingModels} sx={{ fontSize: "0.75rem" }}>
                  {isLoadingModels ? "Loading..." : "Refresh"}
                </Button>
              </Box>
              {remoteModels.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, maxHeight: 260, overflowY: "auto" }}>
                  {remoteModels.map((model) => (
                    <Box
                      key={model.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        borderRadius: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        px: 1.5,
                        py: 1,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {model.name}
                        </Typography>
                        <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {model.description}
                        </Typography>
                      </Box>
                      <Chip size="small" label={model.tag} sx={{ fontSize: "0.5625rem", height: 16, flexShrink: 0 }} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", lineHeight: 1.6 }}>
                  No models fetched yet. Enter a valid API base URL and press Save.
                </Typography>
              )}
            </Box>
          </>
        )}

        {(tab === "interface" || tab === "audio") && (
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", lineHeight: 1.6 }}>
            Coming soon.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  )
}