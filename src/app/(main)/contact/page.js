import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen pt-24 md:pt-40 pb-24 font-bricolage">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-5xl md:text-7xl font-playfair text-[#9A6648] tracking-tight">
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8f5f2] text-[#9A6648]">
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8f5f2] text-[#9A6648]">
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8f5f2] text-[#9A6648]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">WhatsApp</h3>
                  <p className="text-neutral-500">Start a chat for quick support.</p>
                  <a href="#" className="inline-flex items-center gap-1 text-[#9A6648] text-sm font-medium mt-2 hover:underline">
                    Message us now <span className="text-lg leading-none">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <form action="#" method="post" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 ml-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    className="w-full rounded-xl bg-[#F9F7F4] border-none px-5 py-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-1 focus:ring-[#9A6648]/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone-number" className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 ml-1">
                    Phone Number
                  </label>
                  <input
                    id="phone-number"
                    type="tel"
                    placeholder="(555) 000-0000"
                    className="w-full rounded-xl bg-[#F9F7F4] border-none px-5 py-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-1 focus:ring-[#9A6648]/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 ml-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  required
                  className="w-full rounded-xl bg-[#F9F7F4] border-none px-5 py-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-1 focus:ring-[#9A6648]/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 ml-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="How can we make your stay exceptional?"
                  required
                  className="w-full rounded-xl bg-[#F9F7F4] border-none px-5 py-5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-1 focus:ring-[#9A6648]/20 transition-all resize-none"
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-[#9A6648] hover:bg-[#85543a] text-white py-8 rounded-xl text-md font-medium transition-all active:scale-[0.98] shadow-lg shadow-[#9A6648]/10"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </main>
  );
}
