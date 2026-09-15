import * as React from "react"
import { useTranslation } from "react-i18next"
import { Box, Typography, Avatar, Tooltip, IconButton } from "@mui/material"
import { Copy, RotateCcw, ThumbsUp, ThumbsDown, Volume2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import type { ChatMessage } from "../../types"
import { ThinkingAccordion } from "./thinking-accordion"
import { CodeBlock } from "./code-block"
import { useChatStore } from "../../hooks/use-chat-store"

interface AssistantMessageProps {
  message: ChatMessage
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  const { t } = useTranslation()
  const [feedback, setFeedback] = React.useState<"good" | "bad" | null>(null)

  const { remoteModels } = useChatStore()
  const modelName = remoteModels.find((m) => m.id === message.model)?.name ?? message.model

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    toast.success(t("chat.messages.copySuccess"))
  }

  const actionIconSx = (active = false) => ({
    width: 26,
    height: 26,
    color: active ? "text.primary" : "text.disabled",
    transition: "all 0.15s ease",
    "&:hover": { bgcolor: "action.hover", color: "text.primary" },
  })

  return (
    <Box sx={{ display: "flex", gap: 1.5, "&:hover .assistant-actions": { opacity: 1 } }}>
      <Avatar
        sx={{
          width: 28,
          height: 28,
          borderRadius: 1.5,
          bgcolor: "secondary.main",
          color: "secondary.contrastText",
          mt: 0.25,
        }}
      >
        <Sparkles size={14} strokeWidth={2.2} />
      </Avatar>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "text.disabled",
          }}
        >
          {modelName}
        </Typography>

        {message.thinking && (
          <ThinkingAccordion
            content={message.thinking}
            duration={message.thinkingDuration}
            isStreaming={message.isStreaming}
          />
        )}

        <Box
          sx={{
            "& pre": {
              m: 0,
              p: 2,
              borderRadius: 2,
              bgcolor: "background.default",
              overflow: "auto",
              fontSize: "0.75rem",
              lineHeight: 1.6,
              fontFamily: '"Geist Mono", "Fira Code", Consolas, monospace',
              border: "1px solid",
              borderColor: "divider",
            },
            "& code": {
              fontFamily: '"Geist Mono", "Fira Code", Consolas, monospace',
              fontSize: "0.84375em",
            },
            "& :not(pre) > code": {
              px: 0.5,
              py: 0.25,
              borderRadius: 0.75,
              bgcolor: "action.hover",
              fontSize: "0.84375em",
            },
            "& p": { my: 0.75, fontSize: "0.875rem", lineHeight: 1.75 },
            "& ul, & ol": { pl: 3, my: 0.75 },
            "& li": { my: 0.25, fontSize: "0.875rem", lineHeight: 1.75 },
            "& strong": { fontWeight: 600 },
            "& h1, & h2, & h3, & h4": { mt: 1.5, mb: 0.5, fontWeight: 600, letterSpacing: "-0.02em" },
            "& blockquote": { m: "1rem 0", pl: 2, borderLeft: "2px solid", borderColor: "divider", color: "text.secondary" },
            "& a": { color: "text.primary", textDecoration: "underline", textUnderlineOffset: 2 },
          }}
        >
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")
                const isBlock = String(children).includes("\n")
                if (isBlock) {
                  return <CodeBlock language={match?.[1]}>{String(children).replace(/\n$/, "")}</CodeBlock>
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </Box>

        {message.isStreaming && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, color: "text.disabled" }}>
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
            <Typography sx={{ fontSize: "0.6875rem", ml: 0.5 }}>Generating</Typography>
          </Box>
        )}

        {!message.isStreaming && message.content && (
          <Box
            className="assistant-actions"
            sx={{ display: "flex", alignItems: "center", gap: 0.25, mt: 0.5, opacity: 0, transition: "opacity 0.15s ease" }}
          >
            <Tooltip title={t("chat.messages.copyCode")}>
              <IconButton size="small" onClick={handleCopy} sx={actionIconSx()}>
                <Copy size={13} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("chat.messages.regenerate")}>
              <IconButton size="small" sx={actionIconSx()}>
                <RotateCcw size={13} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("chat.messages.goodResponse")}>
              <IconButton
                size="small"
                onClick={() => setFeedback(feedback === "good" ? null : "good")}
                sx={actionIconSx(feedback === "good")}
              >
                <ThumbsUp size={13} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("chat.messages.badResponse")}>
              <IconButton
                size="small"
                onClick={() => setFeedback(feedback === "bad" ? null : "bad")}
                sx={actionIconSx(feedback === "bad")}
              >
                <ThumbsDown size={13} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("chat.messages.readAloud")}>
              <IconButton size="small" sx={actionIconSx()}>
                <Volume2 size={13} />
              </IconButton>
            </Tooltip>

            {message.totalTokens && message.tokensPerSecond && (
              <Typography sx={{ ml: 1, fontSize: "0.625rem", fontFamily: "monospace", color: "text.disabled" }}>
                {message.tokensPerSecond} tok/s · {message.totalTokens} tok
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}