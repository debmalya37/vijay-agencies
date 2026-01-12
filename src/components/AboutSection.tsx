"use client";
import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  History, 
  Award, 
  Sparkles, 
  Phone, 
  Mail,
  Factory,
  FlaskConical,
  ScrollText,
  SprayCan
} from 'lucide-react';

const features = [
  {
    title: "Industrial Equipment",
    desc: "Vacuums, scrubbers & sweepers",
    icon: Factory,
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100"
  },
  {
    title: "Cleaning Chemicals",
    desc: "Kitchen & washroom solutions",
    icon: FlaskConical,
    color: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-100"
  },
  {
    title: "Paper Products",
    desc: "Tissues, towels & rolls",
    icon: ScrollText,
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100"
  },
  {
    title: "Dispensers",
    desc: "Soap & air fresheners",
    icon: SprayCan,
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-100"
  }
];

export default function AboutSection() {
  return (
    <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gray-50 to-transparent -z-10"></div>
      <div className="absolute top-20 right-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT: Image & Legacy Area */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=900"
                alt="Vijay Agencies History"
                className="w-full h-[400px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Bottom Text on Image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                 <p className="font-serif text-2xl font-medium italic mb-2">"Quality First, Always."</p>
                 <div className="flex items-center gap-2 text-sm opacity-80">
                    <History className="w-4 h-4" />
                    <span>Serving Jaipur since 1972</span>
                 </div>
              </div>
            </div>

            {/* Floating Badge (Top Left) */}
            <div className="absolute -top-6 -left-4 sm:top-8 sm:-left-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 max-w-[200px] animate-fade-in-up">
               <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 text-amber-600">
                  <Award className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Legacy</p>
                  <p className="text-lg font-bold text-gray-900 leading-none">50+ Years</p>
               </div>
            </div>

            {/* Contact Strip (Bottom Right - overlaps) */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex-col gap-3">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                     <Phone className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 font-medium">Call Us</p>
                     <p className="text-sm font-bold text-gray-900">9351630408</p>
                  </div>
               </div>
               <div className="w-full h-px bg-gray-100"></div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                     <Mail className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 font-medium">Email</p>
                     <p className="text-sm font-bold text-gray-900">support@vijayagenciesjpr.com</p>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT: Content Area */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold tracking-wide uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              About Vijay Agencies
            </div>
            
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-serif mb-6 leading-tight">
              Your Trusted Partner in <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Commercial Hygiene</span>
            </h2>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
              We specialize in providing comprehensive cleaning solutions to hotels, restaurants, and commercial establishments across Rajasthan. From heavy-duty machinery to daily consumables, we cover it all.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
               {features.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${item.border} bg-white hover:shadow-md transition-shadow flex items-start gap-4`}>
                     <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                        <item.icon className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href="/about"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Our Story
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Contact Sales
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}