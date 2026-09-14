import { FileText, X, Image as ImageIcon } from "lucide-react"
import { useChatStore } from "../../hooks/use-chat-store"

export function ChatAttachmentPreview() {
  const { pendingAttachments, removeAttachment } = useChatStore()

  if (pendingAttachments.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 px-3.5 pt-3">
      {pendingAttachments.map((att) => (
        <span
          key={att.id}
          className="group inline-flex max-w-[13rem] items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 py-1 pr-1 pl-2 text-[11px] text-zinc-600 transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300 dark:hover:border-zinc-600"
        >
          {att.type.startsWith("image/") ? (
            <ImageIcon className="size-3 shrink-0 text-zinc-400" />
          ) : (
            <FileText className="size-3 shrink-0 text-zinc-400" />
          )}
          <span className="truncate">{att.name}</span>
          <button
            onClick={() => removeAttachment(att.id)}
            className="flex size-4 shrink-0 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            aria-label="Remove attachment"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
    </div>
  )
}