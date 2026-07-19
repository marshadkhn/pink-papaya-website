import Container from "@/components/Container";
import { Phone, Mail, MessageSquare } from "lucide-react";
import ContactForm from "./_components/ContactForm";

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen pt-24 md:pt-40 pb-24 font-bricolage">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-5xl md:text-7xl font-playfair text-[#16323C] tracking-tight">
            Get In Touch
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start pb-12">
          {/* Left: Contact Info */}
          <div className="space-y-12">
            <h2 className="text-3xl md:text-4xl font-playfair text-neutral-900 mb-8">
              Pink Papaya Stays
            </h2>

            <div className="space-y-10">
              {/* Phone */}
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7F2EA] text-[#C07A5A]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">Phone</h3>
                  <a href="tel:+3105552140" className="text-neutral-500 hover:text-neutral-800 transition-colors">
                    (310) 555-2140
                  </a>
                  <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
                    Mon-Fri, 9am - 6pm PST
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7F2EA] text-[#C07A5A]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">Email</h3>
                  <a href="mailto:hello@pinkpapaya.com" className="text-neutral-500 hover:text-neutral-800 transition-colors">
                    hello@pinkpapaya.com
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7F2EA] text-[#C07A5A]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">WhatsApp</h3>
                  <p className="text-neutral-500">Start a chat for quick support.</p>
                  <a href="#" className="inline-flex items-center gap-1 text-[#C07A5A] text-sm font-medium mt-2 hover:underline">
                    Message us now <span className="text-lg leading-none">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <ContactForm />
          </div>
        </div>
      </Container>
    </main>
  );
}
