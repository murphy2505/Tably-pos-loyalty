import type { PosProductVariant } from "./products";

const headers = {
  "Content-Type": "application/json",
  "x-tenant-id": "demo",
};

// TODO: bevestig backend route, bijv. /pos/core/variants?productId=...
export async function fetchVariants(productId: string): Promise<PosProductVariant[]> {
  const res = await fetch(`/pos/core/variants?productId=${encodeURIComponent(productId)}`, { headers });
  if (!res.ok) {
    // Backend endpoint ontbreekt → lege lijst
    return [];
  }
  return res.json();
}

export async function createVariant(input: CreateVariantInput): Promise<PosProductVariant> {
  const res = await fetch("/pos/core/variants", {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error("Failed to create variant");
  }
  return res.json();
}

export async function updateVariant(id: string, payload: Partial<ProductVariant>): Promise<ProductVariant> {
  const res = await fetch(`/pos/core/variants/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteVariant(id: string): Promise<void> {
  const res = await fetch(`/pos/core/variants/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function fetchVariantsByProduct(productId: string): Promise<ProductVariant[]> {
  const res = await fetch(`/pos/core/products/${productId}`, { headers });
  if (!res.ok) throw new Error(await res.text());
  const product = await res.json();
  return Array.isArray(product.variants) ? product.variants : [];
}
