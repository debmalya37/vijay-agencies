"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Star, Clock, Check, Share2, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

// Unified Interface combining both needs
interface Product {
  _id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: string;
  size?: string;
  sizes?: string[]; // Handle arrays for logic
  rating?: number;
  reviews?: number;
  minOrderQuantity?: number;
  category?: string;
  deliveryTime?: string;
}

export default function QuickProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  
  // -- State Management --
  // Use first available size or default
  const [selectedSize] = useState<string>(
    product.size || product.sizes?.[0] || ""
  );
  const [adding, setAdding] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // -- Derived State --
  const isInCart = items.some(
    (item) =>
      item.productId === product._id &&
      (item.size ?? "") === (selectedSize ?? "")
  );

  const calculatedDiscount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        ) + "% OFF"
      : product.discount;

  // -- Handlers --

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop navigation to product page
    e.stopPropagation();

    if (isInCart || adding) return;

    setAdding(true);

    // Simulate network delay for better UX feel
    setTimeout(() => {
      addItem({
        productId: product._id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        size: selectedSize,
        quantity: 1,
        minOrderQuantity: product.minOrderQuantity ?? 1,
        inStock: true,
      });
      setAdding(false);
    }, 400);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productUrl = `${window.location.origin}/Products/${product._id}`;
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} for ₹${product.price.toLocaleString()}!`,
      url: productUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(productUrl);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch (err) {
      console.log("Share failed:", err);
    }
  };

  return (
    <div className="group relative flex flex-col h-full w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 overflow-hidden">
      
      {/* -- Share Toast Notification -- */}
      {showShareToast && (
        <div className="absolute top-12 right-2 z-30 px-2 py-1 rounded bg-gray-900/90 text-white text-[10px] font-medium shadow-lg animate-fade-in-up">
          Link copied!
        </div>
      )}

      {/* 1. Image Section */}
      <Link href={`/Products/${product._id}`} className="relative aspect-square w-full bg-gray-50 overflow-hidden cursor-pointer">
        
        {/* Discount Badge */}
        {calculatedDiscount && (
          <div className="absolute top-0 left-0 bg-[#4a7c59] text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-br-lg z-20 shadow-sm">
            {calculatedDiscount}
          </div>
        )}

        {/* Top Right Actions (Rating & Share) */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2 items-end">
            {/* Rating / Time Badge */}
            {product.rating ? (
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md shadow-sm border border-gray-100">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-bold text-gray-700">{product.rating}</span>
                </div>
            ) : (
                 <div className="flex items-center gap-1 bg-gray-100/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-[10px] font-medium text-gray-600">Fast</span>
                </div>
            )}

            {/* Share Button (Hidden until hover on desktop, always visible on touch if needed) */}
            <button
                onClick={handleShare}
                className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:scale-110 transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300"
                title="Share Product"
            >
                <Share2 className="w-3.5 h-3.5" />
            </button>
        </div>

        {/* Product Image */}
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110 mix-blend-multiply"
          priority={false}
        />
      </Link>

      {/* 2. Content Section */}
      <div className="flex flex-col flex-grow p-3 sm:p-4">
        
        {/* Size Label */}
        {selectedSize && (
          <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1 bg-gray-50 inline-block w-fit px-1.5 rounded-md border border-gray-100">
            {selectedSize}
          </p>
        )}

        {/* Title */}
        <Link href={`/Products/${product._id}`} className="block">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-blue-600 transition-colors" title={product.title}>
            {product.title}
          </h3>
        </Link>

        {/* Footer: Price & Smart Button */}
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          
          {/* Price Block */}
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through font-medium">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* SMART ACTION BUTTON */}
          <button 
            onClick={handleAddToCart}
            disabled={adding}
            className={`
                relative overflow-hidden
                flex items-center justify-center gap-1
                px-3 py-1.5 sm:px-6 sm:py-2 
                text-xs sm:text-sm font-bold 
                rounded-lg shadow-sm
                transition-all duration-300
                active:scale-95
                min-w-[70px] sm:min-w-[90px]
                ${isInCart 
                   ? "bg-green-50 border border-green-200 text-green-700" 
                   : "bg-white border border-[#EF4F5F] text-[#EF4F5F] hover:bg-[#FFF2F2]"
                }
            `}
          >
            {adding ? (
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            ) : isInCart ? (
                <>
                  <span className="hidden sm:inline">ADDED</span>
                  <span className="sm:hidden">
                    <Check className="w-4 h-4" />
                  </span>
                </>
            ) : (
                <>
                   ADD
                   <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}