"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Award } from 'lucide-react';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

export default function BrandShowcase({ brands, loading = false }: { brands: Brand[], loading?: boolean }) {
  
  // Skeleton Loader for better UX
  if (loading) {
    return (
      <section className="py-10 px-4 bg-gray-50">
         <div className="max-w-7xl mx-auto">
            <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6 mx-auto animate-pulse"></div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
               {Array.from({length: 6}).map((_, i) => (
                 <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
               ))}
            </div>
         </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 sm:mb-10 gap-4">
          <div className="text-center md:text-left w-full md:w-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5" />
              Trusted Partners
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-serif">
              Shop by Brand
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-md mx-auto md:mx-0">
              Premium cleaning solutions from the world's most trusted manufacturers.
            </p>
          </div>

          {/* View All Link - Hidden on tiny screens, visible on md */}
          <Link 
            href="/brands" 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors group"
          >
            View All Brands
            <span className="bg-gray-100 p-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* Brands Grid / Scroll Container */}
        <div className="relative">
            {(!brands || brands.length === 0) ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 font-medium">No brands available at the moment.</p>
                </div>
            ) : (
                <div className="
                    grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6
                    /* Mobile: Horizontal Scroll Fallback if you prefer scroll over grid on tiny screens */
                    max-sm:flex max-sm:overflow-x-auto max-sm:pb-4 max-sm:snap-x max-sm:scroll-pl-4
                    scrollbar-hide
                ">
                    {brands.map((brand) => (
                        <Link
                            href={`/Products?brand=${brand.slug}`}
                            key={brand._id}
                            className="
                                group relative
                                min-w-[140px] max-sm:snap-start
                                flex flex-col items-center justify-center
                                bg-white rounded-2xl
                                border border-gray-100 hover:border-blue-200
                                p-6 sm:p-8
                                shadow-sm hover:shadow-xl hover:shadow-blue-500/5
                                transition-all duration-300 ease-out
                                hover:-translate-y-1
                            "
                        >
                            {/* Logo Container */}
                            <div className="relative w-full aspect-[3/2] flex items-center justify-center mb-3">
                                <Image
                                    src={brand.logo || "/placeholder.png"}
                                    alt={brand.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/placeholder.png"; 
                                        target.style.filter = "none"; // Remove grayscale on error placeholder
                                    }}
                                />
                            </div>

                            {/* Brand Name (Optional: visible on hover or always visible) */}
                            <h3 className="text-xs sm:text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors text-center">
                                {brand.name}
                            </h3>

                            {/* Decoration: Subtle glow on hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-50/0 to-blue-50/0 group-hover:to-blue-50/50 pointer-events-none transition-all duration-300"></div>
                        </Link>
                    ))}
                    
                    {/* Mobile "View All" Card (Visible only on mobile scroll end) */}
                    <Link
                        href="/brands"
                        className="
                           sm:hidden
                           min-w-[140px] snap-start
                           flex flex-col items-center justify-center
                           bg-gray-50 rounded-2xl
                           border border-dashed border-gray-300
                           p-6 text-gray-500
                           hover:bg-gray-100 hover:text-gray-800
                        "
                    >
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                             <ArrowRight className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold">View All</span>
                    </Link>
                </div>
            )}
        </div>
        
        {/* Mobile View All Button (Bottom) */}
        <div className="mt-6 sm:hidden text-center">
             <Link href="/brands" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Browse all brands &rarr;
             </Link>
        </div>

      </div>
    </section>
  );
}