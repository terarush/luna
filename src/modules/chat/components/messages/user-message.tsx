import * as React from "react"
import { useTranslation } from "react-i18next"
import { Copy, Pencil, FileText, Image } from "lucide-react"
import { Button } from "#/components/ui/button"
import { toast } from "sonner"
import type { ChatMessage } from "../../types"

interface UserMessageProps {
  message: ChatMessage
}

export function UserMessage({ message }: UserMessageProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    toast.success(t("chat.messages.copySuccess"))
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex justify-end gap-2 group/msg">
      <div className="flex flex-col items-end gap-1 max-w-[80%]">
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-end">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-1.5 bg-muted rounded-md px-2 py-1 text-xs"
              >
                {att.type.startsWith("image/") ? (
                  <Image className="h-3.5 w-3.5" />
                ) : (
                  <FileText className="h-3.5 w-3.5" />
                )}
                <span className="truncate max-w-[120px]">{att.name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        <div className="hidden group-hover/msg:flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" className="h-6 w-6" onClick={handleCopy}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="h-6 w-6">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium shrink-0">
        U
      </div>
    </div>
  )
}
