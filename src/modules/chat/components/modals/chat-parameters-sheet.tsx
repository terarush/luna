import * as React from "react"
import { useTranslation } from "react-i18next"
import { X, RotateCcw, Check } from "lucide-react"
import { Dialog } from "@base-ui/react/dialog"
import { useChatStore } from "../../hooks/use-chat-store"
import {
  Slider,
  SliderControl,
  SliderTrack,
  SliderThumb,
} from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface ChatParametersSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEFAULTS = {
  systemPrompt: "You are a helpful, knowledgeable, and concise AI assistant.",
  temperature: 0.7,
  contextLength: 4096,
  topP: 0.9,
  topK: 40,
}

export function ChatParametersSheet({ open, onOpenChange }: ChatParametersSheetProps) {
  const { t } = useTranslation()
  const { parameters, updateParameters } = useChatStore()
  const [local, setLocal] = React.useState(parameters)

  React.useEffect(() => {
    if (open) setLocal(parameters)
  }, [open, parameters])

  const handleSave = () => {
    updateParameters(local)
    onOpenChange(false)
  }

  const handleReset = () => setLocal(DEFAULTS)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-zinc-950/25 backdrop-blur-[2px] data-[starting-style]:animate-fade-in data-[ending-style]:animate-fade-in dark:bg-zinc-950/45" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl shadow-zinc-950/10 outline-none data-[starting-style]:animate-slide-in-right data-[ending-style]:animate-slide-out-right dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/50">
          <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <div>
              <Dialog.Title className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t("chat.parameters.title")}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {t("chat.parameters.description")}
              </Dialog.Description>
            </div>
            <Dialog.Close className="flex size-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                {t("chat.parameters.systemPrompt")}
              </label>
              <p className="mb-2 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {t("chat.parameters.systemPromptDesc")}
              </p>
              <textarea
                value={local.systemPrompt}
                onChange={(e) => setLocal({ ...local, systemPrompt: e.target.value })}
                rows={3}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-[13px] leading-relaxed text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:focus:border-zinc-500"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                  {t("chat.parameters.temperature")}
                </label>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {local.temperature.toFixed(2)}
                </span>
              </div>
              <p className="mb-2.5 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {t("chat.parameters.temperatureDesc")}
              </p>
              <Slider.Root
                min={0}
                max={2}
                step={0.05}
                value={local.temperature}
                onValueChange={(value) => setLocal({ ...local, temperature: value })}
              >
                <SliderControl>
                  <SliderTrack>
                    <Slider.Indicator className="absolute h-full rounded-full bg-zinc-950 dark:bg-zinc-100" />
                    <SliderThumb />
                  </SliderTrack>
                </SliderControl>
              </Slider.Root>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                  {t("chat.parameters.contextLength")}
                </label>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {local.contextLength.toLocaleString()}
                </span>
              </div>
              <Slider.Root
                min={2048}
                max={131072}
                step={1024}
                value={local.contextLength}
                onValueChange={(value) => setLocal({ ...local, contextLength: value })}
              >
                <SliderControl>
                  <SliderTrack>
                    <Slider.Indicator className="absolute h-full rounded-full bg-zinc-950 dark:bg-zinc-100" />
                    <SliderThumb />
                  </SliderTrack>
                </SliderControl>
              </Slider.Root>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                  {t("chat.parameters.topP")}
                </label>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {local.topP.toFixed(2)}
                </span>
              </div>
              <Slider.Root
                min={0}
                max={1}
                step={0.05}
                value={local.topP}
                onValueChange={(value) => setLocal({ ...local, topP: value })}
              >
                <SliderControl>
                  <SliderTrack>
                    <Slider.Indicator className="absolute h-full rounded-full bg-zinc-950 dark:bg-zinc-100" />
                    <SliderThumb />
                  </SliderTrack>
                </SliderControl>
              </Slider.Root>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-zinc-100 px-5 py-3.5 dark:border-zinc-800">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="size-3.5" />
              {t("chat.parameters.reset")}
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              <Check className="size-3.5" />
              {t("chat.parameters.apply")}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}