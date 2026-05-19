"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import StayCard from "@/components/StayCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Stay = {
  id: string; title: string; imageUrl: string; area: string; bed: string;
  guests: string; pricePerNight?: string; location?: string; images?: string[];
  featuredOnHome?: boolean;
};

export default function ExploreStaysGrid() {
  const [stays, setStays] = useState<Stay[]>([]);

  useEffect(() => {
    fetch("/api/stays")
      .then((r) => r.ok ? r.json() : [])
      .then((data: Stay[]) => {
        const featured = data.filter((s) => s.featuredOnHome !== false).slice(0, 12);
        setStays(featured);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="explore" className="py-[5%]">
      <Container>
        <Reveal>
          <div className="mb-14 md:mb-20">
            <HeaderContent
              title="Curated spaces, Effortless comfort"
              subTitle="Goa reimagined for you"
              subTitlePosition="below"
              subTitleClass="text-[24px]"
              titleSize="sm"
              align="center"
              showCta={false}
            />
          </div>

          {stays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stays.map((s) => (
                <StayCard
                  key={s.id}
                  title={s.title}
                  imageUrl={s.imageUrl}
                  images={s.images}
                  area={s.area}
                  bed={s.bed}
                  guests={s.guests}
                  pricePerNight={s.pricePerNight}
                  location={s.location}
                  href={`/stays/${s.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-neutral-100 animate-pulse aspect-[4/3]" />
              ))}
            </div>
          )}

          <div className="mt-20 flex justify-center">
            <Link href="/stays">
              <Button size="lg" variant="outline" className="gap-2.5 px-10 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white">
                Explore More Stays
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
