"use client";
import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider"; // 👈 import the hook

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 👇 get real cart count
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  return (
    <>
      {/* Top Purple Information Bar */}
      <div className="bg-purple-500 text-white text-xs py-2 overflow-hidden">
        <div className="animate-pulse">
          <div className="flex items-center justify-center space-x-8 whitespace-nowrap">
            <span>✓ Timely Delivery</span>
            <span>✓ Biodegradable</span>
            <span>✓ Quality Product</span>
            <span>✓ COD Available</span>
            <span>✓ Delivers in 4-5 days</span>
            <span>✓ Quality Assured</span>
            <span>✓ Genuine Products</span>
            <span>✓ Chemical Free</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600">Vijay Agencies</div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-green-600">Home</a>
              <a href="/Products" className="text-gray-700 hover:text-green-600">Products</a>
              <a href="#" className="text-gray-700 hover:text-green-600">About</a>
              <a href="#" className="text-gray-700 hover:text-green-600">Contact</a>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <Link href={"/Profile"} className="p-2 text-gray-400 hover:text-gray-600">
                <User className="w-5 h-5" />
              </Link>

              <Link href="/cart" className="p-2 text-gray-400 hover:text-gray-600 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 text-gray-700">Home</a>
              <a href="/Products" className="block px-3 py-2 text-gray-700">Products</a>
              <a href="#" className="block px-3 py-2 text-gray-700">About</a>
              <a href="#" className="block px-3 py-2 text-gray-700">Contact</a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
