import { useTranslation } from "react-i18next"
import { Box, Avatar, Chip, Tooltip, IconButton } from "@mui/material"
import { Copy, Pencil, Image as ImageIcon, FileText } from "lucide-react"
import { toast } from "sonner"
import type { ChatMessage } from "../../types"

interface UserMessageProps {
  message: ChatMessage
}

export function UserMessage({ message }: UserMessageProps) {
  const { t } = useTranslation()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    toast.success(t("chat.messages.copySuccess"))
  }

  return (
<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, "&:hover .msg-actions": { opacity: 1 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1, width: { xs: "100%", sm: "auto" }, maxWidth: { xs: "100%", sm: "75%" } }}>
        {message.attachments && message.attachments.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, justifyContent: "flex-end" }}>
            {message.attachments.map((att) => (
              <Chip
                key={att.id}
                size="small"
                icon={att.type.startsWith("image/") ? <ImageIcon size={14} /> : <FileText size={14} />}
                label={att.name}
                variant="outlined"
                sx={{ maxWidth: 180, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } }}
              />
            ))}
          </Box>
        )}
        <Box
          sx={{
            borderRadius: { xs: "16px 16px 4px 16px", sm: "16px 16px 4px 16px" },
            bgcolor: "primary.main",
            color: "primary.contrastText",
            px: { xs: 2, sm: 2.5 },
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: "0.8125rem", sm: "0.84375rem" },
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            boxShadow: "none",
            maxWidth: { xs: "85%", sm: "75%" },
          }}
        >
          {message.content}
        </Box>
        <Box className="msg-actions" sx={{ display: "flex", gap: 0.25, opacity: 0, transition: "opacity 0.15s ease" }}>
          <Tooltip title="Copy">
            <IconButton size="small" onClick={handleCopy} sx={{ width: 24, height: 24 }}>
              <Copy size={12} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" sx={{ width: 24, height: 24 }}>
              <Pencil size={12} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Avatar
        sx={{
          width: 28,
          height: 28,
          borderRadius: 1.5,
          bgcolor: "action.selected",
          color: "text.secondary",
          fontSize: "0.6875rem",
          fontWeight: 600,
          mt: 0.25,
        }}
      >
        U
      </Avatar>
    </Box>
  )
}