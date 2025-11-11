"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

export default function BrandShowcase() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(console.error);
  }, []);

  return (
    <section className="px-4 md:px-12 py-10 bg-white shadow-md border-spacing-2 rounded-xl mt-10">
      <div className="text-center mb-10">
        <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium font-sans">
          Popular Brands
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-4 font-serif ">
          Shop by Brand
        </h2>
      </div>

      <div className="max-w-6xl mx-auto">
        <div
          className="
            flex gap-6 overflow-x-auto pb-4 
            sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible
            scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent
          "
        >
          {brands.map((brand) => (
            <Link
              href={`/Products?brand=${brand.slug}`}
              key={brand._id}
              className="min-w-[180px] sm:min-w-0 bg-blue-50 rounded-xl p-6 shadow-sm flex flex-col items-center justify-between hover:shadow-md transition text-center"
            >
              <Image
                src={brand.logo || "/placeholder.png"}
                alt={brand.name}
                width={90}
                height={90}
                className="object-contain rounded-lg mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {brand.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
