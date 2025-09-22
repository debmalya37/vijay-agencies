"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Star,
  ArrowRight,
  Truck,
  Shield,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Check,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';

// Type definitions
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

interface Category {
  _id: string;
  name: string;
  slug: string;
  image_url?: string;
  icon?: string;
  product_count: number;
  description?: string;
  parent_category?: {
    name: string;
    slug: string;
  };
  subcategories?: {
    name: string;
    slug: string;
    image_url?: string;
  }[];
  is_active: boolean;
  sort_order?: number;
}

interface Banner {
  _id: string;
  title: string;
  image_url: string;
  link_url?: string;
  created_at: string;
}

// Mock data for products (fallback)
const mockProducts = [
  {
    _id: '1',
    title: 'Organic Green Tea Collection',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300',
    rating: 4.5,
    reviews: 128,
    category: 'Beverages'
  },
  {
    _id: '2',
    title: 'Premium Skincare Set',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300',
    rating: 4.8,
    reviews: 95,
    category: 'Beauty'
  },
  {
    _id: '3',
    title: 'Natural Body Care Kit',
    price: 899,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300',
    rating: 4.6,
    reviews: 203,
    category: 'Personal Care'
  }
];

// Fallback categories with emojis
const fallbackCategories = [
  { _id: '1', name: "Dish & Kitchen Care", slug: "dish-kitchen-care", icon: "🧽", product_count: 45, is_active: true },
  { _id: '2', name: "Laundry & Fabric Care", slug: "laundry-fabric-care", icon: "👕", product_count: 32, is_active: true },
  { _id: '3', name: "Bathroom & Toilet Care", slug: "bathroom-toilet-care", icon: "🚿", product_count: 28, is_active: true },
  { _id: '4', name: "Cleaning Accessories", slug: "cleaning-accessories", icon: "🧹", product_count: 18, is_active: true },
  { _id: '5', name: "Floor Cleaner", slug: "floor-cleaner", icon: "🏠", product_count: 22, is_active: true },
  { _id: '6', name: "Hand Washes", slug: "hand-washes", icon: "🧼", product_count: 15, is_active: true },
  { _id: '7', name: "Air Care", slug: "air-care", icon: "🌸", product_count: 12, is_active: true }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Procurement Manager',
    company: 'TechCorp Ltd',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=80',
    text: 'Excellent quality products and outstanding customer service. Our bulk orders are always delivered on time.'
  },
  {
    name: 'Michael Chen',
    role: 'Operations Director',
    company: 'Global Industries',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80',
    text: 'The best B2B platform we\'ve used. Great pricing for bulk orders and reliable delivery.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Supply Chain Manager',
    company: 'MegaCorp',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80',
    text: 'Professional service and high-quality products. Highly recommend for business procurement.'
  }
];

const blogPosts = [
  {
    id: '1',
    title: 'Sustainable Business Practices in 2024',
    excerpt: 'How companies are adopting eco-friendly approaches...',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300',
    date: 'March 15, 2024',
    category: 'Sustainability'
  },
  {
    id: '2',
    title: 'Supply Chain Optimization Tips',
    excerpt: 'Best practices for efficient procurement management...',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300',
    date: 'March 10, 2024',
    category: 'Business'
  },
  {
    id: '3',
    title: 'Quality Standards in Manufacturing',
    excerpt: 'Understanding international quality certifications...',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300',
    date: 'March 5, 2024',
    category: 'Quality'
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Banners state
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [bannersError, setBannersError] = useState<string | null>(null);

  // Function to fetch banners from API
  const fetchBanners = async () => {
    try {
      setBannersLoading(true);
      const response = await fetch('/api/banners');
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.banners)) {
        setBanners(data.banners);
        setBannersError(null);
      } else {
        throw new Error('Invalid banners data');
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
      setBannersError('Failed to load banners');
      setBanners([]);
    } finally {
      setBannersLoading(false);
    }
  };

  // Function to fetch categories from API
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/categories?limit=12');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
        setCategoriesError(null);
      } else {
        throw new Error('Invalid categories data');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategoriesError('Failed to load categories');
      setCategories(fallbackCategories);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Function to fetch products from API
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const raw = await response.json();

      const mapped: Product[] = (Array.isArray(raw) ? raw : []).map((p: any) => {
        const original = Number(p.original_price ?? p.originalPrice ?? 0) || 0;
        const discounted = (p.discounted_price !== undefined && p.discounted_price !== null)
          ? Number(p.discounted_price)
          : null;

        const price = discounted && discounted > 0 ? discounted : original;

        const topImages = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
        const variantImages = Array.isArray(p.variants)
          ? p.variants.flatMap((v: any) => (Array.isArray(v.images) ? v.images.filter(Boolean) : []))
          : [];
        const image = topImages[0] || variantImages[0] || 'https://via.placeholder.com/400x300?text=No+Image';

        const sizesRaw = Array.isArray(p.variants) ? p.variants.map((v: any) => v.size).filter(Boolean) : [];
        const sizes = Array.from(new Set(sizesRaw)) as string[];

        const reviewsArr = Array.isArray(p.reviews) ? p.reviews : [];
        const reviewsCount = reviewsArr.length;
        const rating = reviewsCount
          ? reviewsArr.reduce((sum: number, r: any) => sum + (Number(r.rating) || 0), 0) / reviewsCount
          : undefined;

        const discountLabel =
          original > 0 && price < original
            ? `${Math.round(((original - price) / original) * 100)}% off`
            : p.discount || '';

        return {
          _id: p._id,
          title: p.title,
          price,
          originalPrice: original || undefined,
          image,
          rating,
          reviews: reviewsCount,
          category: Array.isArray(p.categories) && p.categories.length ? p.categories[0] : 'General',
          badge: undefined,
          asSeenOnTV: false,
          discount: discountLabel,
          sizes,
          size: sizes[0] as string | undefined,
          description: p.description || '',
        };
      });

      setProducts(mapped);
      setProductsError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProductsError('Failed to load products');
      setProducts(mockProducts);
    } finally {
      setProductsLoading(false);
    }
  };

  // Helper function to get category color based on name or use a default rotation
  const getCategoryColor = (categoryName: string, index: number) => {
    const colors = ['bg-green-100', 'bg-orange-100', 'bg-purple-100', 'bg-red-100', 'bg-blue-100', 'bg-yellow-100', 'bg-pink-100'];
    return colors[index % colors.length];
  };

  // Helper function to get category icon or emoji
  const getCategoryIcon = (category: Category, index: number) => {
    if (category.icon) {
      return category.icon;
    }
    
    const name = category.name.toLowerCase();
    if (name.includes('dish') || name.includes('kitchen')) return '🧽';
    if (name.includes('laundry') || name.includes('fabric')) return '👕';
    if (name.includes('bathroom') || name.includes('toilet')) return '🚿';
    if (name.includes('cleaning') || name.includes('accessor')) return '🧹';
    if (name.includes('floor')) return '🏠';
    if (name.includes('hand') || name.includes('wash')) return '🧼';
    if (name.includes('air') || name.includes('fresh')) return '🌸';
    if (name.includes('beauty') || name.includes('skincare')) return '💄';
    if (name.includes('health') || name.includes('wellness')) return '💊';
    if (name.includes('food') || name.includes('beverage')) return '🍽️';
    
    const defaultEmojis = ['🏷️', '📦', '🛒', '⭐', '🎯', '💡', '🔔'];
    return defaultEmojis[index % defaultEmojis.length];
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBanners();
  }, []);

  const nextSlide = () => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }
  };

  const prevSlide = () => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  // Handle category click
  const handleCategoryClick = (category: Category) => {
    window.location.href = `/Products?category=${category.name}`;
  };

  // Handle banner click
  const handleBannerClick = (banner: Banner) => {
    if (banner.link_url) {
      window.open(banner.link_url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar/> */}
      
      {/* Shop by Category Section */}
      <section className="bg-white py-6 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            {categoriesLoading && <p className="text-gray-600">Loading categories...</p>}
            {categoriesError && !categoriesLoading && (
              <p className="text-red-600 text-sm">
                {categoriesError} - Showing default categories
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-start overflow-x-auto pb-4 gap-4">
            {!categoriesLoading && categories.map((category, index) => (
              <div 
                key={category._id} 
                className="flex flex-col items-center min-w-0 flex-shrink-0 cursor-pointer group"
                onClick={() => handleCategoryClick(category)}
              >
                <div className={`w-16 h-16 ${getCategoryColor(category.name, index)} rounded-full flex items-center justify-center text-2xl mb-2 hover:shadow-lg transition-all duration-200 group-hover:scale-110`}>
                  {category.image_url ? (
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <span>{getCategoryIcon(category, index)}</span>
                  )}
                </div>
                <span className="text-sm text-gray-700 text-center leading-tight max-w-20 group-hover:text-green-600 transition-colors">
                  {category.name}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {category.product_count} items
                </span>
              </div>
            ))}
            
            {categoriesLoading && (
              <div className="flex gap-4">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="flex flex-col items-center min-w-0 flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-2"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {!categoriesLoading && categories.length > 0 && (
            <div className="text-center mt-6">
              <button 
                onClick={() => window.location.href = '/Products'}
                className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1 border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                View All Categories
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Hero Banner Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {bannersLoading && (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <p className="text-gray-600">Loading banners...</p>
          </div>
        )}

        {bannersError && !bannersLoading && (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-2">No banners available</p>
              <p className="text-gray-400 text-sm">Check back later for updates</p>
            </div>
          </div>
        )}

        {!bannersLoading && !bannersError && banners.length > 0 && (
          <div className="relative w-full h-full">
            {banners.map((banner, index) => (
              <div
                key={banner._id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                } ${banner.link_url ? 'cursor-pointer' : ''}`}
                onClick={() => handleBannerClick(banner)}
              >
                <div className="relative w-full h-full">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                    <h2 className="text-lg font-semibold">{banner.title}</h2>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows - only show if there are multiple banners */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on orders above ₹50,000</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">All products are quality tested</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Certified</h3>
              <p className="text-gray-600">International certifications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round the clock customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">Trusted by families nationwide</p>
          </div>

          {productsLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          )}

          {productsError && !productsLoading && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{productsError}</p>
              <button 
                onClick={fetchProducts}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!productsLoading && !productsError && products.length > 0 && (
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <div key={product._id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {!productsLoading && !productsError && products.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No products available at the moment.</p>
            </div>
          )}

          {!productsLoading && products.length > 8 && (
            <div className="text-center mt-12">
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2 text-lg font-semibold">
                View All Products ({products.length} total)
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Trust & Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Natural Products?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Kid & Pet Safe</h3>
              <p className="text-gray-600 text-sm">Non-toxic formulas safe for your entire family</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Eco-Friendly</h3>
              <p className="text-gray-600 text-sm">Biodegradable ingredients that protect our planet</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Quick and reliable delivery to your doorstep</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Always here to help with any questions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Vijay Agency?</h2>
              <p className="text-gray-600 text-lg mb-6">
                We are committed to providing the highest quality natural products for businesses worldwide. 
                Our sustainable practices and reliable supply chain make us the preferred choice for B2B partnerships.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Certified organic and natural products</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Competitive wholesale pricing</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Reliable global shipping network</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Dedicated account management</span>
                </li>
              </ul>
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
                Learn More About Us
              </button>
            </div>
            
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600"
                  alt="About Us Video"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-colors">
                    <Play className="w-6 h-6 text-gray-800 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Trusted by businesses worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-green-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Insights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Stay updated with industry trends and insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm text-green-600 font-medium">{post.category}</span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <button className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-green-400 mb-4">Vijay Agency</div>
              <p className="text-gray-300 mb-4">
                Your trusted partner for premium natural products and sustainable business solutions.
              </p>
              <div className="flex gap-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Products</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Services</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Returns</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">info@vijayagencies.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">123 Business St, City, ST 12345</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Vijay Agencies. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}