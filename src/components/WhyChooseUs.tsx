"use client";
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Truck, 
  ShieldCheck, 
  BadgePercent, 
  Users, 
  Package, 
  Clock, 
  ThumbsUp,
  ArrowRightLeft
} from 'lucide-react';

const stats = [
  { value: "50+", label: "Years Exp.", icon: Trophy },
  { value: "500+", label: "Clients", icon: Users },
  { value: "1k+", label: "Products", icon: Package },
  { value: "24/7", label: "Support", icon: Clock },
];

const benefits = [
  { 
    title: "Hotel Experts", 
    desc: "Hospitality specialist.",
    icon: Trophy,
    color: "bg-amber-100 text-amber-600"
  },
  { 
    title: "Fast Delivery", 
    desc: "Same-day dispatch.",
    icon: Truck,
    color: "bg-blue-100 text-blue-600"
  },
  { 
    title: "Certified", 
    desc: "100% Genuine items.",
    icon: ShieldCheck,
    color: "bg-green-100 text-green-600"
  },
  { 
    title: "Wholesale", 
    desc: "Direct factory rates.",
    icon: BadgePercent,
    color: "bg-purple-100 text-purple-600"
  },
];

const comparisonData = [
  { point: "Partnerships", us: "Direct Manufacturer", them: "Middlemen" },
  { point: "Stock", us: "Always in Stock", them: "Frequent Shortages" },
  { point: "Pricing", us: "Transparent Wholesale", them: "Hidden Costs" },
  { point: "Delivery", us: "Fast & Reliable", them: "Unpredictable" },
  { point: "Support", us: "Dedicated Manager", them: "No Support" },
];

export default function WhyChooseUs() {
  const [activeTab, setActiveTab] = useState<'us' | 'them'>('us');

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-50/40 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. HEADER & STATS */}
        <div className="relative mb-12 sm:mb-20">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-3 sm:mb-4 border border-red-100">
              The Vijay Agencies Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4 sm:mb-6">
              Why 500+ Hotels Trust Us
            </h2>
            <p className="text-gray-500 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
              We deliver reliability, quality, and cost-efficiency directly to your doorstep.
            </p>
          </div>

          {/* Floating Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transform md:-rotate-1 hover:rotate-0 transition-transform duration-500">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center p-6 border-b border-r border-gray-100 last:border-r-0 sm:border-b-0 even:border-r-0 md:even:border-r">
                <div className="mb-2 sm:mb-3 p-2.5 bg-gray-50 rounded-full text-gray-700">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-0.5">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. CORE PILLARS (Mobile: 2x2 Grid, Desktop: 4 col) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-16 sm:mb-24">
          {benefits.map((item, idx) => (
            <div key={idx} className="group bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center sm:text-left">
              <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl ${item.color} flex items-center justify-center mb-3 sm:mb-6 mx-auto sm:mx-0 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{item.title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 3. THE SHOWDOWN: VIJAY vs OTHERS */}
        <div className="relative">
            <h3 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-10 font-serif">The Difference is Clear</h3>

            {/* MOBILE TOGGLE (Visible only on small screens) */}
            <div className="flex justify-center mb-6 md:hidden">
              <div className="bg-gray-100 p-1 rounded-xl inline-flex relative shadow-inner">
                {/* Animated Background slider */}
                <div 
                   className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${activeTab === 'us' ? 'left-1' : 'left-[calc(50%+4px)]'}`}
                />
                
                <button 
                  onClick={() => setActiveTab('us')}
                  className={`relative z-10 px-2 py-2 pr-4 text-sm text-left font-bold rounded-lg transition-colors duration-200 ${activeTab === 'us' ? 'text-green-700' : 'text-gray-500'}`}
                >
                  Vijay Agencies
                </button>
                <button 
                  onClick={() => setActiveTab('them')}
                  className={`relative z-10 px-8 py-2 text-sm font-bold rounded-lg transition-colors duration-200 ${activeTab === 'them' ? 'text-red-600' : 'text-gray-500'}`}
                >
                  Others
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-center max-w-5xl mx-auto">
                
                {/* Winner Card (Vijay Agencies) - Visible if Desktop OR Mobile Tab is 'us' */}
                <div className={`${activeTab === 'us' ? 'block' : 'hidden'} md:block relative bg-white rounded-3xl shadow-2xl border border-green-100 overflow-hidden transform transition-all duration-500 md:scale-105 z-10`}>
                    <div className="bg-[#00B25C] px-6 py-4 sm:p-6 text-white text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-lg sm:text-xl font-bold mb-0.5">Vijay Agencies</h4>
                            <p className="text-green-100 text-xs sm:text-sm opacity-90">The Professional Choice</p>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <ThumbsUp className="w-12 h-12 sm:w-16 sm:h-16 rotate-12" />
                        </div>
                    </div>
                    
                    <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
                        {comparisonData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 sm:gap-4">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">{item.point}</p>
                                    <p className="font-bold text-gray-800 text-sm sm:text-base">
                                        {item.us}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-green-50 p-3 sm:p-4 text-center border-t border-green-100">
                        <p className="text-green-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> 100% Satisfaction Guarantee
                        </p>
                    </div>
                </div>

                {/* Loser Card (Others) - Visible if Desktop OR Mobile Tab is 'them' */}
                <div className={`${activeTab === 'them' ? 'block' : 'hidden'} md:block relative bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-red-200 md:grayscale-[0.3] hover:grayscale-0 transition-all duration-500`}>
                    <div className="bg-gray-100 px-6 py-4 sm:p-6 text-center text-gray-500">
                        <h4 className="text-lg font-bold">Standard Suppliers</h4>
                        <p className="text-xs">The risky alternative</p>
                    </div>

                    <div className="p-5 sm:p-8 space-y-5 sm:space-y-6 opacity-80">
                         {comparisonData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 sm:gap-4">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                                    <XCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">{item.point}</p>
                                    <p className="font-medium text-gray-600 text-sm sm:text-base">
                                        {item.them}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </section>
  );
}