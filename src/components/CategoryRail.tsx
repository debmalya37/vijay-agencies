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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const parentCategories = categories.filter(
    (cat) => !cat.parent_category || cat.parent_category === null
  );

  return (
    <section className="relative w-full py-4 sm:py-16 overflow-hidden bg-rose-200/40">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-b from-red-50/80 via-white/40 to-transparent blur-3xl" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[#ffdede]/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ffe4e6]/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-12">

          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/50 border border-red-100 text-[#EF4F5F] text-[10px] font-semibold tracking-widest uppercase mb-2 sm:mb-3">
              <Sparkles className="w-3 h-3" />
              Our Collections
            </div>

            <h2 className="text-xl sm:text-3xl lg:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
              Browse
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF4F5F] to-[#C41E3A]">
                {" "}Categories
              </span>
            </h2>
          </div>

          {/* VIEW SWITCHER */}
          <div className="flex items-center gap-2 sm:gap-4 bg-white p-1 rounded-xl sm:rounded-2xl shadow-sm border border-red-100/50">

            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300
              ${viewMode === 'grid'
                  ? 'bg-[#A3221D] text-white shadow-md'
                  : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              onClick={() => setViewMode('rail')}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300
              ${viewMode === 'rail'
                  ? 'bg-[#EF4F5F] text-white shadow-md'
                  : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
                }`}
            >
              <Columns className="w-4 h-4 rotate-90" />
              <span className="hidden sm:inline">Scroll</span>
            </button>

          </div>
        </div>

        {/* CONTENT */}
        <div className="relative min-h-[150px]">

          {viewMode === 'rail' && (
            <>
              <button
                onClick={() => scroll('left')}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 bg-white rounded-full shadow-md border border-red-50 items-center justify-center text-gray-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => scroll('right')}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 bg-white rounded-full shadow-md border border-red-50 items-center justify-center text-gray-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* CATEGORY CONTAINER */}
          <div
            ref={scrollRef}
            className={`
              ${viewMode === 'grid'
                ? 'grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6'
                : 'flex gap-3 sm:gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-hide'
              }
            `}
          >

            {/* ALL PRODUCTS */}
            <Link
              href="/Products"
              className={`group relative ${viewMode === 'rail' ? 'min-w-[130px] snap-start' : ''}`}
            >
              <div className="h-full min-h-[130px] sm:min-h-[180px] bg-[#A3221D] rounded-2xl sm:rounded-[2rem] shadow-md flex flex-col items-center justify-center gap-2 sm:gap-4 p-3 sm:p-4 text-center">

                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                  <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>

                <span className="text-white font-semibold text-xs sm:text-base">
                  All Products
                </span>

              </div>
            </Link>

            {/* CATEGORY CARDS */}
            {!loading && parentCategories.map((category) => (
              <Link
                key={category._id}
                href={`/Products?category=${encodeURIComponent(category.name)}`}
                className={`group relative ${viewMode === 'rail' ? 'min-w-[130px] snap-start' : ''}`}
              >
                <div className="h-full min-h-[130px] sm:min-h-[180px] bg-white rounded-2xl sm:rounded-[2rem] border border-red-50 shadow-sm flex flex-col items-center justify-center gap-2 sm:gap-4 p-3 sm:p-4 text-center">

                  <div className="relative w-14 h-14 sm:w-24 sm:h-24 bg-[#FFF5F5] rounded-full flex items-center justify-center">

                    {category.image_url ? (
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        className="object-contain p-3 sm:p-4"
                      />
                    ) : (
                      <span className="text-2xl sm:text-4xl">{category.icon || "📦"}</span>
                    )}

                  </div>

                  <span className="font-semibold text-gray-700 text-xs sm:text-sm px-1 line-clamp-2">
                    {category.name}
                  </span>

                </div>
              </Link>
            ))}

            {/* SKELETON */}
            {loading && Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`min-h-[130px] sm:min-h-[180px] bg-white rounded-2xl border border-red-50 p-3 flex flex-col items-center justify-center gap-3 ${viewMode === 'rail' ? 'min-w-[130px]' : ''}`}
              >
                <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gray-100 rounded-full animate-pulse" />
                <div className="w-16 h-3 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}