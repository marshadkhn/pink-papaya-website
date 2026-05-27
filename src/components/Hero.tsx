import * as React from "react";
import Image from "next/image";
import { cn } from "@/utils/utils";
import HeaderContent, {
  type HeaderContentProps,
} from "@/components/headerContent";
import Container from "@/components/Container";

interface HeroProps extends HeaderContentProps {
  backgroundUrl?: string;
  backgroundColor?: string;
  height?: string;
  /** Pull hero up to sit behind the sticky navbar (homepage use case) */
  coverNavbar?: boolean;
  /** Compact page-header mode — ~35vh instead of full screen */
  compact?: boolean;
}

export default function Hero({
  backgroundUrl,
  backgroundColor,
  height,
  coverNavbar = false,
  compact = false,
  ...content
}: HeroProps) {
  const heightClass = coverNavbar
    ? "min-h-[80vh]"
    : compact
    ? "min-h-[35vh] py-20 md:py-28 pt-[calc(var(--navbar-h)+theme(spacing.20))]"
    : height
    ? ""
    : "min-h-[80vh] pt-[var(--navbar-h)]";

  return (
    <section
      id="home"
      className={cn(
        "relative isolate flex items-center overflow-hidden",
        backgroundUrl ? "bg-black" : "bg-white",
        heightClass
      )}
      style={height && !coverNavbar && !compact ? { minHeight: height } : undefined}
    >
      {/* Background image optimized for fast load */}
      {backgroundUrl && (
        <Image
          src={backgroundUrl}
          alt="Hero Background"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="pointer-events-none absolute inset-0 -z-10 object-cover object-center"
        />
      )}

      {/* Solid color background */}
      {!backgroundUrl && backgroundColor && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ backgroundColor }}
        />
      )}

      {/* Gradient overlay for image backgrounds */}
      {backgroundUrl && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,22,26,0.55) 0%, rgba(10,22,26,0.45) 40%, rgba(10,22,26,0.70) 100%)",
          }}
        />
      )}

      {/* Extra 10% black overlay for legibility */}
      {backgroundUrl && (
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/10" />
      )}

      <Container className="w-full relative z-10">
        <HeaderContent {...content} />
      </Container>
    </section>
  );
}
