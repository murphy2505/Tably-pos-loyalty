export async function getProducts() {
  const res = await fetch("/pos/core/products");
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}
export async function createProduct(payload: any) {
  const res = await fetch("/pos/core/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}
export async function updateProduct(id: string, payload: any) {
  const res = await fetch(`/pos/core/products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}
export async function deleteProduct(id: string) {
  const res = await fetch(`/pos/core/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
}
