import * as React from "react"
import { useTranslation } from "react-i18next"
import { ArrowDown } from "lucide-react"
import { Button } from "#/components/ui/button"
import { useChatStore } from "../../hooks/use-chat-store"
import { ChatMessageItem } from "./chat-message-item"
import { ChatEmptyState } from "./chat-empty-state"

interface ChatMessagesContainerProps {
  onSendPrompt: (prompt: string) => void
}

export function ChatMessagesContainer({ onSendPrompt }: ChatMessagesContainerProps) {
  const { t } = useTranslation()
  const { sessions, activeSessionId, isGenerating } = useChatStore()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = React.useState(false)

  const activeSession = sessions.find((s) => s.id === activeSessionId)
  const messages = activeSession?.messages ?? []

  const scrollToBottom = React.useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [])

  React.useEffect(() => {
    if (isGenerating) {
      scrollToBottom()
    }
  }, [isGenerating, messages.length, scrollToBottom])

  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }, [])

  if (messages.length === 0) {
    return <ChatEmptyState onSendPrompt={onSendPrompt} />
  }

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scroll-fade-b"
      >
        <div className="mx-auto max-w-4xl flex flex-col gap-6 px-4 py-6">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {t("chat.input.stop")}
            </div>
          )}
        </div>
      </div>

      {showScrollButton && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <Button
            size="icon-sm"
            variant="secondary"
            className="rounded-full shadow-md border"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
