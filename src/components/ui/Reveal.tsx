"use client";

import { PropsWithChildren } from "react";
import { motion } from "motion/react";

type RevealProps = {
  className?: string;
  y?: number;
  duration?: number;
  delay?: number;
};

export default function Reveal({
  children,
  className = "",
  y = 30,
  duration = 0.6,
  delay = 0,
}: PropsWithChildren<RevealProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
