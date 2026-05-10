import Hero from "@/components/Hero";
import Container from "@/components/Container";
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
  },
};

export default async function StaysPage({ searchParams }) {
  const { category, location, guests } = await searchParams;
  const stays = await readStays({ category, location, guests });
  const locations = await readLocations();

  return (
    <>
      <Hero
        backgroundUrl={DEFAULT_PLACEHOLDER}
        title="Our Stays"
        description="Curated spaces across Goa — crafted for comfort, style, and unforgettable moments."
        align="center"
        showCta={false}
        tone="dark"
      />
      <section className="py-14 md:py-20">
        <Container>
          <StaysGridWithFilters stays={stays} locations={locations} />
        </Container>
      </section>
    </>
  );
}
