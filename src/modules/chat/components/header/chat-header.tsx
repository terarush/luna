import { useTranslation } from "react-i18next"
import { Plus, Share2, SlidersHorizontal, Sun, Moon } from "lucide-react"
import { Button } from "#/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "#/components/ui/tooltip"
import { SidebarTrigger } from "#/components/ui/sidebar"
import { useTheme } from "@/components/theme-provider"
import { useChatStore } from "../../hooks/use-chat-store"
import { ModelSelector } from "./model-selector"
import { toast } from "sonner"

interface ChatHeaderProps {
  onOpenParameters: () => void
}

export function ChatHeader({ onOpenParameters }: ChatHeaderProps) {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { createNewSession } = useChatStore()

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success(t("chat.messages.copySuccess"))
  }

  return (
    <header className="flex items-center justify-between border-b px-3 py-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <ModelSelector />
      </div>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={onOpenParameters}>
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("chat.header.parameters")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("chat.header.share")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={() => createNewSession()}>
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("chat.header.newChatTooltip")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("chat.settings.theme")}</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
