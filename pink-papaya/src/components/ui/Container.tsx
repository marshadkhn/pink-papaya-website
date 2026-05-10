import type * as React from "react";
import clsx from "clsx";

type ContainerProps = React.PropsWithChildren<{ className?: string }>;

export function Container({ className, children }: ContainerProps) {
  return <div className={clsx("mx-auto w-full max-w-content px-6 lg:px-12", className)}>{children}</div>;
}
