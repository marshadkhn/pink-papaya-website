import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200/80 bg-white text-neutral-800">
      <Container>
        {/* Logo top center */}
        <div className="py-10 flex items-center justify-center">
          <Image
            src="/logo-files/logo-black.svg"
            alt="Pink Papaya"
            width={160}
            height={32}
          />
        </div>

        {/* Links + Stay up to date */}
        <div className="grid grid-cols-1 gap-8 pb-12 md:grid-cols-12 md:gap-10">
          {/* Quick Links */}
          <div className="md:col-span-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600 text-center">Quick Links</h3>
            <ul className="grid grid-cols-1 gap-2 text-sm place-items-center">
              <li><Link className="hover:underline" href="/">Home</Link></li>
              <li><Link className="hover:underline" href="/stays">Stays</Link></li>
              <li><Link className="hover:underline" href="/interior">Interior</Link></li>
              <li><Link className="hover:underline" href="/about">About</Link></li>
              <li><Link className="hover:underline" href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Stay up to date */}
          <div className="md:col-span-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">Stay up to date</h3>
            <p className="mb-4 text-sm text-neutral-600">Small updates on rooms, offers, and little stories from Pink Papaya. No spam.</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Button asChild variant="outlineBlack" size="icon" aria-label="Instagram">
                <Link href="https://instagram.com" target="_blank"><Instagram className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outlineBlack" size="icon" aria-label="Facebook">
                <Link href="https://facebook.com" target="_blank"><Facebook className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outlineBlack" size="icon" aria-label="X">
                <Link href="https://x.com" target="_blank"><Twitter className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <hr className="border-neutral-200" />
        <div className="flex items-center justify-center py-6 text-xs text-neutral-500">© {new Date().getFullYear()} Pink Papaya — All rights reserved.</div>
      </Container>
    </footer>
  );
}
