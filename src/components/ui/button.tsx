import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16323C]/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#16323C] text-white hover:bg-[#1a3d49] active:scale-[0.98] shadow-sm transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive/30 hover:bg-destructive/90",
        outline:
          "border border-[#16323C]/30 bg-transparent hover:bg-[#16323C]/5 text-[#16323C]",
        secondary:
          "bg-neutral-100 text-neutral-800 border border-neutral-200/60 hover:bg-neutral-200/60",
        ghost: "hover:bg-neutral-100 hover:text-neutral-900",
        link: "text-[#16323C] underline-offset-4 hover:underline",
        // custom project variants
        outlineWhite:
          "bg-transparent border border-white/70 text-white hover:bg-white/15 backdrop-blur-sm",
        white:
          "bg-white text-[#16323C] border border-neutral-200 hover:bg-neutral-50 shadow-sm",
        outlineBlack:
          "bg-transparent border border-black/80 text-black hover:bg-black/5",
        black: "bg-black text-white hover:bg-neutral-900",
        ghostBorder:
          "border border-black/10 bg-transparent text-black hover:bg-black/5",
        amenity:
          "bg-white text-[#16323C] border border-neutral-100 shadow-sm rounded-[14px] font-semibold",
        // Warm terracotta accent
        accent:
          "bg-[#9A6648] text-white hover:bg-[#8a5a3e] active:scale-[0.98] shadow-sm",
      },
      size: {
        default: "h-11 px-8 py-3 text-sm tracking-wide",
        sm: "h-9 px-5 text-xs tracking-wide",
        lg: "h-14 px-10 text-base tracking-wide",
        icon: "h-10 w-10",
        amenity:
          "h-auto py-5 px-10 sm:py-6 sm:px-12 md:py-8 md:px-16 text-2xl sm:text-3xl md:text-4xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
