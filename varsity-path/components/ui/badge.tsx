import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
  {
    variants: {
      variant: {
        default:  "bg-gray-100 text-gray-600",
        navy:     "bg-primary-50 text-primary-700",
        blue:     "bg-blue-50 text-blue-700",
        red:      "bg-red-50 text-red-600",
        gold:     "bg-amber-50 text-amber-600",
        green:    "bg-green-50 text-green-700",
        purple:   "bg-purple-50 text-purple-700",
        success:  "bg-green-50 text-green-700",
        warning:  "bg-amber-50 text-amber-600",
        outline:  "border border-line text-graphite bg-white",
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
