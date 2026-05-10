"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { stays } from "@/lib/data";
import { Container } from "@/components/ui/Container";

export function StayGridOverlay() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 gap-12 md:grid-cols-2"
        >
          {stays.map((stay) => (
            <Link key={stay.slug} href={`/stays/${stay.slug}`} className="group relative overflow-hidden rounded-image focus-ring">
              <Image
                src={stay.imageSrc}
                alt={stay.name}
                width={1600}
                height={1200}
                className="h-auto w-full transition motion-reduce:transition-none group-hover:-translate-y-0.5"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" aria-hidden="true" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="font-serif text-cardTitle font-medium">{stay.name}</div>
                <div className="mt-2 text-small text-white/90">
                  {stay.sqft} / {stay.beds} / {stay.guests}
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
