// components/ProductCard.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Check } from "lucide-react";
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
  badge?: string;
  asSeenOnTV?: boolean;
  discount?: string;
  size?: string;
  sizes?: string[];
  description?: string;
  minOrderQuantity?: number;
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

  const availableSizes = product.sizes ?? (product.size ? [product.size] : []);

  // detect if same product+size exists in cart
  const isInCart = items.some(
    (item) =>
      item.productId === product._id && (item.size ?? "") === (selectedSize ?? "")
  );

  const discountPercentage =
    product.discount ||
    (product.originalPrice && product.originalPrice > product.price
      ? `${Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )}% off`
      : "");

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isInCart || adding) return;

    setAdding(true);
    // add optimistic delay for UX animation
    setTimeout(() => {
      addItem({
        productId: product._id,
        title: product.title,
        price: Number(product.price) || 0,
        originalPrice: product.originalPrice,
        image: product.image,
        size: selectedSize || product.size,
        color: undefined,
        quantity: 1,
        minOrderQuantity: product.minOrderQuantity ?? 1,
        inStock: true,
      });
      setAdding(false);
    }, 220);
  };

  return (
    <article
      className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
      role="article"
      aria-label={product.title}
    >
      <div className="relative p-3 sm:p-4">
        {product.asSeenOnTV && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded transform rotate-6 shadow-md">
              AS SEEN
              <br />
              ON TV
            </div>
          </div>
        )}

        {selectedSize && (
          <div className="absolute left-3 top-3 z-10">
            <div className="bg-green-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
              {selectedSize}
            </div>
          </div>
        )}

        <div className="relative bg-gradient-to-br from-white to-white rounded-xl p-4 mb-3 flex items-center justify-center overflow-hidden">
          {product.badge && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
              {product.badge}
            </div>
          )}

          <Link
            href={`/Products/${product._id}`}
            className="w-full block"
            aria-label={`Open product ${product.title}`}
          >
            <div
              className="w-full flex items-center justify-center p-2 sm:p-6 transition-transform duration-300 group-hover:scale-105"
              style={{ minHeight: 120 }}
            >
              <img
                src={product.image || "/placeholder.png"}
                alt={product.title}
                className="w-full max-w-[220px] h-36 sm:h-44 object-contain transition-transform duration-300"
              />
            </div>
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* rating */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            {typeof product.reviews === "number" && (
              <span className="text-xs text-gray-500">({product.reviews})</span>
            )}
          </div>
        )}

        {/* title */}
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
          <Link href={`/Products/${product._id}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>

        {/* pricing */}
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-lg sm:text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              {discountPercentage && <span className="text-xs font-semibold text-green-600">{discountPercentage}</span>}
            </>
          )}
        </div>

        {/* sizes */}
        {availableSizes.length > 0 && (
          <div className="flex gap-2 items-center mb-4 flex-wrap">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSizeSelect(size);
                }}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                  selectedSize === size
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-green-500"
                }`}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>

        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={isInCart || adding}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-3 font-semibold text-base sm:text-lg transition-all transform
              ${isInCart || adding
                ? "bg-gray-300 text-white cursor-not-allowed scale-100"
                : "bg-black text-white hover:bg-gray-800 active:scale-95"
              }`}
            aria-label={isInCart ? "Added to cart" : `Add ${product.title} to cart`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : adding ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
