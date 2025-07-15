import { supabase } from "./supabaseClient";
import { Product } from "./mockProducts";

const TABLE = "products";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error) throw error;
  return data as Product[];
}

export async function addProduct(product: Product): Promise<void> {
  const { error } = await supabase.from(TABLE).insert([product]);
  if (error) throw error;
}

export async function updateProduct(product: Product): Promise<void> {
  const { error } = await supabase.from(TABLE).update(product).eq("id", product.id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
} 