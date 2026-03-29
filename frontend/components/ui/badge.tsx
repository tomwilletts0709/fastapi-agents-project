import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border-2 px-2.5 py-0.5 font-pixel text-[7px] uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-neon-magenta focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-neon-green bg-neon-green/10 text-neon-green shadow-pixel-sm hover:bg-neon-green/20",
        secondary:
          "border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-pixel-sm hover:bg-neon-cyan/20",
        destructive:
          "border-neon-red bg-neon-red/10 text-neon-red shadow-pixel-sm hover:bg-neon-red/20",
        outline: "border-neon-green text-neon-green",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
