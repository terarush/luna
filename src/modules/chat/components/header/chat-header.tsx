import { useTranslation } from "react-i18next"
import { Box, IconButton, Tooltip, Divider, Typography } from "@mui/material"
import { PanelLeft, SlidersHorizontal, Share2, SquarePen, Sun, Moon, MessageSquareText } from "lucide-react"
import { toast } from "sonner"
import { useChatStore } from "../../hooks/use-chat-store"
import { useMuiTheme } from "@/shared/themes/mui-theme-provider"
import { ModelSelector } from "./model-selector"

interface ChatHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onOpenParameters: () => void
}

export function ChatHeader({ sidebarOpen, onToggleSidebar, onOpenParameters }: ChatHeaderProps) {
  const { t } = useTranslation()
  const { setMode, resolvedMode } = useMuiTheme()
  const { createNewSession } = useChatStore()

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success(t("chat.messages.copySuccess"))
  }

  const actionButtonSx = {
    color: "text.secondary",
    borderRadius: 2,
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    "&:hover": {
      bgcolor: (theme) =>
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(0, 0, 0, 0.05)",
      color: "text.primary",
    },
    "&:active": { transform: "scale(0.92)" },
  } as const

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: { xs: 1, sm: 1.5 },
        minHeight: { xs: 52, sm: 56 },
        flexShrink: 0,
        bgcolor: "background.paper",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "inset 0 -1px 0 0 rgba(255, 255, 255, 0.08), 0 4px 20px rgba(0,0,0,0.18)"
            : "inset 0 -1px 0 0 rgba(255, 255, 255, 0.8), 0 4px 16px rgba(0,0,0,0.03)",
        gap: 1,
        zIndex: 10,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
        <Tooltip title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}>
          <IconButton size="small" onClick={onToggleSidebar} sx={actionButtonSx}>
            <PanelLeft size={17} />
          </IconButton>
        </Tooltip>

        {/* Brand shown on mobile when sidebar is hidden */}
        {!sidebarOpen && (
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
              gap: 1,
              ml: 0.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 26,
                height: 26,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <MessageSquareText size={14} strokeWidth={2.2} />
            </Box>
            <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "-0.01em" }}>
              Luna
            </Typography>
          </Box>
        )}

        <ModelSelector />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flexShrink: 0 }}>
        <Tooltip title={t("chat.header.parameters")}>
          <IconButton size="small" onClick={onOpenParameters} sx={actionButtonSx}>
            <SlidersHorizontal size={17} />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("chat.header.share")}>
          <IconButton size="small" onClick={handleShare} sx={{ ...actionButtonSx, display: { xs: "none", sm: "flex" } }}>
            <Share2 size={17} />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("chat.header.newChatTooltip")}>
          <IconButton size="small" onClick={() => createNewSession()} sx={actionButtonSx}>
            <SquarePen size={17} />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.75 }} />
        <Tooltip title={t("chat.settings.theme")}>
          <IconButton
            size="small"
            onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")}
            sx={actionButtonSx}
          >
            {resolvedMode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}