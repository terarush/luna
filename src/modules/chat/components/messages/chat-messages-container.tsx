import * as React from "react"
import { useTranslation } from "react-i18next"
import { ArrowDown, Sparkles } from "lucide-react"
import { useChatStore } from "../../hooks/use-chat-store"
import { ChatMessageItem } from "./chat-message-item"
import { ChatEmptyState } from "./chat-empty-state"
import { cn } from "@/lib/utils"

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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [])

  React.useEffect(() => {
    if (isGenerating) scrollToBottom()
  }, [isGenerating, messages.length, scrollToBottom])

  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setShowScrollButton(el.scrollHeight - el.scrollTop - el.clientHeight > 100)
  }, [])

  if (messages.length === 0) {
    return <ChatEmptyState onSendPrompt={onSendPrompt} />
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
          {isGenerating && (
            <div className="flex items-center gap-2.5 pl-0.5">
              <div className="flex items-center gap-1">
                <span className="animate-pulse-dot size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                <span
                  className="animate-pulse-dot size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="animate-pulse-dot size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
              <span className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                <Sparkles className="size-3" />
                {t("chat.input.stop")}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={scrollToBottom}
        className={cn(
          "absolute bottom-4 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-lg shadow-zinc-950/8 transition-all duration-200",
          "hover:bg-zinc-50 hover:text-zinc-800 active:scale-95",
          "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-50",
          showScrollButton
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        )}
        aria-label="Scroll to bottom"
      >
        <ArrowDown className="size-4" />
      </button>
    </div>
  )
}