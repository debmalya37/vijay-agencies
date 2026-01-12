"use client";
import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Sharma',
    role: 'Hotel Manager',
    company: 'Grand Palace Hotel',
    image: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?q=80&w=1206&auto=format&fit=crop',
    text: 'Vijay Agencies has been our trusted partner for over 5 years. Their cleaning products are top quality and delivery is always on time.'
  },
  {
    name: 'Priya Agarwal',
    role: 'Procurement Head',
    company: 'Rajputana Hotels',
    image: 'https://images.unsplash.com/photo-1573165850883-9b0e18c44bd2?q=80&w=688&auto=format&fit=crop',
    text: 'Excellent service and competitive prices for bulk orders. Their team understands our hotel requirements perfectly.'
  },
  {
    name: 'Amit Kumar',
    role: 'Operations Manager',
    company: 'Heritage Resort',
    image: 'https://images.unsplash.com/photo-1729157659231-1982957f2d7b?q=80&w=764&auto=format&fit=crop',
    text: 'Professional approach and reliable supply chain. Highly recommend for all hotel and commercial cleaning needs.'
  }
];

export default function TestimonialSection() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            Client Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-6">
            Trusted by Jaipur's Finest
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            We take pride in powering the hygiene standards of top hotels and businesses.
          </p>
        </div>

        {/* Testimonials Container */}
        {/* Mobile: Horizontal Snap Scroll | Desktop: Grid */}
        <div className="
            flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 snap-x
            sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0
            scrollbar-hide
        ">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="
                min-w-[300px] sm:min-w-0 snap-center
                relative bg-white rounded-2xl p-6 sm:p-8
                border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1
                transition-all duration-300 group
              "
            >
              {/* Giant Quote Icon Background */}
              <div className="absolute top-6 right-8 text-gray-100 group-hover:text-blue-50 transition-colors">
                <Quote className="w-16 h-16 fill-current transform rotate-180" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6 relative z-10">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="relative z-10 mb-8">
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium">
                  "{testimonial.text}"
                </p>
              </blockquote>

              {/* Divider */}
              <div className="w-full h-px bg-gray-100 mb-6"></div>

              {/* User Profile */}
              <div className="flex items-center gap-4 relative z-10">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{testimonial.company}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
        
        {/* Mobile Scroll Indicator */}
        <div className="flex justify-center gap-2 mt-4 sm:hidden">
            <div className="w-2 h-2 rounded-full bg-gray-800 opacity-50"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

      </div>
    </section>
  );
}