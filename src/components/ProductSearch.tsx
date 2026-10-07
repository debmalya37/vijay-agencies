"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowLeft, X, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface Suggestion {
  _id: string;
  title: string;
  slug: string;
  images?: string[];
}

interface ProductSearchProps {
  isMobileView?: boolean;
}

export default function ProductSearch({ isMobileView = false }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Desktop specific state
  const [rect, setRect] = useState<DOMRect | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  
  // Mobile specific state
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  
  const router = useRouter();

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

  /* ------------------ Desktop Track Position ------------------ */
  useEffect(() => {
    if (isMobileView) return;

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
  }, [isMobileView]);

  /* ------------------ Desktop Outside Click Close ------------------ */
  useEffect(() => {
    if (isMobileView) return;

    const handler = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) {
        setResults([]);
        setQuery(""); // Optional: clear query on close
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobileView]);

  /* ------------------ Mobile Scroll Lock ------------------ */
  useEffect(() => {
    if (isMobileModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileModalOpen]);


  /* ================== MOBILE UI ================== */
  if (isMobileView) {
    return (
      <>
        {/* Fake Search Bar to Trigger Modal */}
        <div
          onClick={() => setIsMobileModalOpen(true)}
          className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 shadow-sm cursor-text"
        >
          <Search className="w-5 h-5 text-gray-500" />
          <span className="text-gray-500 text-[15px]">Search...</span>
        </div>

        {/* Full Screen Mobile Modal */}
        {isMobileModalOpen && typeof window !== "undefined" && createPortal(
          <div className="fixed inset-0 bg-white z-[999999] flex flex-col animate-in slide-in-from-bottom-2 duration-200">
            
            {/* Header / Input Area */}
            <div className="flex items-center gap-3 px-4 py-4 border-b bg-white shadow-sm">
              <button 
                onClick={() => {
                  setIsMobileModalOpen(false);
                  setQuery("");
                }}
                className="p-1"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              
              <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent outline-none text-gray-900 text-[16px]" // 16px prevents iOS zoom
                />
                {query && (
                  <button onClick={() => setQuery("")}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {loading ? (
                <div className="flex justify-center items-center p-8 text-gray-500 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Searching...
                </div>
              ) : results.length > 0 ? (
                <div className="bg-white border-b">
                  {results.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setIsMobileModalOpen(false);
                        setQuery("");
                        setResults([]);
                        router.push(`/Products/${item._id}`);
                      }}
                      className="flex items-center gap-4 px-4 py-4 border-b last:border-none active:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={item.images?.[0] || "/placeholder.png"}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <span className="text-[15px] font-medium text-gray-800 line-clamp-2">
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="p-8 text-center text-gray-500">
                  No products found for &quot;{query}&quot;
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  Type at least 2 characters to search...
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  /* ================== DESKTOP UI ================== */
  return (
    <>
      <div ref={boxRef} className="relative w-full max-w-xl mx-auto">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-[#A3221D] focus-within:ring-1 focus-within:ring-[#A3221D] transition-all">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => boxRef.current && setRect(boxRef.current.getBoundingClientRect())}
            placeholder="Search products..."
            className="w-full outline-none text-gray-800 bg-transparent text-[15px]"
          />
          {loading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
        </div>
      </div>

      {rect && query.length >= 2 && typeof window !== "undefined" && createPortal(
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: rect.bottom + 8,
            left: rect.left,
            width: rect.width,
            maxHeight: "50vh",
            overflowY: "auto",
            zIndex: 999999,
          }}
          className="bg-white rounded-xl border shadow-2xl overflow-hidden flex flex-col"
        >
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  setResults([]);
                  setQuery("");
                  router.push(`/Products/${item._id}`);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer border-b last:border-none"
              >
                <img
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.title}
                  className="w-10 h-10 rounded-lg object-cover border"
                />
                <span className="text-sm font-medium text-gray-800">
                  {item.title}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">No products found.</div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}