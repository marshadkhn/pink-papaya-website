import Image from "next/image";
import { StayGridOverlay } from "@/components/sections/StayGridOverlay";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function StaysPage() {
  return (
    <>
      <section className="relative min-h-screen">
        <Image src="/img/stays-hero.png" alt="Rooms & Stays" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" aria-hidden="true" />

        <div className="relative flex min-h-screen items-end pb-24">
          <Container>
            <div className="max-w-measure text-white">
              <Eyebrow className="text-muted">Rooms & Stays</Eyebrow>
              <h1 className="mt-4 font-serif font-medium text-h1m md:text-h1">Stay Your Way</h1>
              <p className="mt-6 text-bodyLg text-white/90">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </Container>
        </div>
      </section>

      <StayGridOverlay />
    </>
  );
}
