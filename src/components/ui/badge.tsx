import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/utils"

const badgeVariants = cva(
  // Base keeps it minimal; actual look lives in the single 'text' variant
  "inline-flex items-center leading-none",
  {
    variants: {
      variant: {
        text:
          // simple small blue text badge (force override bg/text if parent sets them)
          "!border-0 !bg-transparent !text-[#0F677D] text-xs font-medium p-0 !rounded-none",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  // Apply variant classes after any className so the simple text style wins globally
  return <div className={cn(className, badgeVariants({ variant }))} {...props} />
}

export { Badge, badgeVariants }
