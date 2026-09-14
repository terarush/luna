import * as React from "react"
import { useTranslation } from "react-i18next"
import { Search, Plus, Pin, MessageSquareText, X } from "lucide-react"
import { useChatStore } from "../../hooks/use-chat-store"
import { ChatHistoryItem } from "./chat-history-item"
import { ChatUserFooter } from "./chat-user-footer"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  open: boolean
  onToggle: () => void
  onOpenSettings: () => void
}

export function ChatSidebar({ open, onToggle, onOpenSettings }: ChatSidebarProps) {
  const { t } = useTranslation()
  const {
    sessions,
    activeSessionId,
    searchFilter,
    setSearchFilter,
    selectSession,
    createNewSession,
    renameSession,
    togglePinSession,
    deleteSession,
  } = useChatStore()

  const filteredSessions = React.useMemo(() => {
    if (!searchFilter.trim()) return sessions
    const q = searchFilter.toLowerCase()
    return sessions.filter((s) => s.title.toLowerCase().includes(q))
  }, [sessions, searchFilter])

  const pinnedSessions = filteredSessions.filter((s) => s.pinned)
  const unpinnedSessions = filteredSessions.filter((s) => !s.pinned)

  return (
    <aside
      className={cn(
        "z-20 flex shrink-0 flex-col border-r border-zinc-200 bg-white transition-[width] duration-300 ease-in-out",
        "dark:border-zinc-800 dark:bg-zinc-900",
        open ? "w-72" : "w-0 border-r-0"
      )}
      aria-hidden={!open}
    >
      <div className="flex h-full w-72 flex-col overflow-hidden">
        {/* Brand row */}
        <div className="flex h-14 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-sm shadow-sky-500/25 dark:from-sky-500 dark:to-sky-700">
              <MessageSquareText className="size-4" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Luna
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                AI Chat
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="flex size-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label={t("chat.sidebar.newChat")}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* New chat + search */}
        <div className="shrink-0 space-y-2 px-3 pb-3">
          <button
            onClick={() => createNewSession()}
            className="group flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            <Plus className="size-4" strokeWidth={2.2} />
            {t("chat.sidebar.newChat")}
          </button>

          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={t("chat.sidebar.searchPlaceholder")}
              className="h-8 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-2 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none transition-colors focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-sky-500"
            />
          </div>
        </div>

        {/* Session list */}
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {pinnedSessions.length > 0 && (
            <div className="mb-1">
              <p className="flex items-center gap-1.5 px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
                <Pin className="size-3" />
                {t("chat.sidebar.pinned")}
              </p>
              {pinnedSessions.map((session) => (
                <ChatHistoryItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onSelect={selectSession}
                  onRename={renameSession}
                  onTogglePin={togglePinSession}
                  onDelete={deleteSession}
                />
              ))}
            </div>
          )}

          {unpinnedSessions.length > 0 && (
            <div>
              <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
                {t("chat.sidebar.recent")}
              </p>
              {unpinnedSessions.map((session) => (
                <ChatHistoryItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onSelect={selectSession}
                  onRename={renameSession}
                  onTogglePin={togglePinSession}
                  onDelete={deleteSession}
                />
              ))}
            </div>
          )}

          {filteredSessions.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Search className="size-6 text-zinc-300 dark:text-zinc-600" />
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {t("chat.header.noModelFound")}
              </p>
            </div>
          )}
        </div>

        <ChatUserFooter onOpenSettings={onOpenSettings} />
      </div>
    </aside>
  )
}