"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 🔹 You can integrate API call / backend email service here
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-lg text-gray-600">
            We’d love to hear from you! Reach out to <span className="font-semibold">Vijay Agencies</span>.
          </p>
        </div>

        {/* Contact Info + Form */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-600" />
                <p className="text-gray-700">+91 98765 43210</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-600" />
                <p className="text-gray-700">support@vijayagencies.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-600" />
                <p className="text-gray-700">
                  123 Market Street, Kolkata, India
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                  <Button type="submit" className="w-full flex items-center justify-center gap-2">
                    <Send size={18} />
                    Send Message
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <h3 className="text-xl font-semibold text-green-600">Thank you!</h3>
                  <p className="text-gray-600 mt-2">
                    Your message has been sent. Our team at Vijay Agencies will get back to you shortly.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <div className="w-full h-72 rounded-2xl overflow-hidden shadow-lg">
          <iframe
            title="Vijay Agencies Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.3173980072936!2d88.3639!3d22.5726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM0JzIxLjQiTiA4OMKwMjEnNTAuMCJF!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
