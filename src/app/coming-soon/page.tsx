import { Instagram } from "lucide-react";

export const metadata = {
  title: "Pink Papaya Stays | Coming Soon",
  description: "Curated Luxury Villas & Heritage Holiday Homes in Goa. Follow @pinkpapayastays on Instagram.",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen w-full bg-[#FAFAF8] text-[#16323C] flex flex-col items-center justify-between p-6 sm:p-12 relative overflow-hidden font-bricolage select-none">
      {/* Decorative Subtle Background Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#C07A5A]/8 blur-[160px] pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#16323C]/5 blur-[140px] pointer-events-none" />

      {/* Spacer for vertical center alignment */}
      <div aria-hidden="true" />

      {/* Ultra-Minimal Centered Content */}
      <section className="w-full max-w-3xl mx-auto flex flex-col items-center text-center z-10 my-auto py-8">
        {/* Main Heading */}
        <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#16323C] leading-[1.12] mb-6">
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
          className="inline-flex items-center justify-center gap-3 bg-[#16323C] hover:bg-[#0f242b] text-white font-semibold text-base px-9 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group border border-[#16323C]"
        >
          <Instagram className="w-5 h-5 text-[#E09F7D] transition-transform group-hover:scale-110" />
          <span>Follow @pinkpapayastays</span>
        </a>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full text-center text-xs text-neutral-400 z-10 py-2">
        <p>© {new Date().getFullYear()} Pink Papaya Stays. All rights reserved.</p>
      </footer>
    </main>
  );
}
