import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"
import { cn } from "@/lib/utils"

function TooltipRoot(props: React.ComponentProps<typeof BaseTooltip.Root>) {
  return <BaseTooltip.Root {...props} />
}

function TooltipTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Trigger>) {
  return (
    <BaseTooltip.Trigger className={cn("inline-flex", className)} {...props} />
  )
}

function TooltipContent({
  className,
  sideOffset = 6,
  side,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Popup> & {
  sideOffset?: number
  side?: "top" | "bottom" | "left" | "right"
}) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} sideOffset={sideOffset}>
        <BaseTooltip.Popup
          className={cn(
            "z-50 max-w-xs rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-lg shadow-zinc-950/5",
            "data-[starting-style]:animate-fade-in",
            "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-black/30",
            className
          )}
          {...props}
        />
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}

export { TooltipRoot, TooltipTrigger, TooltipContent }