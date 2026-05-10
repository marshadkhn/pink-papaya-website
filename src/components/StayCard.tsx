"use client";
import * as React from "react";
import { cn } from "@/utils/utils";
import { formatPriceString } from "@/utils/formatCurrency";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
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
  amenities?: string[];
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

  const ImageWrapper = href ? Link : "div";
  const imageWrapperProps = href ? { href } : {};

  return (
    <div className={cn("group relative w-full", className)}>
      {/* Image Container */}
      <ImageWrapper
        {...(imageWrapperProps as any)}
        className="block relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-100"
      >
        {showCarousel ? (
          <Carousel
            className="h-full w-full"
            opts={{ loop: true }}
          >
            <CarouselContent className="h-full">
              {displayImages.slice(0, 5).map((src, idx) => (
                <CarouselItem key={idx} className="h-full">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-white/90 text-neutral-900 hover:bg-white" />
            <CarouselNext className="right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-white/90 text-neutral-900 hover:bg-white" />
          </Carousel>
        ) : (
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}

        {/* Price Tag */}
        {pricePerNight && (
          <div className="absolute top-3 right-3 z-10 rounded-lg bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-sm">
            <span className="text-[11px] font-semibold text-[#16323C] font-bricolage tracking-wide">
              {`${formatPriceString(pricePerNight)}${/night/i.test(String(pricePerNight)) ? " / night" : ""}`}
            </span>
          </div>
        )}

        {/* Bottom gradient scrim */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </ImageWrapper>

      {/* Content */}
      <div className="mt-4 space-y-2.5 px-0.5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-neutral-400 text-[10.5px] font-semibold uppercase tracking-[0.12em] font-bricolage">
          <MapPin className="h-3 w-3 text-[#C07A5A] shrink-0" />
          {location || "Goa"}
        </div>

        {/* Title */}
        <h3
          className={cn(
            "font-playfair text-[1.35rem] leading-snug text-neutral-900 transition-colors duration-300",
            href && "group-hover:text-[#9A6648]"
          )}
        >
          {title}
        </h3>

        {/* Specs */}
        <div className="flex items-center gap-4 text-[12.5px] text-neutral-500 font-bricolage border-t border-neutral-100 pt-3">
          <div className="flex items-center gap-1.5">
            <Square className="h-3 w-3 opacity-50" />
            <span>{area}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-3 w-3 opacity-50" />
            <span>{bed}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3 w-3 opacity-50" />
            <span>{guests}</span>
          </div>
        </div>

        {/* CTA */}
        {href && (
          <div className="pt-1">
            <Link href={href} className="block group/cta">
              <div className="flex items-center justify-between py-2.5 border-b border-transparent group-hover/cta:border-[#9A6648]/50 transition-all duration-300">
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-neutral-700 group-hover/cta:text-[#9A6648] transition-colors font-bricolage">
                  View Details
                </span>
                <span className="text-[#9A6648] transition-transform duration-300 group-hover/cta:translate-x-1 text-lg leading-none">
                  →
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
