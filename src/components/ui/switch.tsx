import { Switch as BaseSwitch } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full bg-zinc-200 outline-none transition-colors duration-200",
        "hover:bg-zinc-300",
        "data-[checked]:bg-zinc-950 data-[checked]:hover:bg-zinc-800",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
        "dark:bg-zinc-700 dark:data-[checked]:bg-zinc-100 dark:data-[checked]:hover:bg-zinc-200",
        className
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-white shadow-sm transition-transform duration-200",
          "translate-x-[2px] data-[checked]:translate-x-[18px]"
        )}
      />
    </BaseSwitch.Root>
  )
}

export { Switch }