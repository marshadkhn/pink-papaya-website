"use client";

import * as React from "react";
import gsap from "gsap";
import FeedbackCard from "./FeedbackCard";
import { feedback as feedbackData } from "@/data/feedback";

export type TestimonialsCarouselHandle = {
  prev: () => void;
  next: () => void;
};

const CARD_STEP = 462; // ~450px card + 12px gap

const TestimonialsCarousel = React.forwardRef<TestimonialsCarouselHandle, { className?: string }>(
  function TestimonialsCarousel({ className }, ref) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const marqueeRef = React.useRef<HTMLDivElement>(null);
    const tweenRef = React.useRef<gsap.core.Tween | null>(null);

    const items = React.useMemo(() => [...feedbackData, ...feedbackData, ...feedbackData], []);

    React.useImperativeHandle(ref, () => ({
      prev: () => {
        if (!marqueeRef.current) return;
        tweenRef.current?.pause();
        gsap.to(marqueeRef.current, { x: `+=${CARD_STEP}`, duration: 0.45, ease: "power2.out" });
      },
      next: () => {
        if (!marqueeRef.current) return;
        tweenRef.current?.pause();
        gsap.to(marqueeRef.current, { x: `-=${CARD_STEP}`, duration: 0.45, ease: "power2.out" });
      },
    }));

    React.useEffect(() => {
      if (!marqueeRef.current) return;

      const marquee = marqueeRef.current;
      const totalWidth = marquee.scrollWidth / 3;

      tweenRef.current = gsap.to(marquee, {
        x: -totalWidth,
        duration: 40,
        ease: "none",
        repeat: -1,
        onRepeat: () => {
          gsap.set(marquee, { x: 0 });
        },
      });

      const handleMouseEnter = () => tweenRef.current?.pause();
      const handleMouseLeave = () => tweenRef.current?.play();

      marquee.addEventListener("mouseenter", handleMouseEnter);
      marquee.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        tweenRef.current?.kill();
        marquee.removeEventListener("mouseenter", handleMouseEnter);
        marquee.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, []);

    return (
      <div className={className}>
        <div
          ref={containerRef}
          className="relative overflow-hidden px-4 py-10"
        >
          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          <div
            ref={marqueeRef}
            className="flex gap-8 md:gap-12 will-change-transform"
          >
            {items.map((fb, idx) => (
              <div key={idx} className="flex-shrink-0 w-[320px] md:w-[450px]">
                <FeedbackCard feedback={fb} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default TestimonialsCarousel;
