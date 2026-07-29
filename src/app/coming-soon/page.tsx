import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Coming Soon | Pink Papaya Stays",
  description: "Curated Luxury Villas & Heritage Holiday Homes in Goa. Something extraordinary is arriving soon.",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen w-full bg-[#16323C] text-white flex flex-col justify-between relative overflow-hidden font-bricolage select-none">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#C07A5A]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#C07A5A]/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] rounded-full bg-[#16323C] border border-[#C07A5A]/20 blur-[90px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C07A5A] flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
            P
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-white">
            Pink Papaya
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-widest text-[#C07A5A] bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#C07A5A]" />
          <span>Launch Edition</span>
        </div>
      </header>

      {/* Main Content Center */}
      <section className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center text-center z-10 my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C07A5A]/20 border border-[#C07A5A]/40 text-[#E09F7D] text-xs font-semibold uppercase tracking-widest mb-6">
          <MapPin className="w-3.5 h-3.5" />
          <span>Goa, India</span>
        </div>

        <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-white">
          Something Extraordinary <br />
          <span className="text-[#C07A5A] italic font-serif font-normal">Is Coming Soon.</span>
        </h1>

        <p className="text-neutral-300 text-base sm:text-xl max-w-2xl leading-relaxed mb-10 font-light">
          We are handcrafting a premier collection of luxury villas, heritage homes, and boutique stays across Goa. Our website is undergoing final touches.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-14">
          <a
            href="https://wa.me/919876543210?text=Hi%20Pink%20Papaya%20Stays,%20I%20want%20to%20inquire%20about%20villa%20bookings"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#C07A5A] hover:bg-[#a66345] text-white font-semibold text-sm px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Inquire for Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="https://www.instagram.com/pinkpapayastays/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-7 py-4 rounded-xl border border-white/15 transition-all backdrop-blur-md cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-[#C07A5A]" />
            <span>@pinkpapayastays</span>
          </a>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
            <h3 className="font-playfair text-lg font-semibold text-white mb-1">Handpicked Villas</h3>
            <p className="text-xs text-neutral-400">Private pools, heritage architecture, & premium comforts.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
            <h3 className="font-playfair text-lg font-semibold text-white mb-1">Tailored Concierge</h3>
            <p className="text-xs text-neutral-400">Personalized hospitality for an unforgettable Goa retreat.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
            <h3 className="font-playfair text-lg font-semibold text-white mb-1">Direct Booking Perks</h3>
            <p className="text-xs text-neutral-400">Best price guarantee & exclusive guest experiences.</p>
          </div>
        </div>
      </section>

      {/* Footer Details */}
      <footer className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 text-xs text-neutral-400 z-10">
        <p>© {new Date().getFullYear()} Pink Papaya Stays. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="mailto:info@pinkpapaya.in" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#C07A5A]" />
            <span>info@pinkpapaya.in</span>
          </a>
        </div>
      </footer>
    </main>
  );
}
