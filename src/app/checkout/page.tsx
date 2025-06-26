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

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      {success ? (
        <div className="mb-6 text-green-600 text-lg">Order placed! Thank you for your purchase.</div>
      ) : items.length === 0 ? (
        <div className="mb-4">Your cart is empty. <Link href="/shop" className="text-blue-600 hover:underline">Shop now</Link></div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <ul className="mb-2">
              {items.map(item => (
                <li key={item.product.id + item.variant.id}>
                  {item.product.name} ({item.variant.color}/{item.variant.size}) x {item.quantity} — ${(item.product.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="text-lg">Subtotal: ${subtotal.toFixed(2)}</div>
            <div className="text-lg">Shipping: {shipping === null ? "..." : `$${shipping.toFixed(2)}`}</div>
            <div className="text-lg font-semibold">Total: {shipping === null ? "..." : `$${(subtotal + shipping).toFixed(2)}`}</div>
          </div>
          <div className="mb-6 p-4 border rounded bg-card">
            <h2 className="text-lg font-semibold mb-2">Payment</h2>
            {hasStripeKeys() ? (
              clientSecret && stripePromise ? (
                <Elements options={{ clientSecret }} stripe={stripePromise}>
                  <StripeCheckoutForm onSuccess={handleOrder} />
                </Elements>
              ) : (
                <div>Loading payment form...</div>
              )
            ) : (
              <>
                <div className="mb-2">Stripe payment form will go here.</div>
                <button className="btn btn-primary" onClick={handleOrder} disabled={loading}>
                  {loading ? "Placing Order..." : "Place Order (Mock)"}
                </button>
              </>
            )}
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
          <button className="btn btn-outline" onClick={clearCart}>Cancel & Clear Cart</button>
        </>
      )}
      <div className="mt-8">
        <Link href="/cart" className="text-blue-600 hover:underline">Back to Cart</Link>
      </div>
    </main>
  );
} 