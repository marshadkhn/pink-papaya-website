"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-xl bg-[#F7F2EA] border-none px-5 py-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-1 focus:ring-[#C07A5A]/20 transition-all";
const labelClass =
  "text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 ml-1";

export default function ContactForm() {
  const [data, setData] = useState({ name: "", phone: "", email: "", message: "" });
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "contact", website, data }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setData({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" name="name" type="text" placeholder="Jane Doe" required
            value={data.name} onChange={onChange} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className={labelClass}>Phone Number</label>
          <input id="phone" name="phone" type="tel" placeholder="(555) 000-0000"
            value={data.phone} onChange={onChange} className={inputClass} />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" placeholder="jane@example.com" required
          value={data.email} onChange={onChange} className={inputClass} />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea id="message" name="message" rows={4} required
          placeholder="How can we make your stay exceptional?"
          value={data.message} onChange={onChange}
          className={`${inputClass} resize-none`} />
      </div>

      {/* Honeypot — hidden from real users */}
      <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <Button type="submit" size="lg" className="w-full py-8" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : status === "success" ? "Message Sent!" : "Send Message"}
      </Button>

      {status === "success" && (
        <p className="text-center text-sm text-[#16323C]">
          Thank you! We&apos;ll get back to you shortly.
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
