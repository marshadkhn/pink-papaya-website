import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";

export default function NarrativeSection() {
  return (
    <section className="bg-[#F7F2EA] py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-neutral-200 w-full" style={{ aspectRatio: "4 / 5" }}>
              <Image src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80" alt="Pink Papaya interior narrative" fill className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-bricolage text-[11px] uppercase tracking-[0.18em] text-[#C07A5A] mb-6">
              The Narrative
            </p>
            <h2
              className="font-playfair italic font-normal text-[#16323C] mb-8"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.1 }}
            >
              Every room holds<br />a quiet story.
            </h2>
            <p className="font-bricolage text-[#16323C]/70 text-[15px] leading-relaxed mb-5">
              We believe that the best interiors are ones you stop noticing — not because they are forgettable, but because they feel so completely right. The materiality, the proportion, the light: all of it in conversation.
            </p>
            <p className="font-bricolage text-[#16323C]/50 text-[15px] leading-relaxed">
              Our process begins with listening. We observe how a family moves through a home, where the morning light falls, and what rituals matter most. Then we build around those truths.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
