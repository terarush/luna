import * as React from "react"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import { ChatSidebar } from "./components/sidebar/chat-sidebar"
import { ChatHeader } from "./components/header/chat-header"
import { ChatMessagesContainer } from "./components/messages/chat-messages-container"
import { ChatInputBar } from "./components/input/chat-input-bar"
import { ChatParametersSheet } from "./components/modals/chat-parameters-sheet"
import { ChatSettingsDialog } from "./components/modals/chat-settings-dialog"
import { ApiSetupDialog } from "./components/modals/api-setup-dialog"
import { ModelViewerPanel } from "@/components/model-viewer-panel"
import { useChatStore } from "./hooks/use-chat-store"

export default function ChatPage() {
  const [paramsOpen, setParamsOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { fetchModels, apiBaseUrl, apiKey } = useChatStore()
  const [setupOpen, setSetupOpen] = React.useState(false)

  const needsSetup = !apiBaseUrl && !apiKey

  // Desktop: open by default. Mobile: closed by default.
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile)

  // Fetch models on mount
  React.useEffect(() => {
    if (apiBaseUrl) {
      fetchModels()
    } else if (needsSetup) {
      setSetupOpen(true)
    }
  }, [fetchModels, apiBaseUrl, needsSetup])

  const { sendMessage } = useChatStore()

  const handleSendPrompt = React.useCallback(
    (prompt: string) => {
      sendMessage(prompt)
    },
    [sendMessage]
  )

  // On mobile, close sidebar after selecting a session
  const handleSidebarClose = React.useCallback(() => {
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  return (
    <Box sx={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
      <ChatSidebar
        open={sidebarOpen}
        isMobile={isMobile}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onOpenSettings={() => setSettingsOpen(true)}
        onSessionSelect={handleSidebarClose}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          width: "100%",
        }}
      >
        <ChatHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenParameters={() => setParamsOpen(true)}
        />
        <Box sx={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
          {!isMobile && (
            <Box sx={{ width: "50%", borderRight: "1px solid", borderColor: "divider" }}>
              <ModelViewerPanel />
            </Box>
          )}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              maxWidth: isMobile ? "100%" : undefined,
            }}
          >
            <ChatMessagesContainer onSendPrompt={handleSendPrompt} />
            <ChatInputBar />
          </Box>
        </Box>
      </Box>
      <ChatParametersSheet open={paramsOpen} onOpenChange={setParamsOpen} />
      <ChatSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <ApiSetupDialog open={setupOpen} onClose={() => setSetupOpen(false)} />
    </Box>
  )
}