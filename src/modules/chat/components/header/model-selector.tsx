import * as React from "react"
import { useTranslation } from "react-i18next"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "#/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "#/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover"
import { cn } from "@/lib/utils"
import { useChatStore, AVAILABLE_MODELS } from "../../hooks/use-chat-store"

export function ModelSelector() {
  const { t } = useTranslation()
  const { selectedModel, setSelectedModel } = useChatStore()
  const [open, setOpen] = React.useState(false)

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="gap-1.5 px-2 h-8">
          <span className="text-sm font-medium truncate max-w-[140px]">
            {currentModel?.name ?? selectedModel}
          </span>
          {currentModel && (
            <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded px-1 py-0.5">
              {currentModel.tag}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder={t("chat.header.searchModel")} />
          <CommandList>
            <CommandEmpty>{t("chat.header.noModelFound")}</CommandEmpty>
            <CommandGroup>
              {AVAILABLE_MODELS.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    setSelectedModel(model.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{model.name}</span>
                      <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded px-1 py-0.5">
                        {model.tag}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {model.description}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      model.id === selectedModel ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
