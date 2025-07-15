"use client";
import Link from "next/link";
import RequireAuth from "../../components/RequireAuth";
import { mockProducts, Product } from "@/lib/mockProducts";
import { useState, useEffect } from "react";
import ProductFormModal from "./ProductFormModal";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/supabaseProducts";
import Image from "next/image";

function hasSupabaseKeys() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasSupabaseKeys()) {
      setLoading(true);
      getProducts()
        .then(setProducts)
        .catch(e => setError(e instanceof Error ? e.message : String(e)))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setModalOpen(true);
  };
  const handleSave = async (product: Product) => {
    setLoading(true);
    setError("");
    try {
      if (hasSupabaseKeys()) {
        if (editProduct) {
          await updateProduct(product);
        } else {
          await addProduct(product);
        }
        const updated = await getProducts();
        setProducts(updated);
      } else {
        if (editProduct) {
          setProducts(ps => ps.map(p => (p.id === product.id ? product : p)));
        } else {
          setProducts(ps => [...ps, { ...product, id: Math.random().toString(36).slice(2) }]);
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      if (hasSupabaseKeys()) {
        await deleteProduct(id);
        setProducts(await getProducts());
      } else {
        setProducts(ps => ps.filter(p => p.id !== id));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8 text-blue-700">Admin: Products</h1>
          {/* TODO: Inventory Sync feature will be restored here in the future */}
          <div className="mb-4 text-yellow-600 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded animate-fade-in">
            <strong>Inventory Sync is temporarily unavailable.</strong> This feature will be restored soon.
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded shadow-lg p-6 flex flex-col gap-4 animate-fade-in">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover rounded"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <h2 className="text-xl font-semibold text-blue-700">{product.name}</h2>
                    <p className="text-gray-500 mb-2">{product.category}</p>
                    <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="btn btn-sm btn-primary" onClick={() => handleEdit(product)}>Edit</button>
                      <button className="btn btn-sm btn-error" onClick={() => handleDelete(product.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8">
            <ProductFormModal
              open={modalOpen}
              onClose={() => { setModalOpen(false); setEditProduct(null); }}
              onSave={handleSave}
              initial={editProduct}
            />
            <button className="btn btn-primary mt-4" onClick={() => { setModalOpen(true); setEditProduct(null); }}>
              Add Product
            </button>
          </div>
          <div className="mt-8">
            <Link href="/admin" className="text-blue-600 hover:underline">Back to Dashboard</Link>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
} 