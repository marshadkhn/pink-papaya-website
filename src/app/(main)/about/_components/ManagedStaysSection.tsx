import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";

export default function ManagedStaysSection() {
  return (
    <section className="bg-[#F7F2EA] py-[5%]">
      <Container>
        <Reveal>
          <h2 className="font-playfair italic font-normal text-[#16323C] text-center mb-12 md:mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Managed Stays
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

          <Reveal delay={0}>
            <div className="bg-white rounded-2xl p-8">
              <div className="text-[#C07A5A] mb-6">
                <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4M6 8l2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-playfair text-[#16323C] text-xl font-medium mb-4 leading-snug">Full-service management</h3>
              <p className="font-bricolage text-neutral-500 text-sm leading-relaxed">End-to-end marketing, guest communication, housekeeping, maintenance, and assistance with local permits and licensing.</p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-5">
            <Reveal delay={0.08}>
              <div className="bg-white rounded-2xl p-8">
                <div className="text-[#C07A5A] mb-6">
                  <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <polyline strokeLinecap="round" strokeLinejoin="round" points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline strokeLinecap="round" strokeLinejoin="round" points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <h3 className="font-playfair text-[#16323C] text-xl font-medium mb-4 leading-snug">Revenue optimization</h3>
                <p className="font-bricolage text-neutral-500 text-sm leading-relaxed">Dynamic pricing and market insights to increase returns.</p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="bg-white rounded-2xl p-8">
                <div className="text-[#C07A5A] mb-6">
                  <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-playfair text-[#16323C] text-xl font-medium mb-4 leading-snug">Rigorous standards</h3>
                <p className="font-bricolage text-neutral-500 text-sm leading-relaxed">Each property passes a detailed 200+ point inspection and a careful selection process emphasizing personality, quality, and comfort before joining our portfolio.</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="bg-white rounded-2xl p-8 md:mt-20">
              <div className="text-[#C07A5A] mb-6">
                <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="font-playfair text-[#16323C] text-xl font-medium mb-4 leading-snug">Concierge-level guest experience</h3>
              <p className="font-bricolage text-neutral-500 text-sm leading-relaxed">Seamless check-ins, responsive support, and curated local recommendations.</p>
            </div>
          </Reveal>

        </div>
      </Container>
    </section>
  );
}
