import { useTranslation } from "react-i18next"
import { Copy, Pencil, FileText, Image as ImageIcon } from "lucide-react"
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
    <div className="flex justify-end gap-3">
      <div className="flex max-w-[85%] flex-col items-end gap-1.5 sm:max-w-[75%]">
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap justify-end gap-1.5">
            {message.attachments.map((att) => (
              <span
                key={att.id}
                className="inline-flex max-w-[12rem] items-center gap-1.5 truncate rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {att.type.startsWith("image/") ? (
                  <ImageIcon className="size-3 shrink-0 text-zinc-400" />
                ) : (
                  <FileText className="size-3 shrink-0 text-zinc-400" />
                )}
                <span className="truncate">{att.name}</span>
              </span>
            ))}
          </div>
        )}
        <div className="rounded-2xl rounded-br-md bg-zinc-900 px-4 py-2.5 text-[13.5px] leading-relaxed text-zinc-50 whitespace-pre-wrap dark:bg-zinc-100 dark:text-zinc-950">
          {message.content}
        </div>
        <div className="flex items-center gap-0.5 text-zinc-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100 dark:text-zinc-500">
          <button
            onClick={handleCopy}
            className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label={t("chat.messages.copyCode")}
          >
            <Copy className="size-3" />
          </button>
          <button
            className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label={t("chat.sidebar.rename")}
          >
            <Pencil className="size-3" />
          </button>
        </div>
      </div>
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-200 to-zinc-300 text-[11px] font-bold text-zinc-700 dark:from-zinc-700 dark:to-zinc-800 dark:text-zinc-200">
        U
      </div>
    </div>
  )
}