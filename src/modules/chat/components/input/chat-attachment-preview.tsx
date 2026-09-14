import { Box, Chip } from "@mui/material"
import { FileText, X, Image as ImageIcon } from "lucide-react"
import { useChatStore } from "../../hooks/use-chat-store"

export function ChatAttachmentPreview() {
  const { pendingAttachments, removeAttachment } = useChatStore()

  if (pendingAttachments.length === 0) return null

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, px: 1.75, pt: 1.25 }}>
      {pendingAttachments.map((att) => (
        <Chip
          key={att.id}
          size="small"
          icon={att.type.startsWith("image/") ? <ImageIcon size={13} /> : <FileText size={13} />}
          label={att.name}
          onDelete={() => removeAttachment(att.id)}
          deleteIcon={<X size={12} />}
          variant="outlined"
          sx={{ maxWidth: 200, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" }, "& .MuiChip-deleteIcon": { opacity: 0.6, "&:hover": { opacity: 1 } } }}
        />
      ))}
    </Box>
  )
}