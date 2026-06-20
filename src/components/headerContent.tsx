import * as React from "react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";

type Align = "left" | "center" | "right";
type ButtonPlacement = "left" | "right" | "below";
type Tone = "dark" | "light";
type TitleSize = "sm" | "md" | "lg";

export interface HeaderContentProps {
  title: string;
  description?: string;
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
  subTitle?: string;
  subTitleClass?: string;
  subTitlePosition?: "above" | "below";
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
    | "outlineBlack"
    | "accent";
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
  subTitle,
  subTitleClass,
  subTitlePosition = "above",
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

  const titleSizeClass = {
    sm: "text-[30px] sm:text-[38px] md:text-[46px] leading-[1.08]",
    md: "text-[38px] sm:text-[52px] md:text-[62px] leading-[1.06]",
    lg: "text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] leading-[1.04]",
  }[titleSize];

  const textColor = tone === "dark" ? "text-white" : "text-neutral-900";
  const subTextColor = tone === "dark" ? "text-white/75" : "text-neutral-500";

  const descPad = descriptionPadding
    ? `${descriptionPadding.top ?? ""} ${descriptionPadding.right ?? ""} ${descriptionPadding.bottom ?? ""} ${descriptionPadding.left ?? ""}`.trim()
    : "";

  const buttonRow = (
    <div
      className={cn(
        "mt-6 sm:mt-8 flex w-full gap-3 sm:gap-4",
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
        className="w-fit sm:w-auto"
        size={ctaSize}
        variant={ctaVariant}
        onClick={onCtaClick}
      >
        {ctaLabel}
      </Button>
    </div>
  );

  const subTitleEl = subTitle ? (
    <p
      className={cn(
        subTitlePosition === "above"
          ? cn(
              "font-bricolage text-[11px] uppercase tracking-[0.16em] font-semibold mb-4",
              tone === "dark" ? "text-white/60" : "text-[#C07A5A]"
            )
          : cn(
              "font-playfair text-[18px] font-normal mt-3",
              tone === "dark" ? "text-white/80" : "text-[#9A2020]"
            ),
        subTitleClass
      )}
    >
      {subTitle}
    </p>
  ) : null;

  return (
    <div className={cn("flex flex-col px-1 sm:px-0", alignClass)}>
      {subTitlePosition === "above" && subTitleEl}
      <h1
        className={cn(
          "font-semibold font-playfair max-w-full",
          textColor,
          titleSizeClass,
          titleClass
        )}
      >
        {title}
      </h1>
      {subTitlePosition === "below" && subTitleEl}
      {description && (
        <p
          className={cn(
            "mt-4 sm:mt-5 max-w-prose text-sm sm:text-base md:text-[1.05rem] font-bricolage leading-relaxed",
            subTextColor,
            descPad,
            descriptionClass
          )}
        >
          {description}
        </p>
      )}
      {showCta ? buttonRow : null}
    </div>
  );
}
