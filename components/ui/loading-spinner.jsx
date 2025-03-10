import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export const LoadingSpinner = ({
  size = "default",
  className,
  ...props
}) => {
  return (
    <Loader2
      className={cn(
        "animate-spin",
        {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "default",
          "h-8 w-8": size === "lg",
        },
        className
      )}
      {...props}
    />
  )
}

export const LoadingPage = () => {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
    </div>
  )
} 