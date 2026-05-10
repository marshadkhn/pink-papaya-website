import * as React from "react";
import clsx from "clsx";

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

export function Whatsapp({ title, className, ...props }: IconProps) {
  const titleId = React.useId();

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={clsx("h-5 w-5", className)}
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
      <path d="M20 11.5a7.5 7.5 0 0 1-11.5 6.6L4 19l1-4.2A7.5 7.5 0 1 1 20 11.5Z" />
      <path d="M9 9.5c.3 1.2 1.2 2.5 2.4 3.6 1.1 1 2.3 1.7 3.3 2" />
      <path d="M14.8 15.2c.5.1 1.2 0 1.5-.3l.6-.6" />
    </svg>
  );
}
