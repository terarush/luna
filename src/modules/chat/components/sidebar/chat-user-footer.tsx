import * as React from "react"
import { useTranslation } from "react-i18next"
import { Box, Typography, Menu, MenuItem, Divider, Avatar } from "@mui/material"
import { Settings, Sun, Moon, Languages } from "lucide-react"
import { useMuiTheme } from "@/shared/themes/mui-theme-provider"
import { changeLocale, supportedLocales } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

interface ChatUserFooterProps {
  onOpenSettings: () => void
}

export function ChatUserFooter({ onOpenSettings }: ChatUserFooterProps) {
  const { t, i18n } = useTranslation()
  const { setMode, resolvedMode } = useMuiTheme()
  const language = (i18n.resolvedLanguage ?? "en") as Locale
  const nextLanguage = supportedLocales.find((l) => l !== language) ?? "en"
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  return (
    <Box sx={{ p: 1.5, flexShrink: 0 }}>
      <Box
        component="button"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          width: "100%",
          px: 1,
          py: 0.75,
          borderRadius: 2,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
          transition: "background-color 0.12s ease",
          "&:hover": { bgcolor: "action.hover" },
          "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 },
        }}
      >
        <Avatar
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1.5,
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            fontSize: "0.6875rem",
            fontWeight: 600,
          }}
        >
          U
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, lineHeight: 1.2 }} noWrap>
            User
          </Typography>
          <Typography sx={{ fontSize: "0.625rem", color: "text.disabled", lineHeight: 1.2 }} noWrap>
            User account
          </Typography>
        </Box>
        <Settings size={14} style={{ color: "inherit", opacity: 0.6, flexShrink: 0 }} />
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            setAnchorEl(null)
            onOpenSettings()
          }}
        >
          <Settings size={15} style={{ marginRight: 8 }} />
          {t("chat.sidebar.settings")}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setMode(resolvedMode === "dark" ? "light" : "dark")
            setAnchorEl(null)
          }}
        >
          {resolvedMode === "dark" ? (
            <Sun size={15} style={{ marginRight: 8 }} />
          ) : (
            <Moon size={15} style={{ marginRight: 8 }} />
          )}
          {resolvedMode === "dark" ? "Light" : "Dark"}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            changeLocale(nextLanguage)
            setAnchorEl(null)
          }}
        >
          <Languages size={15} style={{ marginRight: 8 }} />
          {nextLanguage === "id" ? "Bahasa Indonesia" : "English"}
        </MenuItem>
      </Menu>
    </Box>
  )
}