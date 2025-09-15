import Hero from "@/components/Hero";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <>
      <Hero
        backgroundUrl="/logo-files/logo-black.svg"
        title="Contact Us"
        description="Questions or bookings? We’d love to hear from you. Reach out and we’ll get back shortly."
        badgeText="We’re here to help"
        align="center"
        buttonPlacement="below"
        showCta={false}
        tone="dark"
      />
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* Left: Contact Info */}
            <div className="md:col-span-6">
          
                <CardContent className="p-6 md:p-8">
                  <HeaderContent title="Pink Papaya Stays" align="left" showCta={false} />

                  <div className="mt-6 space-y-8 text-sm text-neutral-800">
                    <div>
                      <div className="mb-2 text-xs uppercase tracking-wide text-neutral-500">Location</div>
                      <address className="not-italic leading-relaxed">
                        21400 Pacific Sunset Blvd,
                        <br />
                        Malibu, CA 90265
                      </address>
                    </div>

                    <div>
                      <div className="mb-2 text-xs uppercase tracking-wide text-neutral-500">Phone</div>
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium">Reservations & Inquiries</div>
                          <a className="text-neutral-900 hover:underline" href="tel:+13105552140">(310) 555-2140</a>
                        </div>
                        <div>
                          <div className="font-medium">Concierge & Guest Services</div>
                          <a className="text-neutral-900 hover:underline" href="tel:+13105552199">(310) 555-2199</a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-xs uppercase tracking-wide text-neutral-500">Email</div>
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium">General Info</div>
                          <a className="text-neutral-900 hover:underline" href="mailto:hello@pinkpapaya.com">hello@pinkpapaya.com</a>
                        </div>
                        <div>
                          <div className="font-medium">Bookings</div>
                          <a className="text-neutral-900 hover:underline" href="mailto:stay@pinkpapaya.com">stay@pinkpapaya.com</a>
                        </div>
                        <div>
                          <div className="font-medium">Events</div>
                          <a className="text-neutral-900 hover:underline" href="mailto:events@pinkpapaya.com">events@pinkpapaya.com</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
             
            </div>

            {/* Right: Contact Form */}
            <div className="md:col-span-6">
              <Card className="border-neutral-200">
                <CardContent className="p-6 md:p-8">
                  <form className="grid grid-cols-1 gap-4 md:gap-5" action="#" method="post">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-neutral-800">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-800">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium text-neutral-800">Phone (optional)</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(310) 555-1234"
                      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="topic" className="mb-1 block text-sm font-medium text-neutral-800">Topic</label>
                    <select
                      id="topic"
                      name="topic"
                      className="w-full appearance-none rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-800"
                      defaultValue="reservations"
                    >
                      <option value="reservations">Reservations</option>
                      <option value="general">General Inquiry</option>
                      <option value="events">Events</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-medium text-neutral-800">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    placeholder="Tell us a bit about your stay, dates, or any questions you have."
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-800"
                  />
                </div>

                <div className="pt-2 mx-auto">
                  <Button type="submit" variant="outlineBlack" size="lg">Send Message</Button>
                </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
