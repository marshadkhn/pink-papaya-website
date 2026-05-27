"use client";
import * as React from "react";
import { cn } from "@/utils/utils";
import { formatPriceString } from "@/utils/formatCurrency";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { Users, BedDouble, Bath } from "lucide-react";

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

  const isUnsplash = (src: string) => src.startsWith("https://images.unsplash.com/");

  const CardWrapper = href ? Link : "div";
  const cardWrapperProps = href ? { href } : {};

  const priceDisplay = pricePerNight
    ? `From ${formatPriceString(pricePerNight)} + taxes`
    : null;

  return (
    <div className={cn("group relative w-full rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300", className)}>
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        {showCarousel ? (
          <Carousel className="w-full h-full" opts={{ loop: true }}>
            <CarouselContent className="h-full !ml-0">
              {displayImages.slice(0, 5).map((src, idx) => (
                <CarouselItem key={idx} className="!pl-0 relative aspect-[4/3] w-full h-full overflow-hidden">
                  <Image
                    src={src}
                    alt={title}
                    fill
                    unoptimized={isUnsplash(src)}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-[1.04]"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-white/90 text-neutral-900 hover:bg-white" />
            <CarouselNext className="right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-white/90 text-neutral-900 hover:bg-white" />
          </Carousel>
        ) : (
          <Image
            src={imageUrl}
            alt={title}
            fill
            unoptimized={isUnsplash(imageUrl)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-[1.04]"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-bricolage font-semibold text-[1.15rem] leading-snug text-neutral-900">
          {title}
        </h3>

        <p className="text-[#C07A5A] text-[14px] font-bricolage font-medium">
          {location || "Goa"}
        </p>

        {priceDisplay && (
          <p className="text-neutral-700 text-[14px] font-bricolage">
            {priceDisplay}
          </p>
        )}

        {/* Amenity row */}
        <div className="flex items-center justify-between text-[15px] text-neutral-600 font-bricolage pt-3 mt-3 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <Bath className="h-[18px] w-[18px] opacity-60 shrink-0" />
            <span>{area}</span>
          </div>
          <div className="w-px h-[18px] bg-neutral-300" />
          <div className="flex items-center gap-2">
            <BedDouble className="h-[18px] w-[18px] opacity-60 shrink-0" />
            <span>{bed}</span>
          </div>
          <div className="w-px h-[18px] bg-neutral-300" />
          <div className="flex items-center gap-2">
            <Users className="h-[18px] w-[18px] opacity-60 shrink-0" />
            <span>{guests}</span>
          </div>
        </div>

        {/* CTA */}
        {href && (
          <div className="pt-2">
            <CardWrapper
              {...(cardWrapperProps as any)}
              className="block w-full text-center py-2.5 border border-neutral-300 rounded-lg text-[13.5px] font-semibold font-bricolage text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors duration-200"
            >
              View Stay
            </CardWrapper>
          </div>
        )}
      </div>
    </div>
  );
}
