import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-mono text-xs uppercase tracking-widest px-2 py-0.5 border",
  {
    variants: {
      variant: {
        default: "bg-cream border-line text-graphite",
        navy: "bg-navy text-paper border-navy",
        red: "bg-red-flag text-paper border-red-flag",
        gold: "border-gold text-gold bg-transparent",
        success: "bg-paper border-line text-graphite",
        warning: "bg-cream border-gold text-graphite",
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
