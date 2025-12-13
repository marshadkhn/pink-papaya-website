"use client";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/utils/utils";

export default function BackgroundCarousel({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) {
  if (!images || !images.length) return null;

  return (
    <Carousel className={cn("absolute inset-0 -z-10 h-full w-full", className)}>
      <CarouselContent className="h-full">
        {images.map((src, i) => (
          <CarouselItem key={src + i} className="h-full">
            <div className="h-full w-full">
              <div
                className="h-full w-full bg-cover bg-center"
                data-bg={`url(${src})`}
                aria-hidden
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
