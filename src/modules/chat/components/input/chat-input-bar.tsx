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
    borderRadius: 1.5,
    color: active ? "primary.contrastText" : "text.disabled",
    bgcolor: active ? "primary.main" : "transparent",
    transition: "all 0.15s ease",
    "&:hover": {
      bgcolor: active ? "primary.dark" : "action.hover",
      color: active ? "primary.contrastText" : "text.primary",
    },
    "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 },
  })

  const sendButtonSx = {
    width: 34,
    height: 34,
    borderRadius: "50%",
    bgcolor: "primary.main",
    color: "primary.contrastText",
    border: "none",
    cursor: "pointer",
    transition: "all 0.15s ease",
    "&:hover": { bgcolor: "primary.dark" },
    "&:active": { transform: "scale(0.92)" },
    "&:disabled": { opacity: 0.35, pointerEvents: "none" },
    "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 },
  }

  return (
    <Box
      sx={{
        flexShrink: 0,
        borderTop: "1px solid",
        borderColor: "divider",
        background: "transparent",
        px: { xs: 1, sm: 2 },
        pb: { xs: 1, sm: 1.5 },
        pt: { xs: 0.75, sm: 1 },
      }}
    >
      <Box sx={{ mx: "auto", maxWidth: { xs: "100%", md: 768 } }}>
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            borderRadius: { xs: 2.5, sm: 2 },
            borderColor: "divider",
            bgcolor: "background.paper",
            overflow: "hidden",
            transition: "all 0.2s ease",
            boxShadow: "none",
            "&:focus-within": {
              borderColor: "text.disabled",
              boxShadow: "none",
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
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 1, sm: 1.25 },
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
              px: { xs: 1, sm: 1.25 },
              pb: { xs: 1, sm: 1.25 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
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
                  height: 34,
                  px: 1.5,
                  borderRadius: 8,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": { bgcolor: "primary.dark" },
                  "&:active": { transform: "scale(0.97)" },
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