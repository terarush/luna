import * as React from "react"
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material"
import { KeyRound, Server } from "lucide-react"
import { useChatStore } from "../../hooks/use-chat-store"

interface ApiSetupDialogProps {
  open: boolean
  onClose: () => void
}

export function ApiSetupDialog({ open, onClose }: ApiSetupDialogProps) {
  const { apiBaseUrl, apiKey, setApiBaseUrl, setApiKey, fetchModels, isLoadingModels } = useChatStore()
  const [baseUrl, setBaseUrl] = React.useState(apiBaseUrl)
  const [key, setKey] = React.useState(apiKey)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setBaseUrl(apiBaseUrl)
      setKey(apiKey)
      setError("")
    }
  }, [open, apiBaseUrl, apiKey])

  const handleSave = async () => {
    if (!baseUrl.trim()) {
      setError("Base URL wajib diisi.")
      return
    }
    setApiBaseUrl(baseUrl)
    setApiKey(key.trim())
    setError("")
    await fetchModels()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" disableEscapeKeyDown>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}>
        <KeyRound size={18} />
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "-0.01em" }}>
          Setup API
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", lineHeight: 1.6 }}>
          Isi endpoint API OpenAI-compatible dan API key untuk memuat daftar model. Bisa diubah kapan saja di Settings.
        </Typography>

        <Box>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, mb: 0.75, display: "flex", alignItems: "center", gap: 0.5 }}>
            <Server size={13} style={{ opacity: 0.6 }} />
            API Base URL
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="https://prod-9router.terarush.dev/v1"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            error={Boolean(error)}
            helperText={error}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, mb: 0.75, display: "flex", alignItems: "center", gap: 0.5 }}>
            <KeyRound size={13} style={{ opacity: 0.6 }} />
            API Key
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="sk-..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            type="password"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button size="small" variant="contained" onClick={handleSave} disabled={isLoadingModels} sx={{ flex: 1 }}>
          {isLoadingModels ? <CircularProgress size={14} color="inherit" /> : "Save & Load Models"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}