"use client";
import { useState, useEffect } from "react";
import { Product, Variant } from "@/lib/mockProducts";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initial?: Product | null;
}

export default function ProductFormModal({ open, onClose, onSave, initial }: ProductFormModalProps) {
  const [form, setForm] = useState<Product>(
    initial || {
      id: "",
      name: "",
      slug: "",
      description: "",
      images: [""],
      price: 0,
      currency: "USD",
      inStock: true,
      category: "",
      variants: [],
      created_at: new Date().toISOString(),
    }
  );
  const [variant, setVariant] = useState<Variant>({ id: "", color: "", size: "", stock: 0 });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariant(v => ({ ...v, [e.target.name]: e.target.value }));
  };

  const addVariant = () => {
    if (variant.color && variant.size && variant.stock) {
      setForm(f => ({ ...f, variants: [...f.variants, { ...variant, id: Math.random().toString(36).slice(2) }] }));
      setVariant({ id: "", color: "", size: "", stock: 0 });
    }
  };

  const removeVariant = (id: string) => {
    setForm(f => ({ ...f, variants: f.variants.filter(v => v.id !== id) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-background rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 btn btn-sm btn-outline" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold mb-4">{initial ? "Edit" : "Add"} Product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="input input-bordered" required />
          <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug" className="input input-bordered" required />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input input-bordered" required />
          <input name="images" value={form.images[0]} onChange={e => setForm(f => ({ ...f, images: [e.target.value] }))} placeholder="Image URL" className="input input-bordered" required />
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="input input-bordered" required />
          <input name="currency" value={form.currency} onChange={handleChange} placeholder="Currency" className="input input-bordered" required />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input input-bordered" required />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))} />
            In Stock
          </label>
          <div className="border-t pt-2 mt-2">
            <div className="font-semibold mb-2">Variants</div>
            <div className="flex gap-2 mb-2">
              <input name="color" value={variant.color} onChange={handleVariantChange} placeholder="Color" className="input input-bordered" />
              <input name="size" value={variant.size} onChange={handleVariantChange} placeholder="Size" className="input input-bordered" />
              <input name="stock" type="number" value={variant.stock} onChange={e => setVariant(v => ({ ...v, stock: Number(e.target.value) }))} placeholder="Stock" className="input input-bordered w-20" />
              <button type="button" className="btn btn-sm btn-primary" onClick={addVariant}>Add</button>
            </div>
            <ul>
              {form.variants.map(v => (
                <li key={v.id} className="flex gap-2 items-center mb-1">
                  {v.color} / {v.size} — Stock: {v.stock}
                  <button type="button" className="btn btn-xs btn-destructive" onClick={() => removeVariant(v.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <button type="submit" className="btn btn-primary mt-2">Save</button>
        </form>
      </div>
    </div>
  );
} 