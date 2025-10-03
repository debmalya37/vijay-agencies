// app/about/page.tsx
"use client";

import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Award,
  Truck,
  Shield,
  Clock,
  Star,
  Package,
  Building2,
  Target,
  Heart,
  CheckCircle,
  CreditCard,
  Banknote,
  Factory,
  Store,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Star,
      title: "Quality Assurance",
      description: "We source and supply only the highest quality products from trusted manufacturers to ensure customer satisfaction."
    },
    {
      icon: Users,
      title: "Customer-Centric",
      description: "Our customers' needs are at the heart of everything we do. We strive to exceed expectations in service and support."
    },
    {
      icon: Shield,
      title: "Trust & Integrity",
      description: "Built on a foundation of honesty and transparency, we maintain long-lasting relationships with our clients and partners."
    },
    {
      icon: TrendingUp,
      title: "Continuous Growth",
      description: "We continuously evolve and expand our product range to meet the changing demands of the market."
    }
  ];

  const features = [
    {
      icon: Package,
      title: "Wide Product Range",
      description: "From cleaning chemicals to paper products, we offer comprehensive solutions for hotels, restaurants, and businesses."
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      description: "Fast and secure delivery across Rajasthan and neighboring states with real-time tracking."
    },
    {
      icon: CreditCard,
      title: "Flexible Payments",
      description: "Multiple payment options including Cash on Delivery and secure online payments via Razorpay."
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated customer service team to help you choose the right products for your business needs."
    }
  ];

  const stats = [
    { number: "8+", label: "Years of Excellence" },
    { number: "1000+", label: "Happy Customers" },
    { number: "500+", label: "Products Available" },
    { number: "24/7", label: "Customer Support" }
  ];

  const productCategories = [
    {
      name: "Cleaning Chemicals",
      description: "Professional-grade cleaning solutions for industrial and commercial use"
    },
    {
      name: "Cleaning Equipment",
      description: "Industrial cleaning machines, vacuum cleaners, and floor scrubbers"
    },
    {
      name: "Paper Products",
      description: "High-quality paper napkins, tissues, and disposable products"
    },
    {
      name: "Aluminum Products",
      description: "Food-grade aluminum foil containers, rolls, and packaging solutions"
    },
    {
      name: "Hotel Supplies",
      description: "Complete range of hospitality products for hotels and restaurants"
    },
    {
      name: "Industrial Tools",
      description: "Professional cleaning tools and equipment for industrial applications"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Vijay Agencies
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Your Trusted Partner for Quality Cleaning Solutions & Industrial Supplies Since 2016
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 text-white bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Factory className="w-5 h-5" />
                <span className="text-sm font-medium">B2B Solutions</span>
              </div>
              <div className="flex items-center gap-2 text-white bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Store className="w-5 h-5" />
                <span className="text-sm font-medium">B2C Products</span>
              </div>
              <div className="flex items-center gap-2 text-white bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">Jaipur, Rajasthan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Our Story</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Leading Supplier of Quality Products in Rajasthan
              </h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Established in 2016, Vijay Agencies has emerged as a trusted name in the wholesale and retail 
                  supply of cleaning chemicals, industrial equipment, and hospitality products across Rajasthan 
                  and neighboring regions.
                </p>
                
                <p>
                  Located in the heart of Jaipur at Siddharth Nagar, we have built our reputation on delivering 
                  high-quality products and exceptional service to hotels, restaurants, industrial facilities, 
                  and individual customers throughout the region.
                </p>
                
                <p>
                  Our extensive product portfolio includes professional cleaning chemicals, industrial cleaning 
                  equipment, paper products, aluminum containers, and specialized tools designed to meet the 
                  diverse needs of our B2B and B2C customers.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="h-full flex flex-col justify-center">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Quality Certified</h3>
                    <p className="text-blue-100">ISO standards compliant products</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">GST</div>
                      <div className="text-sm text-blue-100">Registered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">08</div>
                      <div className="text-sm text-blue-100">State Code</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Our Values</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What Drives Us Forward
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our core values shape every decision we make and every relationship we build with our customers and partners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Why Choose Us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Excellence in Every Service
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full mb-4">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Our Products</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Product Portfolio
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We offer a wide range of quality products to meet all your cleaning, packaging, and industrial needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productCategories.map((category, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all duration-300">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 sm:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full mb-4">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm font-medium">Payment Options</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Flexible Payment Solutions
                </h2>
                <p className="text-gray-600">Choose the payment method that works best for you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Banknote className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Cash on Delivery</h3>
                  <p className="text-gray-600">Pay when your order arrives at your doorstep</p>
                </div>

                <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Online Payment</h3>
                  <p className="text-gray-600">Secure online payments via Razorpay gateway</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl p-8 sm:p-12 text-white">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Get In Touch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Contact Information</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Ready to serve you with quality products and exceptional service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Address</h3>
                <p className="text-blue-100 leading-relaxed">
                  A 917 SIDDHARTH NAGAR<br />
                  NEAR JAIN MANDIR<br />
                  JAIPUR, RAJASTHAN - 302025
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Phone</h3>
                <div className="text-blue-100 space-y-1">
                  <p>+91 9351630408</p>
                  <p>+91 9414073671</p>
                </div>
              </div>

              <div className="text-center md:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Email & GST</h3>
                <div className="text-blue-100 space-y-1">
                  <p>vijayagenciesjpr@yahoo.in</p>
                  <p className="text-sm">GSTIN: 08AAJPJ2631B1Z6</p>
                  <p className="text-sm">CIN: 041</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full">
                <Clock className="w-5 h-5" />
                <span>Open 24/7 for Online Orders | Customer Support: 9 AM - 8 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}