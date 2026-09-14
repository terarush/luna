import { useTranslation } from "react-i18next"
import { Box, Typography, Paper } from "@mui/material"
import { Code2, Lightbulb, BrainCircuit, Boxes, ArrowUpRight } from "lucide-react"
import { useChatStore, AVAILABLE_MODELS } from "../../hooks/use-chat-store"

interface ChatEmptyStateProps {
  onSendPrompt: (prompt: string) => void
}

const PROMPTS = [
  { icon: Code2, titleKey: "chat.emptyState.prompt1Title", descKey: "chat.emptyState.prompt1Desc" },
  { icon: Lightbulb, titleKey: "chat.emptyState.prompt2Title", descKey: "chat.emptyState.prompt2Desc" },
  { icon: BrainCircuit, titleKey: "chat.emptyState.prompt3Title", descKey: "chat.emptyState.prompt3Desc" },
  { icon: Boxes, titleKey: "chat.emptyState.prompt4Title", descKey: "chat.emptyState.prompt4Desc" },
]

export function ChatEmptyState({ onSendPrompt }: ChatEmptyStateProps) {
  const { t } = useTranslation()
  const { selectedModel } = useChatStore()
  const model = AVAILABLE_MODELS.find((m) => m.id === selectedModel)

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3 },
        py: { xs: 6, sm: 10 },
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          textAlign: "center",
          animation: "fadeIn 0.4s ease-out",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: 44, sm: 48 },
            height: { xs: 44, sm: 48 },
            borderRadius: 3,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            boxShadow: "0 12px 24px rgba(9,9,11,0.18)",
          }}
        >
          <Code2 size={20} strokeWidth={2.2} />
        </Box>
        <Typography
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.625rem" },
            fontWeight: 600,
            letterSpacing: "-0.02em",
            mt: 1,
          }}
        >
          {t("chat.emptyState.title")}
        </Typography>
        <Typography
          sx={{ fontSize: "0.8125rem", color: "text.secondary", maxWidth: 340, lineHeight: 1.6 }}
        >
          {t("chat.emptyState.subtitle")}{" "}
          <Box component="span" sx={{ fontWeight: 500, color: "text.primary" }}>
            {model?.name}
          </Box>
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: { xs: 1, sm: 1.5 },
          width: "100%",
          maxWidth: { xs: "100%", sm: 576 },
        }}
      >
        {PROMPTS.map((prompt, i) => {
          const Icon = prompt.icon
          return (
            <Paper
              key={prompt.titleKey}
              variant="outlined"
              onClick={() => onSendPrompt(t(prompt.titleKey))}
              sx={{
                p: { xs: 1.5, sm: 2 },
                cursor: "pointer",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                borderRadius: 3,
                borderColor: "divider",
                transition: "all 0.18s ease",
                animation: `slideInUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
                "&:hover": {
                  borderColor: "text.disabled",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(9,9,11,0.06)",
                },
                "&:active": { transform: "scale(0.98)" },
                "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  flexShrink: 0,
                  bgcolor: "action.selected",
                  color: "text.secondary",
                  transition: "all 0.18s ease",
                  "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
                }}
              >
                <Icon size={15} strokeWidth={2.2} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                  {t(prompt.titleKey)}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.25, lineHeight: 1.5 }}
                >
                  {t(prompt.descKey)}
                </Typography>
              </Box>
              <ArrowUpRight size={14} style={{ flexShrink: 0, opacity: 0.35 }} />
            </Paper>
          )
        })}
      </Box>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Box>
  )
}