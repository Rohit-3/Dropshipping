"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getRelevantImage } from "@/lib/googleAI";

const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books"
];

const featuredProducts = [
  { name: "Wireless Headphones", price: 99.99 },
  { name: "Smart Watch", price: 149.99 },
  { name: "Coffee Maker", price: 59.99 },
  { name: "Bestseller Book", price: 19.99 },
];

export default function HomePage() {
  const [productImages, setProductImages] = useState<string[]>(Array(featuredProducts.length).fill("/no-image.png"));
  const [categoryImages, setCategoryImages] = useState<string[]>(Array(categories.length).fill("/no-image.png"));
  const [heroImage, setHeroImage] = useState<string>("/no-image.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      // Fetch hero image
      getRelevantImage("shopping cart banner").then(setHeroImage);
      // Fetch product images
      Promise.all(featuredProducts.map(p => getRelevantImage(p.name))).then(setProductImages);
      // Fetch category images
      Promise.all(categories.map(c => getRelevantImage(c + " category"))).then(setCategoryImages);
      setLoading(false);
    }
    fetchImages();
  }, []);

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">EasyBuy</h1>
          <div className="flex space-x-4 items-center">
            <input className="border rounded-md px-4 py-2 w-72" placeholder="Search for products..." />
            <button className="bg-blue-700 text-white px-4 py-2 rounded-md">Search</button>
          </div>
          <div className="flex space-x-6 items-center">
            <a href="/cart" className="relative">
              🛒 <span className="text-sm absolute -top-2 -right-3 bg-red-500 text-white rounded-full px-1">3</span>
            </a>
            <a href="/profile">👤 Account</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-purple-100 py-10">
        <div className="container mx-auto text-center flex flex-col items-center">
          {loading ? (
            <div className="w-[600px] h-[240px] flex items-center justify-center bg-gray-200 rounded-xl mb-6 animate-pulse">Loading...</div>
          ) : (
            <Image src={heroImage} alt="EasyBuy Hero Banner" width={600} height={240} className="rounded-xl mb-6 shadow-lg object-cover" />
          )}
          <h2 className="text-4xl font-bold mb-4">Your Ultimate Shopping Destination</h2>
          <p className="text-lg text-gray-600 mb-6">Deals you can&#39;t resist. Delivered to your door.</p>
          <a href="/shop" className="bg-blue-700 text-white px-6 py-3 rounded-full">Shop Now</a>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <div key={cat} className="bg-white shadow rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer flex flex-col items-center">
            {loading ? (
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-2 animate-pulse" />
            ) : (
              <Image src={categoryImages[i]} alt={cat} width={80} height={80} className="rounded-full mb-2 object-cover" />
            )}
            <h3 className="text-xl font-semibold">{cat}</h3>
            <p className="text-gray-500">Explore {cat}</p>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {featuredProducts.map((prod, i) => (
            <div key={i} className="bg-white p-4 shadow rounded-lg hover:shadow-lg transition-shadow">
              {loading ? (
                <div className="h-40 w-full bg-gray-200 rounded mb-4 animate-pulse" />
              ) : (
                <Image src={productImages[i]} alt={prod.name} width={300} height={160} className="h-40 w-full object-cover mb-4 rounded" />
              )}
              <h4 className="font-semibold text-lg mb-2">{prod.name}</h4>
              <p className="text-gray-600">${prod.price.toFixed(2)}</p>
              <button className="mt-2 w-full bg-blue-700 text-white py-2 rounded">Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

      {/* Deals & Promotions */}
      <section className="bg-yellow-50 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold">Flash Sale - Up to 60% Off!</h2>
          <p className="text-gray-700 mt-2 mb-4">Limited time only. Grab your favorites before they&#39;re gone!</p>
          <button className="bg-black text-white px-5 py-2 rounded-md">View Deals</button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-100 py-10">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-2">Join Our Mailing List</h3>
          <p className="text-gray-600 mb-4">Stay updated with new arrivals & exclusive deals</p>
          <input type="email" placeholder="you@example.com" className="px-4 py-2 rounded-md border mr-2" />
          <button className="bg-blue-700 text-white px-5 py-2 rounded-md">Subscribe</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 mt-auto">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-bold text-lg mb-2">EasyBuy</h4>
            <p>Bringing quality and value to your doorstep.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Shop</h4>
            <ul className="space-y-1">
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#">Best Sellers</a></li>
              <li><a href="#">Gift Cards</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-1">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Shipping Info</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4 text-xl">
              <a href="#">🌐</a>
              <a href="#">📘</a>
              <a href="#">📸</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
