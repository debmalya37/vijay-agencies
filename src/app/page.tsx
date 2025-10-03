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
  X,
  Building2,
  Users,
  Package,
  Headphones,
  Sparkles,
  Zap,
  Heart,
  TrendingUp,
  Leaf,
  Recycle,
  ThumbsUp
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';

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

const testimonials = [
  {
    name: 'Rajesh Sharma',
    role: 'Hotel Manager',
    company: 'Grand Palace Hotel, Jaipur',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80',
    text: 'Vijay Agencies has been our trusted partner for over 5 years. Their cleaning products are top quality and delivery is always on time.'
  },
  {
    name: 'Priya Agarwal',
    role: 'Procurement Head',
    company: 'Rajputana Hotels',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=80',
    text: 'Excellent service and competitive prices for bulk orders. Their team understands our hotel requirements perfectly.'
  },
  {
    name: 'Amit Kumar',
    role: 'Operations Manager',
    company: 'Heritage Resort, Jaipur',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80',
    text: 'Professional approach and reliable supply chain. Highly recommend for all hotel and commercial cleaning needs.'
  }
];

const companyStats = [
  { number: '500+', label: 'Happy Clients', icon: Users },
  { number: '15+', label: 'Years Experience', icon: Award },
  { number: '1000+', label: 'Products', icon: Package },
  { number: '24/7', label: 'Customer Support', icon: Headphones }
];

const whyChooseUs = [
  {
    icon: Building2,
    title: 'Hotel Industry Specialists',
    description: 'Deep understanding of hospitality and commercial cleaning requirements'
  },
  {
    icon: Truck,
    title: 'Reliable Delivery',
    description: 'On-time delivery across Jaipur and surrounding areas'
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'All products are tested and certified for commercial use'
  },
  {
    icon: TrendingUp,
    title: 'Competitive Pricing',
    description: 'Best wholesale rates for bulk orders and regular customers'
  }
];

// Animation keyframes for CSS
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes slideInFromBottom {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-fade-in-left {
    animation: fadeInLeft 0.6s ease-out forwards;
  }

  .animate-fade-in-right {
    animation: fadeInRight 0.6s ease-out forwards;
  }

  .animate-slide-in-bottom {
    animation: slideInFromBottom 0.8s ease-out forwards;
  }

  .animate-pulse-hover:hover {
    animation: pulse 0.6s ease-in-out;
  }

  .scroll-reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }

  .scroll-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }

  .glass-effect {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

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

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    scrollRevealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
    } finally {
      setProductsLoading(false);
    }
  };

  // Helper function to get category color based on name or use a default rotation
  const getCategoryColor = (categoryName: string, index: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-100 to-blue-200', 
      'bg-gradient-to-br from-green-100 to-green-200', 
      'bg-gradient-to-br from-purple-100 to-purple-200', 
      'bg-gradient-to-br from-orange-100 to-orange-200', 
      'bg-gradient-to-br from-red-100 to-red-200', 
      'bg-gradient-to-br from-yellow-100 to-yellow-200', 
      'bg-gradient-to-br from-pink-100 to-pink-200', 
      'bg-gradient-to-br from-indigo-100 to-indigo-200'
    ];
    return colors[index % colors.length];
  };

  // Helper function to get category icon or emoji
  const getCategoryIcon = (category: Category, index: number) => {
    if (category.icon) {
      return category.icon;
    }
    
    const name = category.name.toLowerCase();
    if (name.includes('kitchen')) return '🍽️';
    if (name.includes('washroom') || name.includes('bathroom') || name.includes('toilet')) return '🚿';
    if (name.includes('floor')) return '🏠';
    if (name.includes('vacuum') || name.includes('cleaner')) return '🔌';
    if (name.includes('paper') || name.includes('towel')) return '🧻';
    if (name.includes('soap') || name.includes('dispenser')) return '🧼';
    if (name.includes('air') || name.includes('fresh')) return '🌸';
    if (name.includes('scrubber')) return '🧽';
    if (name.includes('chemical')) return '⚗️';
    if (name.includes('industrial')) return '🏭';
    
    const defaultEmojis = ['🧽', '🧴', '🚿', '🧻', '🔌', '⚗️', '🏭', '🧼'];
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
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
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
                    
                    <Image
  src={category.image_url}
  alt={category.name}
  width={40}   // corresponds to w-10
  height={40}  // corresponds to h-10
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

      {/* Hero Banner Section - Fixed for mobile */}
      <section className="relative h-[30vh] sm:h-[60vh] lg:h-[80vh] overflow-hidden scroll-reveal">
        {bannersLoading && (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading banners...</p>
            </div>
          </div>
        )}

        {bannersError && !bannersLoading && (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="text-center px-4 relative z-10 animate-slide-in-bottom">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight">
                Vijay Agencies
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-6 max-w-3xl mx-auto leading-relaxed">
                Your Trusted Partner for Commercial Cleaning Solutions
              </p>
              <p className="text-base sm:text-lg lg:text-xl mb-8 opacity-90">
                Serving Hotels & Businesses in Jaipur Since 2016
              </p>
              <button 
                onClick={() => window.location.href = '/Products'}
                className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 text-base sm:text-lg"
              >
                Explore Products
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        )}

        {!bannersLoading && !bannersError && banners.length > 0 && (
          <div className="relative w-full h-full">
            {banners.map((banner, index) => (
              <div
                key={banner._id}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                } ${banner.link_url ? 'cursor-pointer' : ''}`}
                onClick={() => handleBannerClick(banner)}
              >
                <div className="relative w-full h-full">
                <Image
  src={banner.image_url}
  alt={banner.title}
  width={1200}      // reasonable default width
  height={600}      // reasonable default height
  className="w-full h-auto object-cover sm:object-cover object-center bg-gray-100 rounded-md"
/>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 glass-effect text-white px-3 sm:px-6 py-2 sm:py-4 rounded-xl backdrop-blur-md max-w-[90%] sm:max-w-none">
                    <h2 className="text-base sm:text-xl lg:text-2xl font-bold line-clamp-2">{banner.title}</h2>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows - only show if there are multiple banners */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 glass-effect hover:bg-white hover:bg-opacity-20 text-white p-2 sm:p-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 glass-effect hover:bg-white hover:bg-opacity-20 text-white p-2 sm:p-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-white scale-125' 
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Why Choose Vijay Agencies Section - NEW */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Vijay Agencies Over Others?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
              What makes us the preferred choice for commercial cleaning solutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Vijay Agencies Side (Green) */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-left">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-md">
                  Vijay Agencies
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center shadow-md">
                  <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4 text-gray-800">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Toxin-free</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-gray-800">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Biodegradable</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-gray-800">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Recyclable</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-gray-800">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Locally crafted</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-gray-800">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Plant-based</span>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-green-200">
                <img
                  src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600"
                  alt="Eco-friendly cleaning products"
                  className="w-full h-40 sm:h-48 lg:h-56 object-cover rounded-2xl shadow-md"
                />
              </div>
            </div>

            {/* Others Side (Red) */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-right">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-md">
                  Others
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4 text-gray-800">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Harsh chemicals</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-gray-800">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Limited trust</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-gray-800">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Non recyclable</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-gray-800">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Hides ingredients</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-gray-800">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Lacks local focus</span>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-red-200">
                <img
                  src="https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600"
                  alt="Chemical cleaning products"
                  className="w-full h-40 sm:h-48 lg:h-56 object-cover rounded-2xl shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Bottom Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-10 sm:mt-12 lg:mt-16">
            {/* The Power of Coconut */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up stagger-1">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    The Power of Coconut
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                    At the core of Vijay Agencies&apos;s cleaning products is coconut. Derived from a coconut oil base, all surfactants that goes into each of every ingredient naturally sourced, plant-based, toxin-free, safe, efficient and completely free from harmful toxins, gentle on your family&apos;s health and safety, it&apos;s gentle effective, and completely free from harmful toxins, making it a powerful yet gentle choice for maintaining them into safe, healthier homes.
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    By harnessing the natural strength of coconuts, Vijay Agencies combines eco-friendliness with high performance, transforming surfactants into effective cleaning agents that truly care for your home and the environment.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=200"
                    alt="Coconut"
                    className="w-full md:w-32 lg:w-40 h-32 lg:h-40 object-cover rounded-2xl shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* About Vijay Agencies */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up stagger-2">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    About Vijay Agencies
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                    Simran Khara founded Vijay Agencies in 2021, driven by her passion for creating a safer everyday for families. During the pandemic, she became acutely aware of the harmful chemicals in common cleaning products and their impact on health and environment. This realization led her to create Vijay Agencies, a brand that offers plant-based cleaning solutions, free from harmful chemicals.
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Simran Khara founded Vijay Agencies in 2021, driven by her passion for creating a safer everyday for families. During the pandemic, she became acutely aware of the harmful chemicals used in cleaning products. Vijay Agencies now offers plant-based solutions that are safer for families, without compromising on performance.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200"
                    alt="Simran Khara"
                    className="w-full md:w-32 lg:w-40 h-40 lg:h-48 object-contain rounded-2xl shadow-md"
                  />
                  <div className="mt-3 bg-green-600 text-white px-3 py-2 rounded-lg text-center">
                    <p className="font-bold text-xs sm:text-sm">Simran Khara</p>
                    <p className="text-xs">Founder of Vijay Agencies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats Section */}
      <section className="py-12 sm:py-16 bg-white scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {companyStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse-hover">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white text-black scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Vijay Agencies?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed">Your trusted partner for all commercial cleaning needs in Jaipur and surrounding areas</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {whyChooseUs.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110 animate-pulse-hover">
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-white scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Professional-grade cleaning solutions for commercial use</p>
          </div>

          {productsLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-6 text-gray-600 text-lg">Loading products...</p>
            </div>
          )}

          {productsError && !productsLoading && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-6 text-lg">{productsError}</p>
              <button 
                onClick={fetchProducts}
                className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
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
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products available at the moment.</p>
            </div>
          )}

          {!productsLoading && products.length > 8 && (
            <div className="text-center mt-12 lg:mt-16 animate-fade-in-up stagger-4">
              <button 
                onClick={() => window.location.href = '/Products'}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 inline-flex items-center gap-3 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                View All Products ({products.length} total)
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About Vijay Agencies Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 lg:space-y-8 animate-fade-in-left">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">About Vijay Agencies</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full mb-6"></div>
              </div>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
                Established as a trusted wholesale supplier in Jaipur, Rajasthan, Vijay Agencies has been 
                serving the hospitality and commercial sector with high-quality cleaning solutions and equipment.
              </p>
              
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                We specialize in providing comprehensive cleaning solutions to hotels, restaurants, and commercial 
                establishments across Jaipur and surrounding areas. Our extensive range includes industrial cleaning 
                equipment, chemicals, and consumables.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 lg:mt-10">
                <div className="flex items-start space-x-4 animate-fade-in-up stagger-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">Industrial Equipment</h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Vacuum cleaners, scrubber driers, floor sweepers</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 animate-fade-in-up stagger-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">Cleaning Chemicals</h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Kitchen & washroom cleaning solutions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 animate-fade-in-up stagger-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">Paper Products</h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Toilet rolls, kitchen towels, tissues</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 animate-fade-in-up stagger-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">Dispensers & Accessories</h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Soap dispensers, air fresheners</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => window.location.href = '/about'}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 inline-flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 text-base sm:text-lg"
                >
                  Learn More About Us
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="relative animate-fade-in-right">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400"
                  alt="Vijay Agencies Cleaning Solutions"
                  className="w-full h-80 sm:h-96 lg:h-[28rem] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 text-white">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">Professional Cleaning Solutions</h3>
                  <p className="text-sm sm:text-base opacity-90 leading-relaxed">Serving Jaipur&apos;s hospitality industry since 2016</p>
                </div>
              </div>
              
              {/* Floating contact card */}
              <div className="absolute -bottom-8 -right-4 sm:-bottom-10 sm:-right-8 bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100 max-w-xs animate-slide-in-bottom hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Get In Touch</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3 justify-center">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">9351630408</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium">vijayagenciesjpr@yahoo.in</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-white scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed">Trusted by hotels and businesses across Jaipur</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-500 group animate-fade-in-up hover:scale-105" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-4 ring-blue-100 shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">{testimonial.role}</p>
                    <p className="text-sm text-blue-600 font-semibold">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed text-sm sm:text-base">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8">Ready to Partner With Us?</h2>
              <p className="text-blue-100 text-base sm:text-lg lg:text-xl mb-8 lg:mb-10 leading-relaxed">
                Contact Vijay Agencies today for all your commercial cleaning needs. 
                We provide personalized solutions and competitive bulk pricing for hotels and businesses.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 sm:gap-6 animate-fade-in-up stagger-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-lg sm:text-xl">Visit Our Store</h4>
                    <p className="text-blue-100 leading-relaxed">
                      A 917 Siddarth Nagar, Near Jain Mandir<br />
                      Jaipur, Rajasthan - 302025
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 sm:gap-6 animate-fade-in-up stagger-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-lg sm:text-xl">Call Us</h4>
                    <p className="text-blue-100 leading-relaxed">
                      +91 9351630408<br />
                      +91 9414073671
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 sm:gap-6 animate-fade-in-up stagger-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-lg sm:text-xl">Email Us</h4>
                    <p className="text-blue-100">vijayagenciesjpr@yahoo.in</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl animate-fade-in-right">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Get a Quote</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Business Name"
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                />
                <textarea
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Request Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
}