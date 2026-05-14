"use client";

import * as React from "react";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { cn } from "@/utils/utils";
import { Plus, Minus } from "lucide-react";

type FAQItem = { question: string; answer: string };

export default function FAQ({
  className,
  title = "FAQs",
  description,
  badgeText,
  faqs = [],
}: {
  className?: string;
  title?: string;
  description?: string;
  badgeText?: string;
  faqs?: FAQItem[];
}) {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);

  return (
    <section id="faq" className={cn("py-16 md:py-24", className)}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left heading */}
          <div className="lg:col-span-4">
            <HeaderContent
              title={title}
              titleSize="sm"
              description={description}
              align="left"
              showCta={false}
            />
          </div>

          {/* Right accordion */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-neutral-100">
              {faqs.map((item, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div key={idx} className="font-bricolage">
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 py-5 md:py-6 text-left group"
                    >
                      <span
                        className={cn(
                          "text-[15px] md:text-base font-medium leading-snug transition-colors duration-200",
                          isOpen ? "text-[#16323C]" : "text-neutral-800 group-hover:text-[#16323C]"
                        )}
                      >
                        {item.question}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200",
                          isOpen
                            ? "border-[#16323C] bg-[#16323C] text-white"
                            : "border-neutral-200 bg-white text-neutral-400 group-hover:border-[#16323C] group-hover:text-[#16323C]"
                        )}
                      >
                        {isOpen ? (
                          <Minus className="h-3.5 w-3.5" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                      </span>
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        isOpen ? "max-h-96 opacity-100 mb-5" : "max-h-0 opacity-0"
                      )}
                    >
                      <p className="text-[13.5px] md:text-sm text-neutral-500 leading-[1.8] pr-10">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
              {faqs.length === 0 && (
                <p className="text-sm text-neutral-400 py-6">
                  No FAQs added yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
