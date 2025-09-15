import * as React from "react";
import { cn } from "@/utils/utils";
import { Card, CardContent } from "@/components/ui/card";
import AreaIcon from "./icons/area";
import BedIcon from "./icons/bed";
import UsersIcon from "./icons/users";
import Link from "next/link";

type StayCardProps = {
  title: string;
  imageUrl: string;
  area: string; // e.g., "550 sq. ft."
  bed: string; // e.g., "1 King Bed"
  guests: string; // e.g., "2 Guests"
  className?: string;
  href?: string;
  pricePerNight?: string;
};

export default function StayCard({ title, imageUrl, area, bed, guests, className, href, pricePerNight }: StayCardProps) {
  const card = (
    <Card
      className={cn(
        // Clean image tile: no border, no rounded corners, no shadow
        "group relative h-80 md:h-96  w-full overflow-hidden bg-neutral-200 !rounded-none !border-0 !shadow-none",
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      {/* gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* content */}
      <CardContent className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className={cn("font-playfair text-white leading-tight", "text-[28px] sm:text-[30px] md:text-[32px]")}>{title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-white/90 text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <AreaIcon className="h-4 w-4" />
            <span>{area}</span>
          </div>
          <div className="flex items-center gap-2">
            <BedIcon className="h-4 w-4" />
            <span>{bed}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            <span>{guests}</span>
          </div>
        </div>
        {pricePerNight ? (
          <div className="mt-3">
            <div className="text-[10px] uppercase tracking-wide text-white/80">Starting at</div>
            <div className="text-white text-lg font-semibold">
              {pricePerNight.toLowerCase().includes("night") ? (
                <>{pricePerNight}</>
              ) : (
                <>
                  {pricePerNight} <span className="text-white/80 text-sm">per night</span>
                </>
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
        {card}
      </Link>
    );
  }

  return card;
}
