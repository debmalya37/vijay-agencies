"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  LogIn,
  PackageCheck, 
  Menu,
X

} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import Image from "next/image";
import ProductSearch from "@/components/ProductSearch";

/* ---------------- NAV LINKS ---------------- */
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/Products", label: "Shop", isMega: true },
  { href: "/about", label: "About" },
  { href: "/contact-us", label: "Contact" },
];

export default function Navbar(): JSX.Element {

  const { data: session, status } = useSession();
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
const [mobileCatsOpen, setMobileCatsOpen] = useState(false);


  const [userOpen, setUserOpen] = useState(false);
  const userPanelRef = useRef<HTMLDivElement | null>(null);
  const userToggleRef = useRef<HTMLButtonElement | null>(null);

  const userName = session?.user?.name ?? session?.user?.email ?? null;
  const initials =
    userName && typeof userName === "string"
      ? userName.split(" ").map(s => s[0]).slice(0, 2).join("")
      : null;

  /* -------- FETCH REAL CATEGORIES -------- */
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories?hierarchical=true");
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCats(false);
      }
    }
    loadCategories();
  }, []);

  /* -------- CLOSE USER DROPDOWN -------- */
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node | null;
      const insidePanel = userPanelRef.current?.contains(target ?? null);
      const insideToggle = userToggleRef.current?.contains(target ?? null);
      if (!insidePanel && !insideToggle) setUserOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-[100] w-full bg-white shadow-sm overflow-visible">

      {/* TOP STRIP */}
      <div className="bg-[#2e7d32] text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="hidden md:block font-medium">
            Welcome to Vijay Agencies — Trusted Wholesale Supplier for Hotels & Restaurants in Jaipur!
          </span>
          <div className="flex gap-4 text-[11px] md:text-xs opacity-90">
            <Link href="/track">Track Order</Link>
            <Link href="/about">About</Link>
            <Link href="/contact-us">Contact</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="border-b border-gray-200 bg-white overflow-visible">
        
        {/* ROW 1: Logo and Buttons */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 relative">
              <Image src="/X.JPEG.jpg" alt="logo" fill className="object-cover rounded-lg" />
            </div>
            <span className="font-extrabold text-lg text-gray-900 hidden sm:block">
              Vijay Agencies
            </span>
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="flex-1 hidden md:block relative z-[60]">
            <ProductSearch />
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3 shrink-0">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg border border-gray-300"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* CART */}
            <Link href="/cart" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm relative hover:bg-gray-50 transition">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#A3221D] text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER AREA (DESKTOP) */}
            <div className="hidden md:flex items-center relative">
              {status === "loading" ? (
                <div className="px-4 py-2 text-sm text-gray-500">Checking...</div>
              ) : session ? (
                <>
                  <button
                    ref={userToggleRef}
                    onClick={() => setUserOpen(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#CB202D] text-rose-50 flex items-center justify-center font-semibold">
                      {initials ?? <User className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-medium text-gray-800 hidden lg:block">
                      {userName}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition ${userOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div
                    ref={userPanelRef}
                    className={`absolute right-0 top-14 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 transition-all ${
                      userOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold text-gray-900 truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/Profile" className="block px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">My Orders</Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => signIn()} className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 flex items-center gap-2">
                    <LogIn className="w-4 h-4" /> Login
                  </button>
                  <Link href="/auth/signup" className="px-3 py-2 rounded-lg bg-[#A3221D] text-white text-sm hover:bg-[#8c1c17]">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 2: MOBILE SEARCH */}
        {/* Notice this is now OUTSIDE the flex row above, giving it 100% width on mobile without breaking the layout */}
        <div className="md:hidden px-4 pb-3 w-full">
          <ProductSearch isMobileView={true} />
        </div>
      </div>

      {/* NAV BAR */}
      <div className="hidden md:block bg-[#A3221D] text-white shadow-md relative overflow-visible">

        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 text-sm font-semibold py-3 overflow-visible">

          {NAV_LINKS.map((l) => (
            <div key={l.href} className="relative group">

              <Link href={l.href} className="flex items-center gap-1 text-white/90 hover:text-white transition relative py-1">
                {l.label}
                {l.isMega && <ChevronDown className="w-4 h-4 transition group-hover:rotate-180" />}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all group-hover:w-full" />
              </Link>

              {/* REAL MEGA MENU */}
              {l.isMega && (
                <div className="absolute top-full left-0 pt-0 w-[calc(100vw-2rem)] max-w-7xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="bg-white rounded-b-2xl shadow-2xl border-t-4 border-[#EF4F5F] flex overflow-hidden">

                    {/* REAL CATEGORY GRID */}
                    {/* REAL CATEGORY GRID */}
<div className="flex-1 p-10 bg-white">
  {loadingCats ? (
    <p className="text-gray-400 text-sm">Loading categories...</p>
  ) : (

    /* COLUMN LAYOUT INSTEAD OF GRID */
    <div className="columns-2 md:columns-3 lg:columns-4 gap-10">

      {categories.map((cat: any) => {

        const hasChildren = cat.children && cat.children.length > 0;

        return (
          <div
            key={cat._id}
            className="break-inside-avoid mb-8"
          >

            {/* PARENT */}
            <Link href={`/Products?category=${encodeURIComponent(cat.name)}`}>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2 hover:text-[#A3221D] transition">
                {cat.name}
              </h4>
            </Link>

            {/* CHILDREN */}
            {hasChildren && (
              <ul className="space-y-2">
                {cat.children.slice(0, 6).map((sub: any) => (
                  <li key={sub._id}>
                    <Link
                      href={`/Products?category=${encodeURIComponent(sub.name)}`}
                      className="text-[13px] text-gray-500 hover:text-[#EF4F5F] transition block"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

          </div>
        );
      })}

    </div>
  )}
</div>



                    {/* PROMO CARD */}
                    <div className="w-[280px] bg-gray-50 p-6 flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#A3221D] to-[#CB202D] opacity-90" />
                      <div className="relative z-10 text-white text-center">
                        <PackageCheck className="w-10 h-10 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Featured Products</h3>
                        <Link
                          href="/Products"
                          className="inline-flex w-full justify-center py-3 bg-white text-[#A3221D] text-sm font-bold rounded-lg"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          ))}

          <div className="ml-auto hidden lg:flex text-white/80 text-xs">
            Delivery: Jaipur, India
          </div>

        </div>
      </div>

{/* ================= MOBILE DRAWER ================= */}
<div
  className={`fixed inset-0 z-[200] md:hidden transition ${
    mobileOpen ? "visible" : "invisible"
  }`}
>

  {/* ================= OVERLAY ================= */}
  <div
    onClick={() => setMobileOpen(false)}
    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${
      mobileOpen ? "opacity-100" : "opacity-0"
    }`}
  />

  {/* ================= DRAWER ================= */}
  <div
    className={`absolute left-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)] flex flex-col transition-transform duration-300 ${
      mobileOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >

    {/* ===== HEADER ===== */}
    <div className="px-5 py-4 border-b flex items-center justify-between bg-gradient-to-r from-[#A3221D] to-[#EF4F5F] text-white">
      <span className="font-semibold tracking-wide">Menu</span>
      <button
        onClick={() => setMobileOpen(false)}
        className="p-2 rounded-lg hover:bg-white/20 transition"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* ===== USER PANEL ===== */}
    <div className="px-5 py-4 border-b bg-gray-50">

      {session ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#CB202D] text-rose-50 flex items-center justify-center font-semibold">
            {initials ?? <User className="w-4 h-4" />}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-900 leading-tight">{userName}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-600 text-xs font-medium mt-1 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => signIn()}
            className="border border-gray-300 rounded-xl py-2 text-sm font-semibold hover:bg-gray-100 transition"
          >
            Login
          </button>
          <Link
            href="/auth/signup"
            className="bg-[#A3221D] text-white text-center rounded-xl py-2 text-sm font-semibold hover:bg-[#8c1c17] transition"
          >
            Sign up
          </Link>
        </div>
      )}

    </div>

    {/* ===== MENU CONTENT ===== */}
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 text-[15px]">

      {/* HOME */}
      <Link
        href="/"
        onClick={() => setMobileOpen(false)}
        className="block py-2.5 font-semibold text-gray-900 hover:text-[#A3221D]"
      >
        Home
      </Link>

      {/* ===== SHOP ACCORDION ===== */}
      <button
        onClick={() => setMobileCatsOpen(v => !v)}
        className="w-full flex justify-between items-center py-2.5 font-semibold text-gray-900"
      >
        Shop
        <ChevronDown className={`w-4 h-4 transition ${mobileCatsOpen ? "rotate-180" : ""}`} />
      </button>

      {mobileCatsOpen && (
        <div className="mt-1 bg-gray-50 border rounded-xl p-3 space-y-3 max-h-[45vh] overflow-y-auto">

          {loadingCats ? (
            <p className="text-gray-400 text-sm">Loading categories...</p>
          ) : (
            categories.map((cat: any) => (
              <div key={cat._id} className="pb-2 border-b last:border-0">

                {/* PARENT */}
                <Link
                  href={`/Products?category=${encodeURIComponent(cat.name)}`}
                  onClick={() => setMobileOpen(false)}
                  className="font-semibold text-gray-900 block py-1.5 hover:text-[#A3221D]"
                >
                  {cat.name}
                </Link>

                {/* CHILDREN */}
                {cat.children?.length > 0 && (
                  <div className="ml-3 pl-3 border-l mt-1 space-y-1">
                    {cat.children.slice(0,5).map((sub:any)=>(
                      <Link
                        key={sub._id}
                        href={`/Products?category=${encodeURIComponent(sub.name)}`}
                        onClick={() => setMobileOpen(false)}
                        className="block text-sm text-gray-600 hover:text-[#EF4F5F]"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      )}

      {/* OTHER LINKS */}
      <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-2.5 font-semibold text-gray-900 hover:text-[#A3221D]">
        About
      </Link>

      <Link href="/contact-us" onClick={() => setMobileOpen(false)} className="block py-2.5 font-semibold text-gray-900 hover:text-[#A3221D]">
        Contact
      </Link>

      {/* <Link href="/cart" onClick={() => setMobileOpen(false)} className="block py-2.5 font-semibold text-gray-900 hover:text-[#A3221D]">
        Cart ({cartCount})
      </Link> */}

      {session && (
        <>
          <Link href="/Profile" className="block py-2.5 font-semibold text-gray-900 hover:text-[#A3221D]">
            Profile
          </Link>
          <Link href="/orders" className="block py-2.5 font-semibold text-gray-900 hover:text-[#A3221D]">
            Orders
          </Link>
        </>
      )}

    </div>

    {/* ===== FOOTER CTA ===== */}
    <div className="p-4 border-t bg-white">
      <Link
        href="/Products"
        onClick={() => setMobileOpen(false)}
        className="block w-full text-center bg-gradient-to-r from-[#A3221D] to-[#EF4F5F] text-white py-3 rounded-xl font-semibold shadow hover:opacity-90 transition"
      >
        Browse All Products
      </Link>
    </div>

  </div>
</div>


    </header>
  );
}
