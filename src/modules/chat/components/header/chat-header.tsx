import { useTranslation } from "react-i18next"
import { PanelLeft, SlidersHorizontal, Share2, SquarePen, Sun, Moon } from "lucide-react"
import { toast } from "sonner"
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { useChatStore } from "../../hooks/use-chat-store"
import { useTheme } from "@/shared/theme-provider"
import { ModelSelector } from "./model-selector"

interface ChatHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onOpenParameters: () => void
}

const iconButtonClass =
  "flex size-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"

export function ChatHeader({
  sidebarOpen,
  onToggleSidebar,
  onOpenParameters,
}: ChatHeaderProps) {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  const { createNewSession } = useChatStore()

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success(t("chat.messages.copySuccess"))
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white/80 px-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70">
      <div className="flex items-center gap-1">
        <TooltipRoot>
          <TooltipTrigger
            className={iconButtonClass}
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          </TooltipContent>
        </TooltipRoot>
        <ModelSelector />
      </div>

      <div className="flex items-center gap-0.5">
        <TooltipRoot>
          <TooltipTrigger
            className={iconButtonClass}
            onClick={onOpenParameters}
            aria-label={t("chat.header.parameters")}
          >
            <SlidersHorizontal className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {t("chat.header.parameters")}
          </TooltipContent>
        </TooltipRoot>

        <TooltipRoot>
          <TooltipTrigger
            className={iconButtonClass}
            onClick={handleShare}
            aria-label={t("chat.header.share")}
          >
            <Share2 className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {t("chat.header.share")}
          </TooltipContent>
        </TooltipRoot>

        <TooltipRoot>
          <TooltipTrigger
            className={iconButtonClass}
            onClick={() => createNewSession()}
            aria-label={t("chat.header.newChatTooltip")}
          >
            <SquarePen className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {t("chat.header.newChatTooltip")}
          </TooltipContent>
        </TooltipRoot>

        <div className="mx-1.5 h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

        <TooltipRoot>
          <TooltipTrigger
            className={iconButtonClass}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={t("chat.settings.theme")}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {t("chat.settings.theme")}
          </TooltipContent>
        </TooltipRoot>
      </div>
    </header>
  )
}