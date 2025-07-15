"use client";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";

export default function NavBar() {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="bg-white shadow sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 md:px-0">
        <Link href="/" className="text-2xl font-bold text-blue-700">EasyBuy</Link>
        <div className="flex gap-6 text-base">
          <Link href="/shop" className="hover:text-blue-700">Shop</Link>
          <Link href="/cart" className="hover:text-blue-700">Cart</Link>
          <Link href="/profile" className="hover:text-blue-700">Profile</Link>
          <Link href="/admin" className="hover:text-blue-700">Admin</Link>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <>
              <span>{user.email}</span>
              <button
                onClick={logout}
                className="btn btn-sm btn-outline ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 