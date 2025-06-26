"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product, Variant } from "@/lib/mockProducts";

type CartItem = {
  product: Product;
  variant: Variant;
  quantity: number;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant: Variant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "dropshipping_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, variant: Variant, quantity: number = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(
        i => i.product.id === product.id && i.variant.id === variant.id
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, variant, quantity }];
    });
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.variant.id === variantId)));
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.variant.id === variantId
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
} 