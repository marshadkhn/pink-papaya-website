import Hero from "@/components/Hero";

export default function InteriorPage() {
  return (
    <>
      <Hero
        backgroundUrl="/logo-files/logo-black.svg"
        title="Interior Design"
        description="Thoughtfully designed interiors that blend warmth and function—discover the details behind our spaces."
        badgeText="Design stories"
        align="center"
        buttonPlacement="below"
        showCta={false}
        tone="dark"
      />
      <section className="min-h-[50vh]" />
    </>
  );
}
