import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";

const LIST_ITEMS = [
  "A material language grounded in place",
  "Light as a primary design element",
  "Spatial clarity that supports daily living",
  "Interiors designed to endure, not impress.",
];

export default function AboutSection() {
  return (
    <section className="bg-white py-[5%]">
      <Container>
        <div className="h-px bg-neutral-200 mb-16 md:mb-24" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-12 lg:gap-20">

          {/* Left — label */}
          <Reveal>
            <p className="font-playfair text-[#16323C] text-lg">About</p>
          </Reveal>

          {/* Right — content */}
          <div>
            <Reveal>
              <p
                className="font-playfair font-normal text-[#16323C] leading-[1.15] mb-14 md:mb-20"
                style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.8rem)" }}
              >
                Pink Papaya Studio is a design practice focused on refined residential environments. Our work is guided by proportion, natural light, and the inherent qualities of materials—creating spaces that are both precise and deeply at ease.
              </p>
            </Reveal>

            {/* Two-col sub-grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <Reveal delay={0.08}>
                <p className="font-bricolage text-[10px] uppercase tracking-[0.2em] font-semibold text-[#16323C] mb-4">
                  Design &amp; Atmosphere
                </p>
                <p className="font-bricolage text-neutral-500 text-[13.5px] leading-relaxed">
                  We begin with space—clear, ordered, and intentional. Materials are chosen for how they perform over time: fabrics that soften, surfaces that acquire depth, and art that brings quiet presence to the space.
                </p>
              </Reveal>

              <Reveal delay={0.14}>
                <p className="font-bricolage text-[10px] uppercase tracking-[0.2em] font-semibold text-[#16323C] mb-4">
                  What Defines Our Work
                </p>
                <ul className="flex flex-col gap-3 mb-6">
                  {LIST_ITEMS.map((item) => (
                    <li key={item} className="font-bricolage text-neutral-500 text-[13.5px]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-bricolage text-[#16323C] text-[13.5px] font-semibold leading-snug">
                  The result is a home that feels quiet, grounded, and complete.
                </p>
              </Reveal>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
