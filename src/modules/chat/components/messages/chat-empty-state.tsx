import { useTranslation } from "react-i18next"
import { Code2, Lightbulb, BrainCircuit, Boxes, ArrowUpRight } from "lucide-react"
import { useChatStore, AVAILABLE_MODELS } from "../../hooks/use-chat-store"

interface ChatEmptyStateProps {
  onSendPrompt: (prompt: string) => void
}

const PROMPTS = [
  { icon: Code2, titleKey: "chat.emptyState.prompt1Title", descKey: "chat.emptyState.prompt1Desc" },
  { icon: Lightbulb, titleKey: "chat.emptyState.prompt2Title", descKey: "chat.emptyState.prompt2Desc" },
  { icon: BrainCircuit, titleKey: "chat.emptyState.prompt3Title", descKey: "chat.emptyState.prompt3Desc" },
  { icon: Boxes, titleKey: "chat.emptyState.prompt4Title", descKey: "chat.emptyState.prompt4Desc" },
]

export function ChatEmptyState({ onSendPrompt }: ChatEmptyStateProps) {
  const { t } = useTranslation()
  const { selectedModel } = useChatStore()
  const model = AVAILABLE_MODELS.find((m) => m.id === selectedModel)

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-4 py-10">
      <div className="animate-fade-in flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg shadow-zinc-950/15 dark:bg-zinc-100 dark:text-zinc-950">
          <Code2 className="size-5" strokeWidth={2.2} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {t("chat.emptyState.title")}
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t("chat.emptyState.subtitle")}{" "}
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {model?.name}
          </span>
        </p>
      </div>

      <div className="grid w-full max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-2">
        {PROMPTS.map((prompt, i) => {
          const Icon = prompt.icon
          return (
            <button
              key={prompt.titleKey}
              onClick={() => onSendPrompt(t(prompt.titleKey))}
              className="group animate-slide-in-up flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-left outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-950/5 focus-visible:ring-2 focus-visible:ring-zinc-400/50 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-950">
                <Icon className="size-4" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                  {t(prompt.titleKey)}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {t(prompt.descKey)}
                </span>
              </span>
              <ArrowUpRight className="size-3.5 shrink-0 text-zinc-300 opacity-0 transition-all group-hover:text-zinc-800 group-hover:opacity-100 dark:text-zinc-600 dark:group-hover:text-zinc-100" />
            </button>
          )
        })}
      </div>
    </div>
  )
}