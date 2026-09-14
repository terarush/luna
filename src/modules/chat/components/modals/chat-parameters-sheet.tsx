import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Slider,
  Button,
  Drawer,
  Tooltip,
} from "@mui/material"
import { X, RotateCcw, Check } from "lucide-react"
import { useChatStore } from "../../hooks/use-chat-store"

interface ChatParametersSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEFAULTS = {
  systemPrompt: "You are a helpful, knowledgeable, and concise AI assistant.",
  temperature: 0.7,
  contextLength: 4096,
  topP: 0.9,
  topK: 40,
}

export function ChatParametersSheet({ open, onOpenChange }: ChatParametersSheetProps) {
  const { t } = useTranslation()
  const { parameters, updateParameters } = useChatStore()
  const [local, setLocal] = React.useState(parameters)

  React.useEffect(() => {
    if (open) setLocal(parameters)
  }, [open, parameters])

  const handleSave = () => {
    updateParameters(local)
    onOpenChange(false)
  }

  const handleReset = () => setLocal(DEFAULTS)

  const labelSx = { fontSize: "0.8125rem", fontWeight: 500, color: "text.primary" } as const
  const descSx = { fontSize: "0.6875rem", color: "text.secondary", lineHeight: 1.5, mb: 1.5 } as const
  const valueSx = { fontFamily: "Geist Mono, monospace", fontSize: "0.75rem", color: "text.secondary" } as const

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => onOpenChange(false)}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 400 },
            borderLeft: "1px solid",
            borderColor: "divider",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}>
          <Box>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, letterSpacing: "-0.01em" }}>
              {t("chat.parameters.title")}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.25 }}>
              {t("chat.parameters.description")}
            </Typography>
          </Box>
          <Tooltip title="Close">
            <IconButton size="small" onClick={() => onOpenChange(false)}>
              <X size={16} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 2.5, py: 2.5, display: "flex", flexDirection: "column", gap: 4 }}>
          <Box>
            <Typography sx={labelSx}>{t("chat.parameters.systemPrompt")}</Typography>
            <Typography sx={descSx}>{t("chat.parameters.systemPromptDesc")}</Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              value={local.systemPrompt}
              onChange={(e) => setLocal({ ...local, systemPrompt: e.target.value })}
              size="small"
            />
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 0.5 }}>
              <Typography sx={labelSx}>{t("chat.parameters.temperature")}</Typography>
              <Typography sx={valueSx}>{local.temperature.toFixed(2)}</Typography>
            </Box>
            <Typography sx={descSx}>{t("chat.parameters.temperatureDesc")}</Typography>
            <Slider
              min={0}
              max={2}
              step={0.05}
              value={local.temperature}
              onChange={(_, value) => setLocal({ ...local, temperature: value })}
              size="small"
            />
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 0.5 }}>
              <Typography sx={labelSx}>{t("chat.parameters.contextLength")}</Typography>
              <Typography sx={valueSx}>{local.contextLength.toLocaleString()}</Typography>
            </Box>
            <Slider
              min={2048}
              max={131072}
              step={1024}
              value={local.contextLength}
              onChange={(_, value) => setLocal({ ...local, contextLength: value })}
              size="small"
            />
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 0.5 }}>
              <Typography sx={labelSx}>{t("chat.parameters.topP")}</Typography>
              <Typography sx={valueSx}>{local.topP.toFixed(2)}</Typography>
            </Box>
            <Typography sx={descSx}>{t("chat.parameters.topPDesc")}</Typography>
            <Slider
              min={0}
              max={1}
              step={0.05}
              value={local.topP}
              onChange={(_, value) => setLocal({ ...local, topP: value })}
              size="small"
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, px: 2.5, py: 2, borderTop: "1px solid", borderColor: "divider", flexShrink: 0 }}>
          <Button size="small" variant="outlined" onClick={handleReset} startIcon={<RotateCcw size={14} />}>
            {t("chat.parameters.reset")}
          </Button>
          <Button size="small" variant="contained" onClick={handleSave} startIcon={<Check size={14} />}>
            {t("chat.parameters.apply")}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}