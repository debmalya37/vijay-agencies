"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface Suggestion {
  _id: string;
  title: string;
  slug: string;
  images?: string[];
}

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  /* ------------------ Fetch Suggestions ------------------ */
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/products/search?q=${query}`);
        const data = await res.json();
        if (data.success) setResults(data.products);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /* ------------------ Track Position ------------------ */
  useEffect(() => {
    const updatePosition = () => {
      if (boxRef.current) {
        setRect(boxRef.current.getBoundingClientRect());
      }
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  /* ------------------ Outside Click Close ------------------ */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* Search Box */}
      <div ref={boxRef} className="relative w-full max-w-xl mx-auto">
        <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-3 shadow-sm">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => boxRef.current && setRect(boxRef.current.getBoundingClientRect())}
            placeholder="Search products..."
            className="w-full outline-none text-gray-800 bg-transparent"
          />
        </div>
      </div>

      {/* Suggestions */}
    
        {rect &&
  results.length > 0 &&
  typeof window !== "undefined" &&
  createPortal(
    <div
      onMouseDown={(e) => e.stopPropagation()}   // <— IMPORTANT FIX HERE
      style={{
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 999999,
      }}
      className="bg-white rounded-xl border shadow-2xl overflow-hidden"
    >
      {results.map((item) => (
  <div
    key={item._id}
    onClick={() => {
      setResults([]);
      router.push(`/Products/${item._id}`);
    }}
    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
  >
    <img
      src={item.images?.[0] || "/placeholder.png"}
      alt={item.title}
      width={40}
      height={40}
      className="rounded-lg object-cover"
    />
    <span className="text-sm font-medium text-gray-800">
      {item.title}
    </span>
  </div>
))}
    </div>,
    document.body
  )}


      {/* Loading */}
      {rect &&
        loading &&
        createPortal(
  <div
    onMouseDown={(e) => e.stopPropagation()}   // <— Fix
    style={{
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 999999,
    }}
    className="bg-white rounded-xl border shadow-2xl overflow-hidden"
  >
    {results.map((item) => (
  <div
    key={item._id}
    onClick={() => {
      setResults([]);
      router.push(`/Products/${item._id}`);
    }}
    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
  >
    <img
      src={item.images?.[0] || "/placeholder.png"}
      alt={item.title}
      width={40}
      height={40}
      className="rounded-lg object-cover"
    />
    <span className="text-sm font-medium text-gray-800">
      {item.title}
    </span>
  </div>
))}
  </div>,
  document.body
)
}
    </>
  );
}
