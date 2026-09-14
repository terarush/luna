import * as React from "react"
import { useTranslation } from "react-i18next"
import { MoreHorizontal, Pin, PinOff, Trash2, Pencil, MessageSquare, Check } from "lucide-react"
import {
  MenuRoot,
  MenuContent,
  MenuItem,
  MenuTrigger,
  MenuSeparator,
} from "@/components/ui/menu"
import { cn } from "@/lib/utils"
import type { ChatSession } from "../../types"

interface ChatHistoryItemProps {
  session: ChatSession
  isActive: boolean
  onSelect: (id: string) => void
  onRename: (id: string, title: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
}

export function ChatHistoryItem({
  session,
  isActive,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
}: ChatHistoryItemProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = React.useState(false)
  const [editValue, setEditValue] = React.useState(session.title)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleRenameSubmit = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== session.title) {
      onRename(session.id, trimmed)
    }
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="px-2 py-0.5">
        <div className="flex items-center gap-1 rounded-lg bg-white ring-1 ring-sky-400 dark:bg-zinc-900">
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit()
              if (e.key === "Escape") setIsEditing(false)
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-8 w-full bg-transparent px-2 text-[13px] text-zinc-800 outline-none dark:text-zinc-100"
          />
          <button
            onClick={handleRenameSubmit}
            className="mr-1 flex size-6 shrink-0 items-center justify-center rounded-md text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10"
            aria-label={t("chat.sidebar.rename")}
          >
            <Check className="size-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <MenuRoot>
      <MenuTrigger
        onClick={() => onSelect(session.id)}
        className={cn(
          "group relative my-0.5 flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] outline-none transition-colors",
          "data-[popup-open]:bg-zinc-100 data-[popup-open]:text-zinc-900",
          "dark:data-[popup-open]:bg-zinc-800 dark:data-[popup-open]:text-zinc-50",
          isActive
            ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-50"
            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
        )}
      >
        <MessageSquare
          className={cn(
            "size-3.5 shrink-0",
            isActive
              ? "text-sky-600 dark:text-sky-400"
              : "text-zinc-400 group-hover:text-zinc-500 dark:text-zinc-500"
          )}
        />
        <span className="min-w-0 flex-1 truncate">{session.title}</span>
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-opacity",
            "group-hover:opacity-100 group-focus-visible:opacity-100",
            isActive ? "opacity-100" : "opacity-0"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="size-3.5" />
        </span>
      </MenuTrigger>
      <MenuContent align="start" sideOffset={4}>
        <MenuItem onClick={() => setIsEditing(true)}>
          <Pencil className="size-3.5" />
          {t("chat.sidebar.rename")}
        </MenuItem>
        <MenuItem onClick={() => onTogglePin(session.id)}>
          {session.pinned ? (
            <PinOff className="size-3.5" />
          ) : (
            <Pin className="size-3.5" />
          )}
          {session.pinned ? t("chat.sidebar.unpin") : t("chat.sidebar.pin")}
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          onClick={() => onDelete(session.id)}
          className="text-red-600 hover:bg-red-50 hover:text-red-600 focus-visible:bg-red-50 focus-visible:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:focus-visible:bg-red-500/10 dark:focus-visible:text-red-400"
        >
          <Trash2 className="size-3.5" />
          {t("chat.sidebar.delete")}
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  )
}