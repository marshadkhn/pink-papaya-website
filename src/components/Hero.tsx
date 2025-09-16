import * as React from "react";
import { cn } from "@/utils/utils";
import HeaderContent, {
  type HeaderContentProps,
} from "@/components/headerContent";
import Container from "@/components/Container";

interface HeroProps extends HeaderContentProps {
  backgroundUrl?: string;
  backgroundColor?: string;
}

export default function Hero({
  backgroundUrl,
  backgroundColor,
  ...content
}: HeroProps) {
  return (
    <section
      id="home"
      className={cn(
        // pt-16 matches the fixed navbar height so content starts below it,
        // while the background still extends beneath the navbar
        // Use 100dvh on small screens to account for mobile browser UI
        "relative isolate flex min-h-[100dvh] md:min-h-screen items-center overflow-hidden bg-black pt-16"
      )}
    >
      {backgroundUrl ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      ) : backgroundColor ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ backgroundColor }}
        />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 to-black/80 md:from-black/60 md:via-black/40 md:to-black/70" />
      <Container>
        <HeaderContent {...content} />
      </Container>
    </section>
  );
}
