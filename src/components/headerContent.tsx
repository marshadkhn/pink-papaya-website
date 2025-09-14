import * as React from "react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Align = "left" | "center" | "right";
type ButtonPlacement = "left" | "right" | "below";

export interface HeaderContentProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  badgeText?: string;
  align?: Align;
  buttonPlacement?: ButtonPlacement;
  // size variant for the CTA button (shadcn/ui button sizes)
  ctaSize?: "default" | "sm" | "lg" | "icon";
  // visual variant for the CTA button (shadcn/ui button variants + custom ones)
  ctaVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "outlineWhite"
    | "white"
    | "outlineBlack";
}

export default function HeroContent({
  title,
  description,
  ctaLabel = "Explore",
  onCtaClick,
  badgeText,
  align = "center",
  buttonPlacement = "below",
  ctaSize = "lg",
  ctaVariant = "default",
}: HeaderContentProps) {
  const alignClass =
    align === "left"
      ? "items-start text-left"
      : align === "right"
      ? "items-end text-right"
      : "items-center text-center";

  const buttonRow = (
    <div
      className={cn(
    "mt-4 sm:mt-6 flex w-full gap-3 sm:gap-4",
        buttonPlacement === "left" && "justify-start",
        buttonPlacement === "right" && "justify-end",
        buttonPlacement === "below" &&
          (align === "left"
            ? "justify-start"
            : align === "right"
            ? "justify-end"
            : "justify-center")
      )}
    >
  <Button className="w-full sm:w-auto" size={ctaSize} variant={ctaVariant} onClick={onCtaClick}>
        {ctaLabel}
      </Button>
    </div>
  );

  return (
    <div className={cn("flex max-w-3xl flex-col px-1 sm:px-0", alignClass)}>
      {badgeText ? (
        <Badge className="mb-3 sm:mb-4 bg-white/90 text-neutral-900">{badgeText}</Badge>
      ) : null}
      <h1 className={cn("font-semibold text-white", "font-playfair", "leading-tight", "text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px]")}>{title}</h1>
      {description ? (
        <p className="mt-3 sm:mt-4 max-w-prose text-white/90 text-sm sm:text-base md:text-lg">{description}</p>
      ) : null}
      {buttonRow}
    </div>
  );
}
