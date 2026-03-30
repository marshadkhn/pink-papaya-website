"use client";

import Reveal from "@/components/ui/Reveal";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { Card } from "@/components/ui/card";
import { DEFAULT_PLACEHOLDER } from "@/utils/image";

export default function LeisureHighlights() {
  const leisureItems = [
    {
      img: DEFAULT_PLACEHOLDER,
      title: "Always there, never in the way",
      desc: "Attentive yet effortless our on-ground team handles every detail, so your stay feels seamless from arrival to departure",
    },
    {
      img: DEFAULT_PLACEHOLDER,
      title: "Wheels for every mood",
      desc: "Glide through Goa in style with curated transport from chic scooters to chauffeured rides.",
    },
    {
      img: DEFAULT_PLACEHOLDER,
      title: "Goa, beyond the guidebooks",
      desc: "Hidden beaches, private tables, sunset rituals discover a side of Goa reserved for you",
    },
  ];

  return (
    <section className="py-30">
      <Container>
        <Reveal>
          <HeaderContent
            align="center"
            showCta={false}
            title="Experience more than a stay a story you’ll want to relive"
            titleSize="sm"
          />
        </Reveal>
        <div className="mt-16 sm:mt-20 md:mt-36 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 items-start">
          {leisureItems.map((item, i) => (
            <Reveal key={i}>
              <div
                className={
                  i === 1 ? "sm:-mt-12 md:-mt-16 lg:-mt-24" : "sm:mt-4 md:mt-6"
                }
              >
                <Card className="rounded-10 !border-0 overflow-hidden bg-neutral-200">
                  <div className="relative w-full pt-[85%]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                      style={{ backgroundImage: `url(${item.img})` }}
                    />
                  </div>
                </Card>
                <div className="mt-6">
                  <h4 className="font-playfair text-base md:text-lg font-medium text-neutral-900">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-sm md:text-lg text-neutral-700 font-bricolage">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
