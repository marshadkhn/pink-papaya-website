"use client";

import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";

export default function BookingWidget({ pricePerNight = "" }: { pricePerNight?: string }) {
  return (
    <div className="sticky top-[calc(var(--navbar-h)+28px)]">
      <div className="rounded-[20px] border border-neutral-100 bg-white shadow-[0_4px_40px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Price header */}
        {pricePerNight && (
          <div className="px-7 pt-7 pb-6 border-b border-neutral-100">
            <p className="font-bricolage text-[10px] uppercase tracking-[0.14em] text-neutral-400 mb-1.5">Starting from</p>
            <p className="font-playfair text-4xl text-[#16323C] leading-none">{pricePerNight}</p>
            <p className="font-bricolage text-xs text-neutral-400 mt-1.5">per night · taxes included</p>
          </div>
        )}

        {/* Contact options */}
        <div className="px-7 py-6 flex flex-col gap-3">
          <p className="font-bricolage text-[11px] uppercase tracking-[0.1em] text-neutral-400 mb-1">
            Reserve this stay
          </p>
          <a
            href="tel:+919226591522"
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-[#F7F2EA] text-[#16323C] hover:bg-neutral-100 transition-colors font-bricolage text-[13px]"
          >
            <Phone size={14} className="text-[#C07A5A] shrink-0" />
            +91 9226591522
          </a>
          <a
            href="mailto:reservations@pinkpapayastays.com"
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-[#F7F2EA] text-[#16323C] hover:bg-neutral-100 transition-colors font-bricolage text-[13px] break-all"
          >
            <Mail size={14} className="text-[#C07A5A] shrink-0" />
            reservations@pinkpapayastays.com
          </a>
        </div>

        {/* CTA */}
        <div className="px-7 pb-7">
          <Button
            className="w-full font-bricolage text-[12.5px] tracking-[0.04em]"
            size="default"
            asChild
          >
            <a href="mailto:reservations@pinkpapayastays.com">Enquire Now</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
