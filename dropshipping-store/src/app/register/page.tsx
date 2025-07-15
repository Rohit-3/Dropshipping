"use client";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import Link from "next/link";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { error } = await register(email, password);
    if (error) setError(error.message);
    else setSuccess("Registration successful! Check your email for confirmation.");
  };

  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Register</h1>
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
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <div className="text-red-500 text-sm text-center animate-shake">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center animate-fade-in">{success}</div>}
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </div>
    </main>
  );
} 