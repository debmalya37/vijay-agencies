// app/products/[id]/page.tsx
import React from "react";
import ProductDetailClient from "@/components/ProductDetailClient";

type Params = { id: string };

const getBaseUrl = () => {
  // Use an env var in production; fallback to localhost for local dev
  return process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:3000`;
};

async function fetchProductById(id: string) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) {
    // throw so we can show notFound or fallback
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = params;
  let product = null;
  try {
    product = await fetchProductById(id);
  } catch (err) {
    // Render a simple fallback UI — you can use notFound() from next/navigation if you prefer.
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Product not found</h2>
          <p className="text-gray-600 mt-2">We couldn&apos;t find the product you&apos;re looking for.</p>
        </div>
      </div>
    );
  }

  // Pass product to the client component (serializable)
  return <ProductDetailClient product={product} />;
}
