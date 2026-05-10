"use client";

import * as React from "react";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buttonClassName } from "@/components/ui/Button";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactBlock() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState<FormState>({ name: "", email: "", subject: "", message: "" });

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24">
      <Container>
        <div className="text-center">
          <Eyebrow>Contact Us</Eyebrow>
          <h2 className="mt-4 font-serif font-medium text-h2m md:text-h2">Get In Touch</h2>
          <p className="mx-auto mt-6 max-w-measure text-bodyLg text-inkSoft">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-serif font-medium text-h3m md:text-h3">Pink Papaya Stays</h3>

            <div className="mt-10 space-y-8 text-body">
              <div>
                <div className="text-small font-semibold text-ink">Location</div>
                <div className="mt-2 text-body text-inkSoft">21400 Pacific Sunset Blvd, Malibu, CA 90265</div>
              </div>

              <div>
                <div className="text-small font-semibold text-ink">Phone</div>
                <div className="mt-2 text-body text-inkSoft">(310) 555-2140</div>
                <div className="mt-1 text-body text-inkSoft">(310) 555-2199</div>
              </div>

              <div>
                <div className="text-small font-semibold text-ink">Email</div>
                <div className="mt-2 text-body text-inkSoft">hello@pinkpapaya.com</div>
                <div className="mt-1 text-body text-inkSoft">stay@pinkpapaya.com</div>
                <div className="mt-1 text-body text-inkSoft">events@pinkpapaya.com</div>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-line bg-card p-8">
            {submitted ? (
              <div className="text-center">
                <h3 className="font-serif font-medium text-h3m md:text-h3">Thank you.</h3>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-small font-semibold text-ink" htmlFor="contact-name">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      className={clsx("mt-2 w-full rounded-card border border-line bg-card px-4 py-3 text-body text-ink", "focus-ring")}
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-small font-semibold text-ink" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className={clsx("mt-2 w-full rounded-card border border-line bg-card px-4 py-3 text-body text-ink", "focus-ring")}
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-small font-semibold text-ink" htmlFor="contact-subject">
                    Subjects
                  </label>
                  <select
                    id="contact-subject"
                    className={clsx("mt-2 w-full rounded-card border border-line bg-card px-4 py-3 text-body text-ink", "focus-ring")}
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  >
                    <option value="">Subjects</option>
                  </select>
                </div>

                <div>
                  <label className="text-small font-semibold text-ink" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    className={clsx("mt-2 w-full rounded-card border border-line bg-card px-4 py-3 text-body text-ink", "focus-ring")}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex justify-center md:justify-end">
                  <button
                    type="submit"
                    className={clsx(buttonClassName("dark"), "px-10", loading ? "opacity-70" : "")}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
