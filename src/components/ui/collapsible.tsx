import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible"
import { cn } from "@/lib/utils"

function Collapsible({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Root>) {
  return <BaseCollapsible.Root className={className} {...props} />
}

function CollapsibleTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Trigger>) {
  return (
    <BaseCollapsible.Trigger
      className={cn("cursor-pointer outline-none", className)}
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        "data-[open]:grid-rows-[1fr] data-[closed]:grid-rows-[0fr]",
        className
      )}
      {...props}
    />
  )
}

function CollapsibleInner({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("overflow-hidden", className)} {...props} />
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleInner }