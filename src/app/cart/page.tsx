"use client";
import Link from "next/link";
import { useCart } from "../providers/CartProvider";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Cart</h1>
        {items.length === 0 ? (
          <div className="mb-4 text-lg text-gray-600">Your cart is empty.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full mb-6 bg-white rounded shadow">
                <thead>
                  <tr className="border-b bg-blue-50">
                    <th className="text-left p-2">Product</th>
                    <th className="text-left p-2">Variant</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Qty</th>
                    <th className="text-left p-2">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.product.id + item.variant.id} className="border-b hover:bg-blue-50 transition">
                      <td className="p-2 font-semibold">{item.product.name}</td>
                      <td className="p-2">{item.variant.color} / {item.variant.size}</td>
                      <td className="p-2">${item.product.price.toFixed(2)}</td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={1}
                          max={item.variant.stock}
                          value={item.quantity}
                          onChange={e => updateQuantity(item.product.id, item.variant.id, Math.max(1, Math.min(Number(e.target.value), item.variant.stock)))}
                          className="input input-bordered w-16"
                        />
                      </td>
                      <td className="p-2">${(item.product.price * item.quantity).toFixed(2)}</td>
                      <td className="p-2">
                        <button
                          className="btn btn-sm btn-outline hover:bg-red-100 hover:text-red-700 transition"
                          onClick={() => removeFromCart(item.product.id, item.variant.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="text-xl font-semibold">Subtotal: ${subtotal.toFixed(2)}</div>
              <button className="btn btn-outline btn-sm hover:bg-red-100 hover:text-red-700 transition" onClick={clearCart}>Clear Cart</button>
            </div>
            <Link href="/checkout" className="btn btn-primary w-full md:w-auto">Proceed to Checkout</Link>
          </>
        )}
        <div className="mt-8">
          <Link href="/shop" className="text-blue-600 hover:underline">Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
} 