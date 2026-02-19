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
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-red-50/20 to-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-100 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-100/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-100 text-[#EF4F5F] text-xs font-bold uppercase tracking-wider mb-6 shadow-sm shadow-red-100 animate-fade-in-up">
            <Star className="w-3.5 h-3.5 fill-[#EF4F5F]" />
            Client Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 font-sans mb-6 leading-tight">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CB202D] to-[#EF4F5F]">Jaipur's Finest</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            We take pride in powering the hygiene standards of top hotels and businesses with our premium cleaning solutions.
          </p>
        </div>

        {/* Testimonials Container */}
        {/* Mobile: Horizontal Snap Scroll | Desktop: Grid */}
        <div className="
            flex gap-6 overflow-x-auto pb-10 pt-4 -mx-4 px-4 snap-x snap-mandatory
            sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0 sm:pt-0 sm:mx-0 sm:px-0
            scrollbar-hide
        ">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="
                min-w-[320px] sm:min-w-0 snap-center h-full
                relative bg-white rounded-3xl p-8
                border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]
                hover:shadow-[0_20px_40px_-12px_rgba(239,79,95,0.15)] 
                hover:border-red-100 hover:-translate-y-2
                transition-all duration-300 ease-out group
              "
            >
              {/* Giant Quote Icon Background */}
              <div className="absolute top-8 right-8 text-gray-50 group-hover:text-red-50/80 transition-colors duration-300">
                <Quote className="w-20 h-20 fill-current transform rotate-180" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6 relative z-10">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="relative z-10 mb-8 min-h-[5rem]">
                <p className="text-gray-700 text-lg leading-relaxed font-medium italic">
                  "{testimonial.text}"
                </p>
              </blockquote>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-gray-100 via-red-50 to-gray-100 mb-6"></div>

              {/* User Profile */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-200 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md relative z-10"
                  />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-base">{testimonial.name}</h4>
                    <CheckCircle2 className="w-4 h-4 text-[#EF4F5F]" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{testimonial.role}</p>
                  <p className="text-xs font-bold text-[#EF4F5F] mt-0.5">{testimonial.company}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
        
        {/* Mobile Scroll Indicator (Dots) */}
        <div className="flex justify-center gap-2 mt-4 sm:hidden">
            <div className="w-2 h-2 rounded-full bg-[#EF4F5F]"></div>
            <div className="w-2 h-2 rounded-full bg-red-100"></div>
            <div className="w-2 h-2 rounded-full bg-red-100"></div>
        </div>

      </div>
    </section>
  );
}