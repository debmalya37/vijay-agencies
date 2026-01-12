"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Star } from 'lucide-react';
// Assuming you have your QuickProductCard here
import QuickProductCard from '@/components/QuickProductCard'; 

// Props interface (Adjust based on your actual data structure if needed)
interface HousekeepingSectionProps {
  products: any[];
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  totalSlides: number;
}

export default function HousekeepingSection({
  products,
  currentSlide,
  nextSlide,
  prevSlide,
  goToSlide,
  totalSlides
}: HousekeepingSectionProps) {

  // If no products, hide section
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-white via-indigo-50/30 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Section Header - Centered & Clean */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold tracking-wide uppercase mb-4 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Commercial Grade
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-serif tracking-tight mb-4">
            Housekeeping Essentials
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 text-base sm:text-lg">
            Professional supplies trusted by Jaipur's top hotels. <br className="hidden sm:block"/>
            Everything from chemicals to tools, delivered fast.
          </p>
        </div>

        {/* 2. Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT: Feature/Banner Card (Takes 5/12 columns) */}
          <div className="lg:col-span-5 relative group order-1">
            <div className="relative h-full min-h-[400px] lg:min-h-[500px] rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-500 hover:shadow-indigo-500/20">
              
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
                  alt="Housekeeping Staff"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent mix-blend-multiply"></div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end text-white z-10">
                
                {/* Floating Badge */}
                <div className="absolute top-8 left-8 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-2xl flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5" />
                   <span className="text-sm font-bold">Certified Quality</span>
                </div>

                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <h3 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
                    Maintain <br/> 5-Star Standards
                  </h3>
                  <p className="text-indigo-100 text-sm sm:text-base mb-8 opacity-90 leading-relaxed max-w-xs">
                    Equip your staff with high-performance tools designed for efficiency and durability.
                  </p>
                  
                  <Link 
                    href="/Products?category=housekeeping"
                    className="inline-flex items-center gap-2 bg-white text-indigo-900 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg"
                  >
                    Explore Collection
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Showcase Slider (Takes 7/12 columns) */}
          <div className="lg:col-span-7 order-2 flex flex-col justify-center">
            
            {/* The "Shelf" Background */}
            <div className="relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] p-4 sm:p-6 shadow-xl shadow-indigo-100/50">
                
                {/* Header inside the shelf */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <div>
                        <h4 className="font-bold text-gray-800 text-lg">Top Picks</h4>
                        <p className="text-xs text-gray-500 font-medium">Curated for you</p>
                    </div>
                    
                    {/* Slide Counters / Dots */}
                    {totalSlides > 1 && (
                        <div className="flex gap-1.5">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        currentSlide === index ? 'w-6 bg-indigo-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Grid (2 Items based on your slice logic) */}
                <div className="relative group/slider">
                    
                    {/* Products Container */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 min-h-[320px]">
                        {products.slice(currentSlide * 2, (currentSlide * 2) + 2).map((product) => (
                            <div key={product._id} className="h-full">
                                {/* Using the QuickProductCard from previous step */}
                                <QuickProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows (Floating) */}
                    {products.length > 2 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-0"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile View All Button (Inside Card) */}
                <div className="mt-6 text-center sm:hidden">
                    <Link href="/Products?category=housekeeping" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                        View all products &rarr;
                    </Link>
                </div>
            </div>

            {/* Desktop "View All" CTA (Outside Card) */}
            <div className="hidden sm:flex justify-end mt-4 px-2">
                <Link 
                    href="/Products?category=housekeeping" 
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
                >
                    View full catalog
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}