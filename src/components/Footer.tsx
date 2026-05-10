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
                className="h-auto w-[120px] md:w-[136px]"
              />
              <p className="text-[13px] text-neutral-400 max-w-[220px] leading-relaxed">
                Thoughtfully designed stays for rest and calm in Goa.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {[
                { href: "https://instagram.com", Icon: PiInstagramLogo, label: "Instagram" },
                { href: "https://spotify.com", Icon: PiSpotifyLogo, label: "Spotify" },
                { href: "https://linktr.ee", Icon: PiLinktreeLogo, label: "Linktree" },
              ].map(({ href, Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-all hover:border-[#16323C] hover:text-[#16323C]"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 md:col-span-4 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h5 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-neutral-800">
                Stories from the coast
              </h5>
              <p className="text-[12.5px] text-neutral-400 leading-relaxed">
                Interiors, escapes & thoughtful living — monthly
              </p>
            </div>

            <form action="#" method="post" className="flex items-center gap-2 max-w-md w-full">
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="flex-1 min-w-0 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-[12.5px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#16323C]/40 transition-all h-[42px]"
              />
              <Button type="submit" size="sm" className="h-[42px] shrink-0 text-[12px] px-5">
                Subscribe
              </Button>
            </form>
          </div>

          {/* Explore */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <h5 className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Explore
            </h5>
            <ul className="flex flex-col gap-2.5 text-[13px] text-neutral-500">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About us" },
                { href: "/partner-with-us", label: "Partner with us" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact us" },
                { href: "/terms-and-conditions", label: "Terms" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link className="hover:text-[#16323C] transition-colors" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div className="md:col-span-3 flex flex-col gap-5">
            <h5 className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Collections
            </h5>
            <ul className="flex flex-col gap-2.5 text-[13px] text-neutral-500">
              {[
                { href: "/stays?category=luxury", label: "Luxury Villas" },
                { href: "/stays?category=beach", label: "Walk to the Beach" },
                { href: "/stays?category=views", label: "Expansive Views" },
                { href: "/stays?category=romantic", label: "Romantic Jacuzzi Escapes" },
                { href: "/stays", label: "All Stays" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link className="hover:text-[#16323C] transition-colors" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 md:mt-20 border-t border-neutral-100 pt-8 flex flex-col items-center justify-between gap-4 md:flex-row text-[10.5px] text-neutral-400 tracking-wide uppercase">
          <div className="text-center md:text-left order-2 md:order-1">
            © {new Date().getFullYear()} Pink Papaya Stays. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 order-1 md:order-2">
            <Link className="hover:text-neutral-700 transition-colors" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="hover:text-neutral-700 transition-colors" href="/terms-and-conditions">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
