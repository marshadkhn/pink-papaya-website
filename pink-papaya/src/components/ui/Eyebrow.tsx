import type * as React from "react";
import clsx from "clsx";

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <div className={clsx("text-eyebrow font-medium uppercase tracking-eyebrow text-muted", className)}>{children}</div>
  );
}
