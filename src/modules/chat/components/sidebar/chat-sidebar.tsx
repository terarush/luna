import * as React from "react"
import { useTranslation } from "react-i18next"
import { Plus, Search, MessageSquare } from "lucide-react"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "#/components/ui/sidebar"
import { useChatStore } from "../../hooks/use-chat-store"
import { ChatHistoryItem } from "./chat-history-item"
import { ChatUserFooter } from "./chat-user-footer"

interface ChatSidebarProps {
  onOpenSettings: () => void
}

export function ChatSidebar({ onOpenSettings }: ChatSidebarProps) {
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
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">Open WebUI</span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => createNewSession()}
            title={t("chat.sidebar.newChat")}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={t("chat.sidebar.searchPlaceholder")}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {pinnedSessions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("chat.sidebar.pinned")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {pinnedSessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <ChatHistoryItem
                      session={session}
                      isActive={session.id === activeSessionId}
                      onSelect={selectSession}
                      onRename={renameSession}
                      onTogglePin={togglePinSession}
                      onDelete={deleteSession}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {unpinnedSessions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("chat.sidebar.recent")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {unpinnedSessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <ChatHistoryItem
                      session={session}
                      isActive={session.id === activeSessionId}
                      onSelect={selectSession}
                      onRename={renameSession}
                      onTogglePin={togglePinSession}
                      onDelete={deleteSession}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredSessions.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
            <Search className="h-8 w-8" />
            <p className="text-sm">{t("chat.header.noModelFound")}</p>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter>
        <ChatUserFooter onOpenSettings={onOpenSettings} />
      </SidebarFooter>
    </Sidebar>
  )
}
