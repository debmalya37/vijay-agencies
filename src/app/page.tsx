"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
// import { ArrowRight } from "lucide-react";
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
import BrandShowcase from '@/components/BrandShowcase';
import ProductSearch from '@/components/ProductSearch';
import QuickProductCard from '@/components/QuickProductCard';
import HousekeepingSection from '@/components/HousekeepingSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import CleaningSection from '@/components/CleaningSection';
import AboutSection from '@/components/AboutSection';
import TestimonialSection from '@/components/TestimonialSection';
import CategoryRail from '@/components/CategoryRail';

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

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

const testimonials = [
  {
    name: 'Rajesh Sharma',
    role: 'Hotel Manager',
    company: 'Grand Palace Hotel, Jaipur',
    image: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    text: 'Vijay Agencies has been our trusted partner for over 5 years. Their cleaning products are top quality and delivery is always on time.'
  },
  {
    name: 'Priya Agarwal',
    role: 'Procurement Head',
    company: 'Rajputana Hotels',
    image: 'https://images.unsplash.com/photo-1573165850883-9b0e18c44bd2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    text: 'Excellent service and competitive prices for bulk orders. Their team understands our hotel requirements perfectly.'
  },
  {
    name: 'Amit Kumar',
    role: 'Operations Manager',
    company: 'Heritage Resort, Jaipur',
    image: 'https://images.unsplash.com/photo-1729157659231-1982957f2d7b?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    text: 'Professional approach and reliable supply chain. Highly recommend for all hotel and commercial cleaning needs.'
  }
];

const messCategories = [
  {
    title: "Grease and Grime",
    image: "/icons/grease.png",
    link: "https://www.vijayagenciesjpr.com/Products?category=Cleaning",
  },
  {
    title: "Stain Removal",
    image: "/icons/stain.png",
    link: "https://www.vijayagenciesjpr.com/Products?category=Cleaning&sort=name&max_price=50000",
  },
  {
    title: "Muddy Floors",
    image: "/icons/muddy.png",
    link: "https://www.vijayagenciesjpr.com/Products?sort=name&max_price=50000&category=Cleaning",
  },
  {
    title: "Dirty Toilets",
    image: "/icons/toilet.png",
    link: "https://www.vijayagenciesjpr.com/Products?sort=name&max_price=50000&category=housekeeping",
  },
  {
    title: "Sticky Kitchens",
    image: "/icons/kitchen.png",
    link: "https://www.vijayagenciesjpr.com/Products?sort=name&max_price=50000&category=housekeeping",
  },
  {
    title: "Machine",
    image: "/icons/machine.png",
    link: "https://www.vijayagenciesjpr.com/Products?sort=name&max_price=50000",
  },
  {
    title: "Dirty Hands",
    image: "/icons/dirty.png",
    link: "https://www.vijayagenciesjpr.com/Products?sort=name&max_price=50000&category=Tissues",
  },
];


const companyStats = [
  { number: '500+', label: 'Happy Clients', icon: Users },
  { number: '50+', label: 'Years Experience', icon: Award },
  { number: '1000+', label: 'Products', icon: Package },
  { number: 'Quick Support', label: 'Customer Support', icon: Headphones }
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
  const [itemsPerSlide, setItemsPerSlide] = useState(2); 
  // Add this at the top of your component (after your other state declarations)
const [currentHousekeepingSlide, setCurrentHousekeepingSlide] = useState(0);
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Banners state
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [bannersError, setBannersError] = useState<string | null>(null);
  const sliderRef2 = useRef<HTMLDivElement>(null);
  const [currentSlide2, setCurrentSlide2] = useState(0);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    fetch("/api/admin/brands", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          setBrands(data.brands);
          setNotFound(false);
        } else {
          console.error("Brands load failed:", data);
          setNotFound(true);
        }
      })
      .catch(console.error);
  }, []);
  
  

  
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


  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 2,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 4, spacing: 24 },
      },
    },
    loop: true,
  });

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
        const image = topImages[0] || variantImages[0] || '';

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

  // Filter housekeeping products
  const housekeepingProducts = products.filter(
    (p) => p.category.toLowerCase() === "housekeeping"
  );

  const cleaningProducts = products.filter(
    (p) => p.category === "Cleaning"
  );
  
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

  // const itemsPerSlide = 2; // showing 2x2 grid
  const totalSlides = Math.ceil(cleaningProducts.length / itemsPerSlide);

  // default for desktop

  // Responsive detection
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1); // mobile
      } else {
        setItemsPerSlide(2); // desktop (2x2)
      }
    };
    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  const scrollToSlide = (index: number) => {
    if (!sliderRef2.current) return;
    const slideWidth = sliderRef2.current.clientWidth;
    sliderRef2.current.scrollTo({
      left: index * slideWidth,
      behavior: "smooth",
    });
    setCurrentSlide(index);
  };

  const handleNext = () => {
    const nextIndex = (currentSlide + 1) % totalSlides;
    scrollToSlide(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    scrollToSlide(prevIndex);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
const itemsPerSlide2 = isMobile ? 1 : 2;

const slides = useMemo(() => {
  const chunks = [];
  for (let i = 0; i < cleaningProducts.length; i += itemsPerSlide2) {
    chunks.push(cleaningProducts.slice(i, i + itemsPerSlide2));
  }
  return chunks;
}, [cleaningProducts, itemsPerSlide2]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* <Navbar/> */}
      <section className="bg-white py-6 px-3 overflow-x-hidden z-[100000]">
  <div className="max-w-full z-[100000]">
    <ProductSearch />
  </div>
</section>
      {/* Shop by Category Section */}
      {/* Shop by Category Section */}
      {/* Shop by Category Section - Zepto Style */}
      <CategoryRail categories={categories} loading={categoriesLoading} />


{/* <section className="bg-white py-6 px-3 overflow-x-hidden z-[100000]">
  <div className="max-w-full z-[100000]">
    <ProductSearch />
  </div>
</section> 
*/}



      {/* Hero Banner Section - Fixed for mobile */}
      <section className="relative h-[25vh] sm:h-[50vh] lg:h-[80vh] scroll-reveal">
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
      <div className="text-center px-3 relative z-10 animate-slide-in-bottom">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight">
          Vijay Agencies
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-6 max-w-3xl mx-auto leading-relaxed">
          Your Trusted Partner for Commercial Cleaning Solutions
        </p>
        <p className="text-base sm:text-lg lg:text-xl mb-8 opacity-90">
          Serving Hotels & Businesses in Jaipur Since 1972
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
      {banners.map((banner, index) => {
  const BannerContent = (
    <div className={`absolute inset-0 transition-all duration-1000 flex items-center justify-center
      ${index === currentSlide ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-105 pointer-events-none'}`}
    >
      <div className="relative w-full h-full cursor-pointer">
        <Image
          src={banner.image_url}
          alt={banner.title}
          width={1200}
          height={600}
          className="w-full h-auto object-cover sm:object-cover object-center bg-gray-100 rounded-md"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div> */}
        {/* <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 glass-effect text-white px-3 sm:px-6 py-2 sm:py-4 rounded-xl backdrop-blur-md max-w-[90%] sm:max-w-none">
          <h2 className="text-base sm:text-xl lg:text-2xl font-bold line-clamp-2">{banner.title}</h2>
        </div> */}
      </div>
    </div>
  );

  return banner.link_url ? (
    <a
      key={banner._id}
      href={banner.link_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-full"
    >
      {BannerContent}
    </a>
  ) : (
    <div key={banner._id} className="block w-full h-full">
      {BannerContent}
    </div>
  );
})}



      {/* Navigation Arrows */}
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
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-red-500 scale-125' : 'bg-gray-600 bg-opacity-50 hover:bg-opacity-75'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )}
</section>


       {/* Featured Products */}
<section className="py-10 sm:py-14 bg-[#F9FAFB]">
  <div className="max-w-7xl mx-auto px-3 sm:px-6">

    {/* ================= HEADER ================= */}
    {/* ================= HEADER ================= */}
<div className="relative mb-6 sm:mb-8">

  {/* Centered Title Group */}
  <div className="text-center space-y-2 max-w-xl mx-auto">
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[11px] sm:text-xs font-semibold tracking-wide uppercase">
      <Sparkles className="w-4 h-4" />
      Featured
    </span>

    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
      Featured Products
    </h2>

    <p className="hidden sm:block text-sm text-gray-600">
      Best-selling and recommended products trusted by businesses
    </p>
  </div>

  {/* Desktop CTA (Right aligned, vertically centered) */}
  <button
    onClick={() => (window.location.href = "/Products")}
    className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#EF4F5F] hover:underline whitespace-nowrap"
  >
    View All →
  </button>

  {/* Mobile CTA (Centered, below title) */}
  <div className="sm:hidden mt-4 text-center">
    <button
      onClick={() => (window.location.href = "/Products")}
      className="text-sm font-semibold text-[#EF4F5F]"
    >
      View All →
    </button>
  </div>
</div>


    {/* ================= MOBILE: HORIZONTAL SCROLL ================= */}
    <div className="sm:hidden relative">
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {products.slice(0, 10).map((product) => (
          <div
            key={product._id}
            className="min-w-[165px] snap-start"
          >
            <QuickProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Scroll Hint */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-[#F9FAFB] via-[#F9FAFB]/80 to-transparent w-10 h-full pointer-events-none" />
    </div>

    {/* ================= DESKTOP: GRID ================= */}
    <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
      {products.slice(0, 8).map((product) => (
        <QuickProductCard key={product._id} product={product} />
      ))}
    </div>

  </div>
</section>


      {/* Housekeeping Products */}
{/* Housekeeping Products */}
{/* // Add this state at the top of your component (with your other useState declarations) */}
{/* // const [currentHousekeepingSlide, setCurrentHousekeepingSlide] = useState(0); */}

{/* Housekeeping Products */}
{!productsLoading && !productsError && housekeepingProducts.length > 0 && (() => {
  
  const totalSlides = Math.ceil(housekeepingProducts.length / 2);
  
  const nextSlide = () => {
    setCurrentHousekeepingSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentHousekeepingSlide((prev) => prev === 0 ? totalSlides - 1 : prev - 1);
  };
  
  const goToSlide = (index: number) => {
    setCurrentHousekeepingSlide(index);
  };

  return (
    <>
      {/* Housekeeping Banner */}
      <section className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920"
            alt="Housekeeping essentials banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/60 to-indigo-900/80"></div>
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-4">
              Professional Housekeeping
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Quality Housekeeping Solutions
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 leading-relaxed">
              Premium products for hotels, restaurants, and commercial facilities
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => (window.location.href = "/Products?category=housekeeping")}
                className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Shop Now
              </button>
              {/* <button className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30">
                Learn More
              </button> */}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        {/* <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full animate-pulse hidden lg:block"></div> */}
        {/* <div className="absolute bottom-10 left-20 w-24 h-24 bg-indigo-500/20 backdrop-blur-sm rounded-2xl rotate-45 hidden lg:block"></div> */}
      </section>

      <HousekeepingSection 
  products={housekeepingProducts}
  currentSlide={currentHousekeepingSlide}
  nextSlide={nextSlide}
  prevSlide={prevSlide}
  goToSlide={goToSlide}
  totalSlides={totalSlides}
/>
    </>
  );
})()}


{/* shop by brand */}
  
<section className="py-8 sm:py-12 bg-[#F9FAFB]">
  <div className="max-w-7xl mx-auto px-3 sm:px-6">

    {/* Header */}
    {/* ================= HEADER ================= */}
<div className="relative mb-6 sm:mb-8">

  {/* Centered Title Group */}
  <div className="text-center space-y-2 max-w-xl mx-auto">
    <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
      Trusted Brands
    </span>

    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
      Shop by Brand
    </h2>
  </div>

  {/* Desktop CTA */}
  <button
    onClick={() => (window.location.href = "/Products")}
    className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap"
  >
    View All →
  </button>

  {/* Mobile CTA */}
  <div className="sm:hidden mt-4 text-center">
    <button
      onClick={() => (window.location.href = "/Products")}
      className="text-sm font-semibold text-blue-600"
    >
      View All →
    </button>
  </div>
</div>


    {/* Mobile – Horizontal Scroll */}
    <div className="sm:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
      {brands?.map((brand) => (
        <Link
          key={brand._id}
          href={`/Products?brand=${brand.slug}`}
          className="snap-start min-w-[140px]"
        >
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 flex flex-col items-center text-center active:scale-95">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <Image
                src={brand.logo || "/placeholder.png"}
                alt={brand.name}
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <p className="text-sm font-semibold text-gray-800 line-clamp-1">
              {brand.name}
            </p>
          </div>
        </Link>
      ))}
    </div>

    {/* Desktop – Grid */}
    <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {brands?.map((brand) => (
        <Link
          key={brand._id}
          href={`/Products?brand=${brand.slug}`}
          className="group"
        >
          <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center group-hover:-translate-y-1">
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Image
                src={brand.logo || "/placeholder.png"}
                alt={brand.name}
                width={72}
                height={72}
                className="object-contain"
              />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              {brand.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>

  </div>
</section>


    
      {/* Why Choose Vijay Agencies Section - NEW */}
 <WhyChooseUs />


      {/* Cleaning Products Section */}
{/* Cleaning Products */}
{!productsLoading && !productsError && cleaningProducts.length > 0 && (
  <>
    {/* Cleaning Products Banner */}
    <section className="relative w-full h-[400px] sm:h-[450px] lg:h-[450px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1920"
          alt="Cleaning products banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-emerald-800/80 to-green-900/90"></div>
      </div>
      
      <div className="relative h-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-4 animate-fade-in">
            Premium Cleaning Solutions
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight animate-slide-up">
            Professional Cleaning Essentials
          </h1>
          <p className="text-lg sm:text-xl text-green-100 mb-6 leading-relaxed animate-slide-up-delay">
            Industrial-grade cleaning products for hotels, restaurants, and commercial spaces
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-delay">
            <button 
              onClick={() => (window.location.href = "/Products?category=Cleaning")}
              className="bg-white text-green-900 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 group"
            >
              Shop Cleaning Products
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            
          </div>
        </div>
      </div>

      {/* Animated Floating Elements */}
      {/* <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full animate-float hidden lg:block"></div> */}
      {/* <div className="absolute top-40 right-40 w-12 h-12 bg-green-400/20 backdrop-blur-sm rounded-full animate-float-delay hidden lg:block"></div> */}
      {/* <div className="absolute bottom-20 right-32 w-20 h-20 bg-emerald-300/10 backdrop-blur-sm rounded-2xl rotate-45 animate-pulse hidden lg:block"></div> */}
      {/* <div className="absolute bottom-32 left-20 w-24 h-24 bg-white/5 backdrop-blur-sm rounded-2xl -rotate-12 animate-float hidden lg:block"></div> */}
      
      {/* Feature Badges */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden lg:flex gap-4">
        <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 flex items-center gap-2 animate-fade-in">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-medium">Eco-Friendly</span>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 flex items-center gap-2 animate-fade-in-delay">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-medium">Fast Acting</span>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 flex items-center gap-2 animate-fade-in-delay-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-medium">Professional Grade</span>
        </div>
      </div>
    </section>

  <CleaningSection 
   products={cleaningProducts}
   currentSlide={currentSlide} // Note: You might need separate state for cleaning vs housekeeping slides if they slide independently.
   nextSlide={nextSlide} 
   prevSlide={prevSlide}
   goToSlide={setCurrentSlide} // Or whatever state setter you use
   totalSlides={totalSlides}
/>


  </>
)}

      {/* Company Stats Section
      <section className="py-12 sm:py-16 bg-white scroll-reveal">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {companyStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse-hover">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      <section className="px-3 md:px-12 py-6 bg-white shadow-md border-spacing-2 rounded-xl">
  <div className="text-center mb-8">
    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium font-sans">
      Shop by Concern
    </span>
    <h2 className="text-3xl md:text-4xl font-bold mt-4 font-serif ">
      Which Mess Matters?
    </h2>
  </div>

  {/* Mobile Horizontal Scroll / Desktop Grid */}
  <div className="max-w-6xl mx-auto">
    <div
      className="
        flex gap-6 overflow-x-auto pb-4 
        sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible
        scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent
      "
    >
      {messCategories.map((item, index) => (
        <div
          key={index}
          className="min-w-[250px] sm:min-w-0 bg-amber-50 rounded-xl p-6 shadow-sm flex flex-col items-start justify-between hover:shadow-md transition"
        >
          <div className="flex items-center justify-between w-full">
            <h3 className="text-2xl font-semibold text-gray-800 max-w-[60%]">
              {item.title}
            </h3>
            <Image
              src={item.image}
              alt={item.title}
              width={80}
              height={80}
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/icons/fallback.png";
              }}
            />
          </div>
          <a
            href={item.link}
            className="mt-4 text-sm font-medium text-black underline hover:text-amber-700"
          >
            View Products &gt;
          </a>
        </div>
      ))}
    </div>
  </div>
</section>

  


      {/* About Vijay Agencies Section */}
     <AboutSection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Contact Us Banner */}
{/* Contact Us Banner */}
<section className="relative w-full overflow-hidden">
  <div className="absolute inset-0">
    <img
      src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920"
      alt="Contact us banner"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-red-900/95 via-red-800/90 to-rose-900/95"></div>
  </div>
  
  <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Left Column - Banner Content */}
      <div className="text-white">
        <span className="inline-block px-3 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-4 animate-fade-in">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 leading-tight animate-slide-up">
          Let&apos;s Work Together
        </h1>
        <p className="text-lg sm:text-xl text-red-100 mb-6 leading-relaxed animate-slide-up-delay">
          Partner with Vijay Agencies for premium B2B solutions. We&apos;re here to help your business succeed.
        </p>
        
        {/* Quick Contact Info */}
        <div className="space-y-4 mb-8">
          <a 
            href="tel:+919351630408"
            className="flex items-center gap-3 text-white hover:text-red-200 transition-colors group"
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-red-200">Call us directly</div>
              <div className="font-semibold">+91 9351630408</div>
            </div>
          </a>
          
          <a 
            href="mailto:vijayagenciesjpr@yahoo.in"
            className="flex items-center gap-3 text-white hover:text-red-200 transition-colors group"
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-red-200">Email us</div>
              <div className="font-semibold">support@vijayagenciesjpr.com</div>
            </div>
          </a>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Quick Support</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Fast Delivery</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">500+ Clients</span>
          </div>
        </div>
      </div>

      {/* Right Column - Contact Form */}
      <div className="relative animate-fade-in-right">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* Background with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/98 via-white/95 to-red-50/98 backdrop-blur-md"></div>
          </div>

          {/* Form Content */}
          <div className="relative z-10 p-6 sm:p-8 bg-white">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Get a Quote</h3>
              <p className="text-gray-600 text-sm">Fill out the form and we&apos;ll get back to you within 24 hours</p>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/90 backdrop-blur-sm text-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/90 backdrop-blur-sm text-sm"
                />
              </div>
              
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/90 backdrop-blur-sm text-sm"
              />
              
              <input
                type="text"
                placeholder="Business Name"
                className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/90 backdrop-blur-sm text-sm"
              />
              
              <div className="relative">
                <input
                  title='category'
                  placeholder='category / product' 
                  className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-gray-900 bg-white/90 backdrop-blur-sm appearance-none cursor-pointer text-sm"
                />
                  {/* <option value="">Select Product Category</option>
                  <option value="cleaning">Cleaning Products</option>
                  <option value="housekeeping">Housekeeping Products</option>
                  <option value="both">Both Categories</option> */}
                
                {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div> */}
              </div>
              
              <textarea
                placeholder="Tell us about your requirements..."
                rows={3}
                className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-500 resize-none bg-white/90 backdrop-blur-sm text-sm"
              ></textarea>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                Request Quote
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>

            {/* Trust Badge */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Your information is secure and confidential
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Decorative Elements */}
  <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full animate-pulse hidden lg:block"></div>
  <div className="absolute bottom-10 left-20 w-24 h-24 bg-red-500/20 backdrop-blur-sm rounded-2xl rotate-45 hidden lg:block"></div>
</section>

{/* Contact Information Section */}


{/* Contact Information Section */}


      {/* Footer */}
    </div>
  );
}
