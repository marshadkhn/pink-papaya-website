import * as React from "react";
import { cn } from "@/utils/utils";
import HeaderContent, { type HeaderContentProps } from "@/components/headerContent";
import Container from "@/components/Container";
import BackgroundCarousel from "@/components/BackgroundCarousel";

interface HeroWithCarouselProps extends HeaderContentProps {
  images?: string[];
  backgroundUrl?: string;
  backgroundColor?: string;
}

export default function HeroWithCarousel({
  images,
  backgroundUrl,
  backgroundColor,
  ...content
}: HeroWithCarouselProps) {
  return (
    <section
      id="home"
      className={cn(
        "relative isolate flex min-h-screen items-center overflow-hidden bg-black"
      )}
    >
      {images && images.length ? (
        <BackgroundCarousel images={images} />
      ) : backgroundUrl ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-70"
          data-bg={`url(${backgroundUrl})`}
        />
      ) : backgroundColor ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ backgroundColor }}
        />
      ) : null}

      {(images && images.length) || backgroundUrl ? (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 to-black/80 md:from-black/60 md:via-black/40 md:to-black/70" />
      ) : null}

      {/* Extra 10% black overlay for legibility */}
      {((images && images.length) || backgroundUrl) ? (
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/10" />
      ) : null}

      <Container>
        <HeaderContent {...content} />
      </Container>
    </section>
  );
}
