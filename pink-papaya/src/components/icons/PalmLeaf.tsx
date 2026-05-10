import * as React from "react";
import clsx from "clsx";

type IconProps = Omit<React.SVGProps<SVGSVGElement>, "title"> & {
  title?: string;
  flipped?: boolean;
};

export function PalmLeaf({ title, flipped, className, ...props }: IconProps) {
  const titleId = React.useId();

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={clsx("h-24 w-24", className)}
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
      <g transform={flipped ? "translate(120 0) scale(-1 1)" : undefined}>
        <path d="M60 110c-8-25-8-55 0-90" />
        <path d="M60 40c-18-12-35-16-52-12 18 2 34 10 46 24" />
        <path d="M60 40c18-12 35-16 52-12-18 2-34 10-46 24" />
        <path d="M60 55c-20-6-38-6-54 0 20 2 38 10 51 22" />
        <path d="M60 55c20-6 38-6 54 0-20 2-38 10-51 22" />
        <path d="M60 70c-18 0-34 6-48 18 18-6 34-6 48 0" />
        <path d="M60 70c18 0 34 6 48 18-18-6-34-6-48 0" />
      </g>
    </svg>
  );
}
