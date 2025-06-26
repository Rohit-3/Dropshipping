"use client";
import Link from "next/link";
import RequireAuth from "../../components/RequireAuth";
import { mockProducts, Product } from "@/lib/mockProducts";
import { useState, useEffect } from "react";
import ProductFormModal from "./ProductFormModal";
import { getProducts, addProduct, updateProduct, deleteProduct as deleteProductApi } from "@/lib/supabaseProducts";
import InventorySync from "./InventorySync";

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
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };
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
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      if (hasSupabaseKeys()) {
        await deleteProductApi(id);
        setProducts(await getProducts());
      } else {
        setProducts(ps => ps.filter(p => p.id !== id));
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInventorySync = async (updates: { id: string; stock: number }[]) => {
    setLoading(true);
    setError("");
    try {
      if (hasSupabaseKeys()) {
        for (const update of updates) {
          const product = products.find(p => p.id === update.id);
          if (product) {
            await updateProduct({ ...product, variants: product.variants.map(v => ({ ...v, stock: update.stock })) });
          }
        }
        setProducts(await getProducts());
      } else {
        setProducts(ps =>
          ps.map(p =>
            updates.some(u => u.id === p.id)
              ? { ...p, variants: p.variants.map(v => ({ ...v, stock: updates.find(u => u.id === p.id)?.stock || v.stock })) }
              : p
          )
        );
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Admin: Products</h1>
        <InventorySync onSync={handleInventorySync} />
        <div className="mb-4 flex justify-end">
          <button className="btn btn-primary" onClick={handleAdd}>Add Product</button>
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">In Stock</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2">${product.price.toFixed(2)}</td>
                  <td className="p-2">{product.inStock ? "Yes" : "No"}</td>
                  <td className="p-2 flex gap-2">
                    <button className="btn btn-sm btn-outline" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="btn btn-sm btn-destructive" onClick={() => handleDelete(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link href="/admin" className="text-blue-600 hover:underline">Back to Dashboard</Link>
        <ProductFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initial={editProduct}
        />
      </main>
    </RequireAuth>
  );
} 