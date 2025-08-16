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

// Mock data for products
const featuredProducts = [
  {
    id: '1',
    title: 'Organic Green Tea Collection',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300',
    rating: 4.5,
    reviews: 128,
    category: 'Beverages'
  },
  {
    id: '2',
    title: 'Premium Skincare Set',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300',
    rating: 4.8,
    reviews: 95,
    category: 'Beauty'
  },
  {
    id: '3',
    title: 'Natural Body Care Kit',
    price: 899,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300',
    rating: 4.6,
    reviews: 203,
    category: 'Personal Care'
  }
];

const categories = [
  {
    name: 'Skincare',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200',
    count: '150+ Products'
  },
  {
    name: 'Haircare',
    image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=200',
    count: '80+ Products'
  },
  {
    name: 'Body Care',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200',
    count: '120+ Products'
  },
  {
    name: 'Wellness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200',
    count: '90+ Products'
  }
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
  const [products, setProducts] = useState(featuredProducts);

  // Function to fetch products from API (placeholder)
  const fetchProducts = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/products?featured=true');
      // const data = await response.json();
      // setProducts(data);
      
      // For now, using mock data
      setProducts(featuredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const heroSlides = [
    {
      title: "Premium Natural Products",
      subtitle: "For Your Business Success",
      description: "Discover our extensive range of high-quality natural products perfect for B2B partnerships",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
      cta: "Explore Catalog"
    },
    {
      title: "Bulk Orders Made Easy",
      subtitle: "Competitive Wholesale Prices",
      description: "Get the best deals on bulk orders with our streamlined procurement process",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      cta: "Get Quote"
    },
    {
      title: "Quality Guaranteed",
      subtitle: "Certified & Trusted",
      description: "All our products meet international quality standards with full certification",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800",
      cta: "Learn More"
    }
  ];

  // Categories data
  const categories = [
    { name: "Dish & Kitchen Care", color: "bg-green-100", icon: "🧽" },
    { name: "Laundry & Fabric Care", color: "bg-orange-100", icon: "👕" },
    { name: "Bathroom & Toilet Care", color: "bg-purple-100", icon: "🚿" },
    { name: "Cleaning Accessories", color: "bg-red-100", icon: "🧹" },
    { name: "Floor Cleaner", color: "bg-orange-100", icon: "🏠" },
    { name: "Hand Washes", color: "bg-green-100", icon: "🧼" },
    { name: "Air Care", color: "bg-orange-100", icon: "🌸" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
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
              <div className="text-2xl font-bold text-green-600">Vijay Agency</div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-green-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-green-600">Products</a>
              <a href="#" className="text-gray-700 hover:text-green-600">Categories</a>
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
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <User className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
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
              <a href="#" className="block px-3 py-2 text-gray-700">Home</a>
              <a href="#" className="block px-3 py-2 text-gray-700">Products</a>
              <a href="#" className="block px-3 py-2 text-gray-700">Categories</a>
              <a href="#" className="block px-3 py-2 text-gray-700">About</a>
              <a href="#" className="block px-3 py-2 text-gray-700">Contact</a>
            </div>
          </div>
        )}
      </header>

      {/* Shop by Category Section */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center min-w-0 flex-shrink-0 mx-4">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-2xl mb-2 hover:shadow-lg transition-shadow cursor-pointer`}>
                  {category.icon}
                </div>
                <span className="text-sm text-gray-700 text-center leading-tight max-w-20">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl px-6">
                    <h2 className="text-lg md:text-xl font-semibold mb-2 text-green-300">{slide.subtitle}</h2>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-lg md:text-xl mb-8 opacity-90">{slide.description}</p>
                    <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2">
                      {slide.cta}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
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
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our most popular products trusted by businesses worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
                
                <div className="p-6">
                  <div className="text-sm text-green-600 font-medium mb-2">{product.category}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our wide range of product categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="relative overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 border-4 border-green-100 group-hover:border-green-200 transition-colors">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </div>
            ))}
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
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
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

      {/* Newsletter */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest products, offers, and industry insights
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
            </div>
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
              Subscribe
            </button>
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
                  <span className="text-gray-300">info@Vijay Agency.com</span>
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
              © 2024 Vijay Agency. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}