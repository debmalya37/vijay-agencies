"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Loader2,
} from "lucide-react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  department: "Sales" | "Support" | "Accounts" | "General";
  message: string;
  contactBy: "email" | "phone";
  consent: boolean;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  department: "General",
  message: "",
  contactBy: "email",
  consent: true,
};

export default function ContactPage(): JSX.Element {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const supportEmail = "vijayagenciesjpr@yahoo.in";
  const companyPhone = "+919351630408";
  const companyAddress = "Vijay Agencies, Jodhpur (Rajasthan), India";

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    )
      e.email = "Enter a valid email address.";

    if (form.phone && !/^\d{10,15}$/.test(form.phone.replace(/[^\d]/g, "")))
      e.phone = "Enter a valid phone number (digits only)";

    if (!form.subject.trim()) e.subject = "Please add a subject.";
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = "Message should be at least 10 characters.";

    if (!form.consent)
      e.consent = "Please agree to the terms and allow us to contact you.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange =
    (key: keyof FormState) =>
    (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        (evt.target as HTMLInputElement | HTMLTextAreaElement).value ?? "";
      setForm((s) => ({ ...s, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleRadio =
    (key: keyof FormState) =>
    (val: string | boolean | any) =>
    () => {
      setForm((s) => ({ ...s, [key]: val }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const buildMailto = (): string => {
    const to = supportEmail;
    const subject = `[${form.department}] ${form.subject}`.trim();
    // Build a friendly body
    const bodyLines = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : undefined,
      `Preferred contact method: ${form.contactBy === "phone" ? "Phone" : "Email"}`,
      ``,
      `Message:`,
      `${form.message}`,
      ``,
      `--`,
      `Website: Vijayagenciesjpr.com`,
      `Please reply to the email above.`,
    ].filter(Boolean) as string[];

    // join using CRLF for best mailto compatibility
    const body = bodyLines.join("\r\n");
    // encode and build
    const params = new URLSearchParams({
      subject: subject,
      body: body,
    });

    // If you want to cc (e.g., accounts), you could add &cc=...
    return `mailto:${to}?${params.toString()}`;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSuccess(null);

    if (!validate()) return;

    setSending(true);
    try {
      const mailto = buildMailto();

      // Try to open mail client; window.open returns a reference if allowed.
      const opened = window.open(mailto, "_self");
      // Some browsers block window.open - fallback to copying link and instructing user
      if (!opened) {
        try {
          await navigator.clipboard.writeText(mailto);
          setSuccess(
            "Mail link copied to clipboard — paste it into your email client to send."
          );
        } catch {
          setSuccess(
            "Unable to open mail client automatically. Please send an email to " +
              supportEmail
          );
        }
      } else {
        // success path: we still show a friendly message (note: many clients open new window)
        setTimeout(() => {
          setSuccess("Mail client opened — please complete and send the email.");
        }, 300);
      }

      // Optionally clear form after "sending" to keep UX tidy
      setForm(INITIAL);
    } catch (err) {
      console.error("Contact submit error:", err);
      setSuccess("Failed to open mail client. Please email us at " + supportEmail);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM CARD */}
        <section className="bg-white rounded-xl shadow p-6 md:p-10">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Contact Vijay Agencies
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              We&apos;re here to help — sales, support or general enquiries. Use the form below
              or email us directly at{" "}
              <Link
                className="text-blue-600 hover:underline"
                href={`mailto:${supportEmail}`}
              >
                {supportEmail}
              </Link>
              .
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Full name *</span>
                <input
                  className={`mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-400" : "border-gray-200"
                  }`}
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                />
                {errors.name && (
                  <span id="err-name" className="text-xs text-red-600 mt-1">
                    {errors.name}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Email address *</span>
                <input
                  className={`mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-400" : "border-gray-200"
                  }`}
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                />
                {errors.email && (
                  <span id="err-email" className="text-xs text-red-600 mt-1">
                    {errors.email}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Phone (optional)</span>
                <input
                  className={`mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-400" : "border-gray-200"
                  }`}
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="10 digit mobile (optional)"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <span className="text-xs text-red-600 mt-1">{errors.phone}</span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Department</span>
                <select
                  className="mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                  value={form.department}
                  onChange={handleChange("department")}
                >
                  <option>General</option>
                  <option>Sales</option>
                  <option>Support</option>
                  <option>Accounts</option>
                </select>
              </label>
            </div>

            <div className="mt-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Subject *</span>
                <input
                  className={`mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subject ? "border-red-400" : "border-gray-200"
                  }`}
                  type="text"
                  value={form.subject}
                  onChange={handleChange("subject")}
                  placeholder="Short subject describing your request"
                />
                {errors.subject && (
                  <span className="text-xs text-red-600 mt-1">{errors.subject}</span>
                )}
              </label>
            </div>

            <div className="mt-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Message *</span>
                <textarea
                  className={`mt-1 px-3 py-2 h-32 resize-y border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.message ? "border-red-400" : "border-gray-200"
                  }`}
                  value={form.message}
                  onChange={handleChange("message")}
                  placeholder="Tell us about your request — include order/product details where relevant"
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.message ? (
                    <span className="text-xs text-red-600">{errors.message}</span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      {form.message.length}/2000
                    </span>
                  )}
                </div>
              </label>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  id="contact-email"
                  name="contactBy"
                  type="radio"
                  checked={form.contactBy === "email"}
                  onChange={() => setForm((s) => ({ ...s, contactBy: "email" }))}
                  className="w-4 h-4"
                />
                <label htmlFor="contact-email" className="text-sm text-gray-700">
                  Contact by email
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="contact-phone"
                  name="contactBy"
                  type="radio"
                  checked={form.contactBy === "phone"}
                  onChange={() => setForm((s) => ({ ...s, contactBy: "phone" }))}
                  className="w-4 h-4"
                />
                <label htmlFor="contact-phone" className="text-sm text-gray-700">
                  Contact by phone
                </label>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                checked={form.consent}
                onChange={(ev) =>
                  setForm((s) => ({ ...s, consent: ev.target.checked }))
                }
                className="w-4 h-4 mt-1"
              />
              <label htmlFor="consent" className="text-sm text-gray-600">
                I agree to be contacted by Vijay Agencies regarding this enquiry and accept
                the <Link href="/privacy"><span className="text-blue-600 underline">Privacy Policy</span></Link>.
              </label>
            </div>
            {errors.consent && (
              <div className="text-xs text-red-600 mt-2">{errors.consent}</div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
              title="Send Message"
                type="submit"
                onClick={handleSubmit}
                disabled={sending}
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                aria-disabled={sending.toString()}
              >
                {sending ? <Loader2 className="animate-spin w-4 h-4" /> : null}
                {sending ? "Opening Mail Client..." : "Send Message"}
              </button>

              <button
                type="button"
                onClick={() => setForm(INITIAL)}
                className="px-4 py-3 border rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100"
              >
                Reset
              </button>
            </div>

            {success && (
              <div
                role="status"
                className="mt-4 rounded-md bg-green-50 border border-green-100 p-3 text-green-800 text-sm"
              >
                {success}
              </div>
            )}
          </form>
        </section>

        {/* CONTACT INFO / HOURS CARD */}
        <aside className="bg-white rounded-xl shadow p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Our Address</h3>
              <p className="text-sm text-gray-600 mt-1">{companyAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-50">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Phone</h3>
              <Link className="text-sm text-gray-600 mt-1 block hover:underline" href={`tel:${companyPhone}`}>
                {companyPhone}
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-indigo-50">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Email</h3>
              <Link className="text-sm text-gray-600 mt-1 block hover:underline" href={`mailto:${supportEmail}`}>
                {supportEmail}
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-yellow-50">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Business Hours</h3>
              <p className="text-sm text-gray-600 mt-1">
                Mon - Sat: 9:30 AM — 6:30 PM
                <br />
                Sun: Closed
              </p>
            </div>
          </div>

          <div className="pt-2 border-t">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Follow us</h4>
            <div className="flex items-center gap-3">
              <Link href="#" aria-label="Facebook" className="p-2 rounded-md bg-blue-50 hover:bg-blue-100">
                <Facebook className="w-4 h-4 text-blue-600" />
              </Link>
              <Link href="#" aria-label="Instagram" className="p-2 rounded-md bg-pink-50 hover:bg-pink-100">
                <Instagram className="w-4 h-4 text-pink-600" />
              </Link>
              <Link href="#" aria-label="Twitter / X" className="p-2 rounded-md bg-sky-50 hover:bg-sky-100">
                <Twitter className="w-4 h-4 text-sky-600" />
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t text-xs text-gray-500">
            <p>
              Prefer emailing directly? Use{" "}
              <Link className="text-blue-600 underline" href={`mailto:${supportEmail}`}>
                {supportEmail}
              </Link>
              . For order queries, please include your Order ID in the subject line for faster support.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
