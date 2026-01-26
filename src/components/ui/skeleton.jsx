import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-800",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent",
        className
      )}
      {...props} />
  );
}

export { Skeleton }
