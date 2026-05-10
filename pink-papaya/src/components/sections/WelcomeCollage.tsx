"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function WelcomeCollage() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-12 gap-6"
        >
          <div className="col-span-12 md:col-span-5">
            <div className="overflow-hidden rounded-image">
              <Image src="/img/collage-1.png" alt="Collage image 1" width={1200} height={1600} className="h-auto w-full" />
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="overflow-hidden rounded-image">
              <Image src="/img/collage-2.png" alt="Collage image 2" width={1600} height={1200} className="h-auto w-full" />
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 md:col-start-2">
            <div className="overflow-hidden rounded-image">
              <Image src="/img/collage-3.png" alt="Collage image 3" width={1200} height={1600} className="h-auto w-full" />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7 md:row-span-2">
            <div className="overflow-hidden rounded-image">
              <Image src="/img/collage-4.png" alt="Collage image 4" width={1600} height={2000} className="h-auto w-full" />
            </div>
          </div>

          <div className="col-span-12 self-center text-center md:col-span-5 md:col-start-4 md:row-start-2">
            <Eyebrow className="mb-3">Welcome to Pink Papaya</Eyebrow>
            <h2 className="font-serif font-medium text-h2m md:text-h2">no average stays</h2>
            <p className="mx-auto mt-6 max-w-measure text-bodyLg text-inkSoft">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
