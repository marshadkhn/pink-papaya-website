import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";

export default function HeroSection() {
  return (
    <section
      className="relative bg-white overflow-hidden"
      style={{ isolation: "isolate", minHeight: "calc(80vh - var(--navbar-h))" }}
    >
      <div
        className="absolute overflow-hidden shadow-2xl"
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
        className="absolute overflow-hidden shadow-2xl"
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
          style={{ zIndex: 2, paddingTop: "var(--navbar-h)", paddingBottom: "6rem", maxWidth: "58%" }}
        >
          <Reveal>
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
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
