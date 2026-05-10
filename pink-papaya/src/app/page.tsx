import { Hero } from "@/components/sections/Hero";
import { StayGrid2x2 } from "@/components/sections/StayGrid2x2";
import { WelcomeCollage } from "@/components/sections/WelcomeCollage";
import { RoomsAccordion } from "@/components/sections/RoomsAccordion";
import { LeisureFeatures } from "@/components/sections/LeisureFeatures";
import { InteriorTalks } from "@/components/sections/InteriorTalks";
import { Faq } from "@/components/sections/Faq";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StayGrid2x2 />
      <WelcomeCollage />
      <RoomsAccordion />
      <LeisureFeatures />
      <InteriorTalks />
      <Faq />
      <Testimonials />
    </>
  );
}
