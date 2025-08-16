"use client";
import React, { useState, useEffect } from 'react';
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
  Home
} from 'lucide-react';

// Mock cart items data based on your Product model
const mockCartItems = [
  {
    _id: '1',
    product_id: 'prod1',
    title: 'Industrial Steel Pipes - Grade A',
    size: 'Large',
    color: 'Silver',
    price: 2200,
    originalPrice: 2500,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=150',
    inStock: true,
    minOrderQuantity: 10
  },
  {
    _id: '2',
    product_id: 'prod2',
    title: 'Premium Office Chair Set',
    size: 'Medium',
    color: 'Black',
    price: 1800,
    originalPrice: 2000,
    quantity: 3,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150',
    inStock: true,
    minOrderQuantity: 5
  },
  {
    _id: '3',
    product_id: 'prod3',
    title: 'Electronic Components Kit',
    size: 'Large',
    color: 'Multi',
    price: 1200,
    originalPrice: 1400,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150',
    inStock: true,
    minOrderQuantity: 20
  }
];

const footerSections = [
  {
    title: 'COMPANY',
    links: ['About', 'Careers', 'Press', 'News', 'Media Kit', 'Contact']
  },
  {
    title: 'HELP',
    links: ['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy', 'FAQ']
  },
  {
    title: 'FAQ',
    links: ['Account', 'Manage Deliveries', 'Orders', 'Payments', 'Returns']
  },
  {
    title: 'RESOURCES',
    links: ['Free eBooks', 'Development Tutorial', 'How to - Blog', 'Youtube Playlist']
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0.2); // 20% discount
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to fetch cart items from API (placeholder)
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/cart', {
      //   headers: {
      //     'Authorization': `Bearer ${sessionToken}`
      //   }
      // });
      // const data = await response.json();
      // setCartItems(data.items);
      
      // For now, using mock data
      setCartItems(mockCartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    const item = cartItems.find(item => item._id === itemId);
    if (!item) return;

    // Ensure minimum order quantity
    const finalQuantity = Math.max(item.minOrderQuantity, newQuantity);

    try {
      // Replace with actual API call
      // await fetch('/api/cart/update', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${sessionToken}`
      //   },
      //   body: JSON.stringify({ itemId, quantity: finalQuantity })
      // });

      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, quantity: finalQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      // Replace with actual API call
      // await fetch('/api/cart/remove', {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${sessionToken}`
      //   },
      //   body: JSON.stringify({ itemId })
      // });

      setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const applyPromoCode = () => {
    // Simple promo code logic
    if (promoCode.toLowerCase() === 'save20') {
      setDiscount(0.2);
    } else if (promoCode.toLowerCase() === 'welcome10') {
      setDiscount(0.1);
    } else {
      setDiscount(0);
    }
  };

  const subscribeToNewsletter = async () => {
    if (!email) return;
    
    try {
      // Replace with actual API call
      // await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      alert('Subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const deliveryFee = subtotal > 50000 ? 0 : 150; // Free delivery above ₹50,000
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Promotional Banner */}
      <div className="bg-teal-700 text-white text-center py-3 relative">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm">Sign up and get 25% off to your first order.</span>
          <button className="underline font-medium">Sign Up Now</button>
        </div>
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Search */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-600">
                245 Items
              </div>
            </div>

            {/* Center - Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 tracking-wider">SHOP</h1>
            </div>

            {/* Right side - Navigation */}
            <div className="flex items-center gap-6 flex-1 justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Shop</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900">On Sale</a>
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900">New Arrivals</a>
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900">Brands</a>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <Home className="w-4 h-4 text-gray-400" />
          <a href="#" className="text-gray-500 hover:text-gray-700">Home</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Cart</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">YOUR CART</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading cart items...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Start shopping to add items to your cart</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeItem(item._id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Size: <span className="font-medium">{item.size}</span></div>
                          <div>Color: <span className="font-medium">{item.color}</span></div>
                          {item.minOrderQuantity > 1 && (
                            <div className="text-blue-600">
                              Min Order: {item.minOrderQuantity} units
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-gray-900">
                                ₹{item.price.toLocaleString()}
                              </span>
                              {item.originalPrice > item.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{item.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-50 transition-colors"
                                disabled={item.quantity <= item.minOrderQuantity}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-black">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount (-{Math.round(discount * 100)}%)</span>
                    <span>-₹{Math.round(discountAmount).toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold text-black">
                    {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{Math.round(total).toLocaleString()}</span>
                </div>
              </div>
              
              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Add promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Try: SAVE20 or WELCOME10
                </p>
              </div>
              
              {/* Checkout Button */}
              <button
                disabled={cartItems.length === 0}
                className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Go to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">STAY CONNECTED ABOUT OUR</h3>
              <h3 className="text-2xl font-bold">LATEST OFFERS</h3>
            </div>
            
            <div className="flex flex-col gap-3 w-80">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
                />
              </div>
              <button
                onClick={subscribeToNewsletter}
                className="w-full bg-white text-teal-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-wider">SHOP</h3>
            </div>
            
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}