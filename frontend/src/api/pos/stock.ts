export async function getStock() {
  const res = await fetch("/pos/core/stock");
  if (!res.ok) throw new Error("Failed to load stock");
  return res.json();
}
export async function stockPurchase(payload: any) {
  const res = await fetch("/pos/core/stock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Failed to purchase");
  return res.json();
}
export async function stockWaste(payload: any) {
  const res = await fetch("/pos/core/stock/waste", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Failed to waste");
  return res.json();
}
export async function stockAdjust(payload: any) {
  const res = await fetch("/pos/core/stock/adjust", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Failed to adjust");
  return res.json();
}
export async function stockHistory() {
  const res = await fetch("/pos/core/stock/history");
  if (!res.ok) throw new Error("Failed to load history");
  return res.json();
}
