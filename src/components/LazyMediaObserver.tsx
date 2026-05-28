"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function LazyMediaObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;

          // background images
          if (el.dataset.bg) {
            try {
              el.style.backgroundImage = el.dataset.bg as string;
            } catch (e) {
              // ignore
            }
            delete el.dataset.bg;
          }

          // video sources
          if (el.tagName.toLowerCase() === "video") {
            const video = el as HTMLVideoElement;
            const src = video.dataset.src;
            if (src) {
              video.src = src;
              try {
                video.load();
              } catch (e) {}
            }
            delete video.dataset.src;
          }

          // images with data-src
          if (el.tagName.toLowerCase() === "img") {
            const img = el as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
            }
            delete img.dataset.src;
          }

          io.unobserve(el);
        });
      },
      { rootMargin: "200px", threshold: 0.01 }
    );

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-bg],[data-src]"));
    nodes.forEach((n) => io.observe(n));

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
