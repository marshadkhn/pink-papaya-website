"use client";

import React from "react";
import StayCard from "@/components/StayCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface StayItem {
  id: string;
  title: string;
  imageUrl: string;
  images?: string[];
  area: string;
  bed: string;
  guests: string;
  pricePerNight?: string;
  location?: string;
  amenities?: string[];
}

interface RecommendedStaysCarouselProps {
  stays: StayItem[];
}

export default function RecommendedStaysCarousel({ stays }: RecommendedStaysCarouselProps) {
  if (!stays || stays.length === 0) return null;

  return (
    <div className="w-full relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        {/* Cards Row (3 Cards Visible on Desktop: basis-1/3) */}
        <CarouselContent className="-ml-4 md:-ml-6">
          {stays.map((s) => (
            <CarouselItem
              key={s.id}
              className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
            >
              <div className="h-full">
                <StayCard
                  title={s.title}
                  imageUrl={s.imageUrl}
                  images={s.images}
                  area={s.area}
                  bed={s.bed}
                  guests={s.guests}
                  href={`/stays/${s.id}`}
                  pricePerNight={s.pricePerNight}
                  location={s.location}
                  amenities={s.amenities}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Control Buttons UNDER THE CARDS */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <CarouselPrevious className="static translate-x-0 translate-y-0 h-11 w-11 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 text-neutral-700 transition-all shadow-xs cursor-pointer active:scale-95" />
          <CarouselNext className="static translate-x-0 translate-y-0 h-11 w-11 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 text-neutral-700 transition-all shadow-xs cursor-pointer active:scale-95" />
        </div>
      </Carousel>
    </div>
  );
}
