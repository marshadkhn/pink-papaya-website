"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StayGallery({ title, description, location, images = [] }: { title: string; description?: string; location?: string; images?: string[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    if (images.length <= 1) return;
    setDirection(1);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    if (images.length <= 1) return;
    setDirection(-1);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [paused, next, images.length]);

  const mainImage = images[index] || "/images/placeholder.png";

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "8%" : "-8%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-8%" : "8%", opacity: 0 }),
  };

  return (
    <section
      className="relative overflow-hidden bg-[#16323C] min-h-[480px]"
      style={{ height: "calc(80vh - var(--navbar-h))" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="sync" initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.32, 0, 0.67, 0] }}
          className="absolute inset-0"
        >
          <Image
            src={mainImage}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,22,26,0.55) 0%, rgba(10,22,26,0.45) 40%, rgba(10,22,26,0.70) 100%)" }} />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
      </AnimatePresence>

      {/* Title overlay — centered like home hero */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
        {location && (
          <p className="font-bricolage text-[11px] uppercase tracking-[0.16em] font-semibold text-white/60 mb-4">
            {location}
          </p>
        )}
        <h1 className="font-playfair text-[38px] sm:text-[52px] md:text-[62px] text-white font-semibold leading-[1.06] max-w-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-prose text-sm sm:text-base md:text-[1.05rem] font-bricolage leading-relaxed text-white/75">
            {description}
          </p>
        )}
      </div>

      {/* Prev / Next arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/45 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/45 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators — bottom right */}
      {images.length > 1 && (
        <div className="absolute bottom-10 md:bottom-14 right-8 md:right-14 z-10 flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/35 hover:bg-white/60"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {images.length > 1 && !paused && (
        <motion.div
          key={`progress-${index}`}
          className="absolute bottom-0 left-0 h-[2px] bg-white/40 z-10"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4.5, ease: "linear" }}
        />
      )}
    </section>
  );
}
