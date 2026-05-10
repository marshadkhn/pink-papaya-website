"use client";

import clsx from "clsx";
import { Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <Container>
        <div className="text-center">
          <h2 className="font-serif font-medium text-h2m md:text-h2">What they say</h2>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3"
        >
          {testimonials.map((t, idx) => (
            <article
              key={`${t.name}-${idx}`}
              className={clsx(
                "rounded-card border border-line bg-card p-8",
                "transition motion-reduce:transition-none hover:-translate-y-0.5",
                idx === 1 ? "lg:-translate-y-0.5" : ""
              )}
            >
              <div className="flex items-center justify-center gap-1 text-ink" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" fill="currentColor" aria-hidden="true" />
                ))}
              </div>

              <p className="mt-6 text-small italic text-ink">{t.quote}</p>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-mist" aria-hidden="true" />
                <div>
                  <div className="text-small font-semibold text-ink">{t.name}</div>
                  <div className="text-eyebrow text-inkSoft">{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
