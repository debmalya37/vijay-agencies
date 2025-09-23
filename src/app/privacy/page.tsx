"use client";

import React from "react";
import Link from "next/link";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8 md:p-12">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mt-2">
            Last updated: <strong>18-09-2025</strong>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            This Privacy Policy explains how Vijayagenciesjpr.com (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, shares and protects
            personal information when you use our website and services. By using our Site you consent to the practices
            described below.
          </p>
        </header>

        <article className="prose prose-sm md:prose md:prose-lg max-w-none text-gray-800">
          <section id="scope">
            <h2>1. Scope</h2>
            <p>
              This policy applies to personal data collected through Vijayagenciesjpr.com (the &quot;Site&quot;) and any related
              services we operate for selling products to our customers. It does not cover third-party websites or
              services linked from our Site; those services are governed by their own privacy notices.
            </p>
          </section>

          <section id="information-we-collect">
            <h2>2. Information We Collect</h2>
            <p>We collect information that helps us provide, improve and protect our services. Types of information include:</p>
            <ul>
              <li>
                <strong>Account &amp; profile data:</strong> name, email address, phone number, billing/shipping addresses,
                company name and other profile information you provide when creating an account or placing an order.
              </li>
              <li>
                <strong>Order &amp; payment data:</strong> order history, product details, transaction identifiers, and
                payment confirmation. Payment card details are processed by our payment provider (Razorpay) and are not
                stored on our servers.
              </li>
              <li>
                <strong>Device &amp; usage data:</strong> IP address, device type, browser, operating system, referrer,
                pages viewed, search queries and other analytics data collected automatically when you visit the Site.
              </li>
              <li>
                <strong>Support &amp; communications:</strong> messages you send to customer support and any responses,
                surveys, or feedback.
              </li>
              <li>
                <strong>Cookies &amp; similar technologies:</strong> information stored in cookies, local storage, pixels,
                and other tracking tools described below.
              </li>
            </ul>
          </section>

          <section id="how-we-use">
            <h2>3. How We Use Your Information</h2>
            <p>We use personal information for the following purposes:</p>
            <ul>
              <li>To create and manage your account, process and fulfill orders, and provide customer support.</li>
              <li>To process payments and prevent fraud (in partnership with Razorpay and other payment providers).</li>
              <li>To communicate important information such as order confirmations, shipping updates, and notices.</li>
              <li>To personalize your experience, show relevant products, and run promotions or marketing campaigns (with consent where required).</li>
              <li>To analyze and improve our Site, products and services using aggregated analytics.</li>
              <li>To comply with legal obligations and enforce our terms, including preventing abuse and fraud.</li>
            </ul>
          </section>

          <section id="cookies">
            <h2>4. Cookies &amp; Tracking</h2>
            <p>
              We use cookies and similar technologies to operate the Site, remember your preferences, analyze usage,
              and support advertising and marketing activities. Cookies may be first-party (set by us) or third-party
              (set by tools we use).
            </p>
            <p>
              You can control cookies through your browser settings and opt out of targeted advertising via industry
              opt-out tools. Disabling cookies may limit certain functionality of the Site.
            </p>
          </section>

          <section id="payment-processing">
            <h2>5. Payment Processing (Razorpay)</h2>
            <p>
              We use Razorpay as our payment gateway to accept and process online payments. When you make a payment:
            </p>
            <ul>
              <li>Payment card and UPI details are transmitted securely to Razorpay and handled according to their policies.</li>
              <li>We receive transaction confirmations and identifiers (e.g., razorpayOrderId, razorpayPaymentId) to track order status and reconciliations.</li>
              <li>We do not store full payment card numbers or bank account credentials on our servers.</li>
            </ul>
            <p className="text-sm text-gray-600">
              Please review Razorpay&apos;s privacy &amp; security documentation to understand how they handle payment data.
            </p>
          </section>

          <section id="third-parties">
            <h2>6. Third-Party Services</h2>
            <p>
              We may share personal information with third parties that perform services on our behalf (payment processors,
              couriers, analytics providers, customer support platforms, marketing platforms). These providers are bound by
              contractual obligations to protect personal data and may only process it for the purposes we specify.
            </p>
          </section>

          <section id="data-retention">
            <h2>7. Data Retention &amp; Security</h2>
            <p>
              We retain personal information as long as necessary to provide services, comply with legal obligations, resolve
              disputes, and enforce agreements. Retention periods vary by data type and purpose.
            </p>
            <p>
              We implement administrative, technical and physical safeguards (encryption, access controls, monitoring) to protect
              personal data. However, no system is entirely secure — if a security incident occurs we will follow applicable
              notification requirements.
            </p>
          </section>

          <section id="your-rights">
            <h2>8. Your Rights</h2>
            <p>
              Depending on your jurisdiction you may have rights to access, correct, delete or port your personal information,
              and to object to or restrict certain processing (for example under GDPR or similar laws). To exercise your rights,
              please contact us using the details below. We may need to verify your identity before responding.
            </p>
            <p className="text-sm text-gray-600">
              If you are a resident of California, you may have additional rights under the CCPA/CPRA. Contact us and
              include &quot;CCPA Request&quot; in the subject line.
            </p>
          </section>

          <section id="children">
            <h2>9. Children</h2>
            <p>
              Our Site and services are not directed to children under the age of 18. We do not knowingly collect personal data
              from children. If you believe we have inadvertently collected information from a child, please contact us and we
              will take steps to delete it.
            </p>
          </section>

          <section id="international">
            <h2>10. International Transfers</h2>
            <p>
              Your information may be processed and stored in servers located outside your country. Where required, we will
              implement appropriate safeguards to protect transfers of personal data across borders.
            </p>
          </section>

          <section id="changes">
            <h2>11. Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
              We will post the updated policy on this page with the &quot;Last updated&quot; date. Continued use of the Site after changes
              constitute acceptance of the revised policy.
            </p>
          </section>

          <section id="contact">
            <h2>12. Contact Us</h2>
            <p>
              If you have questions or requests regarding this Privacy Policy or our data practices, please contact:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <Link className="text-blue-600 underline" href="mailto:support@vijayagenciesjpr.com">
                Support@vijayagenciesjpr.com
                </Link>
                <span>{" / "}</span>
                <Link className="text-blue-600 underline" href="mailto:vijayagenciesjpr@yahoo.in">
                vijayagenciesjpr@yahoo.in
                </Link>
              </li>
              <li>
                <strong>Address:</strong> Vijay Agencies,  A 917 SIDDARTH NAGAR
                NEAR JAIN MANDIR JAIPUR
                PHONE - 9351630408, 9414073671
                Pincode 302025
                GSTIN/UIN: 08AAJPJ2631B1Z6
                State Name :  Rajasthan, Code : 08
                CIN: 041
              </li>
              <li>
                <strong>Phone:</strong> +919314628730
              </li>
            </ul>
          </section>

          <footer className="mt-6 text-sm text-gray-600">
            <p>
              This Privacy Policy is provided for informational purposes and does not create any contractual or legal rights
              beyond those provided under applicable law. For clarity on payment-specific questions, please also review our
              <Link href="/terms"><span className="text-blue-600 underline ml-1">Terms &amp; Conditions</span></Link> and Razorpay’s documentation.
            </p>
          </footer>
        </article>

        <div className="mt-8 flex justify-end gap-3">
          <Link href="/" className="px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200">
            Home
          </Link>
          <Link href="#contact" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
