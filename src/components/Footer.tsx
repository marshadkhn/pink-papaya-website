import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PiInstagramLogo, PiSpotifyLogo, PiLinktreeLogo } from "react-icons/pi";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#F9F7F4] text-[#1a1a1a] pb-12 pt-16 md:pt-20 font-bricolage shadow-[0_-8px_30px_rgba(0,0,0,0.05)] z-20">
      
      {/* Wrapper to clip background graphic without clipping the footer's shadow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Background Cartoon Graphic */}
        <div className="absolute left-0 bottom-0 w-[350px] md:w-[500px] opacity-20 mix-blend-multiply z-0">
          <Image 
            src="/images/cartoon.svg" 
            alt="Background illustration" 
            width={500} 
            height={500} 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      <Container className="relative z-10">
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
              <p className="text-[13px] text-neutral-500 max-w-[220px] leading-relaxed">
                Thoughtfully designed stays for rest and calm in Goa. Experience the finest curated homes.
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-all duration-200 hover:border-[#16323C] hover:text-[#16323C] hover:-translate-y-0.5 hover:scale-[1.08] active:scale-[0.95]"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
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
                { href: "/interior", label: "Interior" },
                { href: "/partner-with-us", label: "Partner with us" },
                { href: "/blog", label: "Blog" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link className="hover:text-[#16323C] hover:translate-x-1 transition-all duration-200 inline-block" href={href}>
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
                { href: "/stays?category=romantic", label: "Romantic Jacuzzi" },
                { href: "/stays", label: "All Stays" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link className="hover:text-[#16323C] hover:translate-x-1 transition-all duration-200 inline-block" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-5">
              <h5 className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                Get in Touch
              </h5>
              <div className="flex flex-col gap-3 text-[13px] text-neutral-500 font-bricolage">
                <p>
                  <strong className="text-neutral-700 font-semibold block mb-0.5">Reservations & Enquiries</strong>
                  <a href="mailto:hello@pinkpapayastays.com" className="hover:text-[#16323C] transition-colors">hello@pinkpapayastays.com</a><br/>
                  <a href="tel:+919876543210" className="hover:text-[#16323C] transition-colors">+91 98765 43210</a>
                </p>
                <p>
                  <strong className="text-neutral-700 font-semibold block mb-0.5">Office</strong>
                  Pink Papaya Stays,<br/>
                  Vagator, North Goa, 403509
                </p>
              </div>
            </div>
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
