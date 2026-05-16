import HeroSection from "./_components/HeroSection";
import OriginSection from "./_components/OriginSection";
import ManagedStaysSection from "./_components/ManagedStaysSection";
import CuratedHomesSection from "./_components/CuratedHomesSection";
import LifecycleSection from "./_components/LifecycleSection";
import CuratorsSection from "./_components/CuratorsSection";
import CTASection from "./_components/CTASection";

export const metadata = {
  title: "About Us | Pink Papaya Stays",
  description:
    "Architectural sanctuaries designed for the modern wanderer. We blend the warmth of home with the precision of a gallery.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <OriginSection />
      <ManagedStaysSection />
      <CuratedHomesSection />
      <LifecycleSection />
      <CuratorsSection />
      <CTASection />
    </div>
  );
}
