import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-[#F7F2EA] flex flex-col items-center justify-center text-center py-10 md:py-[5%]">
      <Reveal>
        <h2 className="font-playfair italic font-normal text-[#16323C] mb-6 md:mb-10" style={{ fontSize: "clamp(2.4rem, 6vw, 6rem)", lineHeight: 1.05 }}>
          Inquire for your stay.
        </h2>
        <Button asChild variant="accent" size="lg" className="font-bricolage uppercase tracking-[0.15em] rounded-full px-12">
          <Link href="/stays">Connect With Us</Link>
        </Button>
      </Reveal>
    </section>
  );
}
