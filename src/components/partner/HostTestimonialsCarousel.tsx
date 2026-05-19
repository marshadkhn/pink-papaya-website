"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = { id: string; name: string; role: string; quote: string };

const SEED: Testimonial[] = [
  { id: "julianne-thorne", quote: "Partnering with Pink Papaya transformed our boutique estate from a hidden gem into a globally recognized architectural destination. Their eye for detail and commitment to intentionality in hospitality is truly unmatched in the industry.", name: "Julianne Thorne", role: "Owner, Casa Della Luce — Tuscany" },
  { id: "rahul-mehra", quote: "Pink Papaya didn't just manage our villa — they elevated it. Every guest leaves raving about the experience, and our bookings have tripled since joining. The team treats your property like their own.", name: "Rahul Mehra", role: "Owner, The Amber House — Goa" },
  { id: "sofia-dasilva", quote: "What impressed me most was the transparency. Real-time dashboards, proactive communication, zero surprises. Our property has never performed better financially or in terms of guest satisfaction.", name: "Sofia da Silva", role: "Host, Villa Brisa — Algarve" },
  { id: "kenji-watanabe", quote: "The curation Pink Papaya brings is extraordinary. They understood the soul of our traditional ryokan-inspired home and ensured every guest experience honored that. Revenue is secondary to integrity here.", name: "Kenji Watanabe", role: "Owner, The Garden Retreat — Goa" },
  { id: "ananya-krishnan", quote: "From onboarding to daily operations, the Pink Papaya team is flawless. My heritage property was in safe hands from day one. It is rare to find a hospitality partner that genuinely cares about your home.", name: "Ananya Krishnan", role: "Owner, Nila House — Kerala" },
];

export default function HostTestimonialsCarousel() {
  const [items, setItems] = useState<Testimonial[]>(SEED);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    fetch("/api/host-testimonials")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (Array.isArray(data) && data.length > 0) setItems(data); })
      .catch(() => {});
  }, []);

  const goTo = useCallback((i: number, dir: number) => {
    setDirection(dir);
    setIndex(i);
  }, []);

  const next = useCallback(() => {
    goTo((index + 1) % items.length, 1);
  }, [index, items.length, goTo]);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next, items.length]);

  const current = items[index];

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <section
      className="py-[5%] bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">

          {/* Left: sticky heading */}
          <div className="lg:pt-2">
            <h2 className="font-playfair text-4xl md:text-5xl font-medium text-[#16323C] leading-tight">
              What Our<br />
              <span className="italic font-normal">Hosts</span> Say
            </h2>

            {/* Dot nav */}
            {items.length > 1 && (
              <div className="flex items-center gap-2.5 mt-10">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i, i > index ? 1 : -1)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === index ? 24 : 8,
                      height: 8,
                      background: i === index ? "#C07A5A" : "#D1C5B8",
                    }}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Progress bar */}
            {!paused && items.length > 1 && (
              <div className="mt-4 h-[2px] bg-neutral-100 rounded-full overflow-hidden w-24">
                <motion.div
                  key={`prog-${index}`}
                  className="h-full bg-[#C07A5A] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              </div>
            )}
          </div>

          {/* Right: testimonial */}
          <div className="relative min-h-[320px] flex flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.32, 0, 0.67, 0] }}
              >
                {/* Decorative quote mark */}
                <div
                  className="font-playfair text-[96px] leading-none text-[#C07A5A] select-none mb-2"
                  style={{ fontFamily: "var(--font-playfair)", lineHeight: 0.8 }}
                  aria-hidden
                >
                  &ldquo;
                </div>

                {/* Quote text */}
                <blockquote className="font-playfair text-2xl md:text-3xl lg:text-[2rem] font-normal italic text-[#16323C] leading-[1.45] mt-6 mb-10">
                  {current.quote}
                </blockquote>

                {/* Author + arrows */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bricolage text-sm font-semibold uppercase tracking-[0.14em] text-[#16323C]">
                      {current.name}
                    </p>
                    {current.role && (
                      <p className="font-bricolage text-xs uppercase tracking-[0.12em] text-neutral-400 mt-1">
                        {current.role}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => goTo((index - 1 + items.length) % items.length, -1)}
                      aria-label="Previous testimonial"
                      className="flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 text-neutral-500 hover:border-[#16323C] hover:text-[#16323C] transition-colors duration-200"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      onClick={() => goTo((index + 1) % items.length, 1)}
                      aria-label="Next testimonial"
                      className="flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 text-neutral-500 hover:border-[#16323C] hover:text-[#16323C] transition-colors duration-200"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
