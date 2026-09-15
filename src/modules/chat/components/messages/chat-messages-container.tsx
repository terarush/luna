import * as React from "react"
import { useTranslation } from "react-i18next"
import { Box, Fade, Typography } from "@mui/material"
import { ArrowDown, Sparkles } from "lucide-react"
import { useChatStore } from "../../hooks/use-chat-store"
import { ChatMessageItem } from "./chat-message-item"
import { ChatEmptyState } from "./chat-empty-state"

interface ChatMessagesContainerProps {
  onSendPrompt: (prompt: string) => void
}

export function ChatMessagesContainer({ onSendPrompt }: ChatMessagesContainerProps) {
  const { t } = useTranslation()
  const { sessions, activeSessionId, isGenerating } = useChatStore()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = React.useState(false)

  const activeSession = sessions.find((s) => s.id === activeSessionId)
  const messages = activeSession?.messages ?? []

  const scrollToBottom = React.useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [])

  React.useEffect(() => {
    if (isGenerating) scrollToBottom()
  }, [isGenerating, messages.length, scrollToBottom])

  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setShowScrollButton(el.scrollHeight - el.scrollTop - el.clientHeight > 100)
  }, [])

  if (messages.length === 0) {
    return <ChatEmptyState onSendPrompt={onSendPrompt} />
  }

  return (
    <Box sx={{ position: "relative", flex: 1, minHeight: 0 }}>
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{ height: "100%", overflowY: "auto", overscrollBehavior: "contain" }}
      >
        <Box
          sx={{
            mx: "auto",
            width: "100%",
            maxWidth: { xs: "100%", md: 768 },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 2.5 },
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, sm: 4 },
          }}
        >
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
          {isGenerating && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pl: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "text.disabled",
                      animation: "pulse 1.4s ease-in-out infinite",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </Box>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  fontSize: "0.75rem",
                  color: "text.disabled",
                }}
              >
                <Sparkles size={12} />
                {t("chat.input.stop")}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Fade in={showScrollButton}>
        <Box
          component="button"
          onClick={scrollToBottom}
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.16)" : "rgba(255, 255, 255, 0.8)",
            bgcolor: "background.paper",
            backdropFilter: "blur(24px) saturate(190%)",
            WebkitBackdropFilter: "blur(24px) saturate(190%)",
            color: "text.primary",
            cursor: "pointer",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 10px 28px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)"
                : "0 8px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.95)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            "&:hover": {
              transform: "translateX(-50%) translateY(-2px)",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.95)",
            },
            "&:active": { transform: "translateX(-50%) scale(0.92)" },
            "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
          }}
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={16} />
        </Box>
      </Fade>
    </Box>
  )
}