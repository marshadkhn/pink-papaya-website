"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import StayCard from "@/components/StayCard";
import { Button } from "@/components/ui/button";
import { stays } from "@/data/stays";
import { ArrowRight } from "lucide-react";

export default function ExploreStaysGrid() {
  return (
    <section id="explore" className="py-20 md:py-36">
      <Container>
        <Reveal>
          <div className="mb-14 md:mb-20">
            <HeaderContent
              title="Curated spaces, effortless comfort"
              subTitle="Goa reimagined for you"
              titleSize="sm"
              align="center"
              showCta={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-10 md:gap-y-16">
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
              <Button size="lg" className="gap-2.5 px-10">
                View All Stays
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
