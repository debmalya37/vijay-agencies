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
import BrowseProductsSection from '@/components/BrowseProductsSection';

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
  description?: string; // Add this
  button_text?: string; // Add this
  bg_color?: string;    // Add this
  image_position?: 'left' | 'right'; // Add this
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
  // const [currentSlide, setCurrentSlide] = useState(0);
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
  // const sliderRef2 = useRef<HTMLDivElement>(null);
  const [currentSlide2, setCurrentSlide2] = useState(0);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [notFound, setNotFound] = useState(false);

  // Banner Slider Logic using Keen Slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef2, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    loop: true,
    drag: true,
  }, [
    (slider) => {
      let timeout: ReturnType<typeof setTimeout>
      let mouseOver = false
      function clearNextTimeout() {
        clearTimeout(timeout)
      }
      function nextTimeout() {
        clearTimeout(timeout)
        if (mouseOver) return
        timeout = setTimeout(() => {
          slider.next()
        }, 5000)
      }
      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true
          clearNextTimeout()
        })
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false
          nextTimeout()
        })
        nextTimeout()
      })
      slider.on("dragStarted", clearNextTimeout)
      slider.on("animationEnded", nextTimeout)
      slider.on("updated", nextTimeout)
    },
  ]);

  const nextSlide = () => {
  setCurrentSlide((prev) => (prev + 1) % banners.length);
};

const prevSlide = () => {
  setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
};
  
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
      const response = await fetch('/api/categories?parent_id=null&limit=12');
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

  // const nextSlide = () => {
  //   if (banners.length > 0) {
  //     setCurrentSlide((prev) => (prev + 1) % banners.length);
  //   }
  // };

  // const prevSlide = () => {
  //   if (banners.length > 0) {
  //     setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  //   }
  // };

  // useEffect(() => {
  //   if (banners.length > 1) {
  //     const timer = setInterval(nextSlide, 1000);
  //     return () => clearInterval(timer);
  //   }
  // }, [banners.length]);

  useEffect(() => {
  if (banners.length === 0) return;

  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, 2000);

  return () => clearInterval(interval);
}, [banners]);
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

  // const scrollToSlide = (index: number) => {
  //   if (!sliderRef2.current) return;
  //   const slideWidth = sliderRef2.current.clientWidth;
  //   sliderRef2.current.scrollTo({
  //     left: index * slideWidth,
  //     behavior: "smooth",
  //   });
  //   setCurrentSlide(index);
  // };

  // const handleNext = () => {
  //   const nextIndex = (currentSlide + 1) % totalSlides;
  //   scrollToSlide(nextIndex);
  // };

  // const handlePrev = () => {
  //   const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
  //   scrollToSlide(prevIndex);
  // };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
const itemsPerSlide2 = isMobile ? 1 : 2;

const slides = useMemo(() => {
  const chunks = [];
  for (let i = 0; i < cleaningProducts.length; i += itemsPerSlide2) {
    chunks.push(cleaningProducts.slice(i, i + itemsPerSlide2));
  }
  return chunks;
}, [cleaningProducts, itemsPerSlide2]);


function getRandomProducts<T>(arr: T[], count: number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

const randomProducts = useMemo(() => {
  return getRandomProducts(products, 12);
}, [products]);


  return (
    <div className="min-h-screen bg-rose-200/10 overflow-x-hidden">

      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* <Navbar/> */}
      {/* <section className="bg-white py-6 px-3 overflow-x-hidden z-[100000]">
  <div className="max-w-full z-[100000]">
    <ProductSearch />
  </div>
</section> */}
      {/* Shop by Category Section */}
      {/* Shop by Category Section */}
      {/* Shop by Category Section - Zepto Style */}
      


{/* <section className="bg-white py-6 px-3 overflow-x-hidden z-[100000]">
  <div className="max-w-full z-[100000]">
    <ProductSearch />
  </div>
</section> 
*/}



      {/* Hero Banner Section - Fixed for mobile */}
    {/* ================= HERO SECTION (Replaces old banner) ================= */}
      
      {/* ================= PREMIUM HERO (Nykaa / Zepto Style) ================= */}
{/* ================= PREMIUM HERO (Nykaa / Myntra Style) ================= */}
<section className="relative bg-[#fafafa] scroll-reveal pt-2 sm:pt-1">
  <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">

    {/* Loading */}
    {bannersLoading && (
      <div className="w-full h-[200px] sm:h-[320px] lg:h-[420px] rounded-3xl sm:rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading banners...</p>
      </div>
    )}

    {/* Error */}
    {bannersError && !bannersLoading && (
      <div className="w-full h-[200px] sm:h-[320px] lg:h-[420px] rounded-xl bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center text-white shadow-xl">
        <div className="text-center px-4">
          <h2 className="text-xl sm:text-3xl font-bold mb-2">Vijay Agencies</h2>
          <p className="text-sm sm:text-base">Premium Cleaning Solutions</p>
        </div>
      </div>
    )}

    {/* Banner Slider */}
    {!bannersLoading && !bannersError && banners.length > 0 && (
      <div className="relative">

        {/* Banner Container */}
        <div className="
          relative w-full
          h-[220px] 
          sm:h-[380px] 
          lg:h-[calc(100vh-160px)]
          overflow-hidden 
          rounded-2xl
          sm:rounded-xl
          shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)]
          bg-white
        ">

          {banners.map((banner, index) => {
            const BannerContent = (
              <div
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  width={1600}
                  height={600}
                  priority={index === 0}
                  className="
                    w-full h-full
                    object-cover
                    sm:object-cover
                    object-center
                    rounded-2xl
                    sm:rounded-none
                  "
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5 pointer-events-none" />
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
              <div key={banner._id} className="w-full h-full">
                {BannerContent}
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="
                absolute left-2 sm:left-4 top-1/2 -translate-y-1/2
                bg-white/90 backdrop-blur-md border border-gray-200
                shadow-md
                w-8 h-8 sm:w-12 sm:h-12
                rounded-full flex items-center justify-center
                hover:bg-white hover:scale-105 transition-all duration-300 z-20
              "
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>

            <button
              onClick={nextSlide}
              className="
                absolute right-2 sm:right-4 top-1/2 -translate-y-1/2
                bg-white/90 backdrop-blur-md border border-gray-200
                shadow-md
                w-8 h-8 sm:w-12 sm:h-12
                rounded-full flex items-center justify-center
                hover:bg-white hover:scale-105 transition-all duration-300 z-20
              "
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
          </>
        )}

      </div>
    )}

  </div>
</section>



<CategoryRail categories={categories} loading={categoriesLoading} />


       {/* Featured Products */}
<section className="relative py-16 sm:py-24 overflow-hidden bg-white">

  {/* ===== LIGHT BACKGROUND GLOW (optimized) ===== */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110%] h-[420px] bg-gradient-to-b from-red-50 via-white/40 to-transparent blur-2xl" />
  </div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* ================= HEADER ================= */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">

      <div className="text-center md:text-left max-w-2xl mx-auto md:mx-0">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-100 shadow-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-[#EF4F5F] animate-pulse"></span>
          <span className="text-[11px] font-semibold tracking-widest text-[#EF4F5F] uppercase">
            Trending Now
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 leading-tight">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF4F5F] to-[#C41E3A]">Collection</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-gray-500">
          Discover our most popular cleaning essentials trusted by hotels & businesses.
        </p>
      </div>

      {/* DESKTOP CTA */}
      <button
        onClick={() => (window.location.href = "/Products")}
        className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-red-100 shadow hover:shadow-md transition"
      >
        <span className="text-sm font-semibold text-gray-800">View All</span>
        <ArrowRight className="w-4 h-4 text-[#EF4F5F]" />
      </button>
    </div>


    {/* ================= SLIDER ================= */}

    <div className="relative">

      {/* LEFT FADE */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

      {/* RIGHT FADE */}
      <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* SCROLL CONTAINER */}
      <div className="
  flex gap-6 overflow-x-auto pb-10 pt-4 mx-4
  snap-x snap-mandatory
  scrollbar-hide
  items-stretch
">


        {/* PRODUCTS */}
        {products.slice(0, 12).map((product) => (
  <div
    key={product._id}
    className="
      w-[240px]
      sm:w-[260px]
      md:w-[270px]
      flex-shrink-0
      snap-start
      h-full
      transition-transform duration-300
      hover:-translate-y-1
    "
  >
    <QuickProductCard product={product} />
  </div>
))}


        {/* VIEW ALL CARD */}
        <div className="w-[240px] sm:w-[260px] md:w-[270px] flex-shrink-0 snap-start h-full">
  <button
    onClick={() => (window.location.href = "/Products")}
    className="
      h-full min-h-[420px] w-full
      rounded-2xl
      border-2 border-dashed border-red-200
      flex flex-col items-center justify-center gap-3
      text-[#EF4F5F]
      font-semibold
      hover:bg-red-50
      transition
    "
  >
    <ArrowRight className="w-7 h-7" />
    View All
  </button>
</div>


      </div>

    </div>

  </div>
</section>



      {/* Housekeeping Products */}
{/* Housekeeping Products */}
{/* // Add this state at the top of your component (with your other useState declarations) */}
{/* // const [currentHousekeepingSlide, setCurrentHousekeepingSlide] = useState(0); */}

{/* Housekeeping Products */}



{/* shop by brand */}
  
<section className="relative py-14 sm:py-20 overflow-hidden bg-gradient-to-b from-[#050505] via-[#0b0b0b] to-[#140202]">

  {/* ===== PREMIUM BACKGROUND LAYERS ===== */}

  {/* radial glow */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-red-600/20 blur-[120px]" />
    <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-red-500/10 blur-[120px]" />
  </div>

  {/* subtle grid texture */}
  <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* ===== HEADER ===== */}
    <div className="mb-12 sm:mb-16 flex flex-col sm:flex-row items-end justify-between gap-6">

      <div className="text-center sm:text-left max-w-2xl mx-auto sm:mx-0">

        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-red-400 text-[11px] font-semibold tracking-widest uppercase mb-4 backdrop-blur-sm">
          PREMIUM PARTNERS
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
          Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">Brand</span>
        </h2>

        <p className="mt-3 text-gray-400 font-medium max-w-lg">
          Discover high-quality products from top-tier manufacturers trusted by professionals.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => (window.location.href = "/Products")}
        className="hidden sm:flex items-center gap-2 text-sm font-semibold text-white hover:text-red-400 transition"
      >
        View All Brands
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 transition">
          <ChevronRight className="w-4 h-4" />
        </span>
      </button>
    </div>

    {/* ===== MOBILE SCROLL ===== */}
    <div className="sm:hidden flex gap-5 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pt-4">

      {brands?.map((brand) => (
        <Link
          key={brand._id}
          href={`/Products?brand=${brand.slug}`}
          className="snap-center shrink-0 group"
        >
          <div className="
            w-[160px] h-[180px]
            flex flex-col items-center justify-center gap-4
            rounded-3xl
            bg-white/5
            border border-white/10
            backdrop-blur-sm
            transition-transform duration-300
            active:scale-95
          ">

            <div className="relative w-20 h-20 flex items-center justify-center p-3 rounded-2xl bg-black/40 group-hover:bg-black transition">
              <Image
                src={brand.logo || "/placeholder.png"}
                alt={brand.name}
                width={80}
                height={80}
                className="object-contain w-full h-full brightness-90 group-hover:brightness-110 transition"
              />
            </div>

            <span className="font-semibold text-gray-200 text-sm px-4 text-center line-clamp-1">
              {brand.name}
            </span>
          </div>
        </Link>
      ))}

      {/* View all */}
      <Link href="/Products" className="snap-center shrink-0">
        <div className="w-[160px] h-[180px] flex flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-red-600 to-red-800 shadow-lg text-white">
          <span className="text-lg font-semibold">View All</span>
          <ChevronRight className="w-6 h-6" />
        </div>
      </Link>
    </div>

    {/* ===== DESKTOP GRID ===== */}
    <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">

      {brands?.map((brand) => (
        <Link
          key={brand._id}
          href={`/Products?brand=${brand.slug}`}
          className="group relative"
        >
          <div className="
            relative h-full
            flex flex-col items-center justify-center p-8
            rounded-[28px]
            bg-white/5
            border border-white/10
            backdrop-blur-sm
            transition-all duration-300
            hover:-translate-y-2
            hover:border-red-500/40
            hover:shadow-[0_20px_40px_-10px_rgba(239,68,68,0.35)]
          ">

            {/* glow hover */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-red-600/0 to-red-600/20 opacity-0 group-hover:opacity-100 transition" />

            <div className="
              relative w-24 h-24 mb-6
              bg-black/40 rounded-2xl
              flex items-center justify-center p-4
              group-hover:scale-110 transition
            ">
              <Image
                src={brand.logo || "/placeholder.png"}
                alt={brand.name}
                width={100}
                height={100}
                className="object-contain w-full h-full brightness-90 group-hover:brightness-110 transition"
              />
            </div>

            <h3 className="relative text-lg font-semibold text-gray-200 group-hover:text-white text-center">
              {brand.name}
            </h3>
          </div>
        </Link>
      ))}

    </div>

    {/* MOBILE CTA */}
    <div className="sm:hidden mt-8 text-center">
      <button
        onClick={() => (window.location.href = "/Products")}
        className="w-full py-3.5 rounded-xl bg-white/10 border border-white/10 text-sm font-semibold text-white active:bg-white/20"
      >
        Explore All Brands
      </button>
    </div>

  </div>
</section>




<BrowseProductsSection products={products} />


    
      {/* Why Choose Vijay Agencies Section - NEW */}
 <WhyChooseUs />


      {/* Cleaning Products Section */}
{/* Cleaning Products */}


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
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}



  


      {/* About Vijay Agencies Section */}
     {/* <AboutSection /> */}

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
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold mb-4 leading-tight animate-slide-up">
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
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Get a Quote</h3>
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
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
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