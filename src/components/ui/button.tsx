import { Button as BaseButton } from "@base-ui/react/button"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ComponentProps<typeof BaseButton> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger"
  size?: "sm" | "md" | "lg" | "icon"
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-zinc-950 text-white hover:bg-zinc-800 active:bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:active:bg-zinc-300",
  secondary:
    "bg-zinc-100 text-zinc-800 hover:bg-zinc-200/80 active:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 dark:active:bg-zinc-700",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800",
  outline:
    "border border-zinc-200 bg-transparent text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 active:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50 dark:active:bg-zinc-800",
  danger:
    "bg-zinc-950 text-white hover:bg-zinc-800 active:bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:active:bg-zinc-300",
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
  icon: "h-8 w-8 p-0",
}

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      className={cn(
        "inline-flex select-none items-center justify-center rounded-lg font-medium outline-none ring-zinc-400/50 transition-all duration-150",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
        "disabled:pointer-events-none disabled:opacity-45",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}