"use client";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import Link from "next/link";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await login(email, password);
    if (error) setError(error.message);
  };

  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input input-bordered"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input input-bordered"
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <div className="text-red-500 text-sm text-center animate-shake">{error}</div>}
        </form>
        <div className="mt-4 text-center">
          <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </div>
    </main>
  );
} 