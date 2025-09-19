import Hero from "@/components/Hero";
import Container from "@/components/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { interiorProjects } from "@/data/interior";
import { interiorFeedback } from "@/data/interiorFeedback";
import Link from "next/link";
import HeaderContent from "@/components/headerContent";

export default function InteriorPage() {
  return (
    <>
      <Hero
        backgroundColor="#fff"
        title="Interior Design"
        description="Thoughtfully designed interiors that blend warmth and function—discover the details behind our spaces."
        align="center"
        buttonPlacement="below"
        showCta={false}
        tone="light"
      />
      {/* Recent Projects */}
      <section className="py-12 md:py-16">
        <Container>
          <HeaderContent
            align="center"
            showCta={false}
            badgeText="Explore"
            title="Our recent Projects"
          />

          <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {interiorProjects.map((p) => (
              <div key={p.id} className="group block">
                <Card className="!rounded-none !border-0 overflow-hidden bg-neutral-200">
                  <div className="relative w-full pt-[140%]">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${p.imageUrl})` }}
                    />
                  </div>
                </Card>
                <div className="mt-3">
                  <h3 className="font-playfair text-lg md:text-xl text-neutral-900 leading-tight">{p.title}</h3>
                  {p.description ? (
                    <p className="mt-1.5 text-sm text-neutral-700 line-clamp-2">{p.description}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-12 flex justify-center">
            <Link href="/stays">
              <Button variant="outlineBlack" size="lg">View all</Button>
            </Link>
          </div>
        </Container>
      </section>

   

      {/* About / Our Story Section */}
      <section className="py-12 md:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left: Header + copy + CTA */}
            <div className="lg:col-span-6">
              <HeaderContent
                align="left"
                showCta={false}
                badgeText="About"
                title="Our Story"
                titleSize="md"
                description="We started Pink Papaya with a simple idea: make travel feel like coming home. Every space is thoughtfully designed to blend calm, craft, and comfort—so you can slow down, sink in, and stay a little longer."
              />
              <div className="mt-6">
                <Link href="/contact">
                  <Button variant="outlineBlack" size="lg">Talk to us</Button>
                </Link>
              </div>
            </div>

            {/* Right: Square image */}
            <div className="lg:col-span-6">
              <Card className="!rounded-none !border-0 overflow-hidden bg-neutral-200">
                <div className="relative w-full pt-[100%]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${interiorProjects[0]?.imageUrl || '/images/hotel.svg'})` }}
                  />
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>


      {/* Get inspired section */}
      <section className="py-12 md:py-16">
        <Container>
          <HeaderContent
            align="center"
            showCta={false}
            badgeText="Inspiration"
            title="Get inspired"
          />

          <Card className="!rounded-none !border-0 overflow-hidden mt-8 md:mt-12">
            {/* 16:9 responsive container */}
            <div className="relative w-full pt-[56.25%] bg-neutral-200">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/uploads/inspiration.mp4"
                controls
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </Card>
        </Container>
      </section>


   {/* Our clients' words */}
      <section className="py-12 md:py-16">
        <Container>
          <HeaderContent
            align="center"
            showCta={false}
            badgeText="Feedback"
            title="Our clients' words"
            titleSize="md"
          />

          <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {interiorFeedback.slice(0, 4).map((f) => (
              <Card key={f.id} className="!rounded-none !border-0 overflow-hidden">
                <div className="relative w-full pt-[100%] bg-neutral-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${f.avatar})` }}
                  />
                </div>
                <CardContent className="bg-neutral-50">
                  <div className="mt-2">
                    <div className="font-medium text-neutral-900">{f.name}</div>
                    <p className="mt-1 text-sm text-neutral-700">{f.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
