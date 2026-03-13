"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import QuickProductCard from "@/components/QuickProductCard";

interface Product {
  _id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: string;
  size?: string;
  sizes?: string[];
  rating?: number;
  reviews?: number;
  minOrderQuantity?: number;
  category?: string;
  inStock?: boolean;
}

export default function BrowseProductsSection({
  products,
}: {
  products: Product[];
}) {
  return (
    <section className="relative py-6 sm:py-20 bg-rose-200/40 overflow-hidden selection:bg-[#A3221D] selection:text-white">
      
      {/* ===== ULTRA-PREMIUM BACKGROUND ===== */}
      {/* Subtle precision dot grid for a modern/architectural feel */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Top subtle border fade */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      
      {/* Geometric accent line */}
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-gray-100 to-transparent transform rotate-12 origin-top opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 sm:mb-12">
          
          <div className="max-w-2xl">
            {/* Sharp, high-contrast badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-gray-900 text-white text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] animate-pulse" />
              Curated Collection
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-gray-900 tracking-tight leading-[1.1]">
              Uncompromising <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CB202D] to-[#D32F2F]">
                Quality & Performance
              </span>
            </h2>

            <p className="mt-5 text-gray-500 sm:text-lg max-w-lg leading-relaxed font-medium">
              Elevate your standards with our meticulously engineered supplies, designed for industry leaders who demand the absolute best.
            </p>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block flex-shrink-0 mb-2">
            <button
              onClick={() => (window.location.href = "/Products")}
              className="
                group flex items-center gap-3 px-8 py-4 
                bg-[#CB202D] hover:bg-[#D32F2F] 
                text-white text-sm font-bold tracking-wide uppercase
                rounded-md shadow-xl hover:shadow-red-900/20
                transition-all duration-300 ease-out
              "
            >
              Explore Catalog
              <span className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>

        </div>

        {/* ================= MOBILE SLIDER ================= */}
        <div className="md:hidden relative -mx-4 px-4">
          
          {/* Scroll Fade Masks (White theme) */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex gap-5 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-hide px-2">
            {products.slice(11, 19).map((product) => (
              <div
                key={product._id}
                className="min-w-[260px] w-[260px] snap-center shrink-0"
              >
                <div className="h-full transition-transform duration-300 active:scale-[0.98]">
                  <QuickProductCard product={product} />
                </div>
              </div>
            ))}
            
            {/* Mobile View All Card */}
            <div className="min-w-[140px] snap-center shrink-0 flex flex-col items-center justify-center gap-4 border border-gray-100 rounded-3xl bg-gray-50/50">
               <button 
                 onClick={() => (window.location.href = "/Products")}
                 className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
               >
                 <ArrowRight className="w-6 h-6" />
               </button>
               <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">View All</span>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP GRID ================= */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.slice(11, 19).map((product) => (
            <div
              key={product._id}
              className="
                relative group h-full
                transform hover:-translate-y-2 hover:z-20
                transition-all duration-500 ease-out
              "
            >
              {/* Premium minimal hover glow (Sharp Red) */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#CB202D]/0 to-[#CB202D]/10 opacity-0 group-hover:opacity-100 rounded-[2rem] blur-xl transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative h-full">
                <QuickProductCard product={product} />
              </div>
            </div>
          ))}
        </div>

        {/* ================= MOBILE BOTTOM CTA ================= */}
        <div className="lg:hidden mt-8 text-center">
          <button
            onClick={() => (window.location.href = "/Products")}
            className="
              inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 
              bg-red-900 hover:bg-[#CB202D] 
              text-white text-sm font-bold tracking-wide uppercase
              shadow-lg transition-colors duration-300
            "
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}