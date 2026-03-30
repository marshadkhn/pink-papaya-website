"use client";
import * as React from "react";
import { cn } from "@/utils/utils";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { Button } from "./ui/button";
import { Users, BedDouble, Square, MapPin } from "lucide-react";

type StayCardProps = {
  title: string;
  imageUrl: string;
  images?: string[];
  area: string;
  bed: string;
  guests: string;
  pricePerNight?: string;
  location?: string;
  className?: string;
  href?: string;
};

export default function StayCard({
  title,
  imageUrl,
  images,
  area,
  bed,
  guests,
  className,
  href,
  pricePerNight,
  location,
}: StayCardProps) {
  const displayImages = images && images.length > 0 ? images : [imageUrl];
  const showCarousel = displayImages.length > 1;

  return (
    <Card className={cn(
      "group relative w-full overflow-hidden border-none bg-transparent transition-all duration-500",
      className
    )}>
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-100">
        {showCarousel ? (
          <Carousel 
            className="h-full w-full"
            opts={{ loop: true }}
          >
            <CarouselContent className="h-full">
              {displayImages.slice(0, 5).map((src, idx) => (
                <CarouselItem key={idx} className="h-full">
                  <div 
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Absolute navigation dots or arrows if needed */}
            <CarouselPrevious className="left-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-white/80" />
            <CarouselNext className="right-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-white/80" />
          </Carousel>
        ) : (
          <div 
            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
        
        {/* Price Tag Overlay */}
        {pricePerNight && (
          <div className="absolute top-4 right-4 z-10 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-neutral-900 shadow-sm font-bricolage">
            {pricePerNight}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-5 space-y-3 px-1">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-playfair text-2xl text-neutral-900 group-hover:text-[#9A6648] transition-colors duration-300">
              {title}
            </h3>
            <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-medium uppercase tracking-widest font-bricolage">
              <MapPin className="h-3 w-3 text-[#9A6648]" />
              {location || "Goa"}
            </div>
          </div>
        </div>

        {/* Essential Specs */}
        <div className="flex items-center gap-4 text-[13px] text-neutral-600 font-bricolage border-t border-neutral-100 pt-3">
          <div className="flex items-center gap-1.5">
            <Square className="h-3.5 w-3.5 opacity-60" />
            <span>{area}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 opacity-60" />
            <span>{bed}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 opacity-60" />
            <span>{guests}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          {href ? (
            <Link href={href} className="block group/btn">
              <div className="flex items-center justify-between py-3 border-b border-transparent group-hover/btn:border-[#9A6648] transition-all duration-300">
                <span className="text-sm font-semibold tracking-wide text-neutral-900 group-hover/btn:text-[#9A6648]">
                  EXPLORE STAY
                </span>
                <span className="text-xl leading-none transition-transform duration-300 group-hover/btn:translate-x-1 text-[#9A6648]">
                  →
                </span>
              </div>
            </Link>
          ) : (
            <Button variant="outlineBlack" className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest">
              View Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
