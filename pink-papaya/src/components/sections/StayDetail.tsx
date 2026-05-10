import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Hairline } from "@/components/ui/Hairline";
import { BeforeAfter } from "@/components/sections/BeforeAfter";

export function StayDetail() {
  return (
    <>
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-image">
              <Image
                src="/img/soft-edit-hero.png"
                alt="THE SOFT EDIT"
                width={1200}
                height={1200}
                className="h-auto w-full"
                priority
              />
            </div>

            <div>
              <Eyebrow className="mb-3">JUMEIRAH PARKS</Eyebrow>
              <h2 className="font-serif font-medium text-h2m md:text-h2 tracking-wide">THE SOFT EDIT</h2>
              <div className="mt-4 script-tagline">Neutral, airy, and organic design</div>
              <p className="mt-8 text-body text-inkSoft">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="mt-6 text-body text-inkSoft">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <Hairline className="my-10" />

              <div className="text-small text-inkSoft">What we did - Furnish, Full Interior</div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="text-center">
            <h3 className="font-serif font-medium text-h3m md:text-h3">All Photos</h3>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => {
              const imgIndex = (idx % 4) + 1;

              return (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-image">
                  <Image
                    src={`/img/soft-edit-${imgIndex}.png`}
                    alt={`All Photos ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="text-center">
            <h3 className="font-serif font-medium text-h3m md:text-h3">Before and After</h3>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <BeforeAfter beforeSrc="/img/before-1.png" afterSrc="/img/after-1.png" alt="Before and After" />
            <BeforeAfter beforeSrc="/img/before-1.png" afterSrc="/img/after-1.png" alt="Before and After" />
          </div>
        </Container>
      </section>
    </>
  );
}
