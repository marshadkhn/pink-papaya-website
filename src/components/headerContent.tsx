import * as React from "react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Align = "left" | "center" | "right";
type ButtonPlacement = "left" | "right" | "below";
type Tone = "dark" | "light";

export interface HeaderContentProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  badgeText?: string;
  align?: Align;
  buttonPlacement?: ButtonPlacement;
  tone?: Tone;
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
  // control rendering of CTA button
  showCta?: boolean;
}

export default function HeroContent({
  title,
  description,
  ctaLabel = "Explore",
  onCtaClick,
  badgeText,
  align = "center",
  buttonPlacement = "below",
  tone = "light",
  ctaSize = "lg",
  ctaVariant = "default",
  showCta = true,
}: HeaderContentProps) {
  const alignClass =
    align === "left"
      ? "items-start text-left"
      : align === "right"
      ? "items-end text-right"
      : "items-center text-center";
  const horizontalCenter = align === "center" ? "mx-auto" : undefined;

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

  const textColor = tone === "dark" ? "text-white" : "text-neutral-900";
  const subTextColor = tone === "dark" ? "text-white/90" : "text-neutral-700";
  const badgeCls = tone === "dark" ? "bg-white/90 text-neutral-900" : "bg-black/80 text-white";

  return (
    <div className={cn("flex  flex-col px-1  sm:px-0", alignClass, horizontalCenter)}>
      {badgeText ? (
        <Badge className={cn("mb-3 sm:mb-4", badgeCls)}>{badgeText}</Badge>
      ) : null}
      <h1 className={cn("font-semibold", textColor, "font-playfair", "leading-tight", "text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px]")}>{title}</h1>
      {description ? (
        <p className={cn("mt-3 sm:mt-4 max-w-prose text-sm sm:text-base md:text-lg", subTextColor)}>{description}</p>
      ) : null}
      {showCta ? buttonRow : null}
    </div>
  );
}
