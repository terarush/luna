import { X, FileText, Image } from "lucide-react"
import { Button } from "#/components/ui/button"
import { useChatStore } from "../../hooks/use-chat-store"

export function ChatAttachmentPreview() {
  const { pendingAttachments, removeAttachment } = useChatStore()

  if (pendingAttachments.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 px-1">
      {pendingAttachments.map((att) => (
        <div
          key={att.id}
          className="flex items-center gap-1.5 bg-muted rounded-md px-2 py-1 text-xs"
        >
          {att.type.startsWith("image/") ? (
            <Image className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="truncate max-w-[100px]">{att.name}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-4 w-4"
            onClick={() => removeAttachment(att.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  )
}
