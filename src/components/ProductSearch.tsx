"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

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
  const boxRef = useRef<HTMLDivElement>(null);

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
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
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
    <div ref={boxRef} className="relative w-full max-w-xl mx-auto">
      {/* Search Input */}
      <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-3 shadow-sm">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full outline-none text-gray-800"
        />
      </div>

      {/* Suggestions */}
      {results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border shadow-lg z-50 overflow-hidden">
          {results.map((item) => (
            <Link
              href={`/Products/${item._id}`}
              key={item._id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
              onClick={() => setResults([])}
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
            </Link>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute mt-2 w-full bg-white text-center py-3 text-sm text-gray-500 rounded-xl shadow">
          Searching...
        </div>
      )}
    </div>
  );
}
