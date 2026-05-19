"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

import FrozenRoute from "@/components/FrozenRoute";

export default function MainLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow grid relative w-full overflow-hidden">
        <AnimatePresence>
          <motion.main
            key={pathname}
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "100vh" }}
            transition={{ duration: 0.8, ease: [0.64, 0, 0.13, 1] }}
            className="col-start-1 row-start-1 flex-grow w-full bg-white flex flex-col shadow-2xl z-10 will-change-transform"
          >
            <FrozenRoute>
              {children}
            </FrozenRoute>
          </motion.main>
        </AnimatePresence>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
