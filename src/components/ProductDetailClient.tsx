// components/ProductDetailClient.tsx
"use client";
import React, { useState, useMemo } from "react";
import axios from "axios";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Award,
  Users,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

interface IVariant {
  _id: string;
  label: string;
  unit: "kg" | "g" | "l" | "ml" | "ps";
  value: number;
  price: number;
  discounted_price?: number;
  stock: number;
  images?: string[];
}

interface IReview {
  _id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string | Date;
}

interface ProductDetailProps {
  product: {
    _id: string;
    title: string;
    description?: string;
    base_price?: number;
    discounted_price?: number;
    variants: IVariant[];
    is_in_stock?: boolean;
    images?: string[];
    reviews?: IReview[];
    categories?: string[];
    tags?: string[];
    seller_id?: string;
    min_order_quantity?: number;
    is_featured?: boolean;
    meta_title?: string;
    meta_description?: string;
  };
  sellerInfo?: {
    name?: string;
    rating?: number;
    yearsInBusiness?: number;
    totalOrders?: number;
    responseTime?: string;
    location?: string;
    certifications?: string[];
  };
}

export default function ProductDetailClient({ product, sellerInfo }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const minQty = product.min_order_quantity ?? 1;
  const [quantity, setQuantity] = useState(minQty);
  const [activeTab, setActiveTab] = useState("details");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [reviews, setReviews] = useState<IReview[]>(product.reviews || []);
  const [submittingReview, setSubmittingReview] = useState(false);

  // CART
  const { addItem, items: cartItems } = useCart();

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : 0;

  // Get current images - prefer variant images, fallback to product images
  const getCurrentImages = () => {
    if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    return product.images || [];
  };

  // Calculate current price
  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.discounted_price ?? selectedVariant.price;
    }
    return product.discounted_price ?? product.base_price ?? 0;
  };

  const getOriginalPrice = () => {
    if (selectedVariant && selectedVariant.discounted_price) {
      return selectedVariant.price;
    }
    if (product.discounted_price && product.base_price) {
      return product.base_price;
    }
    return null;
  };

  const getCurrentStock = () => selectedVariant?.stock ?? (product.is_in_stock ? Infinity : 0);

  const getDiscountPercentage = () => {
    const originalPrice = getOriginalPrice();
    const currentPrice = getCurrentPrice();
    if (originalPrice && originalPrice > currentPrice) {
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const currentImages = getCurrentImages();
  const discount = getDiscountPercentage();

  const tabs = [
    { id: "details", label: "Product Details" },
    { id: "reviews", label: `Reviews (${reviews.length})` },
  ];

  const handleVariantChange = (variant: IVariant) => {
    setSelectedVariant(variant);
    setSelectedImage(0);
    setQuantity(minQty);
  };

  // POST REVIEW
  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) return;
    if (submittingReview) return;

    setSubmittingReview(true);
    try {
      const response = await axios.post(`/api/product/${product._id}/reviews`, {
        
        rating: newReview.rating,
        comment: newReview.comment,
      });

      if (response.data?.review) {
        setReviews((prev) => [response.data.review, ...prev]);
        setNewReview({ rating: 5, comment: "" });
        setShowReviewForm(false);
      }
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      alert(error?.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const currentSizeKey = selectedVariant ? String(selectedVariant._id) : "";
  const cartItemId = `${product._id}::${currentSizeKey}`;
  const isInCart = useMemo(() => cartItems.some((ci) => ci.id === cartItemId), [cartItems, cartItemId]);

  const handleShare = async () => {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareData = {
    title: product.title,
    text: product.description || "Check out this product!",
    url: shareUrl,
  };

  try {
    if (navigator.share) {
      // Mobile & supported browsers
      await navigator.share(shareData);
    } else {
      // Fallback: copy link
      await navigator.clipboard.writeText(shareUrl);
      alert("Product link copied to clipboard!");
    }
  } catch (err) {
    console.error("Share failed:", err);
  }
};

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      alert("Please select a variant/size first.");
      return;
    }

    const price = getCurrentPrice();
    const originalPrice = getOriginalPrice() ?? price;
    const image = (selectedVariant && selectedVariant.images && selectedVariant.images[0]) || product.images?.[0] || "";

    addItem({
      productId: product._id,
      title: product.title,
      variantId: selectedVariant ? String(selectedVariant._id) : undefined,
      size: currentSizeKey,
      price,
      originalPrice,
      image,
      quantity,
      minOrderQuantity: product.min_order_quantity ?? 1,
      inStock: getCurrentStock() > 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Images and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-center">
  <img
    src={currentImages[selectedImage] || "/placeholder.png"}
    alt={product.title}
    className="max-w-full h-auto max-h-[70vh] object-contain"
  />

              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discount}% OFF
                </span>
              )}
              {product.is_featured && (
                <span className="absolute top-4 right-16 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </span>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                {/* <button
                  title="like"
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </button> */}
                <button
  title="Share product"
  onClick={handleShare}
  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
>
  <Share2 className="w-5 h-5" />
</button>

              </div>
            </div>

            {currentImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {currentImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-20 h-20 flex items-center justify-center bg-white rounded-lg">
  <img
    src={img || "/placeholder.png"}
    alt={`View ${i + 1}`}
    className="max-w-full max-h-full object-contain"
  />
</div>

                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-3">
              {(product.categories ?? []).map((c) => (
                <span key={c} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  {c}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{avgRating.toFixed(1)}</span>
                <span className="text-gray-600">({reviews.length} reviews)</span>
              </div>

              <div className="h-4 w-px bg-gray-300"></div>

              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  {getCurrentStock() > 0 ? `In Stock (${getCurrentStock()})` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-gray-900">₹{getCurrentPrice().toLocaleString()}</span>
              {getOriginalPrice() && (
                <span className="text-2xl text-gray-500 line-through">₹{getOriginalPrice()?.toLocaleString()}</span>
              )}
              {getOriginalPrice() && getCurrentPrice() < getOriginalPrice()! && (
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                  Save ₹{(getOriginalPrice()! - getCurrentPrice()).toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">Price per {selectedVariant?.label || "unit"}</p>

            <p className="text-gray-600 text-lg leading-relaxed mb-6">{product.description}</p>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Select Size/Weight:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => handleVariantChange(variant)}
                      disabled={variant.stock === 0}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        selectedVariant?._id === variant._id
                          ? "border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-500 ring-opacity-50"
                          : variant.stock > 0
                          ? "border-gray-200 hover:border-gray-300 text-gray-700"
                          : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div className="font-medium">{variant.label}</div>
                      <div className="text-sm text-gray-500">
                        ₹{(variant.discounted_price || variant.price).toLocaleString()}
                      </div>
                      <div className="text-xs">
                        {variant.stock > 0 ? `${variant.stock} in stock` : "Out of stock"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            {selectedVariant && getCurrentStock() > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-semibold">Quantity:</h3>
                  <span className="text-sm text-gray-600">Minimum order: {minQty} units</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
                      disabled={quantity <= minQty}
                      className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      title="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value) || minQty;
                        setQuantity(Math.max(minQty, Math.min(getCurrentStock(), newQty)));
                      }}
                      className="w-20 text-center py-2 border-0 focus:ring-0"
                      min={minQty}
                      max={getCurrentStock()}
                    />
                    <button
                      onClick={() => setQuantity((q) => Math.min(getCurrentStock(), q + 1))}
                      disabled={quantity >= getCurrentStock()}
                      className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-lg font-semibold">
                    Total: ₹{(getCurrentPrice() * quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || getCurrentStock() === 0 || isInCart}
                className={`flex-1 ${
                  isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-[#CC1A29] hover:bg-red-700"
                } text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isInCart
                  ? "Added to Cart"
                  : getCurrentStock() === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

              {/* <button className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 mx-auto sm:mr-2" />
                <span className="hidden sm:inline">Wishlist</span>
              </button> */}
            </div>
 


 
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-blue-600" /> Free shipping above ₹50,000
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" /> Quality guaranteed
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-purple-600" /> ISO certified
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-[#CC1A29] text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className={`w-8 h-8 ${
                                star <= newReview.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              } hover:text-yellow-400 transition-colors`}
                            >
                              <Star className="w-full h-full" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Share your experience with this product..."
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSubmitReview}
                          disabled={submittingReview}
                          className="px-4 py-2 bg-[#CC1A29] text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
                        <div className="flex items-center justify-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">{reviews.length} reviews</div>
                      </div>

                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = reviews.filter((r) => r.rating === rating).length;
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center gap-2 mb-1">
                              <span className="text-sm w-2">{rating}</span>
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 pb-6 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium">User {review.user_id}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>

                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
