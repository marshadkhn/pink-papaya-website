"use client";

import * as React from "react";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AreaIcon from "@/components/icons/area";
import BedIcon from "@/components/icons/bed";
import UsersIcon from "@/components/icons/users";
import { useRouter } from "next/navigation";
import { stays as staysData } from "@/data/stays";

export default function RoomsAndStay() {
  const router = useRouter();
  const stays = staysData.slice(0, 5);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = stays[activeIndex];

  return (
    <section className="py-12 md:py-16">
      <Container>
        <HeaderContent
          align="left"
          badgeText="Rooms & Suites"
          title="Stay your Way"
          description={
            "From cozy beachfront rooms to luxurious oceanfront suites, each space at Pink Papaya is thoughtfully designed for comfort and style."
          }
          ctaLabel="Explore All Rooms"
          onCtaClick={() => router.push("/stays")}
          buttonPlacement="right"
          ctaVariant="outlineBlack"
        />

        {/* Content grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Left list */}
          <div className="md:col-span-6">
            <ul className="divide-y divide-neutral-200">
              {stays.map((s, idx) => {
                const selected = idx === activeIndex;
                return (
                  <li key={s.id} className="p-4">
                    <button
                      className={
                        "w-full text-left font-medium text-[#99C0C2] hover:underline"
                      }
                      onClick={() => setActiveIndex(idx)}
                    >
                      {s.title}
                    </button>
                    {selected ? (
                      <div className="mt-3 space-y-3">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-700">
                          <span className="flex items-center gap-2">
                            <AreaIcon className="h-4 w-4" /> {s.area}
                          </span>
                          <span className="flex items-center gap-2">
                            <BedIcon className="h-4 w-4" /> {s.bed}
                          </span>
                          <span className="flex items-center gap-2">
                            <UsersIcon className="h-4 w-4" /> {s.guests}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[10px] uppercase tracking-wide text-neutral-500">
                              Starting at
                            </div>
                            <div className="text-neutral-900 font-semibold">
                              {s.pricePerNight}
                            </div>
                          </div>
                          <Button
                            variant="outlineBlack"
                            onClick={() => router.push(`/stays/${s.id}`)}
                          >
                            Book Stay
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right image */}
          <div className="md:col-span-6">
            <Card className="!rounded-none !border-0 overflow-hidden h-80 md:h-[420px] bg-neutral-200">
              <div className="relative h-full w-full">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${active.imageUrl})` }}
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="text-white font-playfair text-lg md:text-xl leading-tight">
                    {active.description}
                  </div>
                </div>
              </div>
            </Card> 
          </div>
        </div>
      </Container>
    </section>
  );
}
