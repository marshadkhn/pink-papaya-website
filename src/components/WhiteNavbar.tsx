"use client";

import Link from "next/link";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import Container from "@/components/Container";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function WhiteNavbar({ className }: { className?: string }) {
  const items = [
    { href: "/", label: "Home" },
    { href: "/stays", label: "Explore Stays" },
    { href: "/become-a-host", label: "Become a host" },
    { href: "/blog", label: "Blog" },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const linkColor = "text-white/90 hover:text-white";
  const iconColor = "text-white";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [isWide, setIsWide] = useState(false);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const line3Ref = useRef<HTMLSpanElement | null>(null);
  const tlRef = useRef<any>(null);
  const navbarWARef = useRef<HTMLAnchorElement | null>(null);
  const floatWARef = useRef<HTMLAnchorElement | null>(null);
  
  const [contactOpen, setContactOpen] = useState(false);
  const contactBtnRef = useRef<HTMLButtonElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const contactTlRef = useRef<any>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopMenuTlRef = useRef<any>(null);
  const contactOpenRef = useRef<boolean>(contactOpen);
  const menuOpenRef = useRef<boolean>(menuOpen);

  useEffect(() => {
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const l3 = line3Ref.current;
    if (!l1 || !l2 || !l3) return;

    const tl = gsap.timeline({ paused: true });
    tl.to(l1, { y: 6, rotation: 45, transformOrigin: "50% 50%", duration: 0.18 }, 0);
    tl.to(l2, { opacity: 0, duration: 0.12 }, 0);
    tl.to(l3, { y: -6, rotation: -45, transformOrigin: "50% 50%", duration: 0.18 }, 0);
    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;
    if (menuOpen) tlRef.current.play();
    else tlRef.current.reverse();
  }, [menuOpen]);

  useEffect(() => {
    function updateWide() {
      setIsWide(typeof window !== "undefined" ? window.innerWidth > 777 : false);
    }

    updateWide();
    window.addEventListener("resize", updateWide, { passive: true });
    return () => window.removeEventListener("resize", updateWide);
  }, []);

  useEffect(() => {
    const elInline = document.querySelector('.nav-inline-wa-white') as HTMLElement | null;
    const elMobile = document.querySelector('.nav-mobile-wa-white') as HTMLElement | null;
    const navEl = (elInline && elInline.offsetParent !== null) ? elInline : (elMobile && elMobile.offsetParent !== null) ? elMobile : null;
    const floatEl = floatWARef.current as HTMLElement | null;
    if (!navEl || !floatEl) return;

    const navRect = navEl.getBoundingClientRect();
    const floatRect = floatEl.getBoundingClientRect();
    const navCenterX = navRect.left + navRect.width / 2;
    const navCenterY = navRect.top + navRect.height / 2;
    const floatCenterX = floatRect.left + floatRect.width / 2;
    const floatCenterY = floatRect.top + floatRect.height / 2;
    const dx = navCenterX - floatCenterX;
    const dy = navCenterY - floatCenterY;

    gsap.killTweensOf(floatEl);
    gsap.killTweensOf(navEl);

    if (scrolled) {
      gsap.set(floatEl, { x: dx, y: dy, opacity: 0, scale: 0.8 });
      gsap.to(floatEl, {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: "power2.out",
        onStart: () => (floatEl.style.pointerEvents = "auto"),
      });
      gsap.to(navEl, { opacity: 0, duration: 0.25, ease: "power1.out" });
    } else {
      gsap.to(floatEl, {
        x: dx,
        y: dy,
        opacity: 0,
        scale: 0.8,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => (floatEl.style.pointerEvents = "none"),
      });
      gsap.to(navEl, { opacity: 1, duration: 0.25, ease: "power1.out" });
    }
  }, [scrolled]);

  useEffect(() => {
    const el = desktopMenuRef.current;
    if (!el) return;

    const tl = gsap.timeline({ paused: true });
    gsap.set(el, { autoAlpha: 0, y: -8, scale: 0.98, pointerEvents: 'none' });
    tl.to(el, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      pointerEvents: 'auto',
      duration: 0.28,
      ease: 'power2.out',
    });
    desktopMenuTlRef.current = tl;

    return () => {
      tl.kill();
      desktopMenuTlRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!desktopMenuTlRef.current) return;
    if (menuOpen) desktopMenuTlRef.current.play();
    else desktopMenuTlRef.current.reverse();
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) setContactOpen(false);
  }, [menuOpen]);

  useEffect(() => {
    contactOpenRef.current = contactOpen;
    menuOpenRef.current = menuOpen;
  }, [contactOpen, menuOpen]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node | null;

      if (contactOpenRef.current) {
        if (
          contactRef.current &&
          contactBtnRef.current &&
          t &&
          !contactRef.current.contains(t) &&
          !contactBtnRef.current.contains(t)
        ) {
          setContactOpen(false);
        }
      }

      if (menuOpenRef.current) {
        if (
          desktopMenuRef.current &&
          menuBtnRef.current &&
          t &&
          !desktopMenuRef.current.contains(t) &&
          !menuBtnRef.current.contains(t)
        ) {
          setMenuOpen(false);
        }
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (contactOpenRef.current) setContactOpen(false);
        if (menuOpenRef.current) setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const el = contactRef.current;
    if (!el) return;

    const tl = gsap.timeline({ paused: true });
    gsap.set(el, { autoAlpha: 0, y: -8, scale: 0.98, pointerEvents: 'none' });
    tl.to(el, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      pointerEvents: 'auto',
      duration: 0.28,
      ease: 'power2.out',
    });
    contactTlRef.current = tl;

    return () => {
      tl.kill();
      contactTlRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!contactTlRef.current) return;
    if (contactOpen) contactTlRef.current.play();
    else contactTlRef.current.reverse();
  }, [contactOpen]);

  return (
    <Container
      className={cn(
        "absolute inset-x-0 top-0 z-50 transition-colors bg-transparent",
        className
      )}
    >
      <Container className="flex h-16 items-center pt-3 w-full">
        <div className="flex items-center">
          <button
            className={cn(
              "flex items-center justify-center focus:outline-none text-white"
            )}
            ref={menuBtnRef}
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">Toggle menu</span>
            <div className="flex flex-col gap-1 w-7 h-6 items-center justify-center">
              <span ref={line1Ref} className={cn("hamb-line w-6 h-[2px] rounded-sm bg-current block")} />
              <span ref={line2Ref} className={cn("hamb-line w-6 h-[2px] rounded-sm bg-current block")} />
              <span ref={line3Ref} className={cn("hamb-line w-6 h-[2px] rounded-sm bg-current block")} />
            </div>
          </button>

          <div
            ref={desktopMenuRef}
            className={cn(
              "absolute left-4 top-full mt-2 w-64 rounded-10 shadow-lg border border-white/20 bg-white/5 backdrop-blur-md bg-clip-padding text-white z-50 overflow-hidden",
              menuOpen ? "md:block" : "hidden"
            )}
            style={{ backgroundColor: "rgba(255,255,255,0.03)", backdropFilter: "blur(8px)" }}
          >
            <nav className="flex flex-col text-base">
              {(!isWide ? items : []).map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 transform transition-transform duration-200 ease-out hover:scale-105 focus-visible:scale-105"
                >
                  {it.label}
                </Link>
              ))}

              <div className="border-t border-white/10" />

              <Link href="/#faq" onClick={() => setMenuOpen(false)} className="px-4 py-3 transform transition-transform duration-200 ease-out hover:scale-105 focus-visible:scale-105">Frequently Asked Questions</Link>
              <div className="border-t border-white/10" />
              <Link href="/cancellation-and-refund-policy" onClick={() => setMenuOpen(false)} className="px-4 py-3 transform transition-transform duration-200 ease-out hover:scale-105 focus-visible:scale-105">Cancellation Policy</Link>
              <div className="border-t border-white/10" />
              <Link href="/terms-and-conditions" onClick={() => setMenuOpen(false)} className="px-4 py-3 transform transition-transform duration-200 ease-out hover:scale-105 focus-visible:scale-105">Terms &amp; Conditions</Link>
            </nav>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <nav className="hidden md:flex justify-center items-center gap-6 text-[15px] font-semibold font-bricolage">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={cn(linkColor, "transition-colors group inline-flex flex-col items-center")}
              >
                <span className="relative z-10">{it.label}</span>
                <span className="block h-[2px] bg-current w-0 transition-[width] duration-200 ease-out origin-right group-hover:w-full mt-1" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 relative">
          <Link
            href="https://wa.me/0000000000"
            aria-label="Chat on WhatsApp"
            className={cn("nav-inline-wa-white text-white/90 hover:text-white", linkColor, scrolled && "hidden")}
            target="_blank"
            rel="noopener noreferrer"
            ref={navbarWARef}
          >
            <WhatsAppIcon className={cn("h-6 w-6", iconColor)} />
          </Link>

          <div className="relative">
            <Button
              ref={contactBtnRef}
              className="hidden md:inline-flex"
              size="sm"
              aria-expanded={contactOpen}
              aria-haspopup="true"
              onClick={() => setContactOpen((v) => !v)}
            >
              Get in touch
            </Button>

            <div
              ref={contactRef}
              role="dialog"
              aria-label="Get in touch"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", backdropFilter: "blur(8px)" }}
              className={cn(
                "absolute right-0 mt-2 w-64 rounded-10 shadow-lg border border-white/20 bg-white/5 backdrop-blur-md bg-clip-padding text-white z-50 overflow-hidden",
                contactOpen ? "block" : "hidden"
              )}
            >
              
              <div className="border-t border-white/10" />
              <ul className="divide-y divide-white/10">
                <li className="px-4 py-3 text-sm transform transition-transform duration-200 ease-out hover:scale-105 focus-visible:scale-105">
                  <a href="tel:+919226591522">+91 9226591522</a>
                </li>
                <li className="px-4 py-3 text-sm transform transition-transform duration-200 ease-out hover:scale-105 focus-visible:scale-105">
                  <a href="mailto:reservations@pinkpapayastays.com">reservations@pinkpapayastays.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
      <a
        href="https://wa.me/0000000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        ref={floatWARef}
        className={cn(
          "fixed bottom-6 right-6 z-50 rounded-full shadow-lg p-3 transform bg-black",
          "pointer-events-none"
        )}
      >
        <WhatsAppIcon className="h-6 w-6 text-white" />
      </a>
    </Container>
  );
}
