import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-5xl font-extrabold mb-4">Welcome to Your Dropshipping Store!</h1>
      <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
        Discover trending products, seamless shopping, and fast shipping—all in one place.
      </p>
      <a href="/shop" className="btn btn-primary text-lg px-8 py-3 rounded-full shadow-lg transition hover:scale-105">
        Start Shopping
      </a>
      <div className="mt-12 text-gray-500 dark:text-gray-400">
        <p>Browse our curated collection and enjoy exclusive deals every day.</p>
        <p className="mt-2">Sign up or log in to manage your orders and profile.</p>
      </div>
    </main>
  );
}
