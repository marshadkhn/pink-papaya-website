"use client";

import React from "react";
import Reveal from "@/components/ui/Reveal";
import Container from "@/components/Container";
import TestimonialsCarousel, { type TestimonialsCarouselHandle } from "@/components/TestimonialsCarousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsSection() {
  const carouselRef = React.useRef<TestimonialsCarouselHandle>(null);

  return (
    <section className="py-[5%] bg-white overflow-hidden">
      <Container>
        <Reveal>
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <h2 className="font-playfair font-semibold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.08] text-neutral-900">
                From Our Guests
              </h2>
              <p className="mt-4 text-[14px] text-neutral-400 font-bricolage max-w-md leading-relaxed">
                Notes from those who&apos;ve stayed and returned for more
              </p>
            </div>

            {/* Nav arrows */}
            <div className="flex items-center gap-2 shrink-0 mb-1">
              <button
                onClick={() => carouselRef.current?.prev()}
                aria-label="Previous testimonial"
                className="flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 text-neutral-500 hover:border-[#16323C] hover:text-[#16323C] transition-colors duration-200"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => carouselRef.current?.next()}
                aria-label="Next testimonial"
                className="flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 text-neutral-500 hover:border-[#16323C] hover:text-[#16323C] transition-colors duration-200"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <TestimonialsCarousel ref={carouselRef} className="w-[90%]" />
        </Reveal>
      </Container>
    </section>
  );
}
