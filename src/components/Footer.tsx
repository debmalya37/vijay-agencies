// app/components/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

/**
 * Responsive, modern footer for Vijay Agencies
 * - Links: Terms, Privacy, About, Contact
 * - Mini sitemap
 * - Address + contact
 * - Social icons
 * - "Developed by ThinQit" credit + copyright
 *
 * Drop this component into your layout (e.g. app/layout.tsx) as <Footer />
 */

export default function Footer(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                <div className="w-10 h-10 relative">
                    <Image
                      src="/X.JPEG.jpg"   // ✅ path relative to /public
                      alt="Vijay Agencies Logo"
                      fill                // fills the div
                      className="object-cover rounded-full"
                      priority            // loads faster
                    />
                  </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-white">Vijay Agencies</div>
                <div className="text-xs text-gray-300">Quality Products • Trusted</div>
              </div>
            </Link>

            <p className="mt-4 text-sm text-gray-300 leading-relaxed">
              Vijay Agencies — Your trusted partner for commercial cleaning solutions in Jaipur. We provide high-quality cleaning equipment and chemicals to hotels and businesses.
            </p>

            <div className="mt-6 flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-green-400 mt-0.5" aria-hidden />
              <address className="not-italic text-gray-300">
                {/* 123 Industrial Estate,<br /> Jaipur, Rajasthan 342001, India */}
                <p className="text-blue-100 leading-relaxed">
                  A 917 SIDDHARTH NAGAR<br />
                  NEAR JAIN MANDIR<br />
                  JAIPUR, RAJASTHAN - 302025
                </p>
              </address>
            </div>

            <div className="mt-4 space-y-1 text-sm">
              <Link
                href="mailto:Support@vijayagenciesjpr.com"
                className="inline-flex items-center gap-2 text-gray-200 hover:text-white"
                aria-label="Email Vijay Agencies"
              >
                <Mail className="w-4 h-4 text-green-400" /> Support@vijayagenciesjpr.com
              </Link>
              <span>   </span>
              <Link
                href="tel:+911234567890"
                className="inline-flex items-center gap-2 text-gray-200 hover:text-white"
                aria-label="Call Vijay Agencies"
              >
                <Phone className="w-4 h-4 text-green-400" /> +919414073671
              </Link>
            </div>
          </div>

          {/* Quick Links / Sitemap */}
          <div className="md:col-span-5 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Quick links</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
                </li>
                <li>
                  <Link href="/Products" className="text-gray-300 hover:text-white">Products</Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white">About Us</Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-gray-300 hover:text-white">Contact Us</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Policies & Help</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/terms-and-conditions" className="text-gray-300 hover:text-white">Terms &amp; Conditions</Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/cancellation-refunds" className="text-gray-300 hover:text-white">Refund Policy</Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-gray-300 hover:text-white">Shipping Policy</Link>
                </li>
                {/* <li>
                  <Link href="/returns" className="text-gray-300 hover:text-white">Return Policy</Link>
                </li>
                <li>
                  <Link href="/refunds" className="text-gray-300 hover:text-white">Refund Policy</Link>
                </li> */}
              </ul>
            </div>
          </div>

          {/* Newsletter & Social */}
          {/* <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Stay in touch</h3>
            {/* <p className="mt-3 text-sm text-gray-300">
              Subscribe to get product updates, offers and useful tips.
            </p> */}

            {/* <form
              // currently simple mailto — progressive enhancement: form action could be wired to your email service
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as HTMLFormElement;
                const form = new FormData(target);
                const email = String(form.get("email") || "").trim();
                if (!email) {
                  alert("Please enter your email");
                  return;
                }
                // open mail client as a temporary subscribe action
                window.location.href = `mailto:info@vijayagenciesjpr.com?subject=Subscribe%20to%20newsletter&body=Please%20subscribe%20${encodeURIComponent(
                  email
                )}%20to%20the%20newsletter.`;
              }}
              className="mt-4 flex flex-col sm:flex-row gap-3"
            >
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="Your email address"
                required
                className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Email address to subscribe"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white font-semibold"
                aria-label="Subscribe"
              >
                Subscribe
              </button>
            </form> 

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Follow us</h4>
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href="#"
                  aria-label="Facebook"
                  className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
                >
                  <Facebook className="w-4 h-4 text-gray-200" />
                </Link>
                <Link
                  href="#"
                  aria-label="Instagram"
                  className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
                >
                  <Instagram className="w-4 h-4 text-gray-200" />
                </Link>
                <Link
                  href="#"
                  aria-label="Twitter"
                  className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
                >
                  <Twitter className="w-4 h-4 text-gray-200" />
                </Link>
                <Link
                  href="#"
                  aria-label="LinkedIn"
                  className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
                >
                  <Linkedin className="w-4 h-4 text-gray-200" />
                </Link>
              </div>
            </div>
          </div>  */}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-gray-400">
              © {year} Vijay Agencies. All rights reserved.
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>
                Developed by{" "}
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:underline inline-flex items-center gap-1"
                >
                  ThinQit <ExternalLink className="w-3 h-3" />
                </Link>
              </span>

              <span className="hidden sm:inline">•</span>

              <nav aria-label="footer legal" className="flex gap-3">
                <Link href="/terms-and-conditions" className="text-gray-300 hover:text-white">Terms & Conditions</Link>
                <Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
                <Link href="/contact-us" className="text-gray-300 hover:text-white">Customer Support</Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
