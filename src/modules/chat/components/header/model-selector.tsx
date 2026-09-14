import * as React from "react"
import { useTranslation } from "react-i18next"
import { Check, ChevronDown, Search, Sparkles } from "lucide-react"
import { Popover } from "@base-ui/react/popover"
import { useChatStore, AVAILABLE_MODELS } from "../../hooks/use-chat-store"
import { cn } from "@/lib/utils"

export function ModelSelector() {
  const { t } = useTranslation()
  const { selectedModel, setSelectedModel } = useChatStore()
  const [search, setSearch] = React.useState("")

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel)

  const filteredModels = React.useMemo(() => {
    if (!search.trim()) return AVAILABLE_MODELS
    const q = search.toLowerCase()
    return AVAILABLE_MODELS.filter(
      (m) => m.name.toLowerCase().includes(q) || m.tag.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <Popover.Root>
      <Popover.Trigger
        className="flex h-8 items-center gap-2 rounded-lg px-2.5 text-left outline-none transition-colors hover:bg-zinc-100 focus-visible:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800"
        aria-label={t("chat.header.selectModel")}
      >
        <span className="flex size-4 items-center justify-center">
          <Sparkles className="size-3.5 text-zinc-500 dark:text-zinc-300" />
        </span>
        <span className="max-w-[10rem] truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
          {currentModel?.name ?? selectedModel}
        </span>
        <span className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-px text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {currentModel?.tag}
        </span>
        <ChevronDown className="size-3.5 text-zinc-400 transition-transform data-[open]:rotate-180" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner align="start" sideOffset={6}>
          <Popover.Popup className="z-50 w-80 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl shadow-zinc-950/8 data-[starting-style]:animate-scale-in dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40">
            <div className="relative mb-1.5">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("chat.header.searchModel")}
                className="h-8 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-2 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-400/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
              />
            </div>

            <div className="max-h-72 overflow-y-auto pb-1">
              {filteredModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id)
                    setSearch("")
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left outline-none transition-colors",
                    "hover:bg-zinc-100 focus-visible:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800",
                    model.id === selectedModel && "bg-zinc-100 dark:bg-zinc-800"
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                      {model.name}
                    </span>
                    <span className="block truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                      {model.description}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-md border border-zinc-200 px-1.5 py-px text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:text-zinc-300">
                    {model.tag}
                  </span>
                  {model.id === selectedModel && (
                    <Check className="size-4 shrink-0 text-zinc-800 dark:text-zinc-100" />
                  )}
                </button>
              ))}
              {filteredModels.length === 0 && (
                <p className="px-2.5 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
                  {t("chat.header.noModelFound")}
                </p>
              )}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}