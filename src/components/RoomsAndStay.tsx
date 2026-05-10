"use client";

import * as React from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { stays as staysData, stayCategories } from "@/data/stays";
import { ArrowRight } from "lucide-react";

export default function RoomsAndStay() {
  const router = useRouter();
  const categories = stayCategories.slice(0, 4);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [prevImageUrl, setPrevImageUrl] = React.useState<string | null>(null);
  const [showNew, setShowNew] = React.useState(true);

  function representativeFor(catId: string) {
    return staysData.find((s) => s.category === catId) ?? staysData[0];
  }

  const active = representativeFor(categories[activeIndex].id);

  function handleSelect(idx: number) {
    if (idx === activeIndex) return;
    const current = representativeFor(categories[activeIndex].id);
    setPrevImageUrl(current.imageUrl ?? null);
    setShowNew(false);
    setActiveIndex(idx);
    requestAnimationFrame(() => {
      setTimeout(() => setShowNew(true), 10);
    });
    setTimeout(() => setPrevImageUrl(null), 520);
  }

  return (
    <section className="py-24 md:py-36">
      <Container>
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <p className="font-bricolage text-[11px] uppercase tracking-[0.16em] font-semibold text-[#C07A5A] mb-3">
            Collections
          </p>
          <h2 className="font-playfair text-[30px] sm:text-[38px] md:text-[46px] leading-[1.08] text-neutral-900 max-w-lg">
            Curated for every kind of getaway
          </h2>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          {/* Left category list */}
          <div className="md:col-span-6">
            <ul className="divide-y divide-neutral-100">
              {categories.map((c, idx) => {
                const selected = idx === activeIndex;
                return (
                  <li key={c.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelect(idx)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelect(idx)}
                      className={
                        "w-full text-left py-6 md:py-7 px-2 transition-all duration-300 group " +
                        (selected ? "cursor-default" : "cursor-pointer")
                      }
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className={
                            "font-playfair leading-snug transition-all duration-300 " +
                            (selected
                              ? "text-3xl md:text-4xl text-[#16323C]"
                              : "text-lg md:text-xl text-neutral-300 group-hover:text-neutral-500")
                          }
                        >
                          {c.name}
                        </span>

                        {selected && (
                          <Button
                            size="sm"
                            className="shrink-0 mt-1 gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/stays?category=${c.id}`);
                            }}
                          >
                            Explore
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>

                      {selected && (
                        <p className="mt-3 text-sm md:text-[15px] text-neutral-500 leading-relaxed font-bricolage max-w-sm">
                          {c.description}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right image */}
          <div className="md:col-span-6">
            <div className="relative rounded-2xl overflow-hidden h-80 md:h-[500px] bg-neutral-200">
              {prevImageUrl && (
                <div
                  className={
                    "absolute inset-0 bg-cover bg-center transition-opacity duration-500 " +
                    (showNew ? "opacity-0" : "opacity-100")
                  }
                  style={{ backgroundImage: `url(${prevImageUrl})` }}
                />
              )}
              <div
                className={
                  "absolute inset-0 bg-cover bg-center transition-opacity duration-500 " +
                  (showNew ? "opacity-100" : "opacity-0")
                }
                style={{ backgroundImage: `url(${active.imageUrl})` }}
              />
              {/* Gradient scrim at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-white font-playfair text-base md:text-lg leading-snug opacity-90">
                  {active.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
