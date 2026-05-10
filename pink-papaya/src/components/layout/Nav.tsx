"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { buttonClassName } from "@/components/ui/Button";
import { Whatsapp } from "@/components/icons/Whatsapp";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!isHome) return;

    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const isTransparent = isHome && !scrolled;
  const fg = isTransparent ? "text-white" : "text-ink";

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-colors motion-reduce:transition-none",
        isTransparent ? "bg-transparent" : "bg-cream/95 backdrop-blur"
      )}
    >
      <Container>
        <div className="flex items-center justify-between py-4">
          <nav className={clsx("flex items-center gap-6 text-small font-medium", fg)} aria-label="Primary">
            <Link className={clsx("focus-ring", fg)} href="/">
              home
            </Link>
            <Link className={clsx("focus-ring", fg)} href="/stays">
              explore stays
            </Link>
            <Link className={clsx("focus-ring", fg)} href="#">
              about us
            </Link>
            <Link className={clsx("focus-ring", fg)} href="/contact">
              contact us
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={clsx(
                buttonClassName("outline"),
                "px-6 py-3",
                isTransparent ? "border-white text-white" : "border-ink text-ink"
              )}
            >
              Get In Touch
            </Link>
            <Link
              href="#"
              aria-label="WhatsApp"
              className={clsx(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border transition motion-reduce:transition-none",
                isTransparent ? "border-white text-white" : "border-ink text-ink",
                "focus-ring"
              )}
            >
              <Whatsapp aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
