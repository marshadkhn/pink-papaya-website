"use client";

import Reveal from "@/components/ui/Reveal";
import Hero from "@/components/Hero";
import { DEFAULT_PLACEHOLDER } from "@/utils/image";

export default function HomeHero() {
  return (
    <Reveal>
      <Hero
        backgroundUrl={DEFAULT_PLACEHOLDER}
        title="Stay where every moment feels like a mood"
        description="Handpicked homes made for unforgettable getaways"
        titleSize="sm"
        align="center"
        buttonPlacement="below"
        ctaLabel="Explore"
        ctaVariant="white"
        tone="dark"
      />
    </Reveal>
  );
}
