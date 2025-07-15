import { Product, Variant } from "./mockProducts";

export async function getShippingRate(items: { product: Product; variant: Variant; quantity: number }[]) {
  // Mock: flat $5 shipping, free over $100
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  if (subtotal > 100) return 0;
  return 5;
} 