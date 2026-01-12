"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

// Types (Keep your existing types)
interface Category {
  _id: string;
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Smooth scroll handler for desktop arrows
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-6 border-b border-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Navigation Arrows */}
        <div className="flex items-center justify-between px-4 sm:px-6 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Explore Categories
          </h2>
          
          {/* Desktop Scroll Controls */}
          <div className="hidden sm:flex gap-2">
            <button  
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scroll Container */}
        <div className="relative group">
          
          {/* Left Fade Mask (Visible when scrolling) */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none sm:hidden" />
          
          {/* Right Fade Mask */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none sm:hidden" />

          <div 
            ref={scrollRef}
            className="
              flex gap-3 sm:gap-6 overflow-x-auto 
              px-4 sm:px-6 pb-4
              scrollbar-hide snap-x snap-mandatory 
              scroll-pl-4
            "
          >
            
            {/* 1. Static 'All' Tab (Pinned / Special Design) */}
            <Link 
              href="/Products"
              className="
                flex flex-col items-center gap-2 
                min-w-[72px] sm:min-w-[80px] 
                snap-start cursor-pointer group
                transition-transform duration-200 active:scale-95
              "
            >
              <div className="
                relative w-16 h-16 sm:w-[72px] sm:h-[72px] 
                bg-blue-600 rounded-2xl sm:rounded-[20px] 
                flex items-center justify-center 
                shadow-lg shadow-blue-200
                group-hover:shadow-blue-300 group-hover:-translate-y-1 transition-all duration-300
              ">
                <LayoutGrid className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-900">All</span>
            </Link>

            {/* 2. Dynamic Categories */}
            {!loading && categories.map((category) => (
              <Link
                key={category._id}
                href={`/Products?category=${category.name}`}
                className="
                  flex flex-col items-center gap-2 
                  min-w-[72px] sm:min-w-[80px] 
                  snap-start cursor-pointer group
                  transition-transform duration-200 active:scale-95
                "
              >
                <div className="
                  relative w-16 h-16 sm:w-[72px] sm:h-[72px] 
                  bg-gray-50 rounded-2xl sm:rounded-[20px] 
                  border border-gray-100
                  flex items-center justify-center 
                  overflow-hidden
                  group-hover:border-blue-200 group-hover:bg-blue-50/50 
                  group-hover:shadow-md group-hover:-translate-y-1
                  transition-all duration-300
                ">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100px, 150px"
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-2xl">{category.icon || '📦'}</span>
                  )}
                </div>
                <span className="
                  text-xs sm:text-sm font-medium text-gray-600 
                  text-center line-clamp-1 max-w-[72px] sm:max-w-[90px]
                  group-hover:text-blue-600 group-hover:font-semibold transition-colors
                ">
                  {category.name}
                </span>
              </Link>
            ))}

            {/* 3. Loading Skeletons */}
            {loading && Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[72px] sm:min-w-[80px] snap-start">
                <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] bg-gray-100 rounded-2xl animate-pulse" />
                <div className="w-12 h-3 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}