// app/cancellation-refunds/page.tsx
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Cancellation & Refunds — Vijay Agencies",
  description:
    "Cancellation, returns and refund policy for Vijay Agencies. Learn how to cancel orders, return items and request refunds.",
};

export default function CancellationRefundsPage(): JSX.Element {
  const supportEmail = "support@vijayagenciesjpr.com";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 md:p-12">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cancellation &amp; Refund Policy</h1>
          <p className="mt-2 text-sm text-gray-600">
            Last updated: <strong>18-09-2025</strong>
          </p>
        </header>

        <section className="prose prose-sm md:prose md:prose-lg text-gray-800">
          <h2>Order Cancellations</h2>
          <p>
            You may cancel an order placed on <strong>Vijay Agencies</strong> within <strong>24 hours</strong> of placing it,
            provided the order has not entered the dispatch process. To request a cancellation, contact our support team at{" "}
            <Link className="text-blue-600 hover:underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </Link>{" "}
            or use the Contact Us page. Once an order is dispatched, cancellation may not be possible; in that case please follow our returns process below.
          </p>

          <h2>Returns & Exchanges</h2>
          <p>
            We accept returns and exchanges for most items within <strong>7 days</strong> of delivery if the product is unused,
            in original condition and packaging, and accompanied by the original invoice.
          </p>
          <ul>
            <li>Start a return by contacting support with your order ID and reason for return.</li>
            <li>We will provide a return authorization and pickup instructions where applicable.</li>
            <li>Return shipping may be covered by Vijay Agencies for defective or wrongly shipped items. For buyer remorse returns, shipping costs may apply.</li>
          </ul>

          <h2>Refunds</h2>
          <p>
            Refunds are processed after we receive and inspect the returned item. Refund method and timeline:
          </p>
          <ul>
            <li>
              <strong>Original payment method:</strong> Refunds are credited to the original payment instrument (for Razorpay payments, refunds will be processed through Razorpay).
            </li>
            <li>
              <strong>Processing time:</strong> Once approved, refunds typically take <strong>5–14 business days</strong> depending on your bank or card issuer.
            </li>
            <li>
              <strong>Fees:</strong> Any payment gateway fees charged at the time of sale may be deducted per applicable Product Terms unless otherwise stated.
            </li>
          </ul>

          <h2>Partial Refunds & Restocking</h2>
          <p>
            Partial refunds may be issued for items returned with missing parts or not in original condition. In some cases a restocking fee may apply (we’ll inform you in advance).
          </p>

          <h2>Non-returnable Items</h2>
          <p>
            Certain items cannot be returned for hygiene, safety or regulatory reasons (e.g., sealed consumables once opened, custom-made items). We’ll list non-returnable items on the product page.
          </p>

          <h2>Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective product, contact support immediately with photos and order details. We will prioritize resolution (replacement, refund or repair) at no extra cost to you.
          </p>

          <h2>How to Contact Support</h2>
          <p>
            For cancellations, returns or refunds, please reach out to:
          </p>
          <ul>
            <li>
              Email:{" "}
              <Link className="text-blue-600 hover:underline" href={`mailto:${supportEmail}`}>
                {supportEmail}
              </Link>
            </li>
            <li>
              Or visit our <Link className="text-blue-600 hover:underline" href="/contact-us">Contact Us</Link> page.
            </li>
          </ul>

          <h2>Additional Notes</h2>
          <p>
            - Refunds are subject to verification and compliance checks to prevent fraud. <br />
            - This policy is in addition to any specific product terms or warranty providers may offer.
          </p>

          <hr />

          <p className="text-sm text-gray-500">
            By shopping on Vijay Agencies you agree to this Cancellation &amp; Refund Policy. This policy may be updated from time to time — the latest version appears on this page.
          </p>
        </section>
      </div>
    </main>
  );
}
