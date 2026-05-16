import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";

export default function SideStorySection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal delay={0.1} className="order-2 lg:order-1">
            <p className="font-bricolage text-[11px] uppercase tracking-[0.18em] text-[#C07A5A] mb-6">
              Side Story
            </p>
            <h2
              className="font-playfair italic font-normal text-[#16323C] mb-8"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.1 }}
            >
              Detail is never<br />an afterthought.
            </h2>
            <p className="font-bricolage text-[#16323C]/70 text-[15px] leading-relaxed mb-5">
              From the curve of a door handle to the texture of a wall finish, every element earns its place. We source materials that develop character over time and furniture that carries the weight of good craft.
            </p>
            <p className="font-bricolage text-[#16323C]/50 text-[15px] leading-relaxed">
              The result is interiors that feel anchored — present in their moment, yet quietly timeless.
            </p>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-200 w-full" style={{ aspectRatio: "4 / 5" }}>
              <Image src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&q=80" alt="Pink Papaya interior detail" fill className="object-cover" />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
