"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InstagramFeed from "@/components/InstagramFeed";
import WhatsAppButton from "@/components/WhatsAppButton";

import FrozenRoute from "@/components/FrozenRoute";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setAnimating(true);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className={`flex-grow grid grid-cols-1 relative w-full ${animating ? "overflow-hidden" : ""}`}>
        <AnimatePresence>
          <motion.main
            key={pathname}
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "100vh" }}
            transition={{ duration: 0.8, ease: [0.64, 0, 0.13, 1] }}
            onAnimationComplete={() => setAnimating(false)}
            style={animating ? undefined : { transform: "none" }}
            className={`col-start-1 row-start-1 flex-grow w-full min-w-0 bg-white flex flex-col shadow-2xl z-10 ${
              animating ? "will-change-transform" : ""
            }`}
          >
            <FrozenRoute>
              {children}
            </FrozenRoute>
            <InstagramFeed />
          </motion.main>
        </AnimatePresence>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
