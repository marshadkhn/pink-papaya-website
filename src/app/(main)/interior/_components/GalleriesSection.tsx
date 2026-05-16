import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";
import type { InteriorProject } from "@/data/interior";

export default function GalleriesSection({ projects }: { projects: InteriorProject[] }) {
  const withPhotos = projects.filter((p) => p.photos && p.photos.length > 0);
  if (withPhotos.length === 0) return null;

  return (
    <>
      {withPhotos.map((project, pi) => (
        <section key={`gallery-${project.id}`} className="bg-white py-20 md:py-28">
          <Container>
            <Reveal>
              <div className="flex items-center gap-6 mb-12 md:mb-16">
                <p className="font-bricolage text-[10px] uppercase tracking-[0.18em] text-neutral-400 shrink-0">
                  {project.badge || `Project ${pi + 1}`}
                </p>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>
              <h2
                className="font-playfair font-medium text-[#16323C] mb-10"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
              >
                {project.headline || project.title}
                <span className="font-playfair italic font-normal text-neutral-400 ml-3 text-[0.8em]">
                  — Interiors
                </span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {(project.photos ?? []).slice(0, 6).map((src, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div
                    className="relative overflow-hidden rounded-xl bg-neutral-100"
                    style={{ aspectRatio: i === 0 ? "16 / 10" : "4 / 3" }}
                  >
                    <Image src={src} alt={`${project.title} interior ${i + 1}`} fill className="object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
