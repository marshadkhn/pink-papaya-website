import { PropsWithChildren } from "react";

type RevealProps = {
  className?: string;
  y?: number;
  duration?: number;
  delay?: number;
};

export default function Reveal({ children, className = "" }: PropsWithChildren<RevealProps>) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
