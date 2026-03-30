import Hero from "@/components/Hero";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { readStays } from "@/lib/staysStore";
import { readLocations } from "@/lib/locationsStore";
import StaysGridWithFilters from "@/components/StaysGridWithFilters";

import { DEFAULT_PLACEHOLDER } from "@/utils/image";

export const metadata = {
  title: "Our Stays",
  description: "Experience comfort across our curated collection of Pink Papaya stays—crafted for relaxation and style.",
  openGraph: {
    title: "Our Curated Stays | Pink Papaya",
    description: "Explore our collection of beautiful spaces designed for your comfort.",
  }
};

export default async function StysPage() {
  const stays = await readStays();
  const locations = await readLocations();
  
  return (
    <>
      <Hero
        backgroundUrl={DEFAULT_PLACEHOLDER}
        title="Our Stays"
        description="Experience comfort across our curated collection of Pink Papaya stays—crafted for relaxation and style."
        align="center"
        buttonPlacement="below"
        showCta={false}
        tone="dark"
      />
      <section className="py-12 md:py-16">
        <Container>
          <div className="mb-6 md:mb-8">
            <HeaderContent
              align="center"
              showCta={false}
              title="Comfort-forward rooms curated for style and ease."
              titleSize="sm"
            />
          </div>
          <StaysGridWithFilters stays={stays} locations={locations} />
        </Container>
      </section>
    </>
  );
}
