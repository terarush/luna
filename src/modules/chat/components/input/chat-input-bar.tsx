import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  ArrowUp,
  Square,
  Paperclip,
  Globe,
  BrainCircuit,
  Mic,
} from "lucide-react"
import { useChatStore } from "../../hooks/use-chat-store"
import { ChatAttachmentPreview } from "./chat-attachment-preview"
import { cn } from "@/lib/utils"

export function ChatInputBar() {
  const { t } = useTranslation()
  const {
    isGenerating,
    isWebSearchEnabled,
    isReasoningEnabled,
    toggleWebSearch,
    toggleReasoning,
    sendMessage,
    stopGeneration,
    addAttachment,
  } = useChatStore()

  const [input, setInput] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleSend = React.useCallback(() => {
    if (!input.trim()) return
    sendMessage(input)
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }, [input, sendMessage])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleInput = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px"
  }, [])

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return
      for (const file of Array.from(files)) {
        addAttachment({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        })
      }
      e.target.value = ""
    },
    [addAttachment]
  )

  const toolButtonClass = (active = false) =>
    cn(
      "flex size-8 shrink-0 items-center justify-center rounded-lg outline-none transition-all duration-150",
      active
        ? "bg-zinc-950 text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200",
      "focus-visible:ring-2 focus-visible:ring-zinc-400/50"
    )

  return (
    <div className="shrink-0 border-t border-zinc-200/70 bg-gradient-to-b from-transparent to-zinc-100/60 px-3 pb-3 pt-2 dark:border-zinc-800/70 dark:to-zinc-950/40 sm:px-4">
      <div className="mx-auto max-w-3xl">
        <div
          className={cn(
            "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg shadow-zinc-950/4 transition-all duration-200",
            "focus-within:border-zinc-300 focus-within:shadow-zinc-950/8 focus-within:ring-4 focus-within:ring-zinc-500/10",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-zinc-600"
          )}
        >
          <ChatAttachmentPreview />

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.input.placeholder")}
            rows={1}
            className="block max-h-[200px] w-full resize-none bg-transparent px-4 pb-0.5 pt-3.5 text-[14px] leading-relaxed text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />

          <div className="flex items-center justify-between px-2.5 pb-2.5 pt-1">
            <div className="flex items-center gap-0.5">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={toolButtonClass()}
                aria-label={t("chat.input.attachFile")}
                title={t("chat.input.attachFile")}
              >
                <Paperclip className="size-4" />
              </button>
              <button
                onClick={toggleWebSearch}
                className={toolButtonClass(isWebSearchEnabled)}
                aria-label={
                  isWebSearchEnabled
                    ? t("chat.input.webSearchActive")
                    : t("chat.input.webSearch")
                }
                title={
                  isWebSearchEnabled
                    ? t("chat.input.webSearchActive")
                    : t("chat.input.webSearch")
                }
              >
                <Globe className="size-4" />
              </button>
              <button
                onClick={toggleReasoning}
                className={toolButtonClass(isReasoningEnabled)}
                aria-label={
                  isReasoningEnabled
                    ? t("chat.input.deepThinkActive")
                    : t("chat.input.deepThink")
                }
                title={
                  isReasoningEnabled
                    ? t("chat.input.deepThinkActive")
                    : t("chat.input.deepThink")
                }
              >
                <BrainCircuit className="size-4" />
              </button>
              <button
                className={toolButtonClass()}
                aria-label={t("chat.input.voiceInput")}
                title={t("chat.input.voiceInput")}
              >
                <Mic className="size-4" />
              </button>
            </div>

            {isGenerating ? (
              <button
                onClick={stopGeneration}
                className="flex h-8.5 items-center gap-1.5 rounded-full bg-zinc-950 px-3.5 text-[12.5px] font-medium text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                aria-label={t("chat.input.stop")}
                title={t("chat.input.stop")}
              >
                <Square className="size-3 fill-current" />
                Stop
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  "flex size-8.5 items-center justify-center rounded-full bg-zinc-950 text-white shadow-sm transition-all duration-150",
                  "hover:bg-zinc-800 active:scale-95",
                  "disabled:pointer-events-none disabled:opacity-35",
                  "dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                )}
                aria-label={t("chat.input.send")}
                title={t("chat.input.send")}
              >
                <ArrowUp className="size-4" strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
          {t("chat.input.disclaimer")}
        </p>
      </div>
    </div>
  )
}