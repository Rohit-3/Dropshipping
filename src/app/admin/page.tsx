import Link from "next/link";
import RequireAuth from "../components/RequireAuth";

export default function AdminDashboardPage() {
  return (
    <RequireAuth>
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto py-8">
          <div className="bg-white rounded shadow-lg p-8 max-w-2xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Admin Dashboard</h1>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link href="/admin/products" className="btn btn-primary flex-1">Manage Products</Link>
              <Link href="/admin/orders" className="btn btn-primary flex-1">View Orders</Link>
            </div>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
} 