"use client";

import Link from "next/link";
import { mockProducts } from "@/lib/mockProducts";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/supabaseProducts";
import Image from "next/image";

function hasSupabaseKeys() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default function ShopPage() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const categories = Array.from(new Set(products.map(p => p.category)));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (hasSupabaseKeys()) {
      setLoading(true);
      getProducts()
        .then(setProducts)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, []);

  const filteredProducts = products.filter(p =>
    (!selectedCategory || p.category === selectedCategory) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-4 md:px-0">
          <h1 className="text-3xl font-bold text-blue-700 mb-2 md:mb-0">EasyBuy</h1>
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            className="input input-bordered w-full md:w-96 mb-2 md:mb-0"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex gap-4 text-sm">
            <Link href="/cart" className="hover:underline">Cart</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>
            <Link href="/admin" className="hover:underline">Admin</Link>
          </div>
        </div>
        <div className="container mx-auto flex gap-2 overflow-x-auto py-2 px-4 md:px-0">
          <button
            className={`px-4 py-2 rounded-full ${!selectedCategory ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full ${selectedCategory === cat ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="container mx-auto py-8">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col hover:shadow-lg transition">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded mb-4"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
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
      </div>
    </main>
  );
} 