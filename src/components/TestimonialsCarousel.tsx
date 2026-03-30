"use client";

import * as React from "react";
import gsap from "gsap";
import FeedbackCard from "./FeedbackCard";
import { feedback as feedbackData } from "@/data/feedback";

export default function TestimonialsCarousel({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);

  // Triple the items to ensure we have enough coverage for seamless looping
  const items = React.useMemo(() => [...feedbackData, ...feedbackData, ...feedbackData], []);

  React.useEffect(() => {
    if (!marqueeRef.current) return;

    const marquee = marqueeRef.current;
    const totalWidth = marquee.scrollWidth / 3;

    const tween = gsap.to(marquee, {
      x: -totalWidth,
      duration: 40,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(marquee, { x: 0 });
      }
    });

    // Pause on hover
    const handleMouseEnter = () => tween.pause();
    const handleMouseLeave = () => tween.play();

    marquee.addEventListener("mouseenter", handleMouseEnter);
    marquee.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      tween.kill();
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
        {/* Subtle Fade Gradients for a softer entry/exit */}
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
