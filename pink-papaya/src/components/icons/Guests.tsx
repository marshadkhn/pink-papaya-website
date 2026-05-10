import * as React from "react";
import clsx from "clsx";

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

export function Guests({ title, className, ...props }: IconProps) {
  const titleId = React.useId();

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={clsx("h-6 w-6", className)}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-labelledby={title ? titleId : undefined}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M16 11a3 3 0 1 0-6 0" />
      <path d="M5 20a7 7 0 0 1 14 0" />
      <path d="M20 20a4 4 0 0 0-3-3.8" />
      <path d="M7 16.2A4 4 0 0 0 4 20" />
      <path d="M18.5 10.5a2.5 2.5 0 1 0-3-4" />
      <path d="M5.5 10.5a2.5 2.5 0 1 1 3-4" />
    </svg>
  );
}
