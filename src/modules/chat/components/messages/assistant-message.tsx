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
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import type { ChatMessage } from "../../types"
import { ThinkingAccordion } from "./thinking-accordion"
import { CodeBlock } from "./code-block"
import { AVAILABLE_MODELS } from "../../hooks/use-chat-store"
import { cn } from "@/lib/utils"

interface AssistantMessageProps {
  message: ChatMessage
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  const { t } = useTranslation()
  const [feedback, setFeedback] = React.useState<"good" | "bad" | null>(null)

  const modelName = AVAILABLE_MODELS.find((m) => m.id === message.model)?.name ?? message.model

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    toast.success(t("chat.messages.copySuccess"))
  }

  return (
    <div className="group flex gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-950">
        <Sparkles className="size-3.5" strokeWidth={2.2} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500">
          {modelName}
        </p>

        {message.thinking && (
          <ThinkingAccordion
            content={message.thinking}
            duration={message.thinkingDuration}
            isStreaming={message.isStreaming}
          />
        )}

        <div className="prose-chat min-w-0">
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")
                const isBlock = String(children).includes("\n")
                if (isBlock) {
                  return <CodeBlock language={match?.[1]}>{String(children).replace(/\n$/, "")}</CodeBlock>
                }
                return (
                  <code className={className} {...props}>
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
          <div className="mt-1 flex items-center gap-1.5 pl-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            <span className="animate-pulse-dot size-1.5 rounded-full bg-zinc-400" />
            Generating
            <span className="animate-pulse-dot size-1.5 rounded-full bg-zinc-400" style={{ animationDelay: "0.2s" }} />
            <span className="animate-pulse-dot size-1.5 rounded-full bg-zinc-400" style={{ animationDelay: "0.4s" }} />
          </div>
        )}

        {!message.isStreaming && message.content && (
          <div
            className={cn(
              "mt-1.5 flex items-center gap-0.5 text-zinc-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100 dark:text-zinc-500"
            )}
          >
            <button
              onClick={handleCopy}
              className="flex size-6.5 items-center justify-center rounded-md transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label={t("chat.messages.copyCode")}
            >
              <Copy className="size-3" />
            </button>
            <button
              className="flex size-6.5 items-center justify-center rounded-md transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label={t("chat.messages.regenerate")}
            >
              <RotateCcw className="size-3" />
            </button>
            <button
              onClick={() => setFeedback(feedback === "good" ? null : "good")}
              className={cn(
                "flex size-6.5 items-center justify-center rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
                feedback === "good"
                  ? "text-zinc-950 dark:text-zinc-50"
                  : "hover:text-zinc-700 dark:hover:text-zinc-200"
              )}
              aria-label={t("chat.messages.goodResponse")}
            >
              <ThumbsUp className="size-3" />
            </button>
            <button
              onClick={() => setFeedback(feedback === "bad" ? null : "bad")}
              className={cn(
                "flex size-6.5 items-center justify-center rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
                feedback === "bad"
                  ? "text-zinc-950 dark:text-zinc-50"
                  : "hover:text-zinc-700 dark:hover:text-zinc-200"
              )}
              aria-label={t("chat.messages.badResponse")}
            >
              <ThumbsDown className="size-3" />
            </button>
            <button
              className="flex size-6.5 items-center justify-center rounded-md transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label={t("chat.messages.readAloud")}
            >
              <Volume2 className="size-3" />
            </button>

            {message.totalTokens && message.tokensPerSecond && (
              <span className="ml-1.5 rounded-md px-1.5 py-px font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                {message.tokensPerSecond} tok/s · {message.totalTokens} tok
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}