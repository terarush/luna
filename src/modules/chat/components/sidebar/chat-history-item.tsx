import * as React from "react"
import { useTranslation } from "react-i18next"
import { MoreHorizontal, Pin, PinOff, Trash2, Pencil } from "lucide-react"
import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
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

  return (
    <div
      className={cn(
        "group/item flex items-center gap-1 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}
      onClick={() => !isEditing && onSelect(session.id)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRenameSubmit()
            if (e.key === "Escape") setIsEditing(false)
          }}
          className="flex-1 bg-transparent border border-border rounded px-1 py-0.5 text-sm outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 truncate">{session.title}</span>
      )}

      {!isEditing && (
        <div className="hidden group-hover/item:flex items-center gap-0.5 shrink-0">
          {session.pinned && (
            <Pin className="h-3 w-3 text-muted-foreground shrink-0" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-6 w-6"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                {t("chat.sidebar.rename")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTogglePin(session.id)}>
                {session.pinned ? (
                  <PinOff className="h-4 w-4 mr-2" />
                ) : (
                  <Pin className="h-4 w-4 mr-2" />
                )}
                {session.pinned ? t("chat.sidebar.unpin") : t("chat.sidebar.pin")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(session.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t("chat.sidebar.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
