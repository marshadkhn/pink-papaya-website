import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";

export default function HeroSection() {
  return (
    <section
      className="relative bg-white overflow-hidden"
      style={{ isolation: "isolate", minHeight: "calc(80vh - var(--navbar-h))", marginTop: "5%" }}
    >
      <div
        className="absolute overflow-hidden shadow-2xl hidden md:block"
        style={{
          width: "25%", aspectRatio: "3 / 4.2",
          top: "calc(var(--navbar-h) + 16px)", left: "40%",
          transform: "rotate(-6deg)", borderRadius: "22px", zIndex: 1,
        }}
      >
        <Image src="/images/stay-view.png" alt="Pink Papaya interiors" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div
        className="absolute overflow-hidden shadow-2xl hidden md:block"
        style={{
          width: "29%", aspectRatio: "3 / 4",
          top: "calc(var(--navbar-h) - 20px)", left: "64%",
          transform: "rotate(4deg)", borderRadius: "22px", zIndex: 1,
        }}
      >
        <Image src="/images/host-pool.png" alt="Pink Papaya stay details" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <Container>
        <div
          className="relative"
          style={{ zIndex: 2, paddingTop: "var(--navbar-h)" }}
        >
          <Reveal>
            <div className="max-w-full md:max-w-[58%] pb-8 md:pb-24">
              <h1 className="font-playfair font-medium text-[#16323C]" style={{ fontSize: "clamp(3.5rem, 9.5vw, 9rem)", lineHeight: 0.92 }}>
                About
              </h1>
              <h1 className="font-playfair font-medium italic text-[#C07A5A]" style={{ fontSize: "clamp(3.5rem, 9.5vw, 9rem)", lineHeight: 0.92 }}>
                Pink
              </h1>
              <h1 className="font-playfair font-medium text-[#16323C]" style={{ fontSize: "clamp(3.5rem, 9.5vw, 9rem)", lineHeight: 0.92 }}>
                Papaya
              </h1>
              <h1 className="font-playfair font-medium text-[#16323C]" style={{ fontSize: "clamp(3.5rem, 9.5vw, 9rem)", lineHeight: 0.92 }}>
                Stays
              </h1>
              <p className="font-bricolage text-neutral-400 text-base leading-relaxed mt-7 max-w-[280px]">
                Architectural sanctuaries designed for the modern wanderer. We blend the warmth of home with the precision of a gallery.
              </p>
            </div>

            {/* Mobile Images Layout */}
            <div className="flex items-center justify-center gap-8 mt-6 mb-12 md:hidden px-4">
              <div
                className="relative overflow-hidden shadow-xl shrink-0"
                style={{
                  width: "44%",
                  aspectRatio: "3 / 4.2",
                  transform: "rotate(-6deg)",
                  borderRadius: "16px",
                }}
              >
                <Image src="/images/stay-view.png" alt="Pink Papaya interiors" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50" />
              </div>

              <div
                className="relative overflow-hidden shadow-xl shrink-0"
                style={{
                  width: "44%",
                  aspectRatio: "3 / 4",
                  transform: "rotate(4deg)",
                  borderRadius: "16px",
                }}
              >
                <Image src="/images/host-pool.png" alt="Pink Papaya stay details" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
