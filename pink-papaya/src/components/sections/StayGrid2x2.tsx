"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { stays } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { Bed } from "@/components/icons/Bed";
import { Guests } from "@/components/icons/Guests";
import { SqFt } from "@/components/icons/SqFt";
import { buttonClassName } from "@/components/ui/Button";

export function StayGrid2x2() {
  const reduceMotion = useReducedMotion();
  const items = stays.slice(0, 4);

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
          {items.map((stay) => (
            <article key={stay.slug} className="overflow-hidden rounded-card border border-line bg-card">
              <Image
                src={stay.imageSrc}
                alt={stay.name}
                width={1200}
                height={900}
                className="h-auto w-full"
              />

              <div className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-serif font-medium text-cardTitle text-ink">{stay.name}</h3>
                    <div className="mt-2 text-small text-accent">{stay.locationLine}</div>
                  </div>

                  <div className="flex items-start gap-6">
                    {[{ Icon: SqFt, label: stay.sqft }, { Icon: Bed, label: stay.beds }, { Icon: Guests, label: stay.guests }].map(
                      ({ Icon, label }) => (
                        <div key={label} className="text-center text-ink">
                          <Icon className="mx-auto" aria-hidden="true" />
                          <div className="mt-2 text-eyebrow text-inkSoft">{label}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-6 text-small font-semibold text-ink">From ₹8,999 / night + taxes</div>
              </div>

              <Link href={`/stays/${stay.slug}`} className={buttonClassName("card") + " focus-ring"}>
                View Stay
              </Link>
            </article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
