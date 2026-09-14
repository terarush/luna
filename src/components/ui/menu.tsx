import { Menu as BaseMenu } from "@base-ui/react/menu"
import { cn } from "@/lib/utils"

function MenuRoot(props: React.ComponentProps<typeof BaseMenu.Root>) {
  return <BaseMenu.Root {...props} />
}

function MenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Trigger>) {
  return <BaseMenu.Trigger className={className} {...props} />
}

function MenuContent({
  className,
  align = "start",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup> & {
  align?: "start" | "center" | "end"
  sideOffset?: number
}) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner align={align} sideOffset={sideOffset}>
        <BaseMenu.Popup
          className={cn(
            "z-50 min-w-[10rem] overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-xl shadow-zinc-950/8",
            "data-[starting-style]:animate-scale-in",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40",
            className
          )}
          {...props}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

function MenuItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Item>) {
  return (
    <BaseMenu.Item
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-zinc-700 outline-none",
        "hover:bg-zinc-100 hover:text-zinc-950 focus-visible:bg-zinc-100 focus-visible:text-zinc-950",
        "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
        "dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:bg-zinc-800 dark:focus-visible:text-zinc-50",
        className
      )}
      {...props}
    />
  )
}

function MenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Separator>) {
  return (
    <BaseMenu.Separator
      className={cn("my-1 h-px bg-zinc-100 dark:bg-zinc-800", className)}
      {...props}
    />
  )
}

export { MenuRoot, MenuTrigger, MenuContent, MenuItem, MenuSeparator }