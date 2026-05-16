import { readInteriorProjects } from "@/lib/interiorStore";
import HeroSection from "./_components/HeroSection";
import AboutSection from "./_components/AboutSection";
import ProjectsSection from "./_components/ProjectsSection";
import ServicesSection from "./_components/ServicesSection";
import ContactSection from "./_components/ContactSection";

export const metadata = {
  title: "Interior Design | Pink Papaya Stays",
  description:
    "Refined spaces, effortlessly lived in. Pink Papaya's interior design studio curates homes that are both precise and deeply at ease.",
};

export default async function InteriorPage() {
  const projects = await readInteriorProjects();

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <AboutSection />
      <ProjectsSection projects={projects} />
      <ServicesSection />
      <ContactSection />
    </div>
  );
}
