"use client";
import Link from "next/link";
import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../providers/AuthProvider";
import { useEffect, useState } from "react";
import { getUserOrders, Order } from "@/lib/supabaseOrders";

function hasSupabaseKeys() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default function ProfilePage() {
  const { user, handleLogout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
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
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto py-8">
          <div className="bg-white rounded shadow-lg p-8 max-w-lg mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Profile</h1>
            {error && <div className="text-red-500 text-center animate-shake mb-4">{error}</div>}
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{user.email}</div>
                    <div className="text-gray-500">User ID: {user.id}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <button className="btn btn-outline btn-error" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center">Not logged in.</div>
            )}
          </div>
          <div className="mt-8 text-lg text-gray-600">Order history and user info will appear here.</div>
          {loading ? (
            <div>Loading orders...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full mb-6 bg-white rounded shadow">
                <thead>
                  <tr className="border-b bg-blue-50">
                    <th className="text-left p-2">Order ID</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b hover:bg-blue-50 transition">
                      <td className="p-2">{order.id}</td>
                      <td className="p-2">${order.total?.toFixed(2)}</td>
                      <td className="p-2">{order.status}</td>
                      <td className="p-2">{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Link href="/shop" className="text-blue-600 hover:underline">Back to Shop</Link>
        </div>
      </main>
    </RequireAuth>
  );
} 