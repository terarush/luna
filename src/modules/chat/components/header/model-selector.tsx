import * as React from "react"
import { useTranslation } from "react-i18next"
import { Box, Typography, Popover, List, ListItemButton, ListItemText, TextField, InputAdornment, Chip, Button, CircularProgress, IconButton } from "@mui/material"
import { Check, ChevronDown, Search, Sparkles, Plus, RefreshCw } from "lucide-react"
import { useChatStore, AVAILABLE_MODELS } from "../../hooks/use-chat-store"

export function ModelSelector() {
  const { t } = useTranslation()
  const { selectedModel, setSelectedModel, customModels, addCustomModel, remoteModels, isLoadingModels, fetchModels } = useChatStore()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [search, setSearch] = React.useState("")
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [newModelId, setNewModelId] = React.useState("")
  const [newModelBaseURL, setNewModelBaseURL] = React.useState("")
  const [newModelName, setNewModelName] = React.useState("")
  const [newModelKey, setNewModelKey] = React.useState("")

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel)
  const allModels = [...AVAILABLE_MODELS, ...remoteModels]

  const filteredModels = React.useMemo(() => {
    if (!search.trim()) return allModels
    const q = search.toLowerCase()
    return allModels.filter(
      (m) => m.name.toLowerCase().includes(q) || m.tag.toLowerCase().includes(q)
    )
  }, [search, allModels])

  const handleRefreshModels = async () => {
    await fetchModels()
  }

  const handleAddCustom = () => {
    if (!newModelId || !newModelBaseURL) return
    addCustomModel({
      id: newModelId,
      name: newModelName || newModelId,
      baseURL: newModelBaseURL,
      apiKey: newModelKey || undefined,
    })
    setNewModelId("")
    setNewModelBaseURL("")
    setNewModelName("")
    setNewModelKey("")
    setShowAddForm(false)
    setSelectedModel(newModelId)
    setAnchorEl(null)
    setSearch("")
  }

  return (
    <>
      <Box
        component="button"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          height: 32,
          px: 1.5,
          borderRadius: 1.5,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          transition: "background-color 0.15s ease",
          "&:hover": { bgcolor: "action.hover" },
          "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 },
        }}
      >
        <Sparkles size={14} style={{ color: "inherit", opacity: 0.8 }} />
        <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {currentModel?.name ?? selectedModel}
        </Typography>
        <Box
          sx={{
            fontSize: "0.625rem",
            fontWeight: 500,
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            color: "text.secondary",
            whiteSpace: "nowrap",
          }}
        >
          {currentModel?.tag}
        </Box>
        <ChevronDown size={14} style={{ opacity: 0.5 }} />
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null)
          setSearch("")
          setShowAddForm(false)
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{ paper: { sx: { width: 320, mt: 0.75, borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "0 12px 32px rgba(9,9,11,0.1)", p: 0.75 } } }}
      >
        <Box sx={{ pt: 0.5, px: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={t("chat.header.searchModel")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={14} style={{ opacity: 0.6 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <IconButton size="small" onClick={handleRefreshModels} sx={{ ml: 0.5 }}>
            <RefreshCw size={14} style={{ opacity: 0.6 }} />
          </IconButton>
        </Box>
        {isLoadingModels && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress size={16} />
          </Box>
        )}
        <List dense disablePadding sx={{ maxHeight: 240, overflowY: "auto", pt: 0.5 }}>
          {filteredModels.map((model) => (
            <ListItemButton
              key={model.id}
              selected={model.id === selectedModel}
              onClick={() => {
                setSelectedModel(model.id)
                setAnchorEl(null)
                setSearch("")
              }}
              sx={{ py: 1, borderRadius: 1.5, mx: 0.25 }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>{model.name}</Typography>
                  </Box>
                }
                secondary={model.description}
                slotProps={{
                  secondary: { sx: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
                }}
              />
              {model.id === selectedModel && (
                <Check size={15} style={{ marginLeft: 8, flexShrink: 0 }} />
              )}
            </ListItemButton>
          ))}
        </List>
        {customModels.length > 0 && (
          <Box sx={{ borderTop: "1px solid", borderColor: "divider", pt: 0.5, mt: 0.5 }}>
            <Typography variant="overline" sx={{ px: 1, py: 0.5, color: "text.disabled", fontSize: "0.6875rem" }}>
              Custom Models
            </Typography>
            <List dense disablePadding sx={{ maxHeight: 160, overflowY: "auto", pt: 0.5 }}>
              {customModels.map((model) => (
                <ListItemButton
                  key={model.id}
                  selected={model.id === selectedModel}
                  onClick={() => {
                    setSelectedModel(model.id)
                    setAnchorEl(null)
                    setSearch("")
                  }}
                  sx={{ py: 1, borderRadius: 1.5, mx: 0.25 }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>{model.name}</Typography>
                        <Chip size="small" label="Custom" sx={{ fontSize: "0.5625rem", height: 16 }} />
                      </Box>
                    }
                    secondary={model.baseURL}
                    slotProps={{
                      secondary: { sx: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
                    }}
                  />
                  {model.id === selectedModel && (
                    <Check size={15} style={{ marginLeft: 8, flexShrink: 0 }} />
                  )}
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}

        {showAddForm ? (
          <Box sx={{ pt: 1, px: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField size="small" placeholder="Model ID" value={newModelId} onChange={(e) => setNewModelId(e.target.value)} />
            <TextField size="small" placeholder="Model Name" value={newModelName} onChange={(e) => setNewModelName(e.target.value)} />
            <TextField size="small" placeholder="Base URL (e.g., https://api.openai.com/v1)" value={newModelBaseURL} onChange={(e) => setNewModelBaseURL(e.target.value)} />
            <TextField size="small" placeholder="API Key (optional)" value={newModelKey} onChange={(e) => setNewModelKey(e.target.value)} type="password" />
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Button size="small" variant="contained" onClick={handleAddCustom} sx={{ flex: 1 }}>Add</Button>
              <Button size="small" variant="outlined" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </Box>
          </Box>
        ) : (
          <Button
            size="small"
            variant="text"
            onClick={() => setShowAddForm(true)}
            startIcon={<Plus size={14} />}
            sx={{ mx: 1, my: 0.5, fontSize: "0.75rem" }}
          >
            Add Custom Model
          </Button>
        )}
      </Popover>
    </>
  )
}