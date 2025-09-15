import Hero from "@/components/Hero";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import StayCard from "@/components/StayCard";
import ImageCarousel from "@/components/ImageCarousel";
import CheckIcon from "@/components/icons/check";
import { stays } from "@/data/stays";
import { Button } from "@/components/ui/button";
import BedIcon from "@/components/icons/bed";
import AreaIcon from "@/components/icons/area";
import UsersIcon from "@/components/icons/users";
import PatioIcon from "@/components/icons/patio";
import ShowerIcon from "@/components/icons/shower";
import BreakfastIcon from "@/components/icons/breakfast";
import MeditationIcon from "@/components/icons/meditation";
import TvIcon from "@/components/icons/tv";
import YogaMatIcon from "@/components/icons/yoga";
import TeaSetIcon from "@/components/icons/tea";
import FAQ from "@/components/FAQ";

export default function StayDetailPage({ params }) {
    const stay = stays.find((s) => s.id === params.id);
    if (!stay) {
        return (
            <Container>
                <div className="py-20 text-center">
                    <HeaderContent title="Stay not found" align="center" showCta={false} />
                </div>
            </Container>
        );
    }

    return (
        <>
            <Hero
                backgroundUrl={stay.imageUrl}
                title={stay.title}
                description={stay.description ?? ""}
                align="left"
                buttonPlacement="below"
                showCta={false}
                tone="dark"
            />

            {/* About section */}
            <section className="py-12 md:py-16">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
                        <div className="md:col-span-4">
                            <HeaderContent title="About" align="left" showCta={false} />
                        </div>
                        <div className="md:col-span-8">
                            <div className="flex flex-wrap items-center gap-5 text-sm text-neutral-800">
                                <div className="flex items-center gap-2">
                                    <BedIcon className="h-4 w-4" />
                                    <span className="font-medium">{stay.bed}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AreaIcon className="h-4 w-4" />
                                    <span className="font-medium">{stay.area}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UsersIcon className="h-4 w-4" />
                                    <span className="font-medium">{stay.guests}</span>
                                </div>
                            </div>

                            {stay.description ? (
                                <>
                                    <hr className="mt-6 border-neutral-200" />
                                    <p className="py-4 text-neutral-700 leading-relaxed">{stay.description}</p>
                                    <hr className="mb-8 border-neutral-200" />
                                </>
                            ) : null}
                            <div className="mt-2 flex flex-wrap items-center justify-between ">
                                {stay.pricePerNight ? (
                                    <div>
                                        <div className="text-xs text-rose-400">Starting at</div>
                                        <div className="text-lg font-semibold text-neutral-900">{stay.pricePerNight}</div>
                                    </div>
                                ) : null}
                                <Button variant="outlineBlack" size="lg" asChild>
                                    <a href="#book">Book Stay</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Carousel */}
            <section className="py-8 md:py-12">
                <Container>
                    <ImageCarousel images={stay.images ?? [stay.imageUrl]} />
                </Container>
            </section>

            {/* Amenities */}
            <section className="py-12 md:py-16">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
                        <div className="md:col-span-4">
                            <HeaderContent title="Amenities" align="left" showCta={false} />
                        </div>
                        <div className="md:col-span-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {(stay.amenities ?? ["Wi‑Fi", "Air Conditioning"]).map((a) => {
                                    const Icon =
                                        a === "Garden Patio" ? PatioIcon :
                                            a === "Queen Bed" ? BedIcon :
                                                a === "Rain Shower" ? ShowerIcon :
                                                    a === "Breakfast" ? BreakfastIcon :
                                                        a === "Meditation Area" ? MeditationIcon :
                                                            a === "Smart TV" ? TvIcon :
                                                                a === "Yoga Mat" ? YogaMatIcon :
                                                                    a === "Tea Set" ? TeaSetIcon :
                                                                        CheckIcon;
                                    return (
                                        <div key={a} className="flex items-center gap-2 text-neutral-800">
                                            <Icon className="h-4 w-4" />
                                            <span>{a}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>


            {/* Policies Section */}
            <FAQ
                title="Policies & Check-in Info"
                faqs={[
                    {
                        question: "Check‑In & Check‑Out",
                        answer:
                            "Check‑in is from 2:00 PM and check‑out is by 11:00 AM. Early check‑in and late check‑out are available on request, subject to availability.",
                    },
                    {
                        question: "Cancellation Policy",
                        answer:
                            "Free cancellation up to 48 hours before arrival. Cancellations within 48 hours or no‑shows may incur a one‑night charge.",
                    },
                    {
                        question: "Pet Policy",
                        answer:
                            "Pets are welcome in select rooms with prior notice. A small cleaning fee may apply. Please keep pets leashed in common areas.",
                    },
                    {
                        question: "Smoking Policy",
                        answer:
                            "All rooms are non‑smoking. Designated outdoor smoking areas are available. A deep‑cleaning fee may apply for violations.",
                    },
                ]}
            />

            {/* FAQ Section */}
            <FAQ
                badgeText="Helpful"
                title="Frequently Asked Questions"
                description="Quick answers to common questions about staying at Pink Papaya."
                faqs={[
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
                    },
                    {
                        question: "How do I book a room?",
                        answer: "You can book directly from the room page using the Book Stay button, or contact us via WhatsApp for assistance.",
                    },
                    {
                        question: "Is parking available?",
                        answer: "Yes, we offer on-site parking for guests.",
                    },
                ]}
            />

            {/* More rooms */}
            <section className="py-12 md:py-16">
                <Container>
                    <div className="mb-6 md:mb-8 flex items-center justify-between gap-4">
                        <HeaderContent title="More Rooms" align="left" showCta={false} />
                        <Button variant="outlineBlack" asChild>
                            <a href="/stays">All rooms</a>
                        </Button>
                    </div>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {stays
                            .filter((s) => s.id !== stay.id)
                            .slice(0, 2)
                            .map((s) => (
                                <StayCard
                                    key={s.id}
                                    title={s.title}
                                    imageUrl={s.imageUrl}
                                    area={s.area}
                                    bed={s.bed}
                                    guests={s.guests}
                                    href={`/stays/${s.id}`}
                                    pricePerNight={s.pricePerNight}
                                />
                            ))}
                    </div>
                </Container>
            </section>
        </>
    );
}
