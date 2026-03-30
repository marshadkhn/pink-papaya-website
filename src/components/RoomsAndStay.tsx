"use client";

import * as React from "react";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// Removed individual stay attribute icons - not needed anymore
import { useRouter } from "next/navigation";
import { stays as staysData, stayCategories } from "@/data/stays";

export default function RoomsAndStay() {
  const router = useRouter();
  // show four categories only
  const categories = stayCategories.slice(0, 4);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [prevImageUrl, setPrevImageUrl] = React.useState<string | null>(null);
  const [showNew, setShowNew] = React.useState(true);

  // For display, find a representative stay for the selected category
  function representativeFor(catId: string) {
    return staysData.find((s) => s.category === catId) ?? staysData[0];
  }

  const active = representativeFor(categories[activeIndex].id);

  return (
    <section className="py-30">
      <Container>
        <HeaderContent
          align="left"
          title="Curated collections"
          titleSize="sm"
          description={"Thoughtfully chosen stays, for every kind of getaway"}
          descriptionPadding={{ left: "pl-2" }}
          showCta={false}
        />

        {/* Content grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Left list */}
          <div className="md:col-span-6 min-h-[20rem] md:min-h-[420px]">
            <ul className="divide-y divide-neutral-200">
              {categories.map((c, idx) => {
                const selected = idx === activeIndex;
                const rep = representativeFor(c.id);
                return (
                  <li key={c.id} className="p-6 md:p-8">
                    <div className="flex items-start justify-between">
                      <button
                        className={
                          // larger, prominent style for the selected category
                          "text-left rounded-[10px] leading-tight " +
                          (selected
                            ? "text-4xl md:text-5xl font-playfair text-neutral-900"
                            : "text-lg md:text-xl font-medium text-[#99C0C2] hover:underline")
                        }
                        onClick={() => {
                          if (idx === activeIndex) return;
                          const current = representativeFor(categories[activeIndex].id);
                          setPrevImageUrl(current.imageUrl ?? null);
                          // show new image hidden initially, then animate in
                          setShowNew(false);
                          setActiveIndex(idx);
                          // trigger animation in next frame
                          requestAnimationFrame(() => {
                            // small timeout helps ensure browser paints the initial state
                            setTimeout(() => setShowNew(true), 10);
                          });
                          // clear prev after animation completes (500ms)
                          setTimeout(() => setPrevImageUrl(null), 520);
                        }}
                      >
                        {c.name}
                      </button>

                      {selected ? (
                        <div className="ml-4">
                          <Button
                            variant="outlineBlack"
                            onClick={() => router.push(`/stays?category=${c.id}`)}
                          >
                            Explore
                          </Button>
                        </div>
                      ) : null}
                    </div>

                    {selected ? (
                      <div className="mt-3">
                        <div className="text-base md:text-lg text-neutral-700">{c.description}</div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right image */}
          <div className="md:col-span-6">
            <Card className="rounded-10 !border-0 overflow-hidden h-80 md:h-[420px] bg-neutral-200">
              <div className="relative h-full w-full">
                {/* Previous image (fades out) */}
                {prevImageUrl ? (
                  <div
                    className={
                      "absolute inset-0 bg-cover bg-center transition-opacity duration-500 " +
                      (showNew ? "opacity-0" : "opacity-100")
                    }
                    data-bg={`url(${prevImageUrl})`}
                  />
                ) : null}

                {/* Active / incoming image (fades in) */}
                <div
                  className={
                    "absolute inset-0 bg-cover bg-center transition-opacity duration-500 " +
                    (showNew ? "opacity-100" : "opacity-0")
                  }
                  data-bg={`url(${active.imageUrl})`}
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
