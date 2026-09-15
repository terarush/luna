import * as React from "react"
import { useTranslation } from "react-i18next"
import { Box, TextField, IconButton, Paper, Tooltip, Typography } from "@mui/material"
import { ArrowUp, Square, Paperclip, Globe, BrainCircuit, Mic } from "lucide-react"
import { useChatStore } from "../../hooks/use-chat-store"
import { ChatAttachmentPreview } from "./chat-attachment-preview"

export function ChatInputBar() {
  const { t } = useTranslation()
  const {
    isGenerating,
    isWebSearchEnabled,
    isReasoningEnabled,
    toggleWebSearch,
    toggleReasoning,
    sendMessage,
    stopGeneration,
    addAttachment,
  } = useChatStore()

  const [input, setInput] = React.useState("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleSend = React.useCallback(() => {
    if (!input.trim()) return
    sendMessage(input)
    setInput("")
  }, [input, sendMessage])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return
      for (const file of Array.from(files)) {
        addAttachment({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        })
      }
      e.target.value = ""
    },
    [addAttachment]
  )

  const toolButtonSx = (active = false) => ({
    width: 32,
    height: 32,
    borderRadius: "8px",
    color: active ? "primary.contrastText" : "text.secondary",
    bgcolor: active
      ? "primary.main"
      : "transparent",
    transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
    "&:hover": {
      bgcolor: active
        ? "primary.dark"
        : (theme: any) =>
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
      color: active ? "primary.contrastText" : "text.primary",
    },
    "&:active": { transform: "scale(0.92)" },
    "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 },
  })

  const sendButtonSx = {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "primary.main",
    color: "primary.contrastText",
    border: "none",
    cursor: "pointer",
    boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 0 2px 6px rgba(0,0,0,0.15)",
    transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
    "&:hover": { bgcolor: "primary.dark" },
    "&:active": { transform: "scale(0.9)" },
    "&:disabled": { opacity: 0.3, pointerEvents: "none", boxShadow: "none" },
    "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 },
  }

  return (
    <Box
      sx={{
        flexShrink: 0,
        background: "transparent",
        px: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 2.5 },
        pt: 0.5,
      }}
    >
      <Box sx={{ mx: "auto", maxWidth: { xs: "100%", md: 768 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "18px",
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
            bgcolor: "background.paper",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 16px 40px -8px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)"
                : "0 8px 24px -4px rgba(0, 0, 0, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.95)",
            overflow: "hidden",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            "&:focus-within": {
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.22)" : "rgba(0, 0, 0, 0.18)",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 18px 48px -6px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)"
                  : "0 12px 32px -4px rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 1)",
            },
          }}
        >
          <ChatAttachmentPreview />

          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={6}
            variant="standard"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.input.placeholder")}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  px: { xs: 2, sm: 2.25 },
                  pt: { xs: 1.5, sm: 1.75 },
                  pb: { xs: 0.75, sm: 1 },
                  fontSize: { xs: "0.9375rem", sm: "0.875rem" },
                  lineHeight: 1.6,
                },
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 1.5, sm: 2 },
              pb: { xs: 1.25, sm: 1.5 },
              pt: 0.25,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileChange} />
              <Tooltip title={t("chat.input.attachFile")}>
                <IconButton size="small" onClick={() => fileInputRef.current?.click()} sx={toolButtonSx()}>
                  <Paperclip size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title={isWebSearchEnabled ? t("chat.input.webSearchActive") : t("chat.input.webSearch")}>
                <IconButton size="small" onClick={toggleWebSearch} sx={toolButtonSx(isWebSearchEnabled)}>
                  <Globe size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={isReasoningEnabled ? t("chat.input.deepThinkActive") : t("chat.input.deepThink")}
              >
                <IconButton size="small" onClick={toggleReasoning} sx={toolButtonSx(isReasoningEnabled)}>
                  <BrainCircuit size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("chat.input.voiceInput")}>
                <IconButton size="small" sx={{ ...toolButtonSx(), display: { xs: "none", sm: "flex" } }}>
                  <Mic size={16} />
                </IconButton>
              </Tooltip>
            </Box>

            {isGenerating ? (
              <Box
                component="button"
                onClick={stopGeneration}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  height: 32,
                  px: 1.5,
                  borderRadius: "10px",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0,0,0,0.12)",
                  transition: "all 0.18s ease",
                  "&:hover": { bgcolor: "primary.dark" },
                  "&:active": { transform: "scale(0.95)" },
                }}
              >
                <Square size={12} style={{ fill: "currentColor" }} />
                {t("chat.input.stop")}
              </Box>
            ) : (
              <Tooltip title={t("chat.input.send")}>
                <Box
                  component="button"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  sx={sendButtonSx}
                >
                  <ArrowUp size={16} strokeWidth={2.4} />
                </Box>
              </Tooltip>
            )}
          </Box>
        </Paper>

        <Typography
          sx={{
            mt: { xs: 0.75, sm: 1.25 },
            textAlign: "center",
            fontSize: "0.6875rem",
            color: "text.disabled",
          }}
        >
          {t("chat.input.disclaimer")}
        </Typography>
      </Box>
    </Box>
  )
}