// app/shipping/page.tsx
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Shipping & Delivery — Vijay Agencies",
  description:
    "Shipping policy, delivery times, costs, tracking and COD details for Vijay Agencies. Everything you need to know about shipping.",
};

export default function ShippingPage(): JSX.Element {
  const customerCare = "support@vijayagenciesjpr.com";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 md:p-12">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shipping &amp; Delivery Policy</h1>
          <p className="mt-2 text-sm text-gray-600">
            Last updated: <strong>18-09-2025</strong>
          </p>
        </header>

        <section className="prose prose-sm md:prose md:prose-lg text-gray-800">
          <h2>Shipping Methods & Timelines</h2>
          <p>
            We ship via trusted courier partners. Standard delivery times (business days) vary by location:
          </p>
          <ul>
            <li><strong>Local (same city):</strong> 1–3 days</li>
            <li><strong>Domestic (within India):</strong> 3–7 days</li>
            <li><strong>Remote locations:</strong> up to 10–14 days</li>
          </ul>

          <h2>Shipping Costs</h2>
          <p>
            Shipping charges depend on product weight, dimensions and delivery location. We offer:
          </p>
          <ul>
            <li>Free shipping for orders above <strong>₹50,000</strong> (where available)</li>
            <li>Flat or calculated shipping charges for smaller orders — shown at checkout.</li>
          </ul>

          <h2>Cash on Delivery (COD)</h2>
          <p>
            COD is available for eligible pin codes. COD orders require verification at delivery. COD charges may apply and will be displayed at checkout.
          </p>

          <h2>International Orders</h2>
          <p>
            We currently focus on domestic shipping (India). For international shipping please contact our sales team at{" "}
            <Link className="text-blue-600 hover:underline" href={`mailto:${customerCare}`}>
              {customerCare}
            </Link>
            . International orders may be subject to customs, duties and taxes — these are the buyer&apos;s responsibility unless otherwise stated.
          </p>

          <h2>Packaging & Handling</h2>
          <p>
            We package products to industry standards to ensure safe transit. Fragile items are packed with extra protection. If an item arrives damaged, follow the damaged-items section in our <Link href="/cancellation-refunds" className="text-blue-600 hover:underline">Cancellation & Refund Policy</Link>.
          </p>

          <h2>Tracking Orders</h2>
          <p>
            After dispatch, you will receive a tracking number via email/SMS. Use the courier&apos;s tracking portal to view live updates. If tracking is unavailable, contact our support team.
          </p>

          <h2>Delivery Failures & Delays</h2>
          <p>
            Delivery delays can occur due to weather, carrier disruption or remote locations. If a delivery attempt fails, the courier will typically attempt delivery again or hold the shipment at a local facility. Contact support if your shipment is delayed beyond the expected timeframe.
          </p>

          <h2>Contact & Customer Care</h2>
          <p>
            For shipping queries please email{" "}
            <Link className="text-blue-600 hover:underline" href={`mailto:${customerCare}`}>
              {customerCare}
            </Link>{" "}
            or use our <Link className="text-blue-600 hover:underline" href="/contact-us">Contact Us</Link> page and include your order ID.
          </p>

          <hr />
          <p className="text-sm text-gray-500">
            Shipping policies may be updated. The current policy on this page supersedes earlier versions.
          </p>
        </section>
      </div>
    </main>
  );
}
