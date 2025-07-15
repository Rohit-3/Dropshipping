"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="text-center py-8">Loading...</div>;
  return <>{children}</>;
} 