import * as React from "react";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { cn } from "@/utils/utils";

type FAQItem = { question: string; answer: string };

export default function FAQ({
    className,
    title = "FAQs",
    description,
    faqs = [],
}: {
    className?: string;
    title?: string;
    description?: string;
    faqs?: FAQItem[];
}) {
    return (
      <section id="faq" className={cn("py-30 md:py-50", className)}>
        <Container>
          {/* Anchor for direct FAQ links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4">
              <HeaderContent
                title={title}
                titleSize="sm"
                description={description}
                align="left"
                showCta={false}
              />
            </div>
            <div className="lg:col-span-8 lg:pl-6">
              <div className="divide-y divide-neutral-200">
                {faqs.map((item, idx) => (
                  <details
                    key={idx}
                    className="group py-3 md:py-4 font-bricolage"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-base md:text-lg font-medium text-neutral-900">
                      <span>{item.question}</span>
                      <span className="select-none text-neutral-500 transition-transform group-open:rotate-90">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 md:w-6 md:h-6"
                          aria-hidden="true"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </span>
                    </summary>
                    <div className="mt-2 md:mt-3 text-sm md:text-base text-neutral-700 leading-relaxed">
                      {item.answer}
                    </div>
                  </details>
                ))}
                {faqs.length === 0 ? (
                  <p className="text-sm text-neutral-600">No FAQs added yet.</p>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
}
