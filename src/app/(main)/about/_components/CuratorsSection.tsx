import Container from "@/components/Container";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

const CURATORS = [
  { src: "/images/mishika.svg", name: "Mishika Chowdhary", role: "Founder" },
  { src: "/images/vani.svg",    name: "Vanni Sharma",      role: "Co-Founder" },
  { src: "/images/shika.svg",   name: "Shikha Chowdhary", role: "Director & Interior Design" },
];

export default function CuratorsSection() {
  return (
    <section className="bg-white py-[5%]">
      <Container>
        <Reveal>
          <h2 className="font-playfair italic font-normal text-[#16323C] text-center mb-16 md:mb-20" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
            The Curators
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
          {CURATORS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div className="flex flex-col items-center">
                <div className="w-full relative rounded-2xl overflow-hidden bg-neutral-200" style={{ aspectRatio: "3 / 4.4" }}>
                  <Image src={p.src} alt={p.name} fill className="object-cover block" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <p className="font-playfair italic text-[#16323C] text-xl mt-5">{p.name}</p>
                <p className="font-bricolage text-[10px] uppercase tracking-[0.18em] text-neutral-400 mt-1.5 text-center">{p.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
