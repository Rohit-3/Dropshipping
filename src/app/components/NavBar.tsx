"use client";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/profile", label: "Profile" },
  { href: "/admin", label: "Admin" },
];

export default function NavBar() {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-2">
        <div className="flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
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