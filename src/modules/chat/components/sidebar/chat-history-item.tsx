import * as React from "react"
import { useTranslation } from "react-i18next"
import { Box, IconButton, Menu, MenuItem, InputBase, Tooltip } from "@mui/material"
import { MoreHorizontal, Pin, PinOff, Trash2, Pencil, MessageSquare, Check } from "lucide-react"
import type { ChatSession } from "../../types"

interface ChatHistoryItemProps {
  session: ChatSession
  isActive: boolean
  onSelect: (id: string) => void
  onRename: (id: string, title: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
}

export function ChatHistoryItem({
  session,
  isActive,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
}: ChatHistoryItemProps) {
  const { t } = useTranslation()
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editValue, setEditValue] = React.useState(session.title)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleRenameSubmit = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== session.title) {
      onRename(session.id, trimmed)
    }
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Box sx={{ px: 1.5, py: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "primary.main",
            bgcolor: "background.paper",
          }}
        >
          <InputBase
            inputRef={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit()
              if (e.key === "Escape") setIsEditing(false)
            }}
            onClick={(e) => e.stopPropagation()}
            sx={{ flex: 1, px: 1, py: 0.5, fontSize: "0.8125rem" }}
          />
          <IconButton size="small" onClick={handleRenameSubmit} sx={{ mr: 0.5 }}>
            <Check size={14} />
          </IconButton>
        </Box>
      </Box>
    )
  }

  return (
    <>
      {/*
        Fix: avoid <button> inside <button>.
        Use a div with role="button" for the row, and keep IconButton (button) as a sibling
        wrapped in an absolutely-positioned overlay so it stays visually inside the row.
      */}
      <Box sx={{ position: "relative", px: 1.5, my: 0.25 }}>
        {/* Main clickable row — rendered as div, not button */}
        <Box
          role="button"
          tabIndex={0}
          onClick={() => onSelect(session.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onSelect(session.id)
            }
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
            height: 36,
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            cursor: "pointer",
            textAlign: "left",
            color: isActive ? "text.primary" : "text.secondary",
            fontWeight: isActive ? 500 : 400,
            bgcolor: isActive
              ? (theme) =>
                  theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.85)"
              : "transparent",
            border: "1px solid",
            borderColor: isActive
              ? (theme) =>
                  theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)"
              : "transparent",
            boxShadow: isActive
              ? (theme) =>
                  theme.palette.mode === "dark"
                    ? "inset 0 1px 0 0 rgba(255, 255, 255, 0.18), 0 2px 8px rgba(0,0,0,0.25)"
                    : "inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(0,0,0,0.04)"
              : "none",
            transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
            userSelect: "none",
            "&:hover": {
              bgcolor: isActive
                ? (theme) =>
                    theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.95)"
                : (theme) =>
                    theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
            },
            "&:active": { transform: "scale(0.98)" },
            "&:hover .more-btn": { opacity: 1 },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 1,
            },
          }}
        >
          <MessageSquare
            size={14}
            style={{ flexShrink: 0 }}
            opacity={isActive ? 1 : 0.6}
          />
          <Box
            component="span"
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.8125rem",
              // leave room for the more button
              pr: 2.5,
            }}
          >
            {session.title}
          </Box>
        </Box>

        {/* More button — positioned absolutely so it's NOT inside the div[role=button] */}
        <Tooltip title="More">
          <IconButton
            className="more-btn"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              setMenuAnchor(e.currentTarget)
            }}
            sx={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              width: 20,
              height: 20,
              opacity: isActive ? 1 : 0,
              transition: "opacity 0.12s ease",
              "&:hover": { opacity: 1 },
            }}
          >
            <MoreHorizontal size={14} />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null)
            setIsEditing(true)
          }}
        >
          <Pencil size={14} style={{ marginRight: 8 }} />
          {t("chat.sidebar.rename")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null)
            onTogglePin(session.id)
          }}
        >
          {session.pinned ? (
            <PinOff size={14} style={{ marginRight: 8 }} />
          ) : (
            <Pin size={14} style={{ marginRight: 8 }} />
          )}
          {session.pinned ? t("chat.sidebar.unpin") : t("chat.sidebar.pin")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null)
            onDelete(session.id)
          }}
          sx={{ color: "error.main" }}
        >
          <Trash2 size={14} style={{ marginRight: 8 }} />
          {t("chat.sidebar.delete")}
        </MenuItem>
      </Menu>
    </>
  )
}