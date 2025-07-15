import { supabase } from "./supabaseClient";
import type { Product, Variant } from "./mockProducts";

export type Order = {
  id: string;
  user_id: string;
  items: { product: Product; variant: Variant; quantity: number }[];
  total: number;
  status: string;
  created_at: string;
};

const TABLE = "orders";

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error) throw error;
  return data as Order[];
}

export async function getUserOrders(user_id: string): Promise<Order[]> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("user_id", user_id);
  if (error) throw error;
  return data as Order[];
}

export async function addOrder(order: Order): Promise<void> {
  const { error } = await supabase.from(TABLE).insert([order]);
  if (error) throw error;
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ status }).eq("id", id);
  if (error) throw error;
} 