// components/ProductCard.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
// inside ProductCard component
import { useCart } from "@/components/cart/CartProvider"; // path adjust if needed



interface Product {
  _id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  category: string;
  badge?: string;
  asSeenOnTV?: boolean;
  discount?: string;
  size?: string;
  sizes?: string[];
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useCart();   // get items from cart
  const [selectedSize, setSelectedSize] = useState<string>(
    product.size || product.sizes?.[0] || ""
  );

  const discountPercentage =
    product.discount ||
    (product.originalPrice && product.originalPrice > product.price
      ? `${Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )}% off`
      : "");

  const availableSizes = product.sizes ?? ["Kit 1", "Kit 2"];

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     e.preventDefault();
//     console.log("Adding to cart:", {
//       productId: product._id,
//       title: product.title,
//       price: product.price,
//       size: selectedSize,
//     });
//   };

  // at top of component body:

 // ✅ Check if already in cart
 const isInCart = items.some(
  (item) =>
    item.productId === product._id &&
    (item.size ?? "") === (selectedSize ?? "")
);
// replace handleAddToCart
const handleAddToCart = (e: React.MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();

  if (isInCart) return; // prevent duplicate

  addItem({
    productId: product._id,
    title: product.title,
    price: Number(product.price) || 0,
    originalPrice: product.originalPrice,
    image: product.image,
    size: selectedSize || product.size,
    color: undefined,
    quantity: 1,
    minOrderQuantity: (product as any).minOrderQuantity ?? 1,
    inStock: true,
  });
};

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative p-4">
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
          <div className="absolute left-4 top-4 z-10">
            <div className="bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
              {selectedSize}
            </div>
          </div>
        )}

        <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 mb-4 flex items-center justify-center">
          {product.badge && (
            <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
              {product.badge}
            </div>
          )}

          {/* clickable image -> product page */}
          <Link href={`/products/${product._id}`} className="w-full block">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-56 object-contain group-hover:scale-105 transition-transform duration-300"
              style={{ maxHeight: 220 }}
            />
          </Link>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {product.rating !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating!) ? "fill-green-500 text-green-500" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            {product.reviews !== undefined && <span className="text-sm text-gray-600">({product.reviews})</span>}
          </div>
        )}

        {/* clickable title -> product page */}
        <h3 className="text-lg md:text-lg font-semibold text-gray-900 line-clamp-2 leading-tight mb-3">
          <Link href={`/Products/${product._id}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>

        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-2xl lg:text-2xl font-bold text-gray-900">Rs. {product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-sm text-gray-500 line-through">Rs. {product.originalPrice}</span>
              {discountPercentage && <span className="text-sm font-semibold text-green-600">{discountPercentage}</span>}
            </>
          )}
        </div>

        {availableSizes.length > 0 && (
          <div className="flex gap-2 items-center mb-4 flex-wrap">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                className={`px-4 py-2 text-sm rounded-full border transition-colors font-medium ${
                  selectedSize === size
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-600"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={isInCart}   // ✅ disable if in cart
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-colors
            ${isInCart
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
            }`}
          aria-label={`Add ${product.title} to cart`}
        >
          <ShoppingCart className="w-5 h-5" />
          {isInCart ? "Added to Cart" : "Add to Cart"}
        </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
