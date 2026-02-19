"use client";

import React, { useState, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Loader2,
  Star,
  Check
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { toast } from "sonner"; 

interface Variant {
  label: string;
  price: number;
  stock: number;
}

interface Product {
  _id: string;
  title: string;
  description?: string;
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
  variants?: Variant[];
}

const QuickProductCard = memo(({ product }: { product: Product }) => {
  const { addItem, items } = useCart();
  const [selectedSize] = useState<string>(
    product.size || product.sizes?.[0] || ""
  );
  const [quantity, setQuantity] = useState(product.minOrderQuantity || 1);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);


  const isInCart = items.some(
    (item) =>
      item.productId === product._id &&
      (item.size ?? "") === (selectedSize ?? "")
  );
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuantityChange = useCallback((delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => Math.max(product.minOrderQuantity || 1, prev + delta));
  }, [product.minOrderQuantity]);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding) return;
    setIsAdding(true);

    await new Promise(resolve => setTimeout(resolve, 400));

    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: product.size || product.sizes?.[0],
      quantity: quantity,
      minOrderQuantity: product.minOrderQuantity ?? 1,
      inStock: true,
    });

    setIsAdding(false);
    toast.success(`Added ${quantity} ${product.title} to cart`);
  }, [addItem, isAdding, product, quantity]);

  const toggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(prev => !prev);
  }, []);

  return (
    <div className="
      group relative w-full h-full flex flex-col
      bg-white rounded-xl sm:rounded-2xl
      border border-gray-100/80
      shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]
      hover:shadow-[0_12px_32px_-8px_rgba(139,0,0,0.12)]
      hover:border-red-100/50
      transition-all duration-500 ease-out
      overflow-hidden
    ">
      
      {/* ===== IMAGE SECTION ===== */}
      <Link href={`/Products/${product._id}`} className="relative block aspect-[4/3] sm:aspect-square w-full bg-[#FAFAFA] overflow-hidden">
        
        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 z-20 p-2 sm:p-2.5 rounded-full bg-white/90 backdrop-blur border shadow-sm transition-all duration-300 active:scale-90 ${
            isWishlisted 
              ? "border-red-100 text-[#D32F2F]" 
              : "border-gray-100 text-gray-400 hover:text-[#D32F2F] hover:border-red-100"
          }`}
        >
          <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Discount Badge */}
        {(discountPercentage > 0 || product.discount) && (
          <div className="absolute top-3 left-3 z-20">
            <span className="px-3 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-white bg-[#CB202D] rounded-sm shadow-md">
              {discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* Product Image */}
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-6 sm:p-8 transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
        />
        
        {/* Subtle bottom gradient for image contrast */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      </Link>

      {/* ===== CONTENT SECTION ===== */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        
        {/* Rating & Meta */}
        {/* <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-1">
             <Star className="w-3.5 h-3.5 fill-[#D32F2F] text-[#D32F2F]" />
             <span className="text-[11px] sm:text-xs font-bold text-gray-800">{product?.rating || "0"}</span>
             <span className="text-[10px] text-gray-400 ml-0.5">({product?.reviews || 0})</span>
           </div>
           {product.size && (
             <span className="text-[10px] sm:text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-sm">
               {product.size}
             </span>
           )}
        </div> */}

        {/* Title */}
        <Link href={`/Products/${product._id}`} className="block mb-1.5">
          <h3 
            className="text-xl font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-[#CB202D] transition-colors duration-300" 
            title={product.title}
          >
            {product.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-[12px] sm:text-xs text-gray-500 line-clamp-2 min-h-[2rem] sm:min-h-[2.25rem] leading-relaxed mb-4">
          {product.description || "Expertly crafted for superior performance and exceptional durability in professional environments."}
        </p>

        {/* Price & Actions Container */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          
          {/* Price Block */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Controls: Stacked on small mobile, row on slightly larger screens */}
          <div className="flex flex-col min-[400px]:flex-row items-stretch gap-2 w-full h-auto min-[400px]:h-11">
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between min-[400px]:justify-center h-10 min-[400px]:h-full bg-white border border-gray-200 rounded-lg sm:rounded-xl p-1 shrink-0 min-[400px]:w-24">
              <button 
                onClick={(e) => handleQuantityChange(-1, e)}
                className="w-8 min-[400px]:w-7 h-full flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-30"
                disabled={quantity <= (product.minOrderQuantity || 1)}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              
              <span className="w-8 text-center font-bold text-gray-900 text-xs sm:text-sm select-none">
                {quantity}
              </span>
              
              <button 
                onClick={(e) => handleQuantityChange(1, e)}
                className="w-8 min-[400px]:w-7 h-full flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
  onClick={handleAddToCart}
  disabled={isAdding || isInCart}
  className={`
    flex-1 h-11 min-[400px]:h-full relative overflow-hidden 
    flex items-center justify-center gap-2 
    bg-[#CB202D]
    text-white font-bold text-xs uppercase tracking-wider
    rounded-lg sm:rounded-xl shadow-md 
    active:scale-[0.98] transition-all duration-300
    disabled:opacity-70 disabled:cursor-not-allowed group/btn
    ${isInCart 
                   ? "bg-green-600 hover:bg-green-700 border border-green-200 text-green-700" 
                   : "bg-[#CB202D] hover:bg-[#c21726] border border-[#EF4F5F]"
                }
  `}
>
  {isAdding ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : 
  isInCart ? (
                <div className="cursor-none">
                  <span className="hidden sm:inline cursor-not-allowed">Added to Cart</span>
                  <span className="sm:hidden">
                    <Check className="w-4 h-4" />
                  </span>
                </div>
            ) :
  (
    <>
      <ShoppingCart className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-x-1" />
      <span className="whitespace-nowrap">Add to Cart</span>
    </>
  )}
</button>

          </div>

        </div>
      </div>
    </div>
  );
});

QuickProductCard.displayName = "QuickProductCard";

export default QuickProductCard;