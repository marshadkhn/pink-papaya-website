"use client";

import Reveal from "@/components/ui/Reveal";
import Container from "@/components/Container";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-36 bg-white overflow-hidden">
      <Container>
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="font-bricolage text-[11px] uppercase tracking-[0.16em] font-semibold text-[#C07A5A] mb-4">
              Guest Stories
            </p>
            <h2 className="font-playfair text-[30px] sm:text-[38px] md:text-[46px] leading-[1.08] text-neutral-900">
              From Our Guests
            </h2>
            <p className="mt-4 text-[14px] text-neutral-400 font-bricolage max-w-md mx-auto leading-relaxed">
              Notes from those who&apos;ve stayed and returned for more
            </p>
          </div>
        </Reveal>
        <Reveal>
          <TestimonialsCarousel className="w-[90%]" />
        </Reveal>
      </Container>
    </section>
  );
}
