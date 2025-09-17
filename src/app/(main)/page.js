import Hero from "@/components/Hero";
import Container from "@/components/Container";
import StayCard from "@/components/StayCard";
import HeaderContent from "@/components/headerContent";
import { stays } from "@/data/stays";
import FAQ from "@/components/FAQ";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import FeedbackCard from "@/components/FeedbackCard";
import { feedback as feedbackData } from "@/data/feedback";

export default function Home() {
  return (
    <>
      <Hero
        backgroundUrl="/logo-files/logo-black.svg"
        title="Do a thing"
        description="Discover Pink Papaya Stays — a cozy retreat where comfort meets style. Explore our spaces and plan your next getaway."
        align="center"
        buttonPlacement="below"
        ctaLabel="Explore"
        ctaVariant="white"
        tone="dark"
      />
      <section id="explore" className="py-12 md:py-16">
        <Container>
          <div className="mb-6 md:mb-8">
            <HeaderContent
              align="center"
              showCta={false}
              description="Comfort-forward rooms curated for style and ease."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {stays.slice(0, 4).map((s) => (
              <StayCard
                key={s.id}
                title={s.title}
                imageUrl={s.imageUrl}
                area={s.area}
                bed={s.bed}
                guests={s.guests}
                pricePerNight={s.pricePerNight}
                href={`/stays/${s.id}`}
              />
            ))}
          </div>
        </Container>
      </section>
      {/* FAQ Section */}
      <FAQ
        badgeText="Helpful"
        title="Frequently Asked Questions"
        description="Quick answers to common questions about staying at Pink Papaya."
        faqs={[
          {
            question: "What time is check-in and check-out?",
            answer: "Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in and late check-out are available on request, subject to availability.",
          },
          {
            question: "Is breakfast included?",
            answer: "Yes. A complimentary breakfast is included with every stay, with vegetarian options available.",
          },
          {
            question: "Do you have Wi‑Fi?",
            answer: "High-speed Wi‑Fi is available throughout the property at no extra cost.",
          },
          {
            question: "How do I book a room?",
            answer: "You can book directly from the room page using the Book Stay button, or contact us via WhatsApp for assistance.",
          },
          {
            question: "Is parking available?",
            answer: "Yes, we offer on-site parking for guests.",
          },
        ]}
      />
      {/* What They Say - Feedback */}
      <section className="py-12 md:py-16">
        <Container>
          <HeaderContent title="WHAT they say" align="center" showCta={false} />
          <div className="mt-8">
            <Carousel className="w-full">
              <CarouselContent className="-ml-5 md:-ml-6 py-2 md:py-3">
                {feedbackData.map((fb) => (
                  <CarouselItem key={fb.id} className="pl-5 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3">
                    <FeedbackCard feedback={fb} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </Container>
      </section>

  
    </>
  );
}
