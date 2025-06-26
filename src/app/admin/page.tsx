import Link from "next/link";
import RequireAuth from "../components/RequireAuth";

export default function AdminDashboardPage() {
  return (
    <RequireAuth>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-4">Admin controls and analytics will appear here.</p>
        <Link href="/admin/products">Manage Products</Link> | <Link href="/admin/orders">Manage Orders</Link>
      </main>
    </RequireAuth>
  );
} 