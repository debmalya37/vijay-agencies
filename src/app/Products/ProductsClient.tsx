// app/Products/ProductsClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  ChevronDown,
  Package,
  Truck,
  Shield,
  Users,
  Loader2,
  X,
} from "lucide-react";

// Types
interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  base_price: number;
  original_price: number;
  discounted_price?: number;
  is_in_stock: boolean;
  stocks: number;
  images: string[];
  categories: string[];
  min_order_quantity: number;
  seller_id?: string;
  reviews?: Array<{ rating: number; comment: string; user_id: string; created_at: Date }>;
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  meta_title?: string;
  meta_description?: string;
  created_at?: Date | string | number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  is_active: boolean;
  product_count: number;
  parent_category?: {
    name: string;
    slug: string;
  };
  subcategories?: Array<{
    name: string;
    slug: string;
    image_url?: string;
  }>;
}

export default function ProductsClient(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem, items } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // URL-based state (initialized from searchParams)
  const [searchTerm, setSearchTerm] = useState<string>(searchParams?.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams?.get("category") || "All");
  const [sortBy, setSortBy] = useState<string>(searchParams?.get("sort") || "name");
  const [minPrice, setMinPrice] = useState<number>(Number(searchParams?.get("min_price")) || 0);
  const [maxPrice, setMaxPrice] = useState<number>(Number(searchParams?.get("max_price")) || 50000);

  // UI state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();

      // API shape: if your API returns { success: true, products: [...] } adjust accordingly
      // Here we assume /api/products returns an array directly
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data?.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("Invalid products data:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (data?.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Invalid categories data:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when filters change
  const updateURL = (params: Record<string, string | number | boolean>) => {
    // create new URL based on current url
    const url = new URL(window.location.href);

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        url.searchParams.delete(key);
        return;
      }
      const str = String(value);
      if (str === "" || str === "All" || str === "0") {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, str);
      }
    });

    router.replace(url.pathname + url.search, { scroll: false });
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(q) ||
          (product.description || "").toLowerCase().includes(q) ||
          product.categories.some((cat) => cat.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.categories.includes(selectedCategory));
    }

    // Price range filter
    filtered = filtered.filter((product) => {
      const price = product.discounted_price ?? product.original_price ?? product.base_price ?? 0;
      return price >= minPrice && price <= maxPrice;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.discounted_price ?? a.original_price ?? a.base_price) - (b.discounted_price ?? b.original_price ?? b.base_price);
        case "price-high":
          return (b.discounted_price ?? b.original_price ?? b.base_price) - (a.discounted_price ?? a.original_price ?? a.base_price);
        case "rating": {
          const avgA = a.reviews && a.reviews.length > 0 ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 0;
          const avgB = b.reviews && b.reviews.length > 0 ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length : 0;
          return avgB - avgA;
        }
        case "newest":
          return (new Date(b.created_at || 0).getTime() || 0) - (new Date(a.created_at || 0).getTime() || 0);
        case "stock":
          return (b.stocks || 0) - (a.stocks || 0);
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, minPrice, maxPrice, products]);

  // Handle filter changes and update URL
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURL({ search: value, category: selectedCategory, sort: sortBy, min_price: minPrice, max_price: maxPrice });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setShowFilters(false); // Close filters on mobile after selection
    updateURL({ search: searchTerm, category: value, sort: sortBy, min_price: minPrice, max_price: maxPrice });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateURL({ search: searchTerm, category: selectedCategory, sort: value, min_price: minPrice, max_price: maxPrice });
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    updateURL({ search: searchTerm, category: selectedCategory, sort: sortBy, min_price: min, max_price: max });
  };

  // ProductCard component inside client file for brevity
  const ProductCard = ({ product, isListView = false }: { product: Product; isListView?: boolean }) => {
    const avgRating = product.reviews && product.reviews.length > 0 ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length) : 0;
    const basePrice = product.discounted_price ?? product.original_price ?? product.base_price ?? 0;
    const original = product.original_price ?? product.base_price ?? 0;
    const discount = product.discounted_price ? Math.round(((original - product.discounted_price) / Math.max(1, original)) * 100) : 0;
    const isInCart = items.some((item) => item.productId === product._id);

    const navigateToDetail = () => {
      router.push(`/Products/${product._id}`);
    };

    if (isListView) {
      return (
        <div onClick={navigateToDetail} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
              <img onClick={navigateToDetail}
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                }}
              />
              {discount > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  -{discount}%
                </span>
              )}
              {!product.is_in_stock && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg">
                  <span className="text-white font-semibold text-sm">Out of Stock</span>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 onClick={navigateToDetail} className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer">{product.title}</h3>
                <p  onClick={navigateToDetail} className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base cursor-pointer">{product.description}</p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 text-xs sm:text-sm">
                  {product.reviews && product.reviews.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{avgRating.toFixed(1)}</span>
                      <span className="text-gray-500">({product.reviews.length})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-gray-600">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Stock: {product.stocks}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>MOQ: {product.min_order_quantity}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                  {product.categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">₹{basePrice.toLocaleString()}</span>
                    {product.discounted_price && (
                      <span className="text-sm sm:text-lg text-gray-500 line-through">₹{original.toLocaleString()}</span>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">per unit</span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    disabled={!product.is_in_stock}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isInCart) {
                        addItem({
                          productId: product._id,
                          title: product.title,
                          price: basePrice,
                          originalPrice: original,
                          image: product.images?.[0],
                          quantity: product.min_order_quantity || 1,
                          minOrderQuantity: product.min_order_quantity,
                          inStock: product.is_in_stock,
                        });
                      }
                    }}
                    className="px-4 sm:px-6 py-2 bg-[#CC1A29] text-white rounded-lg hover:bg-[#6c2329] transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">
                      {product.is_in_stock ? (isInCart ? "Added to Cart" : "Add to Cart") : "Out of Stock"}
                    </span>
                    <span className="sm:hidden">{product.is_in_stock ? (isInCart ? "Added" : "Add") : "Out"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Grid card
    return (
      <div onClick={navigateToDetail} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-200 group">
        <div className="relative">
          <img onClick={navigateToDetail}
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.title}
            className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
            }}
          />
          {discount > 0 && (
            <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">-{discount}%</span>
          )}
          {!product.is_in_stock && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">Out of Stock</span>
            </div>
          )}
          {/* <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 sm:p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button className="p-1.5 sm:p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div> */}
        </div>

        <div className="p-3 sm:p-5">
          <div className="flex flex-wrap gap-1 mb-2">
            {product.categories.slice(0, 2).map((cat) => (
              <button
                key={cat}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryChange(cat);
                }}
                className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium hover:bg-red-100 transition-colors"
              >
                {cat}
              </button>
            ))}
            {product.categories.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">+{product.categories.length - 2}</span>
            )}
          </div>

          <h3 onClick={navigateToDetail} className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer">{product.title}</h3>
          <p onClick={navigateToDetail} className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 cursor-pointer cursor-pointer">{product.description}</p>

          {product.reviews && product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">({product.reviews.length})</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Stock: {product.stocks}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>MOQ: {product.min_order_quantity}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900">₹{basePrice.toLocaleString()}</span>
              {product.discounted_price && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">₹{original.toLocaleString()}</span>
              )}
            </div>
            <span className="text-xs text-gray-500">per unit</span>
          </div>

          <button
            disabled={!product.is_in_stock}
            onClick={(e) => {
              e.stopPropagation();
              if (!isInCart) {
                addItem({
                  productId: product._id,
                  title: product.title,
                  price: basePrice,
                  originalPrice: original,
                  image: product.images?.[0],
                  quantity: product.min_order_quantity || 1,
                  minOrderQuantity: product.min_order_quantity,
                  inStock: product.is_in_stock,
                });
              }
            }}
            className="w-full bg-[#CC1A29] text-white py-2 sm:py-2.5 rounded-lg hover:bg-[#7a2229] transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
            {product.is_in_stock ? (isInCart ? "Added to Cart" : "Add to Cart") : "Out of Stock"}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="ml-2 text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value="All"
                          checked={selectedCategory === "All"}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">All Categories</span>
                        <span className="ml-auto text-xs text-gray-500">({products.length})</span>
                      </label>
                      {categories.map((category) => (
                        <label key={category._id} className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value={category.name}
                            checked={selectedCategory === category.name}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                          <span className="ml-auto text-xs text-gray-500">({category.product_count})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice || ""}
                        onChange={(e) => handlePriceChange(Number(e.target.value) || 0, maxPrice)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice || ""}
                        onChange={(e) => handlePriceChange(minPrice, Number(e.target.value) || 50000)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={maxPrice}
                      onChange={(e) => handlePriceChange(minPrice, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{minPrice.toLocaleString()}</span>
                      <span>₹{maxPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="p-4 border-t">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setMinPrice(0);
                    setMaxPrice(50000);
                    setSortBy("name");
                    setShowFilters(false);
                    router.replace("/Products", { scroll: false });
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h1>
              <span className="text-xs sm:text-sm text-gray-500">({filteredProducts.length} of {products.length} items)</span>
              {selectedCategory !== "All" && (
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">{selectedCategory}</span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders above ₹50,000</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Quality assured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex gap-4 lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="ml-2 text-sm text-gray-500">Loading...</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value="All"
                        checked={selectedCategory === "All"}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">All Categories</span>
                      <span className="ml-auto text-xs text-gray-500">({products.length})</span>
                    </label>
                    {categories.map((category) => (
                      <label key={category._id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.name}
                          checked={selectedCategory === category.name}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                        <span className="ml-auto text-xs text-gray-500">({category.product_count})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice || ""}
                      onChange={(e) => handlePriceChange(Number(e.target.value) || 0, maxPrice)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice || ""}
                      onChange={(e) => handlePriceChange(minPrice, Number(e.target.value) || 50000)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => handlePriceChange(minPrice, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{minPrice.toLocaleString()}</span>
                    <span>₹{maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setMinPrice(0);
                  setMaxPrice(50000);
                  setSortBy("name");
                  router.replace("/Products", { scroll: false });
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <select
                      title="Sort by"
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-auto"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest First</option>
                      <option value="stock">Most Stock</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" : "space-y-4"}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} isListView={viewMode === "list"} />
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4 text-sm sm:text-base">
                  {searchTerm || selectedCategory !== "All" ? "Try adjusting your search or filter criteria" : "No products available at the moment"}
                </p>
                {(searchTerm || selectedCategory !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      router.replace("/Products", { scroll: false });
                    }}
                    className="px-4 py-2 bg-[#CC1A29] text-white rounded-lg hover:bg-[#CC1A29] transition-colors text-sm sm:text-base"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Mobile Trust Indicators */}
            <div className="sm:hidden mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping on orders above ₹50,000</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Quality assured products</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
