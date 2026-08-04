"use client";

import Image from "next/image";
import { isPreOptimizedMedia } from "@/lib/media-url";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Grid, X, Share2, Check, MapPin, Users, Bed, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/Container";

interface StayGalleryProps {
  title: string;
  description?: string;
  location?: string;
  area?: string;
  bed?: string;
  guests?: string;
  images?: string[];
}

export default function StayGallery({
  title,
  description,
  location,
  area,
  bed,
  guests,
  images = [],
}: StayGalleryProps) {
  // Client mount check for React Portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Deduplicate and filter valid image URLs
  const galleryImages = Array.from(
    new Set(images.filter((img): img is string => typeof img === "string" && img.trim().length > 0))
  );

  // Fallback placeholder if no images exist
  if (galleryImages.length === 0) {
    galleryImages.push("/images/placeholder.png");
  }

  // Ensure we have 5 items for the desktop hero grid layout
  const gridImages = galleryImages.slice(0, 5);

  // Lightbox Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [copied, setCopied] = useState(false);

  // Mobile Hero Carousel State
  const [mobileIdx, setMobileIdx] = useState(0);

  const openLightbox = (index: number) => {
    setActiveIdx(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = useCallback(() => {
    if (galleryImages.length <= 1) return;
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    if (galleryImages.length <= 1) return;
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Keyboard navigation & escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  const copyPageLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  const renderLightboxModal = () => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] bg-white/98 text-neutral-900 flex flex-col justify-between backdrop-blur-xl select-none pointer-events-auto"
        >
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-neutral-200/80 bg-white/90 z-[100000] relative shadow-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm sm:text-base tracking-wide bg-neutral-100 text-neutral-800 border border-neutral-200/80 px-3.5 py-1 rounded-full">
                {activeIdx + 1} / {galleryImages.length}
              </span>
              <span className="hidden sm:inline-block font-serif text-lg text-[#16323C] font-semibold truncate max-w-xs md:max-w-md">
                {title}
              </span>
            </div>

            {/* Prominent Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="relative z-[100001] w-11 h-11 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-all border border-neutral-200/80 shadow-sm cursor-pointer active:scale-90"
              aria-label="Close gallery"
              type="button"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Main Center Image View */}
          <div
            onClick={closeLightbox}
            className="relative flex-1 flex items-center justify-center px-4 py-3 overflow-hidden cursor-pointer"
          >
            {/* Prev Arrow */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 sm:left-8 z-[100000] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 hover:bg-white text-neutral-900 border border-neutral-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl"
                aria-label="Previous photo"
                type="button"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Main Image Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full max-w-6xl max-h-[78vh] flex items-center justify-center cursor-default"
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIdx}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={galleryImages[activeIdx]}
                    alt={`${title} - Photo ${activeIdx + 1}`}
                    fill
                    className="object-contain max-h-[78vh] rounded-xl shadow-lg"
                    sizes="100vw"
                    priority
                    unoptimized={isPreOptimizedMedia(galleryImages[activeIdx])}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Arrow */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 sm:right-8 z-[100000] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 hover:bg-white text-neutral-900 border border-neutral-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl"
                aria-label="Next photo"
                type="button"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Thumbnail Navigation Strip */}
          <div className="px-4 py-3 bg-white/95 border-t border-neutral-200/80 overflow-x-auto no-scrollbar z-[100000] relative">
            <div className="flex items-center justify-center gap-2 min-w-max mx-auto px-4">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(i > activeIdx ? 1 : -1);
                    setActiveIdx(i);
                  }}
                  className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    i === activeIdx
                      ? "border-[#C07A5A] scale-105 opacity-100 shadow-md ring-2 ring-[#C07A5A]/30"
                      : "border-neutral-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized={isPreOptimizedMedia(img)}
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section className="w-full bg-white pt-[calc(var(--navbar-h,80px)+0.75rem)] md:pt-[calc(var(--navbar-h,80px)+1.25rem)] pb-4 font-bricolage">
      <Container>
        {/* ---------------------------------------------------- */}
        {/* DESKTOP HERO GRID (5 Images at Top - Tisya Style)    */}
        {/* ---------------------------------------------------- */}
        <div className="hidden md:grid md:grid-cols-4 gap-3 lg:gap-4 h-[420px] lg:h-[480px] xl:h-[520px] w-full">
          {/* Main Large Image (Left Side: 50% Width, Full Height) */}
          <div
            onClick={() => openLightbox(0)}
            className="md:col-span-2 relative h-full w-full rounded-2xl overflow-hidden cursor-pointer group shadow-sm bg-neutral-100 border border-neutral-100"
          >
            <Image
              src={gridImages[0]}
              alt={`${title} - Photo 1`}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={isPreOptimizedMedia(gridImages[0])}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* 2x2 Grid of 4 Smaller Images (Right Side: 50% Width, Matching Left Height) */}
          <div className="md:col-span-2 grid grid-cols-2 grid-rows-2 gap-3 lg:gap-4 h-full min-h-0">
            {[1, 2, 3, 4].map((idx) => {
              const imgSrc = gridImages[idx] || gridImages[0];
              const isLastCard = idx === 4;

              return (
                <div
                  key={idx}
                  onClick={() => openLightbox(idx < gridImages.length ? idx : 0)}
                  className="relative h-full w-full min-h-0 rounded-2xl overflow-hidden cursor-pointer group shadow-sm bg-neutral-100 border border-neutral-100"
                >
                  <Image
                    src={imgSrc}
                    alt={`${title} - Photo ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized={isPreOptimizedMedia(imgSrc)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                  {/* "Show all photos" Overlay Button on 5th Image */}
                  {isLastCard && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(0);
                      }}
                      className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 bg-white/95 hover:bg-white text-neutral-900 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-neutral-200/80 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <Grid className="w-4 h-4 text-neutral-700" />
                      <span>Show all photos</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* MOBILE HERO CAROUSEL (< md Screens)                 */}
        {/* ---------------------------------------------------- */}
        <div className="block md:hidden relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100 shadow-sm">
          <Image
            src={galleryImages[mobileIdx] || galleryImages[0]}
            alt={title || "Stay photo"}
            fill
            priority
            onClick={() => openLightbox(mobileIdx)}
            className="object-cover cursor-pointer"
            sizes="100vw"
            unoptimized={isPreOptimizedMedia(galleryImages[mobileIdx] || galleryImages[0])}
          />

          {/* Carousel Arrows on Mobile */}
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/20 active:scale-95 transition-transform"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileIdx((prev) => (prev + 1) % galleryImages.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/20 active:scale-95 transition-transform"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Photo Count Badge (Top-Left) */}
          <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
            {mobileIdx + 1} / {galleryImages.length}
          </div>

          {/* "Show all photos" Overlay Button on Mobile (Bottom-Right) */}
          <button
            type="button"
            onClick={() => openLightbox(mobileIdx)}
            className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 bg-white/95 text-neutral-900 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md border border-neutral-200/80 backdrop-blur-md cursor-pointer"
          >
            <Grid className="w-3.5 h-3.5 text-neutral-700" />
            <span>Show all photos</span>
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TITLE, LOCATION, SPECS & SHARE BUTTON BELOW PHOTOS   */}
        {/* ---------------------------------------------------- */}
        <div className="mt-6 sm:mt-8 pt-2 border-b border-neutral-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="font-playfair text-3xl sm:text-4xl lg:text-[42px] text-[#16323C] font-semibold leading-tight">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-100 text-[#C07A5A] border border-neutral-200/60">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{location}</span>
                </span>
              )}
              {guests && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-medium bg-neutral-100/80 text-neutral-700 border border-neutral-200/60">
                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{guests}</span>
                </span>
              )}
              {bed && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-medium bg-neutral-100/80 text-neutral-700 border border-neutral-200/60">
                  <Bed className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{bed}</span>
                </span>
              )}
              {area && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-medium bg-neutral-100/80 text-neutral-700 border border-neutral-200/60">
                  <Maximize2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{area}</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Button (Share Link) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={copyPageLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-neutral-200 hover:bg-neutral-50 text-neutral-800 transition-colors shadow-xs cursor-pointer"
              title="Copy page link"
              type="button"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-neutral-600" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Render Lightbox Modal via Portal to document.body */}
      {mounted && createPortal(renderLightboxModal(), document.body)}
    </section>
  );
}
