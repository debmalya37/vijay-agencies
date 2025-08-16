"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart, Eye, ChevronDown, Package, Truck, Shield, Users } from 'lucide-react';

// Mock data based on your Product model
const mockProducts = [
  {
    _id: '1',
    title: 'Industrial Steel Pipes - Grade A',
    description: 'High-quality steel pipes suitable for construction and industrial applications. Corrosion-resistant with excellent durability.',
    original_price: 2500,
    discounted_price: 2200,
    is_in_stock: true,
    stocks: 150,
    images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400'],
    categories: ['Industrial', 'Construction'],
    min_order_quantity: 10,
    seller_id: 'seller1',
    reviews: [{ rating: 4.5, comment: 'Great quality', user_id: 'user1', created_at: new Date() }]
  },
  {
    _id: '2',
    title: 'Premium Office Furniture Set',
    description: 'Complete office furniture solution including desks, chairs, and storage units. Modern ergonomic design.',
    original_price: 15000,
    discounted_price: 13500,
    is_in_stock: true,
    stocks: 25,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
    categories: ['Furniture', 'Office'],
    min_order_quantity: 5,
    seller_id: 'seller2',
    reviews: [{ rating: 4.8, comment: 'Excellent build quality', user_id: 'user2', created_at: new Date() }]
  },
  {
    _id: '3',
    title: 'Electronic Components Kit',
    description: 'Comprehensive electronic components package for manufacturing and prototyping needs.',
    original_price: 8500,
    discounted_price: 7650,
    is_in_stock: true,
    stocks: 80,
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'],
    categories: ['Electronics', 'Components'],
    min_order_quantity: 20,
    seller_id: 'seller3',
    reviews: [{ rating: 4.6, comment: 'Good variety', user_id: 'user3', created_at: new Date() }]
  },
  {
    _id: '4',
    title: 'Industrial Safety Equipment',
    description: 'Complete safety gear package including helmets, gloves, and protective wear for industrial use.',
    original_price: 3200,
    discounted_price: 2880,
    is_in_stock: true,
    stocks: 200,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    categories: ['Safety', 'Industrial'],
    min_order_quantity: 15,
    seller_id: 'seller4',
    reviews: [{ rating: 4.7, comment: 'Top quality safety gear', user_id: 'user4', created_at: new Date() }]
  }
];

const categories = ['All', 'Industrial', 'Construction', 'Furniture', 'Office', 'Electronics', 'Components', 'Safety'];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Filter and search logic
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => 
        product.categories.includes(selectedCategory)
      );
    }
    
    filtered = filtered.filter(product => 
      product.original_price >= priceRange[0] && product.original_price <= priceRange[1]
    );
    
    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.discounted_price || a.original_price) - (b.discounted_price || b.original_price);
        case 'price-high':
          return (b.discounted_price || b.original_price) - (a.discounted_price || a.original_price);
        case 'rating':
          const avgA = a.reviews?.reduce((sum, r) => sum + r.rating, 0) / (a.reviews?.length || 1) || 0;
          const avgB = b.reviews?.reduce((sum, r) => sum + r.rating, 0) / (b.reviews?.length || 1) || 0;
          return avgB - avgA;
        default:
          return a.title.localeCompare(b.title);
      }
    });
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, priceRange, products]);

  const ProductCard = ({ product, isListView = false }) => {
    const avgRating = product.reviews?.reduce((sum, r) => sum + r.rating, 0) / (product.reviews?.length || 1) || 0;
    const discount = product.discounted_price ? Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100) : 0;

    if (isListView) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
          <div className="flex gap-6">
            <div className="relative w-48 h-32 flex-shrink-0">
              <img 
                src={product.images?.[0] || '/api/placeholder/400/300'} 
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />
              {discount > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  -{discount}%
                </span>
              )}
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({product.reviews?.length || 0})</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>Stock: {product.stocks}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>MOQ: {product.min_order_quantity}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.categories.map((cat: any) => (
                    <span key={cat} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{(product.discounted_price || product.original_price).toLocaleString()}
                    </span>
                    {product.discounted_price && (
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.original_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">per unit</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-200 group">
        <div className="relative">
          <img 
            src={product.images?.[0] || '/api/placeholder/400/300'} 
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{discount}%
            </span>
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex flex-wrap gap-1 mb-2">
            {product.categories.map((cat:any) => (
              <span key={cat} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                {cat}
              </span>
            ))}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({product.reviews?.length || 0})</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span>Stock: {product.stocks}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>MOQ: {product.min_order_quantity}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{(product.discounted_price || product.original_price).toLocaleString()}
              </span>
              {product.discounted_price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.original_price.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">per unit</span>
          </div>
          
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <span className="text-sm text-gray-500">({filteredProducts.length} items)</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders above ₹50,000</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Quality assured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  isListView={viewMode === 'list'} 
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}