import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"

const Dialog = BaseDialog

function DialogContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup>) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="data-[starting-style]:animate-fade-in fixed inset-0 z-40 bg-zinc-950/35 backdrop-blur-sm data-[ending-style]:animate-fade-in dark:bg-zinc-950/50" />
      <BaseDialog.Popup
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
          "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-950/10",
          "data-[starting-style]:animate-scale-in",
          "dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/50",
          className
        )}
        {...props}
      />
    </BaseDialog.Portal>
  )
}

export { Dialog, DialogContent }