import * as React from "react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Align = "left" | "center" | "right";
type ButtonPlacement = "left" | "right" | "below";
type Tone = "dark" | "light";
type TitleSize = "sm" | "md" | "lg";

export interface HeaderContentProps {
  title: string;
  description?: string;
  /**
   * Control description padding via Tailwind utility classes.
   * Example: { left: 'pl-4', right: 'pr-2', top: 'pt-2', bottom: 'pb-1' }
   */
  descriptionPadding?: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
  };
  ctaLabel?: string;
  onCtaClick?: () => void;
  align?: Align;
  buttonPlacement?: ButtonPlacement;
  tone?: Tone;
  titleSize?: TitleSize;
  titleClass?: string;
  descriptionClass?: string;
  ctaSize?: "default" | "sm" | "lg" | "icon";
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
  showCta?: boolean;
}

export default function HeroContent({
  title,
  description,
  descriptionPadding,
  ctaLabel = "Explore",
  onCtaClick,
  align = "center",
  buttonPlacement = "below",
  tone = "light",
  titleSize = "lg",
  titleClass,
  descriptionClass,
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

  const titleSizeClass = {
    sm: "text-[32px] sm:text-[40px] md:text-[48px]",
    md: "text-[40px] sm:text-[56px] md:text-[64px]",
    lg: "text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px]",
  }[titleSize];

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
      <Button
        className="w-full sm:w-auto"
        size={ctaSize}
        variant={ctaVariant}
        onClick={onCtaClick}
      >
        {ctaLabel}
      </Button>
    </div>
  );

  const textColor = tone === "dark" ? "text-white" : "text-neutral-900";
  const subTextColor = tone === "dark" ? "text-white/90" : "text-neutral-700";
  const badgeCls =
    tone === "dark" ? "bg-white/90 text-neutral-900" : "bg-black/80 text-white";

  const descPad = descriptionPadding
    ? `${descriptionPadding.top ?? ""} ${descriptionPadding.right ?? ""} ${descriptionPadding.bottom ?? ""} ${descriptionPadding.left ?? ""}`.trim()
    : "";

  return (
    <div
      className={cn(
        "flex  flex-col px-1  sm:px-0",
        alignClass,
        horizontalCenter
      )}
    >
      <h1
        className={cn(
          "font-semibold",
          textColor,
          "font-playfair",
          "leading-tight",
          titleSizeClass,
          titleClass
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "mt-3 sm:mt-4 max-w-prose text-sm sm:text-base md:text-lg font-bricolage",
            subTextColor,
            descPad,
            descriptionClass
          )}
        >
          {description}
        </p>
      ) : null}
      {showCta ? buttonRow : null}
    </div>
  );
}
