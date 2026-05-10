"use client";

import Link from "next/link";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone, Mail, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/stays", label: "Explore Stays" },
  { href: "/partner-with-us", label: "Partner with us" },
  { href: "/about", label: "About Us" },
];

export default function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const transparent = false;

  const contactBtnRef = useRef<HTMLButtonElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setMenuOpen(false);
    setContactOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (
        contactOpen &&
        contactRef.current &&
        contactBtnRef.current &&
        !contactRef.current.contains(t) &&
        !contactBtnRef.current.contains(t)
      ) {
        setContactOpen(false);
      }
      if (
        menuOpen &&
        mobileMenuRef.current &&
        menuBtnRef.current &&
        !mobileMenuRef.current.contains(t) &&
        !menuBtnRef.current.contains(t)
      ) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setContactOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [contactOpen, menuOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href) ?? false;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.08)]"
          : "bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]",
        className
      )}
    >
      <Container className="flex items-center justify-between px-4 md:px-10 max-w-7xl h-[var(--navbar-h)]">
        {/* Logo */}
        <Link href="/" className="shrink-0 z-10">
          <Image
            src={transparent ? "/logo-files/logo-white.svg" : "/logo-files/logo-black.svg"}
            alt="Pink Papaya"
            width={128}
            height={28}
            priority
            className="h-auto w-[110px] md:w-[138px] transition-opacity duration-300"
          />
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 font-bricolage">
          {NAV_ITEMS.map((it) => {
            const active = isActive(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "relative text-[13.5px] tracking-[0.04em] transition-colors group pb-1",
                  transparent
                    ? active
                      ? "text-white"
                      : "text-white/65 hover:text-white"
                    : active
                    ? "text-[#16323C]"
                    : "text-neutral-400 hover:text-[#16323C]"
                )}
              >
                {it.label}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px transition-[width] duration-300 ease-out",
                    transparent ? "bg-white/60" : "bg-[#16323C]/40",
                    active ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Contact dropdown */}
          <div className="relative">
            <Button
              ref={contactBtnRef}
              size="sm"
              variant={transparent ? "outlineWhite" : "default"}
              className="px-5 md:px-6 font-bricolage text-[12.5px]"
              onClick={() => setContactOpen((v) => !v)}
              aria-expanded={contactOpen}
              aria-haspopup="true"
            >
              Get in touch
            </Button>

            {contactOpen && (
              <div
                ref={contactRef}
                className="absolute right-0 top-full mt-2.5 w-[272px] rounded-xl bg-white border border-neutral-100 shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden z-50"
              >
                <a
                  href="tel:+919226591522"
                  className="flex items-center gap-3 px-5 py-4 text-[13px] text-[#16323C] hover:bg-[#F7F2EA] transition-colors font-bricolage"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F2EA]">
                    <Phone size={13} className="text-[#C07A5A]" />
                  </span>
                  +91 9226591522
                </a>
                <div className="h-px bg-neutral-100 mx-5" />
                <a
                  href="mailto:reservations@pinkpapayastays.com"
                  className="flex items-center gap-3 px-5 py-4 text-[13px] text-[#16323C] hover:bg-[#F7F2EA] transition-colors font-bricolage"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F2EA]">
                    <Mail size={13} className="text-[#C07A5A]" />
                  </span>
                  reservations@pinkpapayastays.com
                </a>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            ref={menuBtnRef}
            className={cn(
              "md:hidden flex items-center justify-center w-9 h-9 -mr-1 transition-colors",
              transparent ? "text-white" : "text-[#16323C]"
            )}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden border-t border-neutral-100 bg-white"
        >
          <nav className="flex flex-col font-bricolage divide-y divide-neutral-50 px-5">
            {NAV_ITEMS.map((it) => {
              const active = isActive(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "py-4 text-[13.5px] transition-colors",
                    active
                      ? "text-[#16323C] font-semibold"
                      : "text-neutral-500 hover:text-[#16323C]"
                  )}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>
          <div className="px-5 py-4 border-t border-neutral-100 space-y-3">
            <a
              href="tel:+919226591522"
              className="flex items-center gap-2.5 text-[12.5px] text-neutral-500 font-bricolage hover:text-[#16323C] transition-colors"
            >
              <Phone size={12} className="text-[#C07A5A]" />
              +91 9226591522
            </a>
            <a
              href="mailto:reservations@pinkpapayastays.com"
              className="flex items-center gap-2.5 text-[12.5px] text-neutral-500 font-bricolage hover:text-[#16323C] transition-colors"
            >
              <Mail size={12} className="text-[#C07A5A]" />
              reservations@pinkpapayastays.com
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
