import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";

const ITEMS = [
  { label: "01 / Foundation", body: "Pink Papaya Stays was born from a singular frustration with the \"standardized\" luxury market. We believed that true hospitality required more than high-thread counts; it required a structural dialogue between the inhabitant and the environment." },
  { label: "02 / Curation", body: "Our team approaches every property as a living archive. We don't just manage spaces; we curate artifacts of living. Every piece of furniture, every lighting fixture, and every textural choice is mathematically balanced for harmony." },
  { label: "03 / Evolution", body: "As we expand, our focus remains on the \"Small Precision\"—the ability to maintain architectural integrity while providing seamless, invisible service that anticipates every human need before it arises." },
  { label: "04 / Legacy", body: "We are building more than a stay; we are building a movement in modern hospitality that respects the past while strictly adhering to the technical possibilities of the future." },
];

export default function OriginSection() {
  return (
    <section className="bg-white py-[5%]">
      <Container>
        <div className="h-px bg-neutral-200 mb-16 md:mb-20" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <Reveal>
            <h2 className="font-playfair italic font-normal text-[#16323C]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.1 }}>
              The Origin.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
            {ITEMS.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08}>
                <p className="font-bricolage text-[11px] uppercase tracking-[0.14em] text-[#C07A5A] mb-4">{item.label}</p>
                <p className="font-bricolage text-[#16323C]/80 text-[15px] leading-relaxed">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
