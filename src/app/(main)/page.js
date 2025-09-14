import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero
        backgroundUrl="/logo-files/logo-black.svg"
        title="Do a thing"
        description="Discover Pink Papaya Stays — a cozy retreat where comfort meets style. Explore our spaces and plan your next getaway."
        badgeText="Now open"
        align="center"
        buttonPlacement="below"
        ctaLabel="Explore"
        ctaVariant="white"
      />
      <section id="explore" className="min-h-[50vh]" />
      <section id="about" className="min-h-[50vh]" />
      <section id="contact" className="min-h-[50vh]" />
    </>
  );
}
