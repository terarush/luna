import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "#/components/ui/sheet"
import { Button } from "#/components/ui/button"
import { Label } from "#/components/ui/label"
import { Slider } from "#/components/ui/slider"
import { Textarea } from "#/components/ui/textarea"
import { useChatStore } from "../../hooks/use-chat-store"

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

  const handleReset = () => {
    setLocal(DEFAULTS)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[340px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("chat.parameters.title")}</SheetTitle>
          <SheetDescription>{t("chat.parameters.description")}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6 px-4">
          <div className="space-y-2">
            <Label>{t("chat.parameters.systemPrompt")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("chat.parameters.systemPromptDesc")}
            </p>
            <Textarea
              value={local.systemPrompt}
              onChange={(e) => setLocal({ ...local, systemPrompt: e.target.value })}
              rows={3}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("chat.parameters.temperature")}</Label>
              <span className="text-sm font-mono text-muted-foreground">
                {local.temperature.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("chat.parameters.temperatureDesc")}
            </p>
            <Slider
              value={[local.temperature]}
              onValueChange={(v) => setLocal({ ...local, temperature: Array.isArray(v) ? v[0] : v })}
              min={0}
              max={2}
              step={0.05}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("chat.parameters.contextLength")}</Label>
              <span className="text-sm font-mono text-muted-foreground">
                {local.contextLength.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[local.contextLength]}
              onValueChange={(v) => setLocal({ ...local, contextLength: Array.isArray(v) ? v[0] : v })}
              min={2048}
              max={131072}
              step={1024}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("chat.parameters.topP")}</Label>
              <span className="text-sm font-mono text-muted-foreground">
                {local.topP.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[local.topP]}
              onValueChange={(v) => setLocal({ ...local, topP: Array.isArray(v) ? v[0] : v })}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={handleReset}>
            {t("chat.parameters.reset")}
          </Button>
          <Button onClick={handleSave}>{t("chat.parameters.apply")}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
