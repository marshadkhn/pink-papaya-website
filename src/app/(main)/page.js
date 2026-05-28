import Reveal from "@/components/ui/Reveal";
import RoomsAndStay from "@/components/RoomsAndStay";
import HomeHero from "@/components/home/HomeHero";
import ExploreStaysGrid from "@/components/home/ExploreStaysGrid";
import LeisureHighlights from "@/components/home/LeisureHighlights";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import { getCmsPublicContent } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    const cms = await getCmsPublicContent("home");
    const seo = cms.seo ?? {};
    return {
      title: seo.title || undefined,
      description: seo.description || undefined,
      keywords: seo.keywords?.length ? seo.keywords : undefined,
      openGraph: seo.ogImageUrl ? { images: [seo.ogImageUrl] } : undefined,
    };
  } catch {
    return {};
  }
}

export default async function Home() {
  let cms = null;
  try {
    cms = await getCmsPublicContent("home");
  } catch {
    cms = null;
  }

  const hero = cms?.sections?.hero ?? null;

  return (
    <>
      <HomeHero
        content={{
          title: hero?.title,
          description: hero?.description,
          ctaLabel: hero?.ctaLabel,
          backgroundUrl: hero?.backgroundUrl,
        }}
      />
      <ExploreStaysGrid content={cms?.sections?.explore_stays} />

      {/* Rooms & stay Section */}
      <Reveal>
        <RoomsAndStay content={cms?.sections?.rooms_and_stay} />
      </Reveal>

      {/* Leisure Section */}
      <LeisureHighlights content={cms?.sections?.leisure_highlights} />

      {/* Parallax Interior Section */}
      {/* <section className="py-12 md:py-16">
        <Container>
          <HeaderContent
            align="center"
            showCta={false}
            title="Our Interior talks"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
            descriptionClass="text-sm sm:text-base md:text-lg"
          />
        </Container>
      </section>
     
      <section className="relative h-[200vh] w-full">
       
        <div className="sticky top-0 h-screen w-full grid grid-cols-1 lg:grid-cols-12 z-10">
          <div
            className="lg:col-span-6 h-1/2 lg:h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${stays[3]?.imageUrl})` }}
          />
          <div className="lg:col-span-6 bg-[#ECF2F2] flex items-center justify-center p-6">
            <div className="max-w-md text-center">
              <h3 className="font-playfair text-2xl md:text-3xl text-neutral-900">
                Thoughtful details
              </h3>
              <Image
                src="/images/hotel.svg"
                alt=""
                width={40}
                height={40}
                className="mx-auto my-5 h-10 w-10 opacity-80"
              />
              <p className="text-neutral-700 text-sm md:text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s.
              </p>
            </div>
          </div>
        </div>
       
        <div className="sticky top-0 h-screen w-full grid grid-cols-1 lg:grid-cols-12 z-20">
          <div className="lg:col-span-6 bg-[#ECF2F2] flex items-center justify-center p-6">
            <div className="max-w-md text-center">
              <h3 className="font-playfair text-2xl md:text-3xl text-neutral-900">
                Spaces that breathe
              </h3>
              <Image
                src="/images/hotel.svg"
                alt=""
                width={40}
                height={40}
                className="mx-auto my-5 h-10 w-10 opacity-80"
              />
              <p className="text-neutral-700 text-sm md:text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s.
              </p>
            </div>
          </div>
          <div
            className="lg:col-span-6 h-1/2 lg:h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${stays[3]?.imageUrl})` }}
          />
        </div>
      </section> */}

      <TestimonialsSection />
      {/* FAQ Section */}
      <FAQSection />

      {/* What They Say - Feedback */}
     
    </>
  );
}
