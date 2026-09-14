import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  Sparkles,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import { Button } from "#/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "../../types"
import { ThinkingAccordion } from "./thinking-accordion"
import { CodeBlock } from "./code-block"
import { AVAILABLE_MODELS } from "../../hooks/use-chat-store"

interface AssistantMessageProps {
  message: ChatMessage
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = React.useState(false)
  const [feedback, setFeedback] = React.useState<"good" | "bad" | null>(null)

  const modelName = AVAILABLE_MODELS.find((m) => m.id === message.model)?.name ?? message.model

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    toast.success(t("chat.messages.copySuccess"))
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2 group/msg">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-1 max-w-[80%] min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{modelName}</span>
          {message.thinking && !message.isStreaming && (
            <span className="text-[10px]">
              {t("chat.messages.thoughtDuration", {
                seconds: message.thinkingDuration,
              })}
            </span>
          )}
        </div>

        {message.thinking && (
          <ThinkingAccordion
            content={message.thinking}
            duration={message.thinkingDuration}
            isStreaming={message.isStreaming}
          />
        )}

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")
                const isBlock = String(children).includes("\n")
                if (isBlock) {
                  return (
                    <CodeBlock language={match?.[1]}>
                      {String(children).replace(/\n$/, "")}
                    </CodeBlock>
                  )
                }
                return (
                  <code
                    className={cn("rounded bg-muted px-1.5 py-0.5 text-sm", className)}
                    {...props}
                  >
                    {children}
                  </code>
                )
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {message.isStreaming && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span>Generating...</span>
          </div>
        )}

        {!message.isStreaming && message.content && (
          <div className="flex items-center gap-1 mt-1">
            <Button variant="ghost" size="icon-sm" className="h-6 w-6" onClick={handleCopy}>
              <Copy className={cn("h-3.5 w-3.5", copied && "text-green-500")} />
            </Button>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn("h-6 w-6", feedback === "good" && "text-green-500")}
              onClick={() => setFeedback(feedback === "good" ? null : "good")}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn("h-6 w-6", feedback === "bad" && "text-red-500")}
              onClick={() => setFeedback(feedback === "bad" ? null : "bad")}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6">
              <Volume2 className="h-3.5 w-3.5" />
            </Button>

            {message.totalTokens && message.tokensPerSecond && (
              <span className="ml-2 text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                {message.tokensPerSecond} tokens/s
                {" · "}
                {message.totalTokens} tokens
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
