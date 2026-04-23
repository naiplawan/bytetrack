import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        // Spotify-inspired variants
        spotify: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        'spotify-secondary': "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20",
        'spotify-outline': "border-border text-muted-foreground hover:border-primary hover:text-primary",
        'spotify-success': "border-transparent bg-chart-1 text-white hover:bg-chart-1/90",
        'spotify-warning': "border-transparent bg-chart-5 text-white hover:bg-chart-5/90",
        'spotify-info': "border-transparent bg-chart-4 text-white hover:bg-chart-4/90",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-2xs",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
