import * as React from "react";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { cn } from "@/utils/utils";

type FAQItem = { question: string; answer: string };

export default function FAQ({
    className,
    badgeText,
    title = "FAQs",
    description,
    faqs = [],
}: {
    className?: string;
    badgeText?: string;
    title?: string;
    description?: string;
    faqs?: FAQItem[];
}) {
    return (
      <section className={cn("py-12 md:py-16", className)}>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4">
              <HeaderContent
                title={title}
                titleSize="sm"
                description={description}
                badgeText={badgeText}
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
                      <span className="select-none text-neutral-500 transition-transform group-open:rotate-90 text-lg md:text-xl">
                        ›
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
