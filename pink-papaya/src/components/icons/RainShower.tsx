import * as React from "react";
import clsx from "clsx";

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

export function RainShower({ title, className, ...props }: IconProps) {
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
      <path d="M5 7h14" />
      <path d="M7 7c0-2.2 1.8-4 4-4h2c2.2 0 4 1.8 4 4" />
      <path d="M7 10.5l.01.01" />
      <path d="M12 10.5l.01.01" />
      <path d="M17 10.5l.01.01" />
      <path d="M9 14l.01.01" />
      <path d="M15 14l.01.01" />
      <path d="M12 17.5l.01.01" />
    </svg>
  );
}
