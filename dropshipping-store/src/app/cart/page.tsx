"use client";
import Link from "next/link";
import { useCart } from "../providers/CartProvider";
import Image from "next/image";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Your Cart</h1>
        {items.length === 0 ? (
          <div className="bg-white rounded shadow-lg p-8 text-center animate-fade-in">
            <p className="text-lg text-gray-500">Your cart is empty.</p>
            <Link href="/shop" className="btn btn-primary mt-4">Go to Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, idx) => (
              <div key={item.product.id + idx} className="bg-white rounded shadow-lg p-6 flex flex-col md:flex-row gap-4 animate-fade-in">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  width={120}
                  height={120}
                  className="w-32 h-32 object-cover rounded"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-700">{item.product.name}</h2>
                    <p className="text-gray-500 mb-2">{item.variant?.color} / {item.variant?.size}</p>
                    <p className="text-lg font-bold">${item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="btn btn-sm btn-outline" onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span className="px-2">{item.quantity}</span>
                    <button className="btn btn-sm btn-outline" onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)} disabled={item.quantity >= item.variant?.stock}>+</button>
                    <button className="btn btn-sm btn-error ml-4" onClick={() => removeFromCart(item.product.id, item.variant.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {items.length > 0 && (
          <div className="bg-white rounded shadow-lg p-6 mt-8 max-w-md mx-auto animate-fade-in">
            <h3 className="text-xl font-bold mb-2">Total: ${subtotal.toFixed(2)}</h3>
            <Link href="/checkout" className="btn btn-primary w-full">Proceed to Checkout</Link>
          </div>
        )}
      </div>
    </main>
  );
} 