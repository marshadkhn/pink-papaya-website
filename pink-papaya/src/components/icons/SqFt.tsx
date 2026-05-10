import * as React from "react";
import clsx from "clsx";

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

export function SqFt({ title, className, ...props }: IconProps) {
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
      <path d="M4 4h16v16H4z" />
      <path d="M8 8h8v8H8z" />
      <path d="M4 12h4" />
      <path d="M16 12h4" />
      <path d="M12 4v4" />
      <path d="M12 16v4" />
    </svg>
  );
}
