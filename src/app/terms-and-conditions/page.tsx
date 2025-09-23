"use client";

import React from "react";
import Link from "next/link";

const TermsPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8 md:p-12">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Terms &amp; Conditions — Vijayagenciesjpr.com
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Last updated: <strong>18-09-2025</strong>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            These terms govern your access to and use of the Vijayagenciesjpr.com website and services, including
            purchases using Razorpay and Cash on Delivery (COD).
          </p>
        </header>

        <nav className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">On this page</h2>
          <ul className="text-sm text-blue-600 space-y-1 list-inside list-decimal">
            <li><Link href="#scope">Scope &amp; Acceptance</Link></li>
            <li><Link href="#definitions">Definitions</Link></li>
            <li><Link href="#ordering">Ordering &amp; Product Information</Link></li>
            <li><Link href="#pricing-payment">Pricing &amp; Payment Terms</Link></li>
            <li><Link href="#razorpay">Razorpay — Important Notes</Link></li>
            <li><Link href="#cod">Cash on Delivery (COD)</Link></li>
            <li><Link href="#shipping">Shipping &amp; Delivery</Link></li>
            <li><Link href="#returns">Returns &amp; Refunds Policy</Link></li>
            <li><Link href="#cancellations">Cancellations &amp; Order Changes</Link></li>
            <li><Link href="#privacy">Privacy &amp; Data</Link></li>
            <li><Link href="#ip">Intellectual Property</Link></li>
            <li><Link href="#liability">Liability &amp; Indemnity</Link></li>
            <li><Link href="#governing-law">Governing Law &amp; Dispute Resolution</Link></li>
            <li><Link href="#contact">Contact &amp; Support</Link></li>
          </ul>
        </nav>

        <article className="prose prose-sm md:prose md:prose-lg max-w-none text-gray-800">
          <section id="scope">
            <h3>1. Scope &amp; Acceptance</h3>
            <p>
              By visiting, accessing, browsing, or placing an order through Vijayagenciesjpr.com (the “Site”) you
              acknowledge and agree to these Terms &amp; Conditions. If you do not agree with any part of these Terms,
              do not use the Site or place an order.
            </p>
          </section>

          <section id="definitions">
            <h3>2. Definitions</h3>
            <ul>
              <li><strong>“We / Us / Our”</strong> — Vijayagenciesjpr.com (the merchant operating the Site).</li>
              <li><strong>“You / Customer / Merchant”</strong> — any user, buyer or business using the Site to purchase products.</li>
              <li><strong>“Products”</strong> — goods listed for sale on the Site.</li>
              <li><strong>“Razorpay”</strong> — Razorpay Software Private Limited, payment gateway provider used for online payments.</li>
              <li><strong>“COD”</strong> — Cash on Delivery payment method where payment is collected at delivery.</li>
            </ul>
          </section>

          <section id="ordering">
            <h3>3. Ordering &amp; Product Information</h3>
            <p>
              Product images, descriptions and prices displayed on the Site are for illustrative purposes. We attempt to
              be accurate but do not warrant that product descriptions, images or other content are error-free.
            </p>
            <p>
              All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order
              for any reason, including inaccuracies in product information, pricing, or suspected fraud.
            </p>
          </section>

          <section id="pricing-payment">
            <h3>4. Pricing, Taxes &amp; Payment Terms</h3>
            <p>
              All prices shown on the Site are in Indian Rupees (INR) unless stated otherwise. Prices may include or
              exclude taxes and shipping charges — any applicable taxes, duties and shipping charges will be displayed
              at checkout.
            </p>
            <p>
              You agree to pay the total amount shown at checkout, including product price, taxes, shipping/delivery
              charges and any other fees. For convenience and reconciliation we store some amounts in paise (1 INR = 100 paise);
              the checkout UI converts and displays the rupee value to the user.
            </p>

            <h4 className="mt-4">Accepted payment methods</h4>
            <ul>
              <li><strong>Online payments</strong> via Razorpay (cards, UPI, netbanking, wallets etc.).</li>
              <li><strong>Cash on Delivery (COD)</strong> where available.</li>
            </ul>

            <p>
              We will only charge your selected payment method after order confirmation. For online payments, funds are
              captured by Razorpay as per their flow and will appear on your bank/UPI statement as per Razorpay&apos;s
              settlement policies.
            </p>
          </section>

          <section id="razorpay">
            <h3>5. Razorpay — Important Notes</h3>
            <p>
              We use Razorpay as our payment gateway provider. When you select online payment, you will be redirected
              (or presented) to the Razorpay checkout UI. Your use of Razorpay is governed by Razorpay’s terms and
              privacy policy in addition to these Terms.
            </p>
            <ul>
              <li>You are responsible for providing accurate payment details to Razorpay.</li>
              <li>All payment disputes, chargebacks and refunds initiated via Razorpay will be processed according to Razorpay’s policies and our refund policy below.</li>
              <li>We recommend you review Razorpay’s Product Terms before making payments. Certain Razorpay products may require additional acceptance steps. </li>
            </ul>
            <p className="text-sm text-gray-600">
              <em>Note:</em> We do not store your full card or UPI credentials — those are handled by Razorpay securely.
            </p>
          </section>

          <section id="cod">
            <h3>6. Cash on Delivery (COD)</h3>
            <p>
              COD is offered in selected pin codes only. If you choose COD, please ensure someone is available at the delivery
              address to pay the exact amount in cash. We reserve the right to refuse COD for high-risk orders or orders
              exceeding a certain value.
            </p>
            <p>
              COD orders may attract additional handling fees shown during checkout. If the delivery is refused or undeliverable,
              we may charge cancellation/return fees and shipping costs as applicable.
            </p>
          </section>

          <section id="shipping">
            <h3>7. Shipping &amp; Delivery</h3>
            <p>
              Shipping timelines shown on the Site are estimates. Actual delivery times may vary due to product availability,
              courier delays, customs (for international shipments) or force majeure events. We will make reasonable efforts
              to meet estimated delivery dates but are not liable for delays beyond our control.
            </p>
            <p>
              Risk of loss for products passes to you upon delivery to the address you provided. Please inspect packages
              at the time of delivery and report any visible damage to the courier and to our support immediately.
            </p>
          </section>

          <section id="returns">
            <h3>8. Returns, Refunds &amp; Replacement Policy</h3>
            <p>
              Our returns, refunds and replacement policy is designed to be fair. The key points are:
            </p>
            <ul>
              <li><strong>Return window:</strong> Unless otherwise specified on a product page, returns must be initiated within 7–15 days of delivery for eligible items. Some categories (perishables, opened consumables, personalized items) may not be returnable.</li>
              <li><strong>Condition:</strong> Items must be returned in original, unused condition with tags, packaging and invoice (if provided).</li>
              <li><strong>Process:</strong> To start a return, contact our support team. We will provide instructions and (where applicable) a return shipping label.</li>
              <li><strong>Refunds:</strong> Refunds are issued after we receive and inspect the returned item. Refunds for online payments are processed via Razorpay and may take 3–7 business days (depending on bank/UPI settlement). For COD refunds, we will issue refunds via bank transfer or Razorpay payout as per our internal policy.</li>
              <li><strong>Shipping costs:</strong> Unless the return is due to our error (wrong/defective item), the original shipping charges may not be refundable and return shipping may be your responsibility.</li>
              <li><strong>Partial refunds:</strong> If a returned item is damaged or missing parts when returned, a partial refund may be issued.</li>
            </ul>
            <p className="text-sm text-gray-600">
              We may publish specific return windows, restocking fees or exceptions per product category — always check the product page and the return instructions provided at time of purchase.
            </p>
          </section>

          <section id="cancellations">
            <h3>9. Cancellations &amp; Order Changes</h3>
            <p>
              You may cancel or modify an order before it is shipped. Once an order is shipped, cancellation may not be
              possible and the Returns process should be used after delivery. Cancellation requests are subject to acceptance
              and may incur fees in some circumstances.
            </p>
          </section>

          <section id="privacy">
            <h3>10. Privacy &amp; Data</h3>
            <p>
              We collect and process personal data necessary to provide the service (order fulfillment, payments and support).
              Our <Link href="/privacy"><span className="text-blue-600 underline">Privacy Policy</span></Link> describes what we collect,
              how we use it and your rights. By using the Site you consent to our data practices described there.
            </p>
            <p className="text-sm text-gray-600">
              Payment details (card numbers, UPI IDs) are processed by Razorpay — we do not retain full payment credentials on our servers.
            </p>
          </section>

          <section id="ip">
            <h3>11. Intellectual Property</h3>
            <p>
              All content on the Site (text, images, logos, code) is owned or licensed by Vijayagenciesjpr.com. You may not
              reproduce, distribute or create derivative works from our content without prior written permission.
            </p>
          </section>

          <section id="liability">
            <h3>12. Liability, Warranty &amp; Indemnity</h3>
            <p>
              To the maximum extent permitted by law, our liability for any claim arising out of or in connection with these
              Terms or the Site shall be limited to the purchase price of the products giving rise to the claim.
            </p>
            <p>
              We provide products &quot;as is&quot; and do not offer any warranties not expressly stated. You indemnify and hold us harmless
              from any claims arising from your breach of these Terms or misuse of products.
            </p>
          </section>

          <section id="governing-law">
            <h3>13. Governing Law &amp; Dispute Resolution</h3>
            <p>
              These Terms are governed by the laws of India (unless otherwise specified). Any disputes will be subject to the
              exclusive jurisdiction of the courts located in Rajasthan, India. If you are a
              consumer, nothing in these Terms affects your statutory rights.
            </p>
          </section>

          <section id="contact">
            <h3>14. Contact &amp; Support</h3>
            <p>
              For questions, claims, or to initiate returns please contact our support:
            </p>
            <ul>
              <li><strong>Email:</strong> <Link className="text-blue-600 underline" href="mailto:support@vijayagenciesjpr.com">Support@vijayagenciesjpr.com</Link></li>
              <li><strong>Phone:</strong> +919314628730</li>
              <li><strong>Address:</strong> Vijay Agencies,  A 917 SIDDARTH NAGAR
                NEAR JAIN MANDIR JAIPUR
                PHONE - 9351630408, 9414073671
                Pincode 302025
                GSTIN/UIN: 08AAJPJ2631B1Z6
                State Name :  Rajasthan, Code : 08
                CIN: 041
                </li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              For issues specifically regarding payments, Razorpay support may also assist as per their product terms.
            </p>
          </section>

          <footer className="mt-8 text-sm text-gray-600">
            <p>
              By using Vijayagenciesjpr.com you confirm that you have read, understood, and accepted these Terms and the
              related policies (Privacy, Returns, Shipping). These Terms may change from time to time — the &quot;Last updated&quot;
              date at the top indicates the latest version. We recommend you review them periodically.
            </p>
          </footer>
        </article>

        <div className="mt-8 flex justify-end gap-3">
          <Link href="/" className="px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200">Home</Link>
          <Link href="#contact" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Contact Support</Link>
        </div>
      </div>
    </main>
  );
};

export default TermsPage;
