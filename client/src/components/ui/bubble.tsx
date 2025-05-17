import * as React from "react"
import { cn } from "@/lib/utils"

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string
  icon?: React.ReactNode
  variant?: "default" | "accent" | "primary" | "secondary"
}

const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ className, heading, icon, variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-white border-gray-200",
      accent: "bg-accent-light border-accent",
      primary: "bg-secondary-light border-secondary",
      secondary: "bg-gray-50 border-gray-200",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border p-3 my-4 relative",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {heading && (
          <div className={cn(
            "absolute -top-2 left-3 px-1 text-xs font-semibold text-primary-dark flex items-center",
            variant === "accent" ? "bg-accent-light" : 
            variant === "primary" ? "bg-secondary-light" : 
            variant === "secondary" ? "bg-gray-50" : "bg-white"
          )}>
            {icon && <span className="mr-1">{icon}</span>}
            {heading}
          </div>
        )}
        <div className="text-sm text-gray-700">
          {children}
        </div>
      </div>
    )
  }
)

Bubble.displayName = "Bubble"

export { Bubble }
