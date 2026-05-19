"use client";

import Reveal from "@/components/ui/Reveal";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { DEFAULT_PLACEHOLDER } from "@/utils/image";

export default function LeisureHighlights() {
  const leisureItems = [
    {
      img: DEFAULT_PLACEHOLDER,
      title: "Always there, never in the way",
      desc: "Attentive yet effortless — our on-ground team handles every detail, so your stay feels seamless from arrival to departure.",
    },
    {
      img: DEFAULT_PLACEHOLDER,
      title: "Wheels for every mood",
      desc: "Glide through Goa in style with curated transport — from chic scooters to chauffeured rides.",
    },
    {
      img: DEFAULT_PLACEHOLDER,
      title: "Goa, beyond the guidebooks",
      desc: "Hidden beaches, private tables, sunset rituals — discover a side of Goa reserved only for you.",
    },
  ];

  return (
    <section className="py-[5%] bg-[#F9F7F4]">
      <Container>
        <Reveal>
          <div className="pb-16">
            <HeaderContent
              align="center"
              showCta={false}
              title="Experience more than a stay, a story you'll want to relive"
              titleSize="sm"
            />
          </div>
        </Reveal>

        <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-14 items-start">
          {leisureItems.map((item, i) => (
            <Reveal key={i}>
              <div className={i === 1 ? "sm:-mt-16 md:-mt-24" : ""}>
                {/* Image */}
                <div className="relative w-full overflow-hidden rounded-2xl bg-neutral-200 aspect-[3/4]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-[1.04]"
                    style={{ backgroundImage: `url(${item.img})` }}
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Text */}
                <div className="mt-5 space-y-2">
                  <h4 className="font-playfair text-[1.1rem] md:text-[1.2rem] font-medium text-neutral-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[13.5px] md:text-sm text-neutral-500 leading-relaxed font-bricolage">
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
