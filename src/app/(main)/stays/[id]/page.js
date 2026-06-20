import Container from "@/components/Container";
import { getStayById, readStays } from "@/lib/staysStore";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import StayCard from "@/components/StayCard";
import { Button } from "@/components/ui/button";

// New Redesign Components
import StayGallery from "@/components/stays/StayGallery";
import BookingWidget from "@/components/stays/BookingWidget";
import AmenitiesSection from "@/components/stays/AmenitiesSection";
import MapSection from "@/components/stays/MapSection";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const stay = await getStayById(resolvedParams.id);

    if (!stay) {
        return { title: 'Stay Not Found' };
    }

    return {
        title: stay.title,
        description: stay.description || `Book your stay at ${stay.title} with Pink Papaya.`,
        openGraph: {
            title: stay.title,
            description: stay.description || `Book your stay at ${stay.title} with Pink Papaya.`,
            images: stay.imageUrl ? [{ url: stay.imageUrl }] : [],
        },
    };
}

export default async function StayDetailPage({ params }) {
    const resolvedParams = await params;
    const stay = await getStayById(resolvedParams.id);

    if (!stay) {
        return (
            <Container>
                <div className="py-20 text-center">
                    <h1 className="text-3xl font-serif">Stay not found</h1>
                </div>
            </Container>
        );
    }

    const allStays = await readStays();
    const otherStays = allStays.filter(s => s.id !== stay.id).slice(0, 2);

    return (
        <div className="bg-white">
            {/* Header & Gallery Section */}
            <StayGallery
                title={stay.title}
                description={stay.description}
                location={stay.location}
                images={stay.images || [stay.imageUrl]}
            />

            <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 py-8 lg:py-16">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        {/* About Section */}
                        <section className="mb-8 lg:mb-16">
                            <p className="font-bricolage text-[11px] uppercase tracking-[0.14em] text-[#C07A5A] mb-3">Overview</p>
                            <h2 className="font-playfair text-3xl md:text-4xl text-[#16323C] mb-8">About this stay</h2>
                            <div className="space-y-4">
                                {stay.aboutContent ? (
                                    stay.aboutContent.split('\n').filter(Boolean).map((paragraph, i) => (
                                        <p key={i} className="font-bricolage text-[15px] text-neutral-600 leading-[1.75]">{paragraph}</p>
                                    ))
                                ) : (
                                    <p className="font-bricolage text-[15px] text-neutral-600 leading-[1.75]">{stay.description}</p>
                                )}
                            </div>
                        </section>

                        <hr className="border-neutral-100" />

                        {/* Amenities Section */}
                        <AmenitiesSection amenities={stay.amenities} />

                        <hr className="border-neutral-100" />

                        {/* Location Section */}
                        <MapSection
                            mapUrl={stay.locationMapUrl}
                            nearbyPlaces={stay.nearbyPlaces}
                            location={stay.location}
                        />
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 order-first lg:order-last">
                        <BookingWidget pricePerNight={stay.pricePerNight} />
                    </div>
                </div>

                <hr className="border-neutral-100" />
            </Container>

            {/* FAQ Section */}
            <FAQ
                badgeText="Helpful"
                title="Frequently Asked Questions"
                description="Quick answers to common questions about staying at Pink Papaya."
                faqs={stay.faqs || [
                    {
                        question: "What time is check-in and check-out?",
                        answer: "Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in and late check-out are available on request, subject to availability.",
                    },
                    {
                        question: "Is breakfast included?",
                        answer: "Yes. A complimentary breakfast is included with every stay, with vegetarian options available.",
                    },
                    {
                        question: "Do you have Wi‑Fi?",
                        answer: "High-speed Wi‑Fi is available throughout the property at no extra cost.",
                    }
                ]}
            />

            {/* Recommendations Section */}
            <Container>
                <hr className="border-neutral-100" />

                <section className="py-8 md:py-[5%]">
                    <div className="flex items-start justify-between mb-6 md:mb-10">
                        <div>
                            <p className="font-bricolage text-[11px] uppercase tracking-[0.14em] text-[#C07A5A] mb-3">More escapes</p>
                            <h2 className="font-playfair text-3xl md:text-4xl text-[#16323C]">You might also love</h2>
                        </div>
                        <Button variant="outline" className="font-bricolage text-[12px] tracking-[0.04em] shrink-0 mt-2" asChild>
                            <Link href="/stays">View all stays</Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {otherStays.map((s) => (
                            <StayCard
                                key={s.id}
                                title={s.title}
                                imageUrl={s.imageUrl}
                                images={s.images}
                                area={s.area}
                                bed={s.bed}
                                guests={s.guests}
                                href={`/stays/${s.id}`}
                                pricePerNight={s.pricePerNight}
                                location={s.location}
                                amenities={s.amenities}
                            />
                        ))}
                    </div>
                </section>
            </Container>
        </div>
    );
}
