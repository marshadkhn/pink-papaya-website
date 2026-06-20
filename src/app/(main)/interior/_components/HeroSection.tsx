import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section
      className="bg-white grid grid-cols-1 lg:grid-cols-2"
      style={{ minHeight: "calc(100vh - var(--navbar-h))", paddingTop: "var(--navbar-h)" }}
    >
      <div className="flex flex-col justify-center px-[5%] sm:px-8 md:px-14 lg:px-16 xl:px-20 py-16 lg:py-24">
        <Reveal>
          <h1
            className="font-playfair font-normal text-[#16323C] leading-[1.08]"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.8rem)" }}
          >
            Refined Spaces.<br className="hidden md:inline" />{" "}
            Effortlessly Lived In.<br className="hidden md:inline" />{" "}
            Designed with precision.<br className="hidden md:inline" />{" "}
            Experienced with ease.
          </h1>

          <p className="font-bricolage text-neutral-500 text-[14px] leading-relaxed mt-10 max-w-[400px]">
            Pink Papaya Studio creates interiors where architecture, material, and atmosphere are held in quiet balance. Based in Goa, each space is shaped by light, climate, and landscape—resulting in homes that feel settled, enduring, and complete.
          </p>

          <div className="grid grid-cols-2 gap-8 mt-10 pt-8 border-t border-neutral-150 max-w-[400px]">
            <div>
              <p className="font-bricolage text-[9px] uppercase tracking-[0.2em] text-[#16323C] font-semibold mb-3">
                A Slower Way of Living
              </p>
              <p className="font-bricolage text-neutral-500 text-[12.5px] leading-relaxed">
                These are homes defined by absence as much as presence. They hold their composure when unoccupied.
              </p>
            </div>
            <div>
              <p className="font-bricolage text-[9px] uppercase tracking-[0.2em] text-[#16323C] font-semibold mb-3">
                Philosophy
              </p>
              <ul className="flex flex-col gap-1.5">
                {["Clarity over complexity", "Material honesty", "Measured restraint"].map((item) => (
                  <li key={item} className="font-bricolage text-neutral-500 text-[12.5px]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10">
            <Button asChild variant="black" size="lg" className="font-bricolage uppercase tracking-[0.16em]">
              <Link href="/contact">Enquire Now</Link>
            </Button>
          </div>
        </Reveal>
      </div>

      <div className="hidden lg:flex items-start justify-center px-8 xl:px-14" style={{ paddingTop: "5vh", paddingBottom: "5vh" }}>
        <Reveal className="w-full max-w-[480px] h-full" delay={0.15}>
          <div className="relative w-full rounded-2xl overflow-hidden bg-neutral-100" style={{ aspectRatio: "3 / 4" }}>
            <Image
              src="/images/coastal-calm.png"
              alt="Pink Papaya interior"
              fill
              className="object-cover"
              priority
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
