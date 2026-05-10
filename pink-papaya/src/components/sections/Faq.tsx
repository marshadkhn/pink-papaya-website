"use client";

import * as React from "react";
import clsx from "clsx";
import { Minus, Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { faqs } from "@/lib/data";

export function Faq() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-12 gap-12"
        >
          <div className="col-span-12 lg:col-span-4">
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="mt-4 font-serif font-medium text-h2m md:text-h2">Frequently Asked Questions</h2>
            <p className="mt-6 text-bodyLg text-inkSoft">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <ul className="border-t border-line">
              {faqs.map((item, idx) => {
                const isOpen = open === idx;
                const regionId = `faq-panel-${idx}`;
                const buttonId = `faq-button-${idx}`;

                return (
                  <li key={item.question} className="border-b border-line">
                    <button
                      id={buttonId}
                      type="button"
                      className={clsx("flex w-full items-center justify-between gap-6 py-6 text-left", "focus-ring")}
                      aria-expanded={isOpen}
                      aria-controls={regionId}
                      onClick={() => setOpen(isOpen ? null : idx)}
                    >
                      <span className="text-bodyLg text-ink">{item.question}</span>
                      {isOpen ? (
                        <Minus className="h-5 w-5 text-ink" aria-hidden="true" />
                      ) : (
                        <Plus className="h-5 w-5 text-ink" aria-hidden="true" />
                      )}
                    </button>

                    <div
                      id={regionId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={clsx("overflow-hidden pb-6 pr-12", isOpen ? "block" : "hidden")}
                    >
                      <p className="text-body text-inkSoft">{item.answer}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
