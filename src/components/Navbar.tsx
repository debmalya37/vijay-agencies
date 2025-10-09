// app/components/Navbar.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/Products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact-us", label: "Contact" },
];

export default function Navbar(): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const { data: session, status } = useSession();
  const { getItemCount } = useCart();
  const cartCount = getItemCount();
  const userName = session?.user?.name ?? session?.user?.email ?? null;
  const initials =
    userName && typeof userName === "string"
      ? userName.split(" ").map((s) => s[0]).slice(0, 2).join("")
      : null;

  // refs
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const userPanelRef = useRef<HTMLDivElement | null>(null);
  const userToggleRef = useRef<HTMLButtonElement | null>(null);

  // Close menus on outside click or Escape.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node | null;

      // --- mobile panel close logic ---
      if (mobileOpen) {
        const clickedInsidePanel = mobilePanelRef.current?.contains(target ?? null);
        const clickedToggle = mobileToggleRef.current?.contains(target ?? null);
        if (!clickedInsidePanel && !clickedToggle) {
          setMobileOpen(false);
        }
      }

      // --- user dropdown close logic ---
      if (userOpen) {
        const clickedInsideUser = userPanelRef.current?.contains(target ?? null);
        const clickedUserToggle = userToggleRef.current?.contains(target ?? null);
        if (!clickedInsideUser && !clickedUserToggle) {
          setUserOpen(false);
        }
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setUserOpen(false);
      }
    }

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, userOpen]);

  // small helper to navigate & close menus (keeps mobile UX tidy)
  const onNavigate = () => {
    setMobileOpen(false);
    setUserOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* promo bar */}
      {/* promo bar */}
<div className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-xs py-2 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    <div
      className="flex gap-3 whitespace-nowrap text-[12px] animate-marquee md:animate-marquee md:justify-evenly md:repeat-infinite"
    >
      <span>✓ Timely Delivery</span>
      <span>✓ Quality Product</span>
      <span>✓ COD Available</span>
      <span>✓ 4-5 day delivery</span>
    </div>
  </div>
</div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* left: logo */}
          <div className="flex items-center gap-4">
            <Link href="/" onClick={onNavigate} className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
    <Image
      src="/X.JPEG.jpg"   // ✅ path relative to /public
      alt="Vijay Agencies Logo"
      fill                // fills the div
      className="object-cover rounded-full"
      priority            // loads faster
    />
  </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-gray-900">Vijay Agencies</div>
                <div className="text-xs text-gray-500">Quality Products • Trusted</div>
              </div>
            </Link>
          </div>

          {/* center: nav links (desktop / tablet) */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onNavigate}
                className="text-gray-700 hover:text-green-600 px-2 py-1 rounded-md text-sm transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* right actions */}
          <div className="flex items-center gap-3">
            {/* cart */}
            <Link
              href="/cart"
              onClick={onNavigate}
              className="relative p-2 rounded-md hover:bg-gray-50 transition"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* desktop user area */}
            <div
              className="hidden md:flex items-center relative"
              aria-haspopup="true"
            >
              {status === "loading" ? (
                <div className="px-3 py-1 rounded bg-gray-100 text-gray-500 text-sm">Checking...</div>
              ) : session ? (
                <>
                  <button
                    ref={userToggleRef}
                    onClick={() => setUserOpen((v) => !v)}
                    aria-expanded={userOpen}
                    aria-label="Open account menu"
                    className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
                      {initials ?? <User className="w-4 h-4" />}
                    </div>
                    <div className="text-sm text-gray-800">
                      {userName ? (userName.length > 18 ? userName.slice(0, 18) + "…" : userName) : "Account"}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* dropdown */}
                  <div
                    ref={userPanelRef}
                    className={`absolute right-0 top-14 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-40 transform transition-all ${
                      userOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
                    role="menu"
                    aria-hidden={!userOpen}
                  >
                    <Link href="/Profile" onClick={onNavigate} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                    <Link href="/orders" onClick={onNavigate} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                    {/* <Link href="/dashboard" onClick={onNavigate} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link> */}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => signIn()}
                    className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" /> Login
                  </button>
                  <Link href="/auth/signup" className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* mobile toggle */}
            <div className="md:hidden flex items-center">
              <button
                ref={mobileToggleRef}
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-label="Toggle menu"
                className="p-2 rounded-md hover:bg-gray-100 transition"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* mobile panel */}
      <div
        ref={mobilePanelRef}
        className={`md:hidden bg-white border-t border-gray-200 transform origin-top transition-all ${
          mobileOpen ? "max-h-[100vh] opacity-100 scale-100" : "max-h-0 opacity-0 scale-[0.98] pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="px-4 py-4 space-y-3">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onNavigate}
              className="block px-3 py-3 rounded-md text-gray-700 hover:bg-gray-50 text-base font-medium"
            >
              {l.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-gray-100">
            {session ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">
                    {initials ?? <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{userName}</div>
                    <div className="text-xs text-gray-500">{session.user?.email}</div>
                  </div>
                </div>

                <Link href="/orders" onClick={onNavigate} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">My Orders</Link>
                <Link href="/Profile" onClick={onNavigate} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">Profile</Link>

                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => { signIn(); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm border border-gray-200 flex items-center gap-2 justify-center"
                >
                  <LogIn className="w-4 h-4" /> Login
                </button>
                <Link
                  href="/auth/signup"
                  onClick={onNavigate}
                  className="block px-3 py-2 rounded-md bg-green-600 text-white text-center"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
