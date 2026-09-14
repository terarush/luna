import * as React from "react"
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar"
import { TooltipProvider } from "#/components/ui/tooltip"
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
  const { sendMessage } = useChatStore()

  const handleSendPrompt = React.useCallback(
    (prompt: string) => {
      sendMessage(prompt)
    },
    [sendMessage]
  )

  return (
    <TooltipProvider>
      <SidebarProvider>
        <ChatSidebar onOpenSettings={() => setSettingsOpen(true)} />
        <SidebarInset className="flex flex-col h-screen">
          <ChatHeader onOpenParameters={() => setParamsOpen(true)} />
          <ChatMessagesContainer onSendPrompt={handleSendPrompt} />
          <ChatInputBar />
        </SidebarInset>
        <ChatParametersSheet open={paramsOpen} onOpenChange={setParamsOpen} />
        <ChatSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </SidebarProvider>
    </TooltipProvider>
  )
}
