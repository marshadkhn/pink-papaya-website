"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function InteriorTalks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          title="Our Interior talks"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <div className="flex aspect-square items-center justify-center rounded-card bg-mist p-6">
            <div className="text-center">
              <Eyebrow className="mb-4">Lorem ipsum</Eyebrow>
              <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-line">
                <Image
                  src="/img/interior-thumb.png"
                  alt="Interior thumbnail"
                  width={240}
                  height={240}
                  className="h-auto w-full"
                />
              </div>
              <p className="mx-auto mt-6 max-w-measure text-body text-inkSoft">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-image">
            <Image src="/img/interior-1.png" alt="Interior talk image 1" fill className="object-cover" />
          </div>

          <div className="relative aspect-square overflow-hidden rounded-image">
            <Image src="/img/interior-2.png" alt="Interior talk image 2" fill className="object-cover" />
          </div>

          <div className="flex aspect-square items-center justify-center rounded-card bg-mist p-6">
            <div className="text-center">
              <Eyebrow className="mb-4">Lorem ipsum</Eyebrow>
              <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-line">
                <Image
                  src="/img/interior-thumb.png"
                  alt="Interior thumbnail"
                  width={240}
                  height={240}
                  className="h-auto w-full"
                />
              </div>
              <p className="mx-auto mt-6 max-w-measure text-body text-inkSoft">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
