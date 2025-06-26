"use client";

import Link from "next/link";
import { mockProducts } from "@/lib/mockProducts";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/supabaseProducts";

function hasSupabaseKeys() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default function ShopPage() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasSupabaseKeys()) {
      setLoading(true);
      getProducts()
        .then(setProducts)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Shop</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 bg-card shadow-sm flex flex-col">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
                onError={e => (e.currentTarget.src = "/placeholder.png")}
              />
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-muted-foreground mb-2">{product.category}</p>
              <p className="mb-4">${product.price.toFixed(2)} {product.currency}</p>
              <Link
                href={`/product/${product.slug}`}
                className="btn btn-primary mt-auto"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 