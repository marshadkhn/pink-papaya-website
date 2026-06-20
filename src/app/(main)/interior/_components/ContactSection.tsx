"use client";

import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const inputBase =
  "w-full bg-transparent border-0 border-b border-neutral-300 focus:border-[#16323C] outline-none font-bricolage text-[13.5px] text-[#16323C] placeholder:text-transparent py-2 transition-colors duration-200";

const labelBase =
  "font-bricolage text-[9px] uppercase tracking-[0.22em] font-semibold text-neutral-400 block mb-2";

export default function ContactSection() {
  return (
    <section className="bg-white py-8 lg:py-[5%]">
      <Container>
        <div className="h-px bg-neutral-200 mb-14 md:mb-20" />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-start">

          {/* Left */}
          <Reveal>
            <div className="flex flex-col justify-between h-full min-h-[480px] lg:min-h-[540px]">
              <div>
                <h2
                  className="font-playfair font-normal text-[#16323C] mb-6"
                  style={{ fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)" }}
                >
                  Contact
                </h2>
                <p className="font-bricolage text-neutral-500 text-[13.5px] leading-relaxed max-w-[300px]">
                  Pink Papaya Studio undertakes a limited number of projects each year. Enquiries.
                </p>
              </div>
              <p className="font-bricolage text-[9px] uppercase tracking-[0.22em] text-neutral-400 mt-16">
                Each enquiry is considered with intention.
              </p>
            </div>
          </Reveal>

          {/* Right — form box */}
          <Reveal delay={0.1}>
            <div className="border border-neutral-200 p-8 md:p-10">
              <form className="flex flex-col gap-8">

                {/* Row 1 — Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className={labelBase}>Name</label>
                    <input type="text" name="name" required className={inputBase} />
                  </div>
                  <div>
                    <label className={labelBase}>Email</label>
                    <input type="email" name="email" required className={inputBase} />
                  </div>
                </div>

                {/* Row 2 — Phone + Project Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className={labelBase}>Phone</label>
                    <input type="tel" name="phone" className={inputBase} />
                  </div>
                  <div>
                    <label className={labelBase}>Project Location</label>
                    <input type="text" name="location" className={inputBase} />
                  </div>
                </div>

                {/* Row 3 — Project Scale + Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className={labelBase}>Project Scale</label>
                    <div className="relative">
                      <select
                        name="scale"
                        defaultValue=""
                        className={`${inputBase} appearance-none pr-6 cursor-pointer`}
                      >
                        <option value="" disabled>Select scale...</option>
                        <option value="single-room">Single Room</option>
                        <option value="full-home">Full Home</option>
                        <option value="villa">Villa / Estate</option>
                        <option value="commercial">Commercial</option>
                      </select>
                      <ChevronDown size={13} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelBase}>Timeline</label>
                    <input type="text" name="timeline" placeholder="e.g. 3–6 months" className={`${inputBase} placeholder:text-neutral-300`} />
                  </div>
                </div>

                {/* Row 4 — Service Required */}
                <div>
                  <label className={labelBase}>Service Required</label>
                  <div className="relative">
                    <select
                      name="service"
                      defaultValue=""
                      className={`${inputBase} appearance-none pr-6 cursor-pointer`}
                    >
                      <option value="" disabled>Select service...</option>
                      <option value="complete">Complete Project Realisation</option>
                      <option value="furnishing">Furnishing & Spatial Composition</option>
                      <option value="oversight">Off-Site Project Oversight</option>
                      <option value="remote">Remote Design Framework</option>
                      <option value="advisory">Private Design Advisory</option>
                      <option value="styling">Final Styling & Calibration</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Row 5 — Project Details */}
                <div>
                  <label className={labelBase}>Project Details</label>
                  <textarea
                    name="details"
                    rows={5}
                    className={`${inputBase} resize-none`}
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="font-bricolage text-[11px] uppercase tracking-[0.22em] font-semibold h-12 px-10"
                  >
                    Submit
                  </Button>
                </div>

              </form>
            </div>
          </Reveal>

        </div>
      </Container>
    </section>
  );
}
