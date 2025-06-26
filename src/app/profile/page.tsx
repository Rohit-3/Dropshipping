import Link from "next/link";
import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../providers/AuthProvider";
import { useEffect, useState } from "react";
import { getUserOrders } from "@/lib/supabaseOrders";

function hasSupabaseKeys() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasSupabaseKeys() && user) {
      setLoading(true);
      getUserOrders(user.id)
        .then(setOrders)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <RequireAuth>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <div className="mb-4">Order history and user info will appear here.</div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {loading ? (
          <div>Loading orders...</div>
        ) : (
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order ID</th>
                <th className="text-left p-2">Total</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="p-2">{order.id}</td>
                  <td className="p-2">${order.total?.toFixed(2)}</td>
                  <td className="p-2">{order.status}</td>
                  <td className="p-2">{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link href="/shop">Back to Shop</Link>
      </main>
    </RequireAuth>
  );
} 