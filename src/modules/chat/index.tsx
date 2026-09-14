import * as React from "react"
import { ChatSidebar } from "./components/sidebar/chat-sidebar"
import { ChatHeader } from "./components/header/chat-header"
import { ChatMessagesContainer } from "./components/messages/chat-messages-container"
import { ChatInputBar } from "./components/input/chat-input-bar"
import { ChatParametersSheet } from "./components/modals/chat-parameters-sheet"
import { ChatSettingsDialog } from "./components/modals/chat-settings-dialog"
import { useChatStore } from "./hooks/use-chat-store"

export default function ChatPage() {
  const [paramsOpen, setParamsOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const { sendMessage } = useChatStore()

  const handleSendPrompt = React.useCallback(
    (prompt: string) => {
      sendMessage(prompt)
    },
    [sendMessage]
  )

  return (
    <div className="flex h-dvh overflow-hidden">
      <ChatSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenParameters={() => setParamsOpen(true)}
        />
        <ChatMessagesContainer onSendPrompt={handleSendPrompt} />
        <ChatInputBar />
      </div>
      <ChatParametersSheet open={paramsOpen} onOpenChange={setParamsOpen} />
      <ChatSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}