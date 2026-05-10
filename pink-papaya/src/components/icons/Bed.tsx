import * as React from "react";
import clsx from "clsx";

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

export function Bed({ title, className, ...props }: IconProps) {
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
      <path d="M3 17v4" />
      <path d="M21 17v4" />
      <path d="M3 17h18" />
      <path d="M3 10h18v7H3z" />
      <path d="M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
    </svg>
  );
}
