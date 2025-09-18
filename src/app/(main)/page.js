import Hero from "@/components/Hero";
import Container from "@/components/Container";
import StayCard from "@/components/StayCard";
import HeaderContent from "@/components/headerContent";
import { stays } from "@/data/stays";
import FAQ from "@/components/FAQ";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import FeedbackCard from "@/components/FeedbackCard";
import { feedback as feedbackData } from "@/data/feedback";
import RoomsAndStay from "@/components/RoomsAndStay";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero
        backgroundUrl="/images/hotel.svg"
        title="Do a thing"
        description="Discover Pink Papaya Stays — a cozy retreat where comfort meets style. Explore our spaces and plan your next getaway."
        align="center"
        buttonPlacement="below"
        ctaLabel="Explore"
        ctaVariant="white"
        tone="dark"
      />
      <section id="explore" className="py-30 md:py-50">
        <Container>
          <div className="mb-6 md:mb-8">
            <HeaderContent
              align="center"
              showCta={false}
              description="Comfort-forward rooms curated for style and ease."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {/* Our villas black tile */}
            <Link
              href="/stays"
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60"
              aria-label="Explore all villas"
            >
              <Card className="group relative w-full overflow-hidden bg-black !rounded-none !border-0 !shadow-none">
                <div className="relative w-full" style={{ paddingTop: "100%" }}>
                  <div className="absolute inset-0 bg-black" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <h3 className="font-playfair text-white leading-tight text-[28px] sm:text-[30px] md:text-[32px]">
                      Our villas
                    </h3>
                  </div>
                </div>
              </Card>
            </Link>

            {stays.slice(0, 3).map((s) => (
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

      {/* Rooms & stay Section */}
      <RoomsAndStay />

      {/* Leisure Section */}
      <section className="py-30 md:py-50">
        <Container>
          <HeaderContent
            align="center"
            showCta={false}
            title="Leisure, not logistics"
            description="From a love of the sea to a promise of serenity."
          />
          {(() => {
            const leisureItems = [
              {
                img: stays[0]?.imageUrl,
                title: "Morning by the shore",
                desc: "Wake to soft light, waves, and slow sips of coffee.",
              },
              {
                img: stays[1]?.imageUrl,
                title: "Afternoon calm",
                desc: "Sunlit corners and sea breeze—unwind your way.",
              },
              {
                img: stays[2]?.imageUrl,
                title: "Evening glow",
                desc: "Golden hours, quiet skies, and effortless ease.",
              },
            ];
            return (
              <div className="mt-12 sm:mt-16 md:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 items-start">
                {leisureItems.map((item, i) => (
                  <div
                    key={i}
                    className={
                      i === 1
                        ? "sm:-mt-12 md:-mt-16 lg:-mt-24"
                        : "sm:mt-4 md:mt-6"
                    }
                  >
                    <Card className="!rounded-none border-1 overflow-hidden bg-neutral-200">
                      <div
                        className={`relative w-full ${
                          i === 1 ? "pt-[100%]" : "pt-[115%] "
                        }`}
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.img})` }}
                        />
                      </div>
                    </Card>
                    <div className="mt-4">
                      <h4 className="text-base md:text-lg font-medium text-neutral-900">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 text-xs md:text-sm text-neutral-700">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </Container>
      </section>

      {/* Parallax Interior Section */}
      <section className="py-12 md:py-16">
        <Container>
          <HeaderContent
            align="center"
            showCta={false}
            title="Our Interior talks"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
          />
        </Container>
      </section>
      {/* Screen 1: Image left, content right (edge-to-edge) */}
      {/* Interior sticky scroll: screen 1 sticks, screen 2 overlays */}
      <section className="relative h-[200vh] w-full">
        {/* Screen 1 (base) */}
        <div className="sticky top-0 h-screen w-full grid grid-cols-1 lg:grid-cols-12 z-10">
          <div
            className="lg:col-span-6 h-1/2 lg:h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${stays[3]?.imageUrl})` }}
          />
          <div className="lg:col-span-6 bg-[#ECF2F2] flex items-center justify-center p-6">
            <div className="max-w-md text-center">
              <h3 className="font-playfair text-2xl md:text-3xl text-neutral-900">
                Thoughtful details
              </h3>
              <Image
                src="/images/hotel.svg"
                alt=""
                width={40}
                height={40}
                className="mx-auto my-5 h-10 w-10 opacity-80"
              />
              <p className="text-neutral-700 text-sm md:text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s.
              </p>
            </div>
          </div>
        </div>
        {/* Screen 2 (overlays) */}
        <div className="sticky top-0 h-screen w-full grid grid-cols-1 lg:grid-cols-12 z-20">
          <div className="lg:col-span-6 bg-[#ECF2F2] flex items-center justify-center p-6">
            <div className="max-w-md text-center">
              <h3 className="font-playfair text-2xl md:text-3xl text-neutral-900">
                Spaces that breathe
              </h3>
              <Image
                src="/images/hotel.svg"
                alt=""
                width={40}
                height={40}
                className="mx-auto my-5 h-10 w-10 opacity-80"
              />
              <p className="text-neutral-700 text-sm md:text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s.
              </p>
            </div>
          </div>
          <div
            className="lg:col-span-6 h-1/2 lg:h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${stays[3]?.imageUrl})` }}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ
        badgeText="Helpful"
        title="Frequently Asked Questions"
        description="Quick answers to common questions about staying at Pink Papaya."
        faqs={[
          {
            question: "What time is check-in and check-out?",
            answer:
              "Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in and late check-out are available on request, subject to availability.",
          },
          {
            question: "Is breakfast included?",
            answer:
              "Yes. A complimentary breakfast is included with every stay, with vegetarian options available.",
          },
          {
            question: "Do you have Wi‑Fi?",
            answer:
              "High-speed Wi‑Fi is available throughout the property at no extra cost.",
          },
          {
            question: "How do I book a room?",
            answer:
              "You can book directly from the room page using the Book Stay button, or contact us via WhatsApp for assistance.",
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
          <HeaderContent title="What they say" align="center" showCta={false} titleSize="sm" />
          <div className="mt-8">
            <Carousel className="w-full">
              <CarouselContent className="-ml-5 md:-ml-6 py-2 md:py-3">
                {feedbackData.map((fb) => (
                  <CarouselItem
                    key={fb.id}
                    className="pl-5 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
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
