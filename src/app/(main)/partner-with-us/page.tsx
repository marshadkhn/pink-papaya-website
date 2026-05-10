"use client";

import { useState, FormEvent } from "react";
import Container from "@/components/Container";
import Reveal from "@/components/ui/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function BecomeHostPage() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    email: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your interest! We'll get back to you soon.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F2EA]">
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ minHeight: "calc(100vh - var(--navbar-h))" }}>
        {/* Full-bleed background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/host-hero-new.png"
            alt="Luxury coastal room"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          {/* Extra left-side gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          {/* Soft white fade at the bottom */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white/80 to-transparent z-[1]" />
        </div>

        {/* Content grid */}
        <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
          {/* Left: text, bottom-aligned */}
          <div className="flex flex-col justify-end pb-16 pt-12 px-8 md:px-16">
            <Reveal>
              <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.1]">
                Partner with
              </h1>
              <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-medium italic text-[#C07A5A] leading-[1.1] mt-1">
                Pink Papaya
              </h1>
              <p className="mt-6 text-white/80 font-bricolage text-base md:text-lg max-w-xs leading-relaxed">
                Transform your property into a high-yield sanctuary. We blend data-driven management with the soul of luxury hospitality.
              </p>
            </Reveal>
          </div>

          {/* Right: frosted glass form card, vertically centered */}
          <div className="flex items-center justify-center lg:justify-end px-8 md:px-12 lg:pr-16 py-16 lg:py-0">
            <Reveal delay={0.2}>
              <div
                className="w-full max-w-lg rounded-[20px] p-10"
                style={{
                  background: "rgba(255, 255, 255, 0.55)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                }}
              >
                <p className="font-bricolage text-sm font-medium text-[#16323C] mb-6 tracking-wide">
                  Get Started Today
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-bricolage text-[10px] uppercase tracking-[0.12em] text-[#16323C]/60 mb-1.5">
                      Full Name
                    </label>
                    <Input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Blair Home"
                      className="h-11 border-0 bg-white/70 placeholder:text-neutral-400 text-[#16323C] text-sm rounded-[8px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bricolage text-[10px] uppercase tracking-[0.12em] text-[#16323C]/60 mb-1.5">
                      Property Location
                    </label>
                    <Input
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Tuscany, Italy"
                      className="h-11 border-0 bg-white/70 placeholder:text-neutral-400 text-[#16323C] text-sm rounded-[8px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bricolage text-[10px] uppercase tracking-[0.12em] text-[#16323C]/60 mb-1.5">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="elara@estate.com"
                      className="h-11 border-0 bg-white/70 placeholder:text-neutral-400 text-[#16323C] text-sm rounded-[8px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full mt-2"
                  >
                    Submit Interest
                  </Button>
                  <p className="mt-4 text-center text-[10px] font-bricolage text-[#16323C]/50">
                    We&apos;ll reach out within 24 hours.
                  </p>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      {/* Stats Strip */}
      <section className="bg-white py-10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-300">
            {[
              { value: "10k+", label: "HAPPY GUESTS" },
              { value: "4.8", label: "STAR RATINGS" },
              { value: "1 in 10", label: "HOMES SELECTED" },
              { value: "24/7", label: "SUPPORT" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center py-4 px-6 gap-2">
                <span className="font-playfair text-4xl md:text-5xl text-[#88ADA2] tracking-tight">
                  {stat.value}
                </span>
                <span className="font-bricolage text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Host With Us Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Title + benefits list */}
            <div>
              <Reveal>
                <h2 className="font-playfair text-4xl md:text-5xl font-medium text-[#16323C] mb-4 leading-tight">
                  Why Host With Us
                </h2>
                <p className="text-neutral-500 font-bricolage leading-relaxed mb-12 max-w-sm">
                  We don&apos;t just manage properties; we curate experiences that honor the architectural spirit of your home.
                </p>
              </Reveal>

              <div className="space-y-8">
                {[
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    ),
                    title: "Flexible Hosting",
                    description: "Host on your terms. We adapt to your personal schedule and property goals.",
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ),
                    title: "100% Transparency",
                    description: "Real-time dashboards showing every booking, review, and expense instantly.",
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                    ),
                    title: "Maximize Earnings",
                    description: "Dynamic pricing algorithms optimized for premium seasonal demand.",
                  },
                ].map((item, idx) => (
                  <Reveal key={idx} delay={idx * 0.1}>
                    <div className="flex items-start gap-5">
                      <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#3D1515] flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-playfair text-xl font-medium text-[#16323C] italic mb-1">
                          {item.title}
                        </h3>
                        <p className="text-neutral-500 font-bricolage text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Right: Photo + floating card */}
            <Reveal>
              <div className="relative">
                <div className="relative aspect-[4/3.2] rounded-[28px] overflow-hidden shadow-2xl">
                  <Image
                    src="/images/host-pool.png"
                    alt="Luxury infinity pool at sunset"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Floating glassmorphism card */}
                <div className="absolute bottom-[-24px] left-[-16px] w-[280px] rounded-[20px] p-5 shadow-xl"
                  style={{
                    background: "rgba(50, 50, 60, 0.55)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-full mb-3"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h4 className="font-playfair text-white text-lg font-medium italic mb-2">
                    Trusted Guests
                  </h4>
                  <p className="text-white/75 font-bricolage text-xs leading-relaxed">
                    Rigorous multi-step vetting ensures your estate is only in the most respectful hands.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* What Our Hosts Say */}
      <section className="py-24 bg-[#F7F2EA]">
        <Container>
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="font-playfair text-4xl md:text-6xl font-medium text-[#16323C]">
                What <span className="italic font-normal">Our</span> Hosts Say
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Lucas Nguyen",
                role: "Business Traveler",
                review: "Quiet, stylish and comfortable. The garden patio was my favorite spot to unwind after meetings. Pink Papaya made my stay effortless.",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas"
              },
              {
                name: "Rina Patel",
                role: "Artist/Host",
                review: "We love the design details and the breakfast. Pink Papaya transformed our home stay into a premium experience. Highly recommended!",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina"
              },
              {
                name: "Daniel Kim",
                role: "Solar Panelist",
                review: "The location and the surrounding nature were perfect. Staff were friendly and attentive. Highly recommend becoming a partner.",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel"
              }
            ].map((host, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <Card className="p-8 bg-white border-0 rounded-[20px] shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-neutral-700 font-bricolage leading-relaxed mb-8 italic">
                    &ldquo;{host.review}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={host.avatar} alt={host.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-playfair font-semibold text-[#16323C]">{host.name}</p>
                      <p className="text-xs text-neutral-400 font-bricolage">{host.role}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 bg-white text-center">
        <Container>
          <Reveal>
            <h2 className="font-playfair text-4xl md:text-6xl font-medium text-[#16323C] mb-8 leading-tight">
              Ready to Transform Your Property?
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 font-bricolage mb-12 max-w-2xl mx-auto">
              Join our exclusive network of hosts and start earning from your property today.
            </p>
            <Button
              size="lg"
              className="px-16"
            >
              Contact Us
            </Button>
          </Reveal>
        </Container>
      </section>

    </div>
  );
}
