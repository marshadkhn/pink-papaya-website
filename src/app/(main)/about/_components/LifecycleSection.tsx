import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";

const PHASES = [
  { phase: "PHASE I",   title: "Visit",           body: "Escape for a break and soak up the atmosphere. Enjoy premium amenities and attentive service—so inviting you may prolong your visit.",                                                                                                                        cta: "DISCOVER STAYS",  href: "/stays" },
  { phase: "PHASE II",  title: "Reside",          body: "Residences that adapt to your pace: from compact city pads to expansive beachfront retreats. Settle in long-term or transition between styles with ease.",                                                                                                    cta: "DISCOVER LIVE",   href: "/stays" },
  { phase: "PHASE III", title: "Own",             body: "If a location captures your heart, consider ownership. Move in, or generate income by listing it—our team manages every detail.",                                                                                                                              cta: "DISCOVER BELONG", href: "/partner-with-us" },
  { phase: "PHASE IV",  title: "Belong/\nDesign", body: "We design interiors that fuse regional character with contemporary comfort—curating bespoke furnishings, refined color palettes, and layouts to elevate functionality and aesthetic—and offering styling for guest-ready spaces.",                             cta: "DISCOVER DESIGN", href: "/partner-with-us" },
];

export default function LifecycleSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="flex items-center gap-6 mb-16 md:mb-20">
            <h2 className="font-playfair italic font-normal text-[#16323C] shrink-0" style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}>
              Lifecycle of Stay
            </h2>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASES.map((item, i) => (
            <Reveal key={item.phase} delay={i * 0.08}>
              <div className="flex flex-col h-full bg-[#F7F2EA] rounded-2xl p-7 md:p-8 min-h-[420px]">
                <p className="font-bricolage text-[10px] uppercase tracking-[0.18em] text-neutral-400 mb-6">{item.phase}</p>
                <h3 className="font-playfair italic font-normal text-[#16323C] mb-6 whitespace-pre-line" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", lineHeight: 1.15 }}>
                  {item.title}
                </h3>
                <p className="font-bricolage text-[#16323C]/65 text-sm leading-relaxed flex-1">{item.body}</p>
                <Link
                  href={item.href}
                  className="mt-8 font-bricolage text-[11px] uppercase tracking-[0.16em] font-semibold text-[#C07A5A] border-b border-[#C07A5A] pb-0.5 self-start transition-opacity hover:opacity-70"
                >
                  {item.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
