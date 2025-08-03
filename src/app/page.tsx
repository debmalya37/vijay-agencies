// app/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const categories = [
  { name: 'Dish & Kitchen Care', icon: '/icons/dish.svg' },
  { name: 'Laundry & Fabric Care', icon: '/icons/laundry.svg' },
  { name: 'Bathroom & Toilet Care', icon: '/icons/bath.svg' },
  { name: 'Cleaning Accessories', icon: '/icons/cleaning.svg' },
  { name: 'Floor Cleaner', icon: '/icons/floor.svg' },
  { name: 'Hand Washes', icon: '/icons/handwash.svg' },
  { name: 'Air Care', icon: '/icons/air.svg' },
]

const momsFavorites = [
  {
    id: 1,
    image: '/products/mom-1.png',
    title: 'Natural Dishwashing Liquid – Lime – 2 Litres',
    price: 229,
    mrp: 499,
    reviews: 138,
  },
  // …add 3 more
]
const slides = [
  '/banners/banner1.jpg',
  '/banners/banner2.jpg',
  '/banners/banner3.jpg',
]

const megaSaver = [
  {
    id: 1,
    image: '/products/mega-1.png',
    title: 'Natural Top Load Liquid Detergent – Fresh Cotton – 5 Litres',
    price: 875,
    mrp: 1249,
    reviews: 143,
  },
  // …add 3 more
]



export default function Home() {
  const [showMega, setShowMega] = useState(false)
  const [idx, setIdx] = useState(0)

  // auto‑advance every 5s
  useEffect(() => {
    const h = setInterval(() => setIdx(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(h)
  }, [])
  return (
    <div className="font-sans text-gray-800">
      {/* Top Bar */}
      <header className="bg-white shadow">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={120} height={40} />
          </Link>
          <nav className="space-x-6 hidden md:flex">
            <Link href="#" className="hover:text-green-600">Best Sellers</Link>
            <Link href="#" className="hover:text-green-600">Offers</Link>
            <Link href="#" className="hover:text-green-600">New Launches</Link>
            <Link href="#" className="hover:text-green-600">Combos</Link>
            <Link href="#" className="hover:text-green-600">Blog</Link>
            <Link href="#" className="hover:text-green-600">Contact Us</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button title="Search"><Image src="/icons/search.svg" alt="Search" width={24} height={24} /></button>
            <button title="Cart"><Image src="/icons/cart.svg" alt="Cart" width={24} height={24} /></button>
          </div>
        </div>
        {/* Category Scroll */}
        <div className="overflow-x-auto bg-white py-2">
          <div className="container mx-auto flex space-x-6 px-6">
            {categories.map((cat) => (
              <div key={cat.name} className="flex-shrink-0 flex flex-col items-center space-y-1">
                <Image src={cat.icon} alt={cat.name} width={48} height={48} />
                <span className="text-sm">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div key={i} className="min-w-full h-[400px] relative">
            <Image
              src={src}
              alt={`Banner ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setIdx(i => (i - 1 + slides.length) % slides.length)}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white text-black rounded-full p-2"
      >
        ‹
      </button>
      <button
        onClick={() => setIdx(i => (i + 1) % slides.length)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white text-black rounded-full p-2"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setIdx(i)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === idx ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>

      {/* Mom's Favorites */}
      <section className="container mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-6">Mom’s Favorites</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {momsFavorites.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow">
              <Image src={p.image} alt={p.title} width={200} height={200} className="mx-auto" />
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>★★★★★</span>
                <span>({p.reviews} reviews)</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-lg font-bold">₹{p.price}</span>
                <span className="line-through">₹{p.mrp}</span>
                <span className="text-green-600 text-sm">{Math.round(100 - (p.price / p.mrp) * 100)}% off</span>
              </div>
              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Mega Saver Packs */}
      <section className="container mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Mega Saver Packs</h2>
          <button
            onClick={() => setShowMega(!showMega)}
            className="text-green-600 underline"
          >
            View all
          </button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {(showMega ? megaSaver : megaSaver.slice(0, 4)).map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow">
              <Image src={p.image} alt={p.title} width={200} height={200} className="mx-auto" />
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>★★★★★</span>
                <span>({p.reviews} reviews)</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-lg font-bold">₹{p.price}</span>
                <span className="line-through">₹{p.mrp}</span>
                <span className="text-green-600 text-sm">{Math.round(100 - (p.price / p.mrp) * 100)}% off</span>
              </div>
              <button className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
