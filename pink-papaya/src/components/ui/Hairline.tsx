import clsx from "clsx";

type HairlineProps = {
  className?: string;
};

export function Hairline({ className }: HairlineProps) {
  return <div className={clsx("h-px w-full bg-line", className)} />;
}
