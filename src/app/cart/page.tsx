"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Tag,
  X,
  ChevronDown,
  Mail,
  Home,
  CreditCard,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

const footerSections = [
  {
    title: "COMPANY",
    links: ["About", "Careers", "Press", "News", "Media Kit", "Contact"],
  },
  {
    title: "HELP",
    links: [
      "Customer Support",
      "Delivery Details",
      "Terms & Conditions",
      "Privacy Policy",
      "FAQ",
    ],
  },
  {
    title: "FAQ",
    links: ["Account", "Manage Deliveries", "Orders", "Payments", "Returns"],
  },
  {
    title: "RESOURCES",
    links: [
      "Free eBooks",
      "Development Tutorial",
      "How to - Blog",
      "Youtube Playlist",
    ],
  },
];

export default function CartPage() {
  const router = useRouter();
  
  // Cart context
  const {
    items: cartItems,
    initialized,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getItemCount,
    addItem,
  } = useCart();

  // Local UI state
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [email, setEmail] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products/featured");
        const data = await res.json();
        setFeaturedProducts(data);
      } catch (err) {
        console.error("Error loading featured products", err);
      }
    };
    fetchFeatured();
  }, []);

  // loading while cart context initializes
  const loading = !initialized;

  const applyPromoCode = () => {
    if (!promoCode) {
      setDiscount(0);
      return;
    }
    if (promoCode.toLowerCase() === "save20") {
      setDiscount(0.2);
    } else if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(0.1);
    } else {
      setDiscount(0);
      alert("Invalid promo code");
    }
  };

  // Add to cart handler
  const handleAddToCart = (product: any, variant: any) => {
    addItem({
      productId: product._id,
      title: product.title,
      price: variant?.discounted_price ?? variant?.base_price ?? product.discounted_price ?? product.base_price,
      originalPrice: product.base_price,
      image: product.images?.[0],
      size: variant?.size,
      color: variant?.color,
      quantity: product.minOrderQuantity ?? 1,
      minOrderQuantity: product.minOrderQuantity ?? 1,
      inStock: variant?.inStock ?? true,
    });
  };

  const subscribeToNewsletter = async () => {
    if (!email) return;

    try {
      alert("Subscribed to newsletter!");
      setEmail("");
    } catch (err) {
      console.error("Subscribe error", err);
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    router.push("/checkout");
  };

  // Totals
  const subtotal = Number(getSubtotal() || 0);
  const discountAmount = subtotal * discount;
  const deliveryFee = subtotal > 50000 ? 0 : 150;
  const total = subtotal - discountAmount + deliveryFee;

  // Handlers that call context functions
  const handleDecrease = (id: string, currentQty: number, minOrderQuantity?: number) => {
    const min = minOrderQuantity ?? 1;
    const newQty = Math.max(min, currentQty - 1);
    updateQuantity(id, newQty);
  };

  const handleIncrease = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty + 1);
  };

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  // Slider functions for mobile
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const getVisibleProducts = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const productsPerSlide = isMobile ? 1 : 3;
    const start = currentSlide;
    const end = start + productsPerSlide;
    return featuredProducts.slice(start, end);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Promotional Banner */}
      {/* <div className="bg-teal-700 text-white text-center py-2 px-4 relative">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs sm:text-sm">Sign up and get 25% off to your first order.</span>
          <button className="underline font-medium text-xs sm:text-sm">Sign Up Now</button>
        </div>
        <button title="Close banner" className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2">
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div> */}


      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <Home className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          <a href="#" className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm">Home</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium text-xs sm:text-sm">Cart</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">YOUR CART</h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-600 mt-2 text-sm">Loading cart items...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">Start shopping to add items to your cart</p>
                <button
                  onClick={() => router.push('/products')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.title}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex-1 w-full">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <div className="flex flex-col sm:flex-row sm:gap-4">
                            <div>Size: <span className="font-medium">{item.size ?? "—"}</span></div>
                            <div>Color: <span className="font-medium">{item.color ?? "—"}</span></div>
                          </div>
                          {(item.minOrderQuantity ?? 0) > 1 && (
                            <div className="text-blue-600">Min Order: {item.minOrderQuantity} units</div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg sm:text-xl font-bold text-gray-900">
                                ₹{item.price.toLocaleString()}
                              </span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{item.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end">
                            <span className="text-sm text-gray-600 sm:hidden">Quantity:</span>
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => handleDecrease(item.id, item.quantity, item.minOrderQuantity)}
                                className="p-2 hover:bg-gray-50 transition-colors"
                                disabled={item.quantity <= (item.minOrderQuantity ?? 1)}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 sm:px-4 py-2 font-medium min-w-[3rem] text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleIncrease(item.id, item.quantity)}
                                className="p-2 hover:bg-gray-50 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-right sm:hidden">
                          <span className="text-lg font-bold text-gray-900">
                            Total: ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h3>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                  <span className="font-semibold text-black text-sm sm:text-base">₹{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span className="text-sm sm:text-base">Discount (-{Math.round(discount * 100)}%)</span>
                    <span className="text-sm sm:text-base">-₹{Math.round(discountAmount).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Delivery Fee</span>
                  <span className="font-semibold text-black text-sm sm:text-base">
                    {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                  </span>
                </div>

                {subtotal < 50000 && deliveryFee > 0 && (
                  <div className="text-xs text-gray-500">
                    Add ₹{(50000 - subtotal).toLocaleString()} more for free delivery
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span>₹{Math.round(total).toLocaleString()}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4 sm:mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Add promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={applyPromoCode}
                    className="px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Try: SAVE20 or WELCOME10</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleProceedToCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                >
                  <CreditCard className="w-4 h-4" />
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => router.push('/products')}
                  className="w-full bg-gray-100 text-gray-800 py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
                >
                  Continue Shopping
                </button>

                {cartItems.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear your cart?")) {
                        clearCart();
                      }
                    }}
                    className="w-full text-sm text-red-600 hover:text-red-800 transition-colors py-2"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recommended for You</h2>
            
            {/* Navigation buttons for mobile */}
            <div className="flex gap-2 sm:hidden">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={featuredProducts.length <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={featuredProducts.length <= 1}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile slider view */}
          <div className="sm:hidden">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="w-full flex-shrink-0 px-2"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/300"}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{product.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-base text-gray-900">
                            ₹{(product.discounted_price ?? product.base_price).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleAddToCart(product, product.variants?.[0])}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Dots indicator */}
            <div className="flex justify-center mt-4 gap-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop grid view */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/300"}
                  alt={product.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base sm:text-lg text-gray-900">
                      ₹{(product.discounted_price ?? product.base_price).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product, product.variants?.[0])}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      {/* <div className="bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">STAY CONNECTED ABOUT OUR</h3>
              <h3 className="text-xl sm:text-2xl font-bold">LATEST OFFERS</h3>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-sm lg:w-80">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white text-sm"
                />
              </div>
              <button
                onClick={subscribeToNewsletter}
                className="w-full bg-white text-teal-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      {/*  */}
    </div>
  );
}