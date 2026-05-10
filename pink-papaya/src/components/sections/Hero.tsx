"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { buttonClassName } from "@/components/ui/Button";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen">
      <Image
        src="/img/hero.png"
        alt="Hero background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" aria-hidden="true" />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-measure text-center text-white"
        >
          <h1 className="font-serif font-medium text-h1m md:text-h1">Your Home By The Ocean</h1>
          <p className="mt-6 text-bodyLg text-white/90">
            Curated spaces, Effortless comfort, Goa reimagined for you
          </p>
          <div className="mt-10">
            <Link href="/stays" className={buttonClassName("primary") + " focus-ring"}>
              Explore Stays
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
