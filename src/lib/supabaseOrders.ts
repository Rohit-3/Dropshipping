import { supabase } from "./supabaseClient";

const TABLE = "orders";

export async function getOrders() {
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error) throw error;
  return data;
}

export async function getUserOrders(user_id: string) {
  const { data, error } = await supabase.from(TABLE).select("*").eq("user_id", user_id);
  if (error) throw error;
  return data;
}

export async function addOrder(order: any) {
  const { error } = await supabase.from(TABLE).insert([order]);
  if (error) throw error;
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase.from(TABLE).update({ status }).eq("id", id);
  if (error) throw error;
} 