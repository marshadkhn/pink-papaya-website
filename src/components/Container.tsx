import { cn } from "@/utils/utils";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[1552px] px-6 md:px-14", className)}>
      {children}
    </div>
  );
}
