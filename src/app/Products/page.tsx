// app/Products/page.tsx
import React, { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-300 rounded-full animate-spin" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      {/* ProductsClient is a client component that uses useSearchParams */}
      <ProductsClient />
    </Suspense>
  );
}
