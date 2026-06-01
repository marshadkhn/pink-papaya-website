"use client";

import * as React from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { stays as staysData, stayCategories } from "@/data/stays";


export default function RoomsAndStay({ content }: { content?: any }) {
  const router = useRouter();
  const categories = stayCategories.slice(0, 4).map((c, idx) => ({
    ...c,
    name: content?.[`title${idx + 1}`] || c.name,
    description: content?.[`desc${idx + 1}`] || c.description,
  }));
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [prevImageUrl, setPrevImageUrl] = React.useState<string | null>(null);
  const [showNew, setShowNew] = React.useState(true);

  function representativeFor(catId: string, idx: number) {
    const s = staysData.find((s) => s.category === catId) ?? staysData[0];
    const customImage = content?.[`image${idx + 1}`];
    return { ...s, imageUrl: customImage || s.imageUrl };
  }

  const active = representativeFor(categories[activeIndex].id, activeIndex);

  function handleSelect(idx: number) {
    if (idx === activeIndex) return;
    const current = representativeFor(categories[activeIndex].id, activeIndex);
    setPrevImageUrl(current.imageUrl ?? null);
    setShowNew(false);
    setActiveIndex(idx);
    requestAnimationFrame(() => {
      setTimeout(() => setShowNew(true), 10);
    });
    setTimeout(() => setPrevImageUrl(null), 520);
  }

  return (
    <section className="py-[5%]">
      <Container>
        {/* Section header */}
        <div className="mb-12 md:mb-16 text-center flex flex-col items-center">
          <h2 className="font-playfair font-semibold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.08] text-neutral-900 mb-3">
            {content?.heading || "Curated collections"}
          </h2>
          <p className="font-bricolage text-[15px] md:text-base text-neutral-600">
            {content?.description || "Thoughtfully chosen stays, for every kind of getaway"}
          </p>
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
                        "w-full text-left py-5 md:py-6 px-2 transition-all duration-300 group " +
                        (selected ? "cursor-default" : "cursor-pointer")
                      }
                    >
                      {selected ? (
                        <div className="flex flex-col gap-4 w-full py-2">
                          <span className="font-playfair text-3xl md:text-4xl text-[#6b302a] leading-snug">
                            {c.name}
                          </span>
                          <div className="flex flex-row items-center justify-between gap-4 w-full">
                            <p className="text-sm md:text-[14px] text-neutral-600 font-bricolage max-w-sm pr-4">
                              {c.description}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg px-5 h-9 text-[13px] font-bricolage border-neutral-300 text-neutral-800 hover:bg-neutral-50 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/stays?category=${c.id}`);
                              }}
                            >
                              Explore
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-2">
                          <span className="font-bricolage text-[15px] md:text-[16px] font-medium text-neutral-800 group-hover:text-black transition-colors">
                            {c.name}
                          </span>
                        </div>
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
                <Image
                  src={prevImageUrl}
                  alt="Previous stay image"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={
                    "object-cover object-center transition-opacity duration-500 " +
                    (showNew ? "opacity-0" : "opacity-100")
                  }
                />
              )}
              <Image
                src={active.imageUrl!}
                alt="Active stay image"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={
                  "object-cover object-center transition-opacity duration-500 " +
                  (showNew ? "opacity-100" : "opacity-0")
                }
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
