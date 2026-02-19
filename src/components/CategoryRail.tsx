"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutGrid, 
  Columns, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles 
} from "lucide-react";

interface Category {
  _id: string;
  parent_category?: {
    name: string;
    slug: string;
  };
  name: string;
  slug: string;
  image_url?: string;
  icon?: string;
}

interface CategoryRailProps {
  categories: Category[];
  loading: boolean;
}

export default function CategoryRail({ categories, loading }: CategoryRailProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'rail'>('grid');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll handler for Rail View
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const parentCategories = categories.filter(
  (cat) => !cat.parent_category || cat.parent_category === null
);


  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden bg-rose-200/40">
      
      {/* ===== PREMIUM BACKGROUND DECOR ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-gradient-to-b from-red-50/80 via-white/40 to-transparent blur-3xl" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#ffdede]/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#ffe4e6]/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== HEADER & CONTROLS ===== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          
          {/* Title Area */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/50 border border-red-100 text-[#EF4F5F] text-[10px] font-bold tracking-widest uppercase mb-3 animate-fade-in">
              <Sparkles className="w-3 h-3" />
              Our Collections
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF4F5F] to-[#C41E3A]">Categories</span>
            </h2>
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl shadow-sm border border-red-100/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                ${viewMode === 'grid' 
                  ? 'bg-[#A3221D] text-white shadow-lg shadow-red-500/30 scale-105' 
                  : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}
              `}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('rail')}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                ${viewMode === 'rail' 
                  ? 'bg-[#EF4F5F] text-white shadow-lg shadow-red-500/30 scale-105' 
                  : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}
              `}
            >
              <Columns className="w-4 h-4 rotate-90" />
              <span className="hidden sm:inline">Scroll View</span>
            </button>
          </div>
        </div>

        {/* ===== CONTENT AREA ===== */}
        <div className="relative min-h-[200px]">
          
          {/* Scroll Arrows (Only for Rail View) */}
          {viewMode === 'rail' && (
            <>
              <button 
                onClick={() => scroll('left')}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-red-50 items-center justify-center text-gray-600 hover:text-[#EF4F5F] hover:scale-110 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-red-50 items-center justify-center text-gray-600 hover:text-[#EF4F5F] hover:scale-110 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* DYNAMIC CONTAINER */}
          <div 
            ref={scrollRef}
            className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6' 
                : 'flex gap-6 overflow-x-auto pb-10 pt-4 snap-x snap-mandatory scrollbar-hide px-2'}
            `}
          >
            {/* --- ALL PRODUCTS CARD --- */}
            <Link 
              href="/Products" 
              className={`group relative ${viewMode === 'rail' ? 'min-w-[160px] snap-start' : 'col-span-1'}`}
            >
              <div className="
                h-full min-h-[180px]
                bg-[#A3221D]
                rounded-[2rem]
                shadow-[0_10px_30px_-10px_rgba(239,79,95,0.5)]
                group-hover:shadow-[0_25px_50px_-12px_rgba(239,79,95,0.6)]
                group-hover:-translate-y-2
                transition-all duration-500 ease-out
                flex flex-col items-center justify-center gap-4 p-4 text-center
                relative overflow-hidden
              ">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner border border-white/30 group-hover:scale-110 transition-transform duration-500">
                  <LayoutGrid className="w-8 h-8" />
                </div>
                <span className="text-white font-bold text-base tracking-wide">All Products</span>
              </div>
            </Link>

            {/* --- CATEGORY CARDS --- */}
            {!loading && parentCategories.map((category) => (
              <Link
                key={category._id}
                href={`/Products?category=${encodeURIComponent(category.name)}`}
                className={`group relative ${viewMode === 'rail' ? 'min-w-[160px] snap-start' : 'col-span-1'}`}
              >
                <div className="
                  h-full min-h-[180px]
                  bg-white
                  rounded-[2rem]
                  border border-red-50
                  shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]
                  group-hover:shadow-[0_25px_50px_-12px_rgba(239,79,95,0.25)]
                  group-hover:border-red-200/50
                  group-hover:-translate-y-2
                  transition-all duration-500 ease-out
                  flex flex-col items-center justify-center gap-4 p-4 text-center
                  overflow-hidden
                ">
                  {/* Hover Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon Container */}
                  <div className="
                    relative w-20 h-20 sm:w-24 sm:h-24
                    bg-[#FFF5F5] rounded-full
                    flex items-center justify-center
                    group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg
                    transition-all duration-500 ease-back-out
                  ">
                    {category.image_url ? (
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-4xl">{category.icon || "📦"}</span>
                    )}
                  </div>

                  {/* Label */}
                  <span className="relative font-bold text-gray-700 text-sm group-hover:text-[#EF4F5F] transition-colors duration-300 px-2 line-clamp-2">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}

            {/* --- SKELETON LOADERS --- */}
            {loading && Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`h-[180px] bg-white rounded-[2rem] border border-red-50 p-4 flex flex-col items-center justify-center gap-4 ${viewMode === 'rail' ? 'min-w-[160px]' : ''}`}>
                <div className="w-20 h-20 bg-gray-100 rounded-full animate-pulse" />
                <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}