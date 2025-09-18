import Hero from "@/components/Hero";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <>
      <Hero
        backgroundColor="#ffffff"
        title="About Us"
        description="Pink Papaya is a boutique stay experience focused on comfort, aesthetics, and heartfelt hospitality."
        align="center"
        buttonPlacement="below"
        showCta={false}
        tone="light"
      />
      {/* Our Story header */}
      <section className="py-10 md:py-14">
        <Container>
          <HeaderContent
            badgeText="About"
            title="Our story"
            description="Pink Papaya grew from a love of thoughtful design and warm, human hospitality — a place where calm spaces, comfort, and small details make every stay feel personal."
            align="center"
            showCta={false}
          />
        </Container>
      </section>

      {/* Team */}
      <section className="mt-50 py-12 md:py-16">
        <Container>
          <HeaderContent
            title="The Faces behind Pink Papaya"
            titleSize="sm"
            align="center"
            showCta={false}
          />

          {/* Team cards */}
          <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Maya Rivera", imageUrl: "/logo-files/logo-white.svg" },
              { name: "Ethan Cole", imageUrl: "/logo-files/logo-black.svg" },
              { name: "Sofia Patel", imageUrl: "/logo-files/logo-white.svg" },
            ].map((member) => (
              <Card
                key={member.name}
                className="!rounded-none !border-0 !shadow-none"
              >
                <div
                  className="h-64 w-full bg-neutral-200"
                  style={{
                    backgroundImage: `url(${member.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <CardContent className="px-0 py-3">
                  <h3 className="text-base font-semibold text-neutral-900">
                    {member.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
