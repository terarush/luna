import { Slider as BaseSlider } from "@base-ui/react/slider"
import { cn } from "@/lib/utils"

const Slider = BaseSlider

function SliderTrack({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Track>) {
  return (
    <BaseSlider.Track
      className={cn(
        "relative h-1.5 w-full rounded-full bg-zinc-200/80 data-[disabled]:opacity-50 dark:bg-zinc-700/60",
        className
      )}
      {...props}
    />
  )
}

function SliderThumb({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Thumb>) {
  return (
    <BaseSlider.Thumb
      className={cn(
        "size-4 rounded-full bg-white shadow-md ring-1 ring-zinc-300 outline-none",
        "transition-transform duration-150 hover:scale-110",
        "focus-visible:ring-2 focus-visible:ring-zinc-400/60",
        "dark:bg-zinc-100 dark:ring-zinc-600",
        className
      )}
      {...props}
    />
  )
}

function SliderControl({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Control>) {
  return (
    <BaseSlider.Control
      className={cn("flex w-full items-center", className)}
      {...props}
    />
  )
}

export { Slider, SliderControl, SliderTrack, SliderThumb }