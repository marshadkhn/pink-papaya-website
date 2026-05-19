"use client";

import { useState } from "react";
import BedIcon from "@/components/icons/bed";
import PatioIcon from "@/components/icons/patio";
import ShowerIcon from "@/components/icons/shower";
import BreakfastIcon from "@/components/icons/breakfast";
import MeditationIcon from "@/components/icons/meditation";
import TvIcon from "@/components/icons/tv";
import YogaMatIcon from "@/components/icons/yoga";
import TeaSetIcon from "@/components/icons/tea";
import CheckIcon from "@/components/icons/check";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Garden Patio": PatioIcon,
  "Queen Bed": BedIcon,
  "King Bed": BedIcon,
  "Rain Shower": ShowerIcon,
  "Breakfast": BreakfastIcon,
  "Meditation Area": MeditationIcon,
  "Smart TV": TvIcon,
  "Yoga Mat": YogaMatIcon,
  "Tea Set": TeaSetIcon,
};

const INITIAL_SHOW = 8;

export default function AmenitiesSection({ amenities = [] }: { amenities?: string[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? amenities : amenities.slice(0, INITIAL_SHOW);
  const hasMore = amenities.length > INITIAL_SHOW;

  return (
    <section className="py-[5%]">
      <p className="font-bricolage text-[11px] uppercase tracking-[0.14em] text-[#C07A5A] mb-3">
        What&apos;s included
      </p>
      <h2 className="font-playfair text-3xl md:text-4xl text-[#16323C] mb-10">
        Amenities
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-8">
        {visible.map((amenity, idx) => {
          const Icon = iconMap[amenity] || CheckIcon;
          return (
            <div key={idx} className="flex items-center gap-3.5 group">
              <div className="w-9 h-9 rounded-[10px] bg-[#F7F2EA] flex items-center justify-center text-[#C07A5A] group-hover:bg-[#16323C] group-hover:text-white transition-all duration-200 shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <span className="font-bricolage text-[13.5px] text-neutral-700">{amenity}</span>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-8 font-bricolage text-[13px] text-[#16323C] border-b border-[#16323C]/30 pb-px hover:border-[#16323C] hover:text-[#582D2D] transition-colors"
        >
          {showAll ? "Show less" : `View all ${amenities.length} amenities`}
        </button>
      )}
    </section>
  );
}
