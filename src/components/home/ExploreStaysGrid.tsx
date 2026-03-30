"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import StayCard from "@/components/StayCard";
import { Button } from "@/components/ui/button";
import { stays } from "@/data/stays";

export default function ExploreStaysGrid() {
  return (
    <section id="explore" className="py-20 md:py-32">
      <Container>
        <Reveal>
          <div className="mb-12 md:mb-20">
            <HeaderContent
              title="Curated spaces, Effortless comfort"
              subTitle="Goa reimagined for you"
              titleSize="sm"
              align="center"
              showCta={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-12 md:gap-y-16">
            {stays.slice(0, 6).map((s) => (
              <StayCard
                key={s.id}
                title={s.title}
                imageUrl={s.imageUrl}
                images={(s as any).images}
                area={s.area}
                bed={s.bed}
                guests={s.guests}
                pricePerNight={s.pricePerNight}
                location={(s as any).location}
                href={`/stays/${s.id}`}
              />
            ))}
          </div>
          <div className="mt-20 flex justify-center">
            <Link href="/stays">
              <Button variant="outlineBlack" className="px-10 h-14 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95">
                View All Stays
              </Button>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
