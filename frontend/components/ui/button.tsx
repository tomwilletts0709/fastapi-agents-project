import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-pixel text-[8px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-magenta disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "border-2 border-neon-green bg-neon-green/10 text-neon-green shadow-pixel-sm hover:bg-neon-green/20",
        destructive:
          "border-2 border-neon-red bg-neon-red/10 text-neon-red shadow-pixel-sm hover:bg-neon-red/20",
        outline:
          "border-2 border-neon-green bg-transparent text-neon-green shadow-pixel-sm hover:bg-neon-green/10",
        secondary:
          "border-2 border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-pixel-sm hover:bg-neon-cyan/20",
        ghost: "border-2 border-transparent hover:border-neon-green/50 hover:bg-neon-green/5 text-neon-green",
        link: "text-neon-cyan underline-offset-4 hover:underline border-0",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-[7px]",
        lg: "h-10 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
