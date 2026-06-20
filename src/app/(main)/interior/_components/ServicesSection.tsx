import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";

const SERVICES = [
  { num: "01", label: "Complete Project Realisation" },
  { num: "02", label: "Furnishing & Spatial Composition" },
  { num: "03", label: "Off-Site Project Oversight" },
  { num: "04", label: "Remote Design Framework" },
  { num: "05", label: "Private Design Advisory" },
  { num: "06", label: "Final Styling & Calibration" },
];

// Pair into rows of 2
const ROWS = SERVICES.reduce<(typeof SERVICES)[]>((acc, s, i) => {
  if (i % 2 === 0) acc.push([s]);
  else acc[acc.length - 1].push(s);
  return acc;
}, []);

export default function ServicesSection() {
  return (
    <section className="bg-white pt-8 pb-3 lg:pt-[5%] lg:pb-4">
      <Container>
        <div className="h-px bg-neutral-200 mb-14 md:mb-20" />

        {/* Main row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-12 lg:gap-20">

          {/* Left — label */}
          <Reveal>
            <h2
              className="font-playfair font-normal text-[#16323C] mb-5"
              style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)" }}
            >
              Services
            </h2>
            <p className="font-bricolage text-[9px] uppercase tracking-[0.22em] font-semibold text-[#16323C]">
              Defined Offerings. Singular Intent.
            </p>
          </Reveal>

          {/* Right — numbered 2-col grid */}
          <div>
            {ROWS.map((row, ri) => (
              <Reveal key={ri} delay={ri * 0.07}>
                <div className="grid grid-cols-2 gap-x-8 py-5 border-b border-neutral-200 first:border-t first:border-neutral-200">
                  {row.map((s) => (
                    <div key={s.num} className="flex items-baseline gap-4">
                      <span className="font-bricolage text-[11px] text-neutral-400 shrink-0 w-5">{s.num}</span>
                      <span
                        className="font-playfair font-normal text-[#16323C]"
                        style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}

            {/* Closing quote */}
            <Reveal delay={0.25}>
              <p
                className="font-playfair italic font-normal text-[#16323C] text-center mt-16 md:mt-20 leading-snug"
                style={{ fontSize: "clamp(1.3rem, 2.2vw, 2rem)" }}
              >
                Every engagement is guided by the same objective: a space that feels inevitable.
              </p>
            </Reveal>
          </div>

        </div>
      </Container>
    </section>
  );
}
