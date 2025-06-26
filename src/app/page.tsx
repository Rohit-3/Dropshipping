import Image from "next/image";

const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books"
];

const featuredProducts = [
  { name: "Wireless Headphones", price: 99.99, image: "https://img.freepik.com/free-photo/modern-wireless-headphones-isolated-white-background_93675-128651.jpg?w=740&t=st=1719440000~exp=1719440600~hmac=1b2e3e4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f" },
  { name: "Smart Watch", price: 149.99, image: "https://img.freepik.com/free-photo/smartwatch-white-background_53876-96809.jpg?w=740&t=st=1719440000~exp=1719440600~hmac=2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b" },
  { name: "Coffee Maker", price: 59.99, image: "https://img.freepik.com/free-photo/coffee-machine-isolated-white-background_93675-133093.jpg?w=740&t=st=1719440000~exp=1719440600~hmac=3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d" },
  { name: "Bestseller Book", price: 19.99, image: "https://img.freepik.com/free-photo/stack-books-isolated-white-background_93675-133062.jpg?w=740&t=st=1719440000~exp=1719440600~hmac=4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e" },
];

export default function HomePage() {
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
          <Image src="https://img.freepik.com/free-photo/shopping-cart-full-groceries-isolated-white-background_93675-133093.jpg?w=1060&t=st=1719440000~exp=1719440600~hmac=5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f" alt="EasyBuy Hero Banner" width={600} height={240} className="rounded-xl mb-6 shadow-lg object-cover" />
          <h2 className="text-4xl font-bold mb-4">Your Ultimate Shopping Destination</h2>
          <p className="text-lg text-gray-600 mb-6">Deals you can't resist. Delivered to your door.</p>
          <a href="/shop" className="bg-blue-700 text-white px-6 py-3 rounded-full">Shop Now</a>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat} className="bg-white shadow rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
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
              <Image src={prod.image} alt={prod.name} width={300} height={160} className="h-40 w-full object-cover mb-4 rounded" />
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
          <p className="text-gray-700 mt-2 mb-4">Limited time only. Grab your favorites before they're gone!</p>
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
