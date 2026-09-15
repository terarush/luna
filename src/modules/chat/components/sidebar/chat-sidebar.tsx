import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Divider,
  Drawer,
} from "@mui/material"
import { Plus, Search, Pin, MessageSquareText, PanelLeftClose, X } from "lucide-react"
import { useChatStore } from "../../hooks/use-chat-store"
import { ChatHistoryItem } from "./chat-history-item"
import { ChatUserFooter } from "./chat-user-footer"
import { DRAWER_WIDTH } from "../../constants"

interface ChatSidebarProps {
  open: boolean
  isMobile: boolean
  onToggle: () => void
  onOpenSettings: () => void
  onSessionSelect: () => void
}

export function ChatSidebar({
  open,
  isMobile,
  onToggle,
  onOpenSettings,
  onSessionSelect,
}: ChatSidebarProps) {
  const { t } = useTranslation()
  const {
    sessions,
    activeSessionId,
    searchFilter,
    setSearchFilter,
    selectSession,
    createNewSession,
    renameSession,
    togglePinSession,
    deleteSession,
  } = useChatStore()

  const filteredSessions = React.useMemo(() => {
    if (!searchFilter.trim()) return sessions
    const q = searchFilter.toLowerCase()
    return sessions.filter((s) => s.title.toLowerCase().includes(q))
  }, [sessions, searchFilter])

  const pinnedSessions = filteredSessions.filter((s) => s.pinned)
  const unpinnedSessions = filteredSessions.filter((s) => !s.pinned)

  const handleSelect = (id: string) => {
    selectSession(id)
    onSessionSelect()
  }

  const handleNewChat = () => {
    createNewSession()
    onSessionSelect()
  }

  const sidebarContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: DRAWER_WIDTH }}>
      {/* Brand row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "10px",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <MessageSquareText size={16} strokeWidth={2.2} />
          </Box>
          <Box sx={{ lineHeight: 1.1 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>
              Luna
            </Typography>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "text.disabled",
              }}
            >
              AI Chat
            </Typography>
          </Box>
        </Box>
        <Tooltip title={isMobile ? "Close" : "Collapse"}>
          <IconButton size="small" onClick={onToggle}>
            {isMobile ? <X size={16} /> : <PanelLeftClose size={16} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* New chat + search */}
      <Box
        sx={{ px: 1.5, pb: 1.5, display: "flex", flexDirection: "column", gap: 1.25, flexShrink: 0 }}
      >
        <Box
          component="button"
          onClick={handleNewChat}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            height: 36,
            borderRadius: "10px",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontSize: "0.8125rem",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 0 2px 6px rgba(0,0,0,0.12)",
            transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
            "&:hover": { bgcolor: "primary.dark" },
            "&:active": { transform: "scale(0.97)" },
          }}
        >
          <Plus size={16} strokeWidth={2.2} />
          {t("chat.sidebar.newChat")}
        </Box>
        <TextField
          fullWidth
          size="small"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder={t("chat.sidebar.searchPlaceholder")}
          slotProps={{
            input: {
              sx: {
                borderRadius: "10px",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={14} style={{ color: "inherit", opacity: 0.6 }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Divider />

      {/* Session list */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 0.5 }}>
        {pinnedSessions.length > 0 && (
          <Box sx={{ mb: 0.5 }}>
            <Typography
              variant="overline"
              sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 2, py: 1, color: "text.disabled" }}
            >
              <Pin size={11} />
              {t("chat.sidebar.pinned")}
            </Typography>
            {pinnedSessions.map((session) => (
              <ChatHistoryItem
                key={session.id}
                session={session}
                isActive={session.id === activeSessionId}
                onSelect={handleSelect}
                onRename={renameSession}
                onTogglePin={togglePinSession}
                onDelete={deleteSession}
              />
            ))}
          </Box>
        )}

        {unpinnedSessions.length > 0 && (
          <Box>
            <Typography
              variant="overline"
              sx={{ display: "block", px: 2, py: 1, color: "text.disabled" }}
            >
              {t("chat.sidebar.recent")}
            </Typography>
            {unpinnedSessions.map((session) => (
              <ChatHistoryItem
                key={session.id}
                session={session}
                isActive={session.id === activeSessionId}
                onSelect={handleSelect}
                onRename={renameSession}
                onTogglePin={togglePinSession}
                onDelete={deleteSession}
              />
            ))}
          </Box>
        )}

        {filteredSessions.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              py: 8,
              color: "text.disabled",
            }}
          >
            <Search size={24} />
            <Typography variant="body2">{t("chat.header.noModelFound")}</Typography>
          </Box>
        )}
      </Box>

      <Divider />
      <ChatUserFooter onOpenSettings={onOpenSettings} />
    </Box>
  )

  // Mobile: MUI Drawer overlay
  if (isMobile) {
    return (
      <Drawer
        open={open}
        onClose={onToggle}
        anchor="left"
        slotProps={{
          paper: {
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.paper",
              backdropFilter: "blur(26px) saturate(190%)",
              WebkitBackdropFilter: "blur(26px) saturate(190%)",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    )
  }

  // Desktop: inline sidebar
  return (
    <Box
      component="aside"
      sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: open ? "1px solid" : "none",
        borderColor: "divider",
        bgcolor: "background.paper",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        overflow: "hidden",
        transition: "width 0.25s ease, border-color 0.25s ease",
      }}
    >
      {sidebarContent}
    </Box>
  )
}