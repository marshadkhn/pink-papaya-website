"use client";

import Link from "next/link";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import Container from "@/components/Container";
import { useState } from "react";


export default function Navbar({ className }: { className?: string }) {
  const items = [
    { href: "/", label: "Home" },
    { href: "/stays", label: "Explore" },
    { href: "/about", label: "About us" },
    { href: "/contact", label: "Contact us" },
  ];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 bg-transparent", className)}>
      <Container className="flex h-16 items-center justify-between">
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="text-white/90 hover:text-white transition-colors"
            >
              {it.label}
            </Link>
          ))}
        </nav>
        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center text-white focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <Link
            href="https://wa.me/0000000000"
            aria-label="Chat on WhatsApp"
            className="text-white/90 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </Link>
          <Button variant="outlineWhite">
            Get in touch
          </Button>
        </div>
      </Container>
      {/* Mobile menu overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-16 z-40 bg-black/90 backdrop-blur transition-all duration-300",
          menuOpen ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col items-center gap-6 py-6 text-lg">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="text-white/90 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {it.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
