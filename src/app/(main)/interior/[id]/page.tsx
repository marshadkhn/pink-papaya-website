import Container from "@/components/Container";
import { interiorProjects } from "@/data/interior";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Bilbo_Swash_Caps } from "next/font/google";

// Bilbo Swash Caps from Google Fonts
const bilboSwash = Bilbo_Swash_Caps({ subsets: ["latin"], weight: "400", display: "swap" });

export default function InteriorDetailPage({ params }: { params: { id: string } }) {
  const project = interiorProjects.find((p) => p.id === params.id);
  if (!project) return notFound();

  return (
    <>
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Left: Image */}
            <div className="lg:col-span-6">
              <Card className="!rounded-none !border-0 overflow-hidden bg-neutral-200">
                <div className="relative w-full pt-[100%]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.imageUrl})` }}
                  />
                </div>
              </Card>
            </div>

            {/* Right: Badge, title, tagline, description */}
            <div className="lg:col-span-6">
              <div className="flex flex-col gap-4">
                {project.badge ? (
                  <div>
                    <span className="inline-block text-xs tracking-wide uppercase  py-1">
                      {project.badge}
                    </span>
                  </div>
                ) : null}
                <h1 className="font-playfair text-3xl md:text-4xl text-neutral-900">
                  {project.headline || project.title}
                </h1>
                {project.tagline ? (
                  <p className={`${bilboSwash.className} text-2xl md:text-3xl text-neutral-800`}>
                    {project.tagline}
                  </p>
                ) : null}
                {project.longDescription?.length ? (
                  <div className="flex flex-col gap-4">
                    {project.longDescription.map((para, idx) => (
                      <p key={idx} className="text-neutral-700 leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* All Photos grid 2 by 3 */}
      {project.photos?.length ? (
        <section className="py-10 md:py-14">
          <Container>
            <div className="mb-6 md:mb-8 ">
              <h2 className="font-playfair text-center  text-2xl md:text-3xl text-neutral-900">All Photos</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {project.photos.slice(0, 6).map((src, i) => (
                <Card key={i} className="!rounded-none !border-0 overflow-hidden bg-neutral-200">
                  <div className="relative w-full pt-[100%]">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${src})` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Before and After */}
      {project.beforeAfter?.length ? (
        <section className="py-10 md:py-16">
          <Container>
            <div className="mb-8 md:mb-12 ">
              <h2 className="font-playfair text-center text-2xl md:text-3xl text-neutral-900">Before and After</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-6 md:gap-12">
              {project.beforeAfter.slice(0, 2).map((src, i) => (
                <Card
                  key={i}
                  className="!rounded-none !border-0 overflow-hidden bg-neutral-200 w-full max-w-[90vw] md:w-[648px] md:h-[443px]"
                >
                  <div className="relative w-full pt-[68%] md:pt-0 md:h-full">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${src})` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
