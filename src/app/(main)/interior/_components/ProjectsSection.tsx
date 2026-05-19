import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";
import type { InteriorProject } from "@/data/interior";

export default function ProjectsSection({ projects }: { projects: InteriorProject[] }) {
  if (projects.length === 0) return null;

  const leftCol = projects.filter((_, i) => i % 2 === 0);
  const rightCol = projects.filter((_, i) => i % 2 === 1);

  return (
    <section className="bg-white py-[5%]">
      <Container>
        <div className="h-px bg-neutral-200 mb-14 md:mb-20" />

        {/* Header row */}
        <div className="flex items-start justify-between gap-10 mb-16 md:mb-20">
          <div className="max-w-[380px]">
            <Reveal>
              <h2 className="font-playfair font-normal text-[#16323C] mb-4" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)" }}>
                Projects
              </h2>
              <p className="font-bricolage text-neutral-500 text-[13.5px] leading-relaxed">
                A collection of residences across Goa, designed for both private living and guest stays. Each project is approached as a complete composition—where space, material, and environment exist in balance.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="font-bricolage text-[9px] uppercase tracking-[0.22em] text-neutral-400 text-right shrink-0 mt-1">
              A detailed portfolio is available upon request.
            </p>
          </Reveal>
        </div>

        {/* Staggered 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-10 items-start">
          {/* Left column */}
          <div className="flex flex-col gap-10">
            {leftCol.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.1}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>

          {/* Right column — offset down */}
          <div className="flex flex-col gap-10 md:mt-32">
            {rightCol.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.1 + 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProjectCard({ project }: { project: InteriorProject }) {
  return (
    <Link href={`/interior/${project.id}`} className="group block">
      <div
        className="relative w-full overflow-hidden bg-neutral-200 rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
        style={{ aspectRatio: "3 / 4" }}
      >
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}
        {/* Subtle centered label on image (matches design placeholder text) */}
        {!project.imageUrl && (
          <span className="absolute inset-0 flex items-center justify-center font-bricolage text-[9px] uppercase tracking-[0.22em] text-neutral-400">
            {project.headline || project.title}
          </span>
        )}
      </div>
      <h3
        className="font-playfair font-normal text-[#16323C] mt-4 group-hover:opacity-70 transition-opacity"
        style={{ fontSize: "clamp(1.2rem, 2vw, 1.7rem)" }}
      >
        {project.headline || project.title}
      </h3>
    </Link>
  );
}
