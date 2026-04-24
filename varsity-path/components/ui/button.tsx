"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-700 rounded-lg",
        danger:  "bg-red-500 text-white hover:bg-red-600 rounded-lg",
        outline: "border border-line bg-white text-graphite hover:bg-paper hover:border-mist rounded-lg",
        ghost:   "text-graphite hover:bg-paper hover:text-ink rounded-lg",
        gold:    "border border-amber-400 text-amber-600 hover:bg-amber-50 rounded-lg",
        navy:    "bg-primary text-white hover:bg-primary-700 rounded-lg",
      },
      size: {
        sm: "h-7 px-3 text-xs",
        md: "h-8 px-3.5",
        lg: "h-10 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
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
