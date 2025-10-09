"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Check, Star, Share2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

interface Product {
  _id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  category?: string;
  sizes?: string[];
  size?: string;
  discount?: string;
  asSeenOnTV?: boolean;
  minOrderQuantity?: number;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(
    product.size || product.sizes?.[0] || ""
  );
  const [adding, setAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const availableSizes = product.sizes ?? (product.size ? [product.size] : []);
  const isInCart = items.some(
    (item) =>
      item.productId === product._id &&
      (item.size ?? "") === (selectedSize ?? "")
  );

  const discountPercentage =
    product.discount ||
    (product.originalPrice && product.originalPrice > product.price
      ? `${Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )}% OFF`
      : "");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart || adding) return;
    setAdding(true);
    setTimeout(() => {
      addItem({
        productId: product._id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        size: selectedSize || product.size,
        quantity: 1,
        minOrderQuantity: product.minOrderQuantity ?? 1,
        inStock: true,
      });
      setAdding(false);
    }, 200);
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
    <article 
      className="relative flex flex-col w-full max-w-[280px] sm:max-w-[320px] rounded-2xl overflow-hidden
        bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl
        transition-all duration-500 ease-out group cursor-pointer
        border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-rose-500/0 to-pink-500/0 
        group-hover:from-red-500/5 group-hover:via-rose-500/5 group-hover:to-pink-500/5 
        transition-all duration-700 pointer-events-none z-10" />

      {/* Discount Badge */}
      {discountPercentage && (
        <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full
          bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold
          shadow-lg transform -rotate-3 animate-pulse">
          {discountPercentage}
        </div>
      )}

      {/* Share Button */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={handleShare}
          className="w-9 h-9 rounded-full backdrop-blur-md border border-white/50
            bg-white/80 text-gray-700 hover:bg-white flex items-center justify-center
            transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="absolute top-16 right-3 z-30 px-3 py-2 rounded-lg
          bg-gray-900 text-white text-xs font-medium shadow-lg
          animate-pulse">
          Link copied!
        </div>
      )}

      {/* Product Image Container */}
      <Link href={`/Products/${product._id}`} className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
          transition-transform duration-1000 ease-out
          bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        
        <div className="relative w-full h-full p-6 flex items-center justify-center">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.title}
            fill
            className="object-contain transition-all duration-500 
              group-hover:scale-110 group-hover:rotate-2 p-6"
          />
        </div>

        {/* Quick size selector overlay */}
        {availableSizes.length > 0 && (
          <div className={`absolute bottom-0 left-0 right-0 p-3 
            bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm
            transform transition-all duration-300 ease-out
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <div className="flex gap-1.5 justify-center flex-wrap">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border-2
                    transition-all duration-200 transform hover:scale-105
                    ${selectedSize === size
                      ? "bg-white text-black border-white shadow-lg scale-105"
                      : "bg-white/20 text-white border-white/40 hover:bg-white/30"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col gap-2.5 relative z-10">
        {/* Rating */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 transition-all duration-200
                    ${i < Math.floor(product.rating!) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-600">
              {product.rating?.toFixed(1)} <span className="text-gray-400">({product.reviews})</span>
            </span>
          </div>
        )}

        {/* Category */}
        {product.category && (
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
            {product.category}
          </span>
        )}

        {/* Title */}
        <Link href={`/Products/${product._id}`}>
          <h3 className="text-base sm:text-lg font-bold line-clamp-2 text-gray-900 
            group-hover:text-red-600 transition-colors duration-300 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="flex items-end justify-between gap-2 mt-1">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 
                bg-clip-text text-transparent">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm line-through text-gray-400 font-medium">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs font-semibold text-green-600">
                Save ₹{(product.originalPrice - product.price).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isInCart || adding}
          className={`mt-2 w-full py-3 rounded-xl font-bold text-sm
            transition-all duration-300 transform hover:scale-105 active:scale-95
            flex items-center justify-center gap-2 shadow-lg hover:shadow-xl
            ${isInCart
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default"
              : adding
              ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-wait"
              : "bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white hover:from-red-700 hover:via-rose-700 hover:to-pink-700"
            }`}
        >
          {isInCart ? (
            <>
              <Check className="w-5 h-5" />
              Added to Cart
            </>
          ) : adding ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>

        {/* Size indicator (when sizes available and card not hovered) */}
        {availableSizes.length > 0 && !isHovered && (
          <div className="text-xs text-gray-500 text-center">
            Size: <span className="font-semibold text-gray-700">{selectedSize}</span>
          </div>
        )}
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] 
          transition-transform duration-1000 ease-out
          bg-gradient-to-r from-transparent via-white/20 to-transparent 
          skew-x-12" />
      </div>
    </article>
  );
};

export default ProductCard;