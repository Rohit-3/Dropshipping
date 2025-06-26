"use client";
import Link from "next/link";
import RequireAuth from "../../components/RequireAuth";
import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, Order } from "@/lib/supabaseOrders";

// Mock order data
const mockOrders: Order[] = [
  {
    id: "1001",
    user_id: "alice@example.com",
    items: [],
    total: 49.98,
    status: "Pending",
    created_at: "2024-06-26T10:00:00Z",
  },
  {
    id: "1002",
    user_id: "bob@example.com",
    items: [],
    total: 19.99,
    status: "Shipped",
    created_at: "2024-06-25T15:30:00Z",
  },
];

function hasSupabaseKeys() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasSupabaseKeys()) {
      setLoading(true);
      getOrders()
        .then(setOrders)
        .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    setLoading(true);
    setError("");
    try {
      if (hasSupabaseKeys()) {
        await updateOrderStatus(id, status);
        setOrders(await getOrders());
      } else {
        setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Admin: Orders</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order ID</th>
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Total</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="p-2">{order.id}</td>
                  <td className="p-2">{order.user_id || "-"}</td>
                  <td className="p-2">${order.total?.toFixed(2)}</td>
                  <td className="p-2">{order.status}</td>
                  <td className="p-2">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="p-2 flex gap-2">
                    <button className="btn btn-sm btn-outline">View</button>
                    <select
                      className="input input-bordered input-sm"
                      value={order.status}
                      onChange={e => handleStatusUpdate(order.id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link href="/admin" className="text-blue-600 hover:underline">Back to Dashboard</Link>
      </main>
    </RequireAuth>
  );
} 