"use client";
import Link from "next/link";
import { useCart } from "../providers/CartProvider";
import { useAuth } from "../providers/AuthProvider";
import { useState, useEffect } from "react";
import { addOrder, Order } from "@/lib/supabaseOrders";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getShippingRate } from "@/lib/shipping";

function hasStripeKeys() {
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_SECRET_KEY);
}
function hasSupabaseKeys() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

const stripePromise = hasStripeKeys()
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  : null;

function StripeCheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!stripe || !elements) return;
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });
    if (error) setError(error.message || "Payment failed");
    else onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </form>
  );
}

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [shipping, setShipping] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Calculate shipping on mount or cart change
  useEffect(() => {
    getShippingRate(items).then(setShipping);
  }, [items]);

  // Initialize Stripe on mount if keys are present
  useEffect(() => {
    if (hasStripeKeys() && subtotal > 0) {
      const handleStripeInit = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: Math.round(subtotal * 100), currency: "usd" }),
          });
          const data = await res.json();
          if (data.clientSecret) setClientSecret(data.clientSecret);
          else setError(data.error || "Failed to initialize payment");
        } catch (e: unknown) {
          setError(e instanceof Error ? e.message : String(e));
        } finally {
          setLoading(false);
        }
      };
      handleStripeInit();
    }
  }, [subtotal]);

  // Place order after payment
  const handleOrder = async () => {
    setLoading(true);
    setError("");
    try {
      if (hasSupabaseKeys() && user) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (hasSupabaseKeys() && user) {
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