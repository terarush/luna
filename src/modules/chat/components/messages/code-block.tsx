import * as React from "react"
import { Box, Typography } from "@mui/material"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

interface CodeBlockProps {
  language?: string
  children: string
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    toast.success(t("chat.messages.copied"))
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Box sx={{ my: 1 }} data-language={language}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1.5,
          py: 0.75,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          border: "1px solid",
          borderBottom: "none",
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <Typography sx={{ fontSize: "0.625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary", fontFamily: "monospace" }}>
          {language ?? "code"}
        </Typography>
        <Box
          component="button"
          onClick={handleCopy}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 0.75,
            py: 0.25,
            borderRadius: 0.75,
            border: "none",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontSize: "0.625rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
            "&:hover": { bgcolor: "primary.dark" },
            "&:active": { transform: "scale(0.97)" },
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? t("chat.messages.copied") : t("chat.messages.copyCode")}
        </Box>
      </Box>
      <pre
        style={{
          margin: 0,
          padding: 12,
          borderRadius: "0 0 8px 8px",
          border: "1px solid",
          borderColor: "var(--mui-palette-divider)",
          background: "var(--mui-palette-background-default)",
          overflow: "auto",
        }}
      >
        <code>{children}</code>
      </pre>
    </Box>
  )
}