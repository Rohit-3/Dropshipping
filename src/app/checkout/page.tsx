"use client";
import { useCart } from "../providers/CartProvider";
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";
import { addOrder, Order } from "@/lib/supabaseOrders";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (user) {
        const order: Order = {
          id: "", // Supabase will auto-generate
          user_id: user.id,
          items,
          total: subtotal,
          status: "Paid",
          created_at: new Date().toISOString(),
        };
        await addOrder(order);
      }
      clearCart();
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Checkout</h1>
        <div className="bg-white rounded shadow-lg p-8 max-w-lg mx-auto animate-fade-in">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input input-bordered"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input input-bordered"
              required
            />
            <input
              type="text"
              placeholder="Shipping Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="input input-bordered"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </button>
            {error && <div className="text-red-500 text-center animate-shake">{error}</div>}
            {success && <div className="text-green-600 text-center animate-fade-in">{success}</div>}
          </form>
        </div>
      </div>
    </main>
  );
} 