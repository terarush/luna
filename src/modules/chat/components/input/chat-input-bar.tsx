import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  ArrowUp,
  Square,
  Paperclip,
  Globe,
  Brain,
  Mic,
} from "lucide-react"
import { Button } from "#/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "#/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useChatStore } from "../../hooks/use-chat-store"
import { ChatAttachmentPreview } from "./chat-attachment-preview"

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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
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

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)
      const ta = e.target
      ta.style.height = "auto"
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px"
    },
    []
  )

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

  return (
    <div className="border-t bg-background">
      <div className="mx-auto max-w-4xl px-4 py-3">
        <div className="rounded-2xl border bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring/20 transition-shadow">
          <ChatAttachmentPreview />

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.input.placeholder")}
            rows={1}
            className="w-full resize-none bg-transparent px-4 pt-3 pb-1 text-sm outline-none placeholder:text-muted-foreground min-h-[44px] max-h-[200px]"
          />

          <div className="flex items-center justify-between px-3 pb-2">
            <div className="flex items-center gap-0.5">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-7 w-7"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("chat.input.attachFile")}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={cn(
                      "h-7 w-7",
                      isWebSearchEnabled && "text-primary bg-primary/10"
                    )}
                    onClick={toggleWebSearch}
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isWebSearchEnabled
                    ? t("chat.input.webSearchActive")
                    : t("chat.input.webSearch")}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={cn(
                      "h-7 w-7",
                      isReasoningEnabled && "text-primary bg-primary/10"
                    )}
                    onClick={toggleReasoning}
                  >
                    <Brain className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isReasoningEnabled
                    ? t("chat.input.deepThinkActive")
                    : t("chat.input.deepThink")}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("chat.input.voiceInput")}</TooltipContent>
              </Tooltip>
            </div>

            {isGenerating ? (
              <Button
                size="icon-sm"
                variant="destructive"
                className="h-7 w-7"
                onClick={stopGeneration}
              >
                <Square className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                size="icon-sm"
                className="h-7 w-7 rounded-full"
                disabled={!input.trim()}
                onClick={handleSend}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          {t("chat.input.disclaimer")}
        </p>
      </div>
    </div>
  )
}
