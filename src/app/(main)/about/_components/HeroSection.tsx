import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";

export default function HeroSection() {
  return (
    <section
      className="relative bg-white overflow-hidden min-h-[calc(50vh_-_var(--navbar-h))] md:min-h-[calc(80vh_-_var(--navbar-h))] mt-6 md:mt-[5%]"
      style={{ isolation: "isolate" }}
    >
      <div
        className="absolute overflow-hidden shadow-2xl w-[28%] md:w-[25%] left-[45%] md:left-[40%] top-[calc(var(--navbar-h)_+_16px)]"
        style={{
          aspectRatio: "3 / 4.2",
          transform: "rotate(-6deg)", borderRadius: "22px", zIndex: 1,
        }}
      >
        <Image src="/images/stay-view.png" alt="Pink Papaya interiors" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div
        className="absolute overflow-hidden shadow-2xl w-[32%] md:w-[29%] left-[67%] md:left-[64%] top-[calc(var(--navbar-h)_-_20px)]"
        style={{
          aspectRatio: "3 / 4",
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
            <div className="max-w-[42%] md:max-w-[58%] pb-8 md:pb-24">
              <h1 className="font-playfair font-medium text-[#16323C]" style={{ fontSize: "clamp(1.8rem, 9.5vw, 9rem)", lineHeight: 0.92 }}>
                About
              </h1>
              <h1 className="font-playfair font-medium italic text-[#C07A5A]" style={{ fontSize: "clamp(1.8rem, 9.5vw, 9rem)", lineHeight: 0.92 }}>
                Pink
              </h1>
              <h1 className="font-playfair font-medium text-[#16323C]" style={{ fontSize: "clamp(1.8rem, 9.5vw, 9rem)", lineHeight: 0.92 }}>
                Papaya
              </h1>
              <h1 className="font-playfair font-medium text-[#16323C]" style={{ fontSize: "clamp(1.8rem, 9.5vw, 9rem)", lineHeight: 0.92 }}>
                Stays
              </h1>
              <p className="font-bricolage text-neutral-400 text-base leading-relaxed mt-7 max-w-[280px]">
                Architectural sanctuaries designed for the modern wanderer. We blend the warmth of home with the precision of a gallery.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
