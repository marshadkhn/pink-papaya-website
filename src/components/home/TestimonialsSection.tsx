"use client";

import Reveal from "@/components/ui/Reveal";
import Container from "@/components/Container";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <Container>
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-playfair font-semibold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.08] text-neutral-900">
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
