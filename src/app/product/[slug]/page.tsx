"use client";
import { mockProducts } from "@/lib/mockProducts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/supabaseProducts";
import { useParams } from "next/navigation";
import { useCart } from "../../providers/CartProvider";

function hasSupabaseKeys() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default function Page() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";
  const [product, setProduct] = useState(mockProducts.find(p => p.slug === slug) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (hasSupabaseKeys()) {
      setLoading(true);
      getProducts()
        .then(products => {
          const found = products.find(p => p.slug === slug);
          setProduct(found || null);
          setSelectedVariant(found?.variants[0] || null);
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return <main className="container mx-auto py-8">Loading...</main>;
  }
  if (error) {
    return <main className="container mx-auto py-8 text-red-500">{error}</main>;
  }
  if (!product) {
    return (
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop" className="btn btn-primary">Back to Shop</Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <main className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full md:w-1/2 h-64 object-cover rounded"
          onError={e => (e.currentTarget.src = "/placeholder.png")}
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-muted-foreground mb-2">{product.category}</p>
          <p className="mb-4">{product.description}</p>
          <p className="text-xl font-semibold mb-4">${product.price.toFixed(2)} {product.currency}</p>
          <div className="mb-4">
            <span className="font-semibold">Variants:</span>
            <select
              className="input input-bordered ml-2"
              value={selectedVariant?.id}
              onChange={e => setSelectedVariant(product.variants.find(v => v.id === e.target.value) || null)}
            >
              {product.variants.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.color} / {variant.size} — Stock: {variant.stock}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <span className="font-semibold">Quantity:</span>
            <input
              type="number"
              min={1}
              max={selectedVariant?.stock || 1}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Math.min(Number(e.target.value), selectedVariant?.stock || 1)))}
              className="input input-bordered w-20"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={!selectedVariant || quantity < 1 || quantity > (selectedVariant?.stock || 1)}
          >
            Add to Cart
          </button>
          {added && <div className="text-green-600 mt-2">Added to cart!</div>}
        </div>
      </div>
      <div className="mt-8">
        <Link href="/shop" className="text-blue-600 hover:underline">Back to Shop</Link>
      </div>
    </main>
  );
} 