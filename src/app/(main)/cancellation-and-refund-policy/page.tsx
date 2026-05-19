import Hero from "@/components/Hero";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";

export default function CancellationPolicyPage() {
  return (
    <>
      <Hero
        backgroundColor="#ffffff"
        title="Cancellation & Refund Policy"
        description="Details about our policies regarding cancellations and refunds."
        align="center"
        buttonPlacement="below"
        showCta={false}
        tone="light"
      />
      <section className="py-[5%]">
        <Container className="prose prose-neutral max-w-4xl mx-auto">
          <HeaderContent
            title="Cancellation and Refund Policy"
            align="left"
            showCta={false}
            titleSize="sm"
          />
          <div className="mt-8 space-y-6 text-neutral-700">
            <p>
              We understand that plans can change. This policy outlines the
              procedures for cancelling your reservation and the conditions for
              receiving a refund.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900">
              1. Standard Cancellation
            </h2>
            <p>
              - <strong>Full Refund:</strong> Cancellations made more than 14
              days prior to the check-in date will receive a 100% refund.
              <br />- <strong>Partial Refund:</strong> Cancellations made
              between 7 and 14 days prior to check-in will receive a 50% refund.
              <br />- <strong>No Refund:</strong> Cancellations made less than 7
              days before the check-in date are not eligible for a refund.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900">
              2. How to Cancel
            </h2>
            <p>
              To cancel your reservation, please contact our support team via
              email at{" "}
              <a href="mailto:stay@pinkpapaya.com">stay@pinkpapaya.com</a> or
              call us at (310) 555-2140 with your booking details.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900">
              3. No-Shows
            </h2>
            <p>
              If you do not arrive for your reservation and do not cancel in
              advance, you will be charged for the full amount of the stay, and
              no refund will be issued.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900">
              4. Refund Processing
            </h2>
            <p>
              Refunds will be processed within 5-7 business days to the original
              method of payment.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900">
              5. Special Circumstances
            </h2>
            <p>
              We may consider exceptions to this policy in cases of documented
              emergencies. Please contact us to discuss your situation.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
