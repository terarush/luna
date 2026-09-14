import { useTranslation } from "react-i18next"
import { Sparkles, Code, Brain, Lightbulb, LayoutGrid } from "lucide-react"
import { Button } from "#/components/ui/button"
import { useChatStore, AVAILABLE_MODELS } from "../../hooks/use-chat-store"

interface ChatEmptyStateProps {
  onSendPrompt: (prompt: string) => void
}

const PROMPTS = [
  { icon: Code, titleKey: "chat.emptyState.prompt1Title", descKey: "chat.emptyState.prompt1Desc" },
  { icon: Lightbulb, titleKey: "chat.emptyState.prompt2Title", descKey: "chat.emptyState.prompt2Desc" },
  { icon: Brain, titleKey: "chat.emptyState.prompt3Title", descKey: "chat.emptyState.prompt3Desc" },
  { icon: LayoutGrid, titleKey: "chat.emptyState.prompt4Title", descKey: "chat.emptyState.prompt4Desc" },
]

export function ChatEmptyState({ onSendPrompt }: ChatEmptyStateProps) {
  const { t } = useTranslation()
  const { selectedModel } = useChatStore()
  const model = AVAILABLE_MODELS.find((m) => m.id === selectedModel)

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-12 max-w-2xl mx-auto w-full">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">{t("chat.emptyState.title")}</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          {t("chat.emptyState.subtitle")}{" "}
          <span className="font-medium text-foreground">{model?.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {PROMPTS.map((prompt) => {
          const Icon = prompt.icon
          return (
            <Button
              key={prompt.titleKey}
              variant="outline"
              className="h-auto justify-start gap-3 p-4 text-left"
              onClick={() => onSendPrompt(t(prompt.titleKey))}
            >
              <Icon className="h-5 w-5 shrink-0 text-primary" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{t(prompt.titleKey)}</span>
                <span className="text-xs text-muted-foreground">{t(prompt.descKey)}</span>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
