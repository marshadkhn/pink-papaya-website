import Container from "@/components/Container";
import { getInteriorProjectById, readInteriorProjects } from "@/lib/interiorStore";
import { Card } from "@/components/ui/card";
import HeaderContent from "@/components/headerContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const project = await getInteriorProjectById(params.id);
  
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.headline || project.title,
    description: project.tagline || `Discover the beautiful ${project.title} interior design project by Pink Papaya.`,
    openGraph: {
      title: project.headline || project.title,
      description: project.tagline || `Discover the beautiful ${project.title} interior design project by Pink Papaya.`,
      images: project.imageUrl ? [{ url: project.imageUrl }] : [],
    },
  };
}

export default async function InteriorDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const project = await getInteriorProjectById(params.id);
  if (!project) {
    return (
      <Container>
        <div className="py-20 text-center">
          <HeaderContent title="Project not found" align="center" showCta={false} />
        </div>
      </Container>
    );
  }

  return (
    <>
      <section className="py-16 md:py-20 mt-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-20 items-start">
            {/* Left: Image */}
            <div className="lg:col-span-6 pr-4 md:pr-6 lg:pr-8">
              <Card className="rounded-10 !border-0 overflow-hidden bg-neutral-200">
                <div className="relative w-full pt-[100%]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    data-bg={`url(${project.imageUrl})`}
                  />
                </div>
              </Card>
            </div>

            {/* Right: Badge, title, tagline, description */}
            <div className="lg:col-span-6 pl-4 md:pl-6 lg:pl-8">
              <div className="flex flex-col gap-4">
                {project.badge ? (
                  <div>
                    <span className="inline-block text-xs tracking-wide uppercase py-1">
                      {project.badge}
                    </span>
                  </div>
                ) : null}
                <h1 className="font-playfair text-3xl md:text-4xl text-neutral-900">
                  {project.headline || project.title}
                </h1>
                {project.tagline ? (
                  <p className="font-playfair italic text-2xl md:text-3xl text-[#16323C]">
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
        <section className="py-12 md:py-16">
          <Container>
            <div className="mb-6 md:mb-8 ">
              <h2 className="font-playfair text-center text-2xl md:text-3xl text-neutral-900">
                All Photos
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto mt-10">
              {project.photos.slice(0, 6).map((src, i) => (
                <Card
                  key={i}
                  className="rounded-10 !border-0 overflow-hidden bg-neutral-200"
                >
                  <div className="relative w-full pt-[100%]">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      data-bg={`url(${src})`}
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
        <section className="py-12 md:py-16">
          <Container>
            <div className="mb-8 md:mb-12 ">
              <h2 className="font-playfair text-center text-2xl md:text-3xl text-neutral-900">
                Before and After
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-6 md:gap-12">
              {project.beforeAfter.slice(0, 2).map((src, i) => (
                <Card
                  key={i}
                  className="rounded-10 !border-0 overflow-hidden bg-neutral-200 w-full max-w-[90vw] md:w-[648px] md:h-[443px]"
                >
                  <div className="relative w-full pt-[68%] md:pt-0 md:h-full">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      data-bg={`url(${src})`}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Contact Us Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="text-center">
            <HeaderContent
              title="Have a project in mind?"
              description="Let's create something beautiful together. Reach out to us for a consultation."
              align="center"
              showCta={false}
            />
            <div className="mt-6">
              <Button asChild variant="black" size="lg">
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
