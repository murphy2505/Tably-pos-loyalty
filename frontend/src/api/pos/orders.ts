export async function createOrder(payload: any) {
  const res = await fetch("/pos/core/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}
export async function addOrderItem(id: string, payload: any) {
  const res = await fetch(`/pos/core/orders/${id}/items`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Failed to add item");
  return res.json();
}
export async function updateOrderItem(itemId: string, payload: any) {
  const res = await fetch(`/pos/core/orders/items/${itemId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}
export async function deleteOrderItem(itemId: string) {
  const res = await fetch(`/pos/core/orders/items/${itemId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete item");
}
export async function payOrder(id: string, payload: { method: "CASH" | "PIN" | "OTHER"; amount: number }) {
  const res = await fetch(`/pos/core/orders/${id}/pay`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Failed to pay order");
  return res.json();
}
export async function cancelOrder(id: string) {
  const res = await fetch(`/pos/core/orders/${id}/cancel`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to cancel order");
  return res.json();
}
