"use client";

import Hero from "@/components/Hero";
import { DEFAULT_PLACEHOLDER } from "@/utils/image";

export default function HomeHero() {
  return (
    <Hero
      backgroundUrl={DEFAULT_PLACEHOLDER}
      title="Stay where every moment feels like a mood"
      description="Handpicked homes in Goa made for unforgettable getaways"
      titleSize="md"
      align="center"
      buttonPlacement="below"
      ctaLabel="Explore Stays"
      ctaVariant="outlineWhite"
      ctaSize="lg"
      tone="dark"
      showCta={true}
    />
  );
}
