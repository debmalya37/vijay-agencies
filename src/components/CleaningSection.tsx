"use client";
import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Leaf 
} from 'lucide-react';
import QuickProductCard from '@/components/QuickProductCard';

interface CleaningSectionProps {
  products: any[];
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  totalSlides: number;
}

export default function CleaningSection({
  products,
  currentSlide,
  nextSlide,
  prevSlide,
  goToSlide,
  totalSlides
}: CleaningSectionProps) {

  if (!products || products.length === 0) return null;

  return (
    // FIX: Changed overflow-hidden to overflow-x-clip so vertical floating elements don't get cut off, but no horizontal scroll
    <section className="py-8 sm:py-20 bg-gradient-to-b from-white via-emerald-50/40 to-white overflow-x-clip relative">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* 1. Header */}
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold tracking-wide uppercase mb-3 sm:mb-4 shadow-sm">
            <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />
            Deep Cleaning
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-serif tracking-tight mb-3 sm:mb-4">
            Cleaning Essentials
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 text-sm sm:text-lg">
            Industrial-strength formulas for kitchens, washrooms, and floors. <br className="hidden sm:block"/>
            Tough on grime, safe for surfaces.
          </p>
        </div>

        {/* 2. Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT: Feature Card (Banner) */}
          <div className="lg:col-span-5 relative group order-1">
            {/* FIX: Adjusted min-height for mobile to prevent bad cropping */}
            <div className="relative h-full min-h-[280px] sm:min-h-[400px] lg:min-h-[500px] rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl shadow-emerald-900/10 transition-transform duration-500 hover:shadow-emerald-500/20">
              
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80" 
                  alt="Professional Cleaning"
                  // FIX: Added object-center to keep focus in the middle
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent mix-blend-multiply"></div>
              </div>

              {/* Overlay Content */}
              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end text-white z-10">
                
                {/* Badge */}
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-2">
                   <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-yellow-300" />
                   <span className="text-xs sm:text-sm font-bold">Fast Acting</span>
                </div>

                <div className="translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <h3 className="text-2xl sm:text-4xl font-bold leading-tight mb-2 sm:mb-4">
                    Power Through <br/> Tough Stains
                  </h3>
                  <p className="text-emerald-50 text-xs sm:text-base mb-4 sm:mb-8 opacity-90 leading-relaxed max-w-xs">
                    Get wholesale rates on bulk chemical orders. Specialized solutions for every surface.
                  </p>
                  
                  <Link 
                    href="/Products?category=Cleaning"
                    className="inline-flex items-center gap-2 bg-white text-emerald-900 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-lg"
                  >
                    Shop Chemicals
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Slider */}
          <div className="lg:col-span-7 order-2 flex flex-col justify-center">
            
            {/* Glass Container */}
            <div className="relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 shadow-xl shadow-gray-100">
                
                {/* Shelf Header */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 px-1 sm:px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-base sm:text-lg leading-none">Best Sellers</h4>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1">High demand items</p>
                        </div>
                    </div>
                    
                    {/* Dots */}
                    {totalSlides > 1 && (
                        <div className="flex gap-1.5">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        currentSlide === index ? 'w-4 sm:w-6 bg-emerald-600' : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Slider Area */}
                <div className="relative group/slider">
                    
                    {/* Grid - Adjusted Gap for Mobile */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-6 min-h-[280px] sm:min-h-[320px]">
                        {products.slice(currentSlide * 2, (currentSlide * 2) + 2).map((product) => (
                            <div key={product._id} className="h-full">
                                <QuickProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows - FIX: Inside for mobile, Outside for desktop */}
                    {products.length > 2 && (
                        <>
                            <button
                                onClick={prevSlide}
                                // FIX: Changed positioning logic. 'left-0' for mobile (inside), '-left-4' for desktop (outside). Added z-10.
                                className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 sm:bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 z-10 opacity-100 sm:opacity-0 sm:group-hover/slider:opacity-100 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-600"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={nextSlide}
                                // FIX: Changed positioning logic. 'right-0' for mobile (inside), '-right-4' for desktop (outside). Added z-10.
                                className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 sm:bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 z-10 opacity-100 sm:opacity-0 sm:group-hover/slider:opacity-100 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-600"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile View All Link */}
                <div className="mt-4 sm:mt-6 text-center sm:hidden">
                    <Link href="/Products?category=Cleaning" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wide">
                        View all chemicals &rarr;
                    </Link>
                </div>
            </div>

            {/* Desktop View All Link */}
            <div className="hidden sm:flex justify-end mt-4 px-2">
                <Link 
                    href="/Products?category=Cleaning" 
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors"
                >
                    View full cleaning catalog
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}