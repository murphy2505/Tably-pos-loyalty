export async function getProducts() {
  const res = await fetch("/pos/core/products");
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function createProduct(payload: any) {
  const res = await fetch("/pos/core/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id: string, payload: any) {
  const res = await fetch(`/pos/core/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`/pos/core/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
}

export async function getVariants(productId: string) {
  // Indien backend een query filter heeft, kun je hier naar /pos/core/variants?productId=... gaan.
  // Voor nu veronderstellen we dat het product detail inclusief variants wordt opgehaald via getProducts.
  // Placeholder die leeg terugkeert.
  return [];
}

export async function createVariant(payload: any) {
  const res = await fetch("/pos/core/variants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create variant");
  return res.json();
}

export async function updateVariant(id: string, payload: any) {
  const res = await fetch(`/pos/core/variants/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update variant");
  return res.json();
}

export async function deleteVariant(id: string) {
  const res = await fetch(`/pos/core/variants/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete variant");
}
