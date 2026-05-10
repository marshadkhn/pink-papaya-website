import * as React from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "outline" | "dark" | "card";

export function buttonClassName(variant: ButtonVariant) {
  switch (variant) {
    case "primary":
      return "inline-flex items-center justify-center rounded-full bg-cream px-8 py-3.5 text-small font-medium text-ink border border-transparent transition motion-reduce:transition-none hover:bg-ink hover:text-cream";
    case "outline":
      return "inline-flex items-center justify-center rounded-full bg-transparent px-6 py-3 text-small font-medium border border-ink text-ink transition motion-reduce:transition-none hover:bg-ink hover:text-cream hover:border-ink";
    case "dark":
      return "inline-flex items-center justify-center rounded-card bg-btnDark px-10 py-3 text-small font-medium text-white border border-transparent transition motion-reduce:transition-none hover:bg-ink";
    case "card":
      return "inline-flex w-full items-center justify-center border-t border-line px-6 py-4 text-small font-semibold text-ink transition motion-reduce:transition-none hover:bg-ink hover:text-cream";
  }
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => {
    return (
      <button ref={ref} type={type} className={clsx(buttonClassName(variant), "focus-ring", className)} {...props} />
    );
  }
);

Button.displayName = "Button";
