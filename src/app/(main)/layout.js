"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main key={pathname}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
