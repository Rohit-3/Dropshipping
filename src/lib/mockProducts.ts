export type Variant = {
  id: string;
  color: string;
  size: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  inStock: boolean;
  category: string;
  variants: Variant[];
  created_at: string;
};

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic T-Shirt",
    slug: "classic-t-shirt",
    description: "A comfortable and stylish classic t-shirt.",
    images: ["/products/tshirt1.jpg"],
    price: 19.99,
    currency: "USD",
    inStock: true,
    category: "Apparel",
    variants: [
      { id: "1a", color: "Black", size: "M", stock: 10 },
      { id: "1b", color: "White", size: "L", stock: 5 },
    ],
    created_at: "2024-06-26T00:00:00Z",
  },
  {
    id: "2",
    name: "Eco Water Bottle",
    slug: "eco-water-bottle",
    description: "Reusable eco-friendly water bottle.",
    images: ["/products/bottle1.jpg"],
    price: 14.99,
    currency: "USD",
    inStock: true,
    category: "Accessories",
    variants: [
      { id: "2a", color: "Blue", size: "500ml", stock: 20 },
      { id: "2b", color: "Green", size: "750ml", stock: 8 },
    ],
    created_at: "2024-06-26T00:00:00Z",
  },
]; 