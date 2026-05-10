"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const features = [
  {
    title: "wheels for every mood",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    imageSrc: "/img/leisure-1.png",
  },
  {
    title: "always there, never in the way",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    imageSrc: "/img/leisure-2.png",
  },
  {
    title: "goa, beyond the guidebooks",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    imageSrc: "/img/leisure-3.png",
  },
];

export function LeisureFeatures() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <Container>
        <SectionHeading title="leisure, not logistics" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3"
        >
          {features.map((f) => (
            <article key={f.title}>
              <div className="overflow-hidden rounded-image">
                <Image src={f.imageSrc} alt={f.title} width={900} height={1200} className="h-auto w-full" />
              </div>
              <h3 className="mt-6 font-serif font-medium text-cardTitle lowercase">{f.title}</h3>
              <p className="mt-4 text-body text-inkSoft">{f.body}</p>
            </article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
