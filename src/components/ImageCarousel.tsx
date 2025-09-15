"use client";
import * as React from "react";
import { cn } from "@/utils/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function ImageCarousel({ images, className }: { images: string[]; className?: string }) {
  if (!images?.length) return null;

  return (
    <Carousel className={cn("w-full", className)}>
      <CarouselContent className="-ml-1">
        {images.map((src, i) => (
          <CarouselItem key={src + i} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="overflow-hidden">
                <CardContent className="relative p-0">
                  <div
                    className="aspect-[4/3] w-full bg-neutral-200"
                    style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    aria-label={`Image ${i + 1}`}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
