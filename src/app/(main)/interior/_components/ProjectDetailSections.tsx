import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";
import type { InteriorProject } from "@/data/interior";
import { ArrowRight } from "lucide-react";

export default function ProjectDetailSections({ projects }: { projects: InteriorProject[] }) {
  const visible = projects.filter(
    (p) => p.longDescription?.length || p.photos?.length
  );
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((project, i) => (
        <ProjectSection key={project.id} project={project} index={i} />
      ))}
    </>
  );
}

function ProjectSection({ project, index }: { project: InteriorProject; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        {/* Hairline + badge */}
        <div className="h-px bg-neutral-200 mb-12 md:mb-16" />
        <Reveal>
          <div className="flex items-center justify-between mb-10 md:mb-14">
            {project.badge && (
              <p className="font-bricolage text-[9px] uppercase tracking-[0.22em] font-semibold text-neutral-400">
                {project.badge}
              </p>
            )}
            <Link
              href={`/interior/${project.id}`}
              className="flex items-center gap-1.5 font-bricolage text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-[#16323C] transition-colors group"
            >
              View project
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </Reveal>

        {/* Main grid — alternates text/gallery side each project */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start ${
            isEven ? "" : "lg:[&>*:first-child]:order-2"
          }`}
        >
          {/* Text block */}
          <Reveal delay={0.05}>
            <div className="flex flex-col gap-6">
              <h2
                className="font-playfair font-normal text-[#16323C] leading-[1.1]"
                style={{ fontSize: "clamp(1.8rem, 3.2vw, 3rem)" }}
              >
                {project.headline || project.title}
              </h2>

              {project.tagline && (
                <p
                  className="font-playfair italic font-normal text-neutral-400"
                  style={{ fontSize: "clamp(1rem, 1.6vw, 1.3rem)" }}
                >
                  {project.tagline}
                </p>
              )}

              {project.longDescription?.map((para, pi) => (
                <p
                  key={pi}
                  className="font-bricolage text-[#16323C]/70 text-[14px] leading-relaxed"
                >
                  {para}
                </p>
              ))}

              {project.description && !project.longDescription?.length && (
                <p className="font-bricolage text-[#16323C]/70 text-[14px] leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>
          </Reveal>

          {/* Photo gallery */}
          {project.photos && project.photos.length > 0 && (
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                {project.photos.slice(0, 4).map((src, pi) => (
                  <div
                    key={pi}
                    className={`relative overflow-hidden rounded-sm bg-neutral-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)] ${
                      pi === 0 ? "col-span-2" : ""
                    }`}
                    style={{ aspectRatio: pi === 0 ? "16 / 9" : "4 / 3" }}
                  >
                    <Image
                      src={src}
                      alt={`${project.headline || project.title} — photo ${pi + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        {/* Before / After strip — if data exists */}
        {project.beforeAfter && project.beforeAfter.length === 2 && (
          <Reveal delay={0.15}>
            <div className="mt-10 md:mt-14">
              <p className="font-bricolage text-[9px] uppercase tracking-[0.22em] text-neutral-400 mb-5">
                Before &amp; After
              </p>
              <div className="grid grid-cols-2 gap-3">
                {project.beforeAfter.map((src, bi) => (
                  <div
                    key={bi}
                    className="relative overflow-hidden rounded-sm bg-neutral-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                    style={{ aspectRatio: "4 / 3" }}
                  >
                    <Image
                      src={src}
                      alt={bi === 0 ? "Before" : "After"}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-3 left-3 font-bricolage text-[8px] uppercase tracking-[0.2em] text-white bg-black/40 px-2 py-1 rounded-sm">
                      {bi === 0 ? "Before" : "After"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
