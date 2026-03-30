import Container from "@/components/Container";

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="pt-12 pb-16 md:pt-20 md:pb-32 bg-white">
        <Container className="max-w-4xl mx-auto">
          <div className="mb-12 md:mb-16 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair mb-4 leading-tight">Privacy policy</h1>
            <p className="text-neutral-500 text-xs sm:text-sm">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="space-y-8 md:space-y-10 text-neutral-800 text-sm sm:text-base leading-relaxed font-bricolage">
            <p>
              Welcome to Pink Papaya Stays. By accessing or using our website and services, you agree to be bound by the following Terms and Conditions. Please read them carefully before making a booking.
            </p>

            <section>
              <h2 className="text-xl font-bold mb-4">1. Definitions</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>&quot;Platform&quot;</strong> refers to the website operated by Pink Papaya Stays.</li>
                <li><strong>&quot;User&quot;/&quot;Guest&quot;/&quot;You&quot;</strong> refers to any person accessing or using the Platform.</li>
                <li><strong>&quot;Property&quot;</strong> refers to hotels, homestays, villas, apartments, or other accommodations listed on the Platform.</li>
                <li><strong>&quot;Booking&quot;</strong> refers to a confirmed reservation made through the Platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">2. Eligibility</h2>
              <p>
                You must be at least 18 years old to make a booking on the Platform. By using the Platform, you confirm that all information provided is accurate and complete.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">3. Bookings and Reservations</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All bookings are subject to availability and confirmation.</li>
                <li>A booking is considered confirmed only after successful payment and confirmation notification.</li>
                <li>The details shown on the booking confirmation (dates, guests, pricing) are final.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">4. Pricing and Payments</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Prices displayed are inclusive of applicable taxes unless stated otherwise.</li>
                <li>Payments must be made using the payment methods available on the Platform.</li>
                <li>Pink Papaya Stays reserves the right to correct pricing errors or cancel bookings in case of incorrect pricing.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">5. Cancellation and Refund Policy</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Cancellation and refund policies vary by property and are displayed at the time of booking.</li>
                <li>Refunds, if applicable, will be processed to the original payment method within the specified timeline.</li>
                <li>No-shows may result in a full charge unless otherwise stated.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">6. Check-in and Check-out</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Standard check-in and check-out times are defined by the property.</li>
                <li>Early check-in or late check-out is subject to availability and may incur additional charges.</li>
                <li>Guests must present valid identification at check-in if required.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">7. Guest Responsibilities</h2>
              <p className="mb-4">Guests agree to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use the property responsibly and respectfully.</li>
                <li>Follow house rules provided by the property.</li>
                <li>Avoid causing damage, disturbance, or illegal activity.</li>
                <li>Be liable for any damages caused during the stay.</li>
              </ul>
              <p className="mt-4 italic">Additional charges may apply for damages, missing items, or excessive cleaning.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">8. Property Rules and Amenities</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Amenities listed are subject to availability and may change without prior notice.</li>
                <li>Certain amenities may have usage restrictions or operating hours.</li>
                <li>Misuse of amenities may result in penalties or termination of stay without refund.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">9. Modifications to Bookings</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Booking modifications are subject to availability and property policies.</li>
                <li>Price differences due to modifications must be paid by the guest.</li>
                <li>Some bookings may be non-modifiable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">10. Cancellation by the Platform or Property</h2>
              <p>
                In rare circumstances, a booking may be cancelled due to unforeseen issues such as maintenance, safety concerns, or force majeure. In such cases:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Guests will be offered a refund or alternative accommodation where possible.</li>
                <li>Pink Papaya Stays is not liable for additional expenses incurred by the guest.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">11. Limitation of Liability</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Pink Papaya Stays acts only as a booking platform and is not responsible for the acts, omissions, or conditions of the properties.</li>
                <li>We are not liable for loss, injury, theft, or damage occurring during your stay, except where required by law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">12. Intellectual Property</h2>
              <p>
                All content on the Platform, including text, images, logos, and design, is the property of Pink Papaya Stays and may not be copied or used without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">13. Privacy</h2>
              <p>
                Your use of the Platform is also governed by our Privacy Policy, which explains how we collect and use your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">14. Force Majeure</h2>
              <p>
                We are not responsible for delays or failures caused by events beyond reasonable control, including natural disasters, government actions, strikes, or pandemics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">15. Termination</h2>
              <p>
                We reserve the right to suspend or terminate access to the Platform if a user violates these Terms or engages in fraudulent or abusive behavior.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">16. Governing Law</h2>
              <p>
                These Terms shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">17. Changes to Terms</h2>
              <p>
                We may update these Terms and Conditions from time to time. Continued use of the Platform after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">18. Contact Information</h2>
              <p>For any questions or concerns, please contact us at:</p>
              <div className="mt-4 space-y-1">
                <p>Email: support@pinkpapaya.com</p>
                <p>Company Name: Pink Papaya Stays</p>
                <p>Address: Bangalore, Karnataka, India</p>
              </div>
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}
