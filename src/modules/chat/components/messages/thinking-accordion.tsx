import * as React from "react"
import { useTranslation } from "react-i18next"
import { Brain, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThinkingAccordionProps {
  content: string
  duration?: number
  isStreaming?: boolean
}

export function ThinkingAccordion({
  content,
  duration,
  isStreaming,
}: ThinkingAccordionProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="my-2 rounded-lg border border-border/50 bg-muted/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Brain className="h-4 w-4 shrink-0" />
        <span className="font-medium">{t("chat.messages.thoughtTitle")}</span>
        {duration && !isStreaming && (
          <span className="text-xs">
            {t("chat.messages.thoughtDuration", { seconds: duration })}
          </span>
        )}
        {isStreaming && (
          <span className="flex items-center gap-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Thinking...
          </span>
        )}
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 ml-auto transition-transform shrink-0",
            isOpen && "rotate-90"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-3 pb-3 border-t border-border/30">
          <p className="text-sm text-muted-foreground/80 whitespace-pre-wrap font-mono mt-2 leading-relaxed">
            {content}
          </p>
        </div>
      )}
    </div>
  )
}
