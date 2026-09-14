import * as React from "react"
import { useTranslation } from "react-i18next"
import { Box, Typography, Popover, List, ListItemButton, ListItemText, TextField, InputAdornment } from "@mui/material"
import { Check, ChevronDown, Search, Sparkles } from "lucide-react"
import { useChatStore, AVAILABLE_MODELS } from "../../hooks/use-chat-store"

export function ModelSelector() {
  const { t } = useTranslation()
  const { selectedModel, setSelectedModel } = useChatStore()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [search, setSearch] = React.useState("")

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel)

  const filteredModels = React.useMemo(() => {
    if (!search.trim()) return AVAILABLE_MODELS
    const q = search.toLowerCase()
    return AVAILABLE_MODELS.filter(
      (m) => m.name.toLowerCase().includes(q) || m.tag.toLowerCase().includes(q)
    )
  }, [search])

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
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{ paper: { sx: { width: 320, mt: 0.75, borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "0 12px 32px rgba(9,9,11,0.1)", p: 0.75 } } }}
      >
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
        <List dense disablePadding sx={{ maxHeight: 288, overflowY: "auto", pt: 0.5 }}>
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
          {filteredModels.length === 0 && (
            <Typography variant="body2" sx={{ color: "text.disabled", textAlign: "center", py: 4 }}>
              {t("chat.header.noModelFound")}
            </Typography>
          )}
        </List>
      </Popover>
    </>
  )
}