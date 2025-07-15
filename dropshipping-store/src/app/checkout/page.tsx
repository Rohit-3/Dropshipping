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
    <main className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Checkout Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in border border-gray-100">
          <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Checkout</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input input-bordered px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input input-bordered px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              required
            />
            <input
              type="text"
              placeholder="Shipping Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="input input-bordered px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              required
            />
            <button type="submit" className="btn btn-primary py-3 rounded-lg text-lg font-semibold mt-2" disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </button>
            {error && <div className="text-red-500 text-center animate-shake">{error}</div>}
            {success && <div className="text-green-600 text-center animate-fade-in">Order placed successfully!</div>}
          </form>
        </div>
        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Order Summary</h2>
          <div className="divide-y divide-gray-200">
            {items.length === 0 ? (
              <div className="text-gray-400 text-center py-8">Your cart is empty.</div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-semibold text-gray-800">{item.product.name}</div>
                    <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-blue-700">${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-between pt-6 text-lg font-bold">
            <span>Subtotal</span>
            <span className="text-blue-700">${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
} 