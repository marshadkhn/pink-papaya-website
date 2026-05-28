"use client";

import Hero from "@/components/Hero";
import { DEFAULT_PLACEHOLDER } from "@/utils/image";

type Props = {
  content?: {
    title?: string;
    description?: string;
    ctaLabel?: string;
    backgroundUrl?: string;
  };
};

export default function HomeHero({ content }: Props) {
  return (
    <Hero
      backgroundUrl={content?.backgroundUrl || DEFAULT_PLACEHOLDER}
      title={content?.title || "Stay where every moment feels like a mood"}
      description={content?.description || "Handpicked homes in Goa made for unforgettable getaways"}
      titleSize="md"
      align="center"
      buttonPlacement="below"
      ctaLabel={content?.ctaLabel || "Explore Stays"}
      ctaVariant="outlineWhite"
      ctaSize="lg"
      tone="dark"
      showCta={true}
      coverNavbar={true}
    />
  );
}
