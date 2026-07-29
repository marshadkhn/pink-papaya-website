import Image from "next/image";
import { Instagram, Sparkles } from "lucide-react";

export const metadata = {
  title: "Pink Papaya Stays | Coming Soon",
  description: "Curated Luxury Villas & Heritage Holiday Homes in Goa. Follow @pinkpapayastays on Instagram.",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen w-full bg-[#FAFAF8] text-[#16323C] flex flex-col justify-between relative overflow-hidden font-bricolage select-none">
      {/* Decorative Subtle Background Orbs matching IP theme */}
      <div className="absolute top-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#C07A5A]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#16323C]/5 blur-[150px] pointer-events-none" />

      {/* Top Header / Logo */}
      <header className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C07A5A] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md">
            P
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#16323C]">
            Pink Papaya
          </span>
        </div>

        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C07A5A] bg-[#C07A5A]/10 border border-[#C07A5A]/20 px-4 py-1.5 rounded-full font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Coming Soon</span>
        </div>
      </header>

      {/* Center Main Hero */}
      <section className="w-full max-w-3xl mx-auto px-6 py-16 flex flex-col items-center text-center z-10 my-auto">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C07A5A] mb-4">
          Pink Papaya Stays · Goa
        </span>

        {/* Heading */}
        <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#16323C] leading-[1.15] mb-6">
          Something Extraordinary <br />
          <span className="text-[#C07A5A] italic font-serif font-normal">
            Is Arriving Soon.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-neutral-600 text-base sm:text-xl max-w-xl font-light leading-relaxed mb-10">
          Curated luxury villas & heritage holiday homes across Goa. Follow our journey on Instagram for exclusive sneak peeks.
        </p>

        {/* Instagram Only Button */}
        <a
          href="https://www.instagram.com/pinkpapayastays/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-[#16323C] hover:bg-[#0f242b] text-white font-semibold text-base px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group border border-[#16323C]"
        >
          <Instagram className="w-5 h-5 text-[#E09F7D] transition-transform group-hover:scale-110" />
          <span>Follow @pinkpapayastays</span>
        </a>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200/60 text-xs text-neutral-500 z-10">
        <p>© {new Date().getFullYear()} Pink Papaya Stays. All rights reserved.</p>
        <a
          href="https://www.instagram.com/pinkpapayastays/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#16323C] transition-colors font-medium"
        >
          instagram.com/pinkpapayastays
        </a>
      </footer>
    </main>
  );
}
