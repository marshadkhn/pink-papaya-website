import clsx from "clsx";
import { Eyebrow } from "@/components/ui/Eyebrow";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, body, className }: SectionHeadingProps) {
  return (
    <div className={clsx("text-center", className)}>
      {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
      <h2 className="font-serif font-medium text-h2m md:text-h2">{title}</h2>
      {body ? <p className="mx-auto mt-6 max-w-measure text-bodyLg text-inkSoft">{body}</p> : null}
    </div>
  );
}
