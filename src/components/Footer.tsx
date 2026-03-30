import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PiInstagramLogo, PiSpotifyLogo, PiLinktreeLogo } from "react-icons/pi";

export default function Footer() {
  return (
    <footer className="w-full bg-white text-[#1a1a1a] pb-12 pt-16 md:pt-20 font-bricolage border-t border-neutral-100">
      <Container>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-12 md:gap-8">
          {/* Brand & Socials */}
          <div className="md:col-span-3 flex flex-col items-start gap-6">
            <div className="flex flex-col gap-4">
              <Image
                src="/logo-files/logo-black.svg"
                alt="Pink Papaya"
                width={140}
                height={28}
                loading="lazy"
                className="h-auto w-[120px] md:w-[140px]"
              />
              <p className="text-[13px] text-neutral-500 max-w-[220px] leading-relaxed">
                Thoughtfully designed stays for rest and calm.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="https://instagram.com"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#582D2D]/20 text-[#582D2D] transition-all hover:bg-[#582D2D] hover:text-white shadow-sm"
                aria-label="Instagram"
              >
                <PiInstagramLogo className="h-5 w-5" />
              </Link>
              <Link
                href="https://spotify.com"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#582D2D]/20 text-[#582D2D] transition-all hover:bg-[#582D2D] hover:text-white shadow-sm"
                aria-label="Spotify"
              >
                <PiSpotifyLogo className="h-5 w-5" />
              </Link>
              <Link
                href="https://linktr.ee"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#582D2D]/20 text-[#582D2D] transition-all hover:bg-[#582D2D] hover:text-white shadow-sm"
                aria-label="Linktree"
              >
                <PiLinktreeLogo className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 md:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h5 className="text-[14px] font-bold uppercase tracking-wider text-[#582D2D] font-playfair">
                Stories from the coast
              </h5>
              <p className="text-[13px] text-neutral-500">
                Interiors, escapes & thoughtful living — monthly
              </p>
            </div>

            <form action="#" method="post" className="flex items-center gap-3 max-w-md w-full">
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="flex-1 min-w-0 rounded-[10px] border border-neutral-200 bg-white px-4 py-3 text-[13px] text-neutral-900 outline-none focus:border-[#582D2D]/30 transition-all shadow-sm h-[46px]"
              />
              <Button
                type="submit"
                className="bg-[#582D2D] text-white hover:bg-[#4a2626] rounded-[10px] px-6 text-[13px] font-medium shadow-sm transition-all h-[46px] shrink-0 active:scale-95"
              >
                Subscribe
              </Button>
            </form>
          </div>

          {/* Explore */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h5 className="text-[14px] font-bold uppercase tracking-wider text-[#582D2D] font-playfair">
              Explore
            </h5>
            <ul className="flex flex-col gap-3 text-[13px] text-neutral-600">
              <li><Link className="hover:text-[#582D2D] transition-colors" href="/">Home</Link></li>
              <li><Link className="hover:text-[#582D2D] transition-colors" href="/about">About us</Link></li>
              <li><Link className="hover:text-[#582D2D] transition-colors" href="/become-a-host">Partner with us</Link></li>
              <li><Link className="hover:text-[#582D2D] transition-colors" href="/blog">Blog</Link></li>
              <li><Link className="hover:text-[#582D2D] transition-colors" href="/contact">Contact us</Link></li>
              <li><Link className="hover:text-[#582D2D] transition-colors" href="/terms-and-conditions">Terms and Conditions</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <h5 className="text-[14px] font-bold uppercase tracking-wider text-[#582D2D] font-playfair">
              Collections
            </h5>
            <ul className="flex flex-col gap-3 text-[13px] text-neutral-600">
              <li><Link className="hover:text-[#582D2D] transition-colors" href="/stays?category=luxury">Luxury Villas</Link></li>
              <li><Link className="hover:text-[#582D2D] transition-colors" href="/stays?category=beach">Walk to the Beach</Link></li>
              <li><Link className="hover:text-[#582D2D] transition-colors" href="/stays?category=views">Expansive Views</Link></li>
              <li><Link className="hover:text-[#582D2D] transition-colors" href="/stays?category=romantic">Romantic Jacuzzi Escapes</Link></li>
              <li><Link className="hover:text-[#582D2D] transition-colors" href="/stays">All Stays</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 md:mt-20 border-t border-neutral-100 pt-8 flex flex-col items-center justify-between gap-6 md:flex-row text-[11px] text-neutral-400 tracking-wide uppercase">
          <div className="text-center md:text-left order-2 md:order-1">
            © {new Date().getFullYear()} Pink Papaya Stays. All rights reserved
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 order-1 md:order-2">
            <Link className="hover:text-[#582D2D] transition-colors" href="/privacy-policy">Privacy Policy</Link>
            <Link className="hover:text-[#582D2D] transition-colors" href="/terms-and-conditions">Terms and Conditions</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
