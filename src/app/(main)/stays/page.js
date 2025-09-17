import Hero from "@/components/Hero";
import Container from "@/components/Container";
import StayCard from "@/components/StayCard";
import HeaderContent from "@/components/headerContent";
import { stays } from "@/data/stays";

export default function StysPage() {
  return (
    <>
      <Hero
        backgroundUrl="/logo-files/logo-black.svg"
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
              description="Comfort-forward rooms curated for style and ease."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {stays.map((s) => (
              <StayCard
                key={s.id}
                title={s.title}
                imageUrl={s.imageUrl}
                area={s.area}
                bed={s.bed}
                guests={s.guests}
                href={`/stays/${s.id}`}
                pricePerNight={s.pricePerNight}
              />
            ))}
          </div>
        </Container>
        
      </section>
    </>
  );
}
