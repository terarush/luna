import { useTranslation } from "react-i18next"
import { Brain, ChevronRight, Loader2 } from "lucide-react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleInner,
} from "@/components/ui/collapsible"

interface ThinkingAccordionProps {
  content: string
  duration?: number
  isStreaming?: boolean
}

export function ThinkingAccordion({ content, duration, isStreaming }: ThinkingAccordionProps) {
  const { t } = useTranslation()

  return (
    <Collapsible className="my-1.5 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/60">
      <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60">
        <Brain className="size-3.5 shrink-0 text-zinc-400" />
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
          {t("chat.messages.thoughtTitle")}
        </span>
        {duration && !isStreaming && (
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
            {t("chat.messages.thoughtDuration", { seconds: duration })}
          </span>
        )}
        {isStreaming && (
          <span className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
            <Loader2 className="size-3 animate-spin" />
            Thinking
          </span>
        )}
        <ChevronRight className="ml-auto size-3.5 shrink-0 text-zinc-400 transition-transform duration-200 data-[panel-open]:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CollapsibleInner>
          <p className="border-t border-zinc-100 px-3 py-2.5 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            {content}
          </p>
        </CollapsibleInner>
      </CollapsibleContent>
    </Collapsible>
  )
}