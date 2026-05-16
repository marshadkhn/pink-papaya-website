import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";

export default function HostingReadySection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-center">

          {/* Left — landscape image */}
          <Reveal>
            <div
              className="relative w-full overflow-hidden bg-neutral-200 rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.07)]"
              style={{ aspectRatio: "16 / 10" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80"
                alt="Hosting-ready residence"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Right — text */}
          <Reveal delay={0.12}>
            <p className="font-bricolage text-[9px] uppercase tracking-[0.22em] font-semibold text-[#16323C] mb-5">
              Hosting-Ready Residences
            </p>
            <h2
              className="font-playfair font-normal text-[#16323C] mb-7 leading-[1.15]"
              style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)" }}
            >
              Homes designed to remain ready.
            </h2>
            <p className="font-bricolage text-neutral-500 text-[14px] leading-relaxed">
              A complete approach for residences used intermittently, for short-term stays—where consistency, durability, and ease are essential. Interiors are composed to function without effort.
            </p>
          </Reveal>

        </div>
      </Container>
    </section>
  );
}
