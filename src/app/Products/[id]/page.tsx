"use client";

import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, Award, Users, Package, MessageCircle, Phone, Mail, ChevronLeft, ChevronRight, Plus, Minus, Check, X } from 'lucide-react';

// Mock product data based on your Product model
const mockProduct = {
  _id: '1',
  title: 'Industrial Steel Pipes - Grade A Premium',
  description: 'High-quality steel pipes suitable for construction and industrial applications. Manufactured with superior grade steel, these pipes offer excellent corrosion resistance, durability, and structural integrity. Perfect for heavy-duty industrial use, construction projects, and infrastructure development.',
  original_price: 2500,
  discounted_price: 2200,
  is_in_stock: true,
  stocks: 150,
  images: [
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
  ],
  variants: [
    { _id: '1', size: '2 inch', color: 'Silver', stock: 50, images: [] },
    { _id: '2', size: '3 inch', color: 'Silver', stock: 60, images: [] },
    { _id: '3', size: '4 inch', color: 'Silver', stock: 40, images: [] }
  ],
  reviews: [
    {
      _id: '1',
      user_id: 'user1',
      rating: 5,
      comment: 'Excellent quality steel pipes. Used them for our construction project and they exceeded expectations. Highly recommend for industrial use.',
      created_at: new Date('2024-01-15')
    },
    {
      _id: '2',
      user_id: 'user2',
      rating: 4,
      comment: 'Good quality and timely delivery. The pipes are sturdy and well-finished. Will order again.',
      created_at: new Date('2024-01-20')
    },
    {
      _id: '3',
      user_id: 'user3',
      rating: 5,
      comment: 'Perfect for our industrial application. Great value for money and excellent customer service.',
      created_at: new Date('2024-01-25')
    }
  ],
  categories: ['Industrial', 'Construction', 'Steel'],
  seller_id: 'seller1',
  min_order_quantity: 10
};

const sellerInfo = {
  name: 'Premium Steel Industries',
  rating: 4.8,
  yearsInBusiness: 15,
  totalOrders: 2500,
  responseTime: '2 hours',
  location: 'Mumbai, India',
  certifications: ['ISO 9001', 'IS 1239', 'ASTM A53']
};

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(mockProduct.variants[0]);
  const [quantity, setQuantity] = useState(mockProduct.min_order_quantity);
  const [activeTab, setActiveTab] = useState('details');

  const avgRating = mockProduct.reviews.reduce((sum, r) => sum + r.rating, 0) / mockProduct.reviews.length;
  const discount = Math.round(((mockProduct.original_price - mockProduct.discounted_price) / mockProduct.original_price) * 100);

  const tabs = [
    { id: 'details', label: 'Product Details' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${mockProduct.reviews.length})` },
    { id: 'seller', label: 'Seller Information' }
  ];

  const specifications = [
    { label: 'Material', value: 'High Grade Steel' },
    { label: 'Standard', value: 'IS 1239, ASTM A53' },
    { label: 'Finish', value: 'Galvanized' },
    { label: 'Application', value: 'Industrial, Construction' },
    { label: 'Warranty', value: '2 Years' },
    { label: 'Country of Origin', value: 'India' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="#" className="text-gray-500 hover:text-gray-700">Home</a>
              <span className="text-gray-400">/</span>
              <a href="#" className="text-gray-500 hover:text-gray-700">Products</a>
              <span className="text-gray-400">/</span>
              <a href="#" className="text-gray-500 hover:text-gray-700">Industrial</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Steel Pipes</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img 
                src={mockProduct.images[selectedImage]} 
                alt={mockProduct.title}
                className="w-full h-96 object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discount}% OFF
                </span>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {mockProduct.categories.map(category => (
                  <span key={category} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {category}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{mockProduct.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{avgRating.toFixed(1)}</span>
                  <span className="text-gray-600">({mockProduct.reviews.length} reviews)</span>
                </div>
                
                <div className="h-4 w-px bg-gray-300"></div>
                
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">In Stock ({mockProduct.stocks} available)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{mockProduct.discounted_price.toLocaleString()}
                </span>
                <span className="text-2xl text-gray-500 line-through">
                  ₹{mockProduct.original_price.toLocaleString()}
                </span>
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                  Save ₹{(mockProduct.original_price - mockProduct.discounted_price).toLocaleString()}
                </span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {mockProduct.description}
              </p>

              {/* Variants */}
              {mockProduct.variants && mockProduct.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Select Size:</h3>
                  <div className="flex gap-3">
                    {mockProduct.variants.map(variant => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                          selectedVariant._id === variant._id
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {variant.size}
                        <span className="block text-xs text-gray-500">Stock: {variant.stock}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-semibold">Quantity:</h3>
                  <span className="text-sm text-gray-600">
                    Minimum order: {mockProduct.min_order_quantity} units
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(mockProduct.min_order_quantity, quantity - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(mockProduct.min_order_quantity, parseInt(e.target.value) || mockProduct.min_order_quantity))}
                      className="w-20 text-center py-2 border-0 focus:ring-0"
                      min={mockProduct.min_order_quantity}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-lg font-semibold">
                    Total: ₹{(mockProduct.discounted_price * quantity).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg font-semibold">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Free shipping above ₹50,000</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Quality guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>ISO certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {mockProduct.description}
                </p>
                <h4 className="text-lg font-semibold mb-3">Key Features:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>High-grade steel construction for maximum durability</li>
                  <li>Corrosion-resistant galvanized finish</li>
                  <li>Complies with IS 1239 and ASTM A53 standards</li>
                  <li>Suitable for both indoor and outdoor applications</li>
                  <li>Available in multiple sizes to meet various requirements</li>
                  <li>2-year manufacturer warranty included</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{spec.label}:</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Write a Review
                  </button>
                </div>

                <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
                    <div className="flex items-center justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{mockProduct.reviews.length} reviews</div>
                  </div>
                  
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map(rating => {
                      const count = mockProduct.reviews.filter(r => r.rating === rating).length;
                      const percentage = (count / mockProduct.reviews.length) * 100;
                      return (
                        <div key={rating} className="flex items-center gap-2 mb-1">
                          <span className="text-sm w-2">{rating}</span>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-6">
                  {mockProduct.reviews.map(review => (
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
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'seller' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Seller Information</h3>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{sellerInfo.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(sellerInfo.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="font-medium">{sellerInfo.rating}</span>
                        <span className="text-gray-600">Seller Rating</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Phone className="w-4 h-4" />
                        Call
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{sellerInfo.yearsInBusiness}+</div>
                      <div className="text-sm text-gray-600">Years in Business</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{sellerInfo.totalOrders}+</div>
                      <div className="text-sm text-gray-600">Orders Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{sellerInfo.responseTime}</div>
                      <div className="text-sm text-gray-600">Avg Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{sellerInfo.location}</div>
                      <div className="text-sm text-gray-600">Location</div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Certifications:</h5>
                    <div className="flex flex-wrap gap-2">
                      {sellerInfo.certifications.map(cert => (
                        <span key={cert} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}